# ai_processing_engine.py
import os
import time
import json
import requests
from typing import Any, Dict, Optional
import pandas as pd
import math

# Config: prefer env vars or streamlit secrets
GROQ_API_URL = os.environ.get("GROQ_API_URL")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

OUTPUT_FILE = os.environ.get("MASTER_CSV", "master_predictions_sheet.csv")
LEDGER_FILE = os.environ.get("LEDGER_FILE", "settled_bets_ledger.csv")

# Simple in-memory cache to avoid repeated model calls for same matchup+odds
_prediction_cache: Dict[str, Dict[str, Any]] = {}

def _atomic_write_csv(df: pd.DataFrame, path: str):
    tmp = path + ".tmp"
    df.to_csv(tmp, index=False)
    os.replace(tmp, path)

def append_prediction_to_csv(filename: str, row: Dict[str, Any]):
    """
    Append a dict row to CSV atomically (creates file with header if missing).
    """
    import csv
    new_file = not os.path.exists(filename)
    tmp = filename + ".tmp_append"
    # read existing headers if file exists to keep consistent column order
    if new_file:
        with open(tmp, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=list(row.keys()))
            writer.writeheader()
            writer.writerow(row)
    else:
        # append row (open in append mode) but still ensure atomic replace
        # build a small df and concat
        try:
            existing = pd.read_csv(filename)
            new_df = pd.concat([existing, pd.DataFrame([row])], ignore_index=True)
            _atomic_write_csv(new_df, filename)
            return
        except Exception:
            # last-resort append via csv module
            with open(filename, "a", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=list(row.keys()))
                writer.writerow(row)
            return
    os.replace(tmp, filename)

# ------------------ Odds parsing & edge utils ------------------
def _extract_number_in_parentheses(s: str) -> Optional[str]:
    """If string contains '(xxx)', return the inner part as string."""
    if not isinstance(s, str):
        return None
    import re
    m = re.search(r"\(([^)]+)\)", s)
    return m.group(1) if m else None

def parse_american_or_decimal(odds_raw: Any) -> Optional[int]:
    """
    Accept many formats and return American odds (int) if possible.
    - Input examples: '+120', '-150', '2.5', '3.09', 'TonyBet (3.09)', 1.74
    - If decimal odds provided (e.g. 3.09) convert to approximate american odds.
    """
    if odds_raw is None:
        return None
    s = str(odds_raw).strip()
    # try to extract number inside parentheses
    inner = _extract_number_in_parentheses(s)
    if inner:
        s = inner.strip()
    # strip trailing/leading text
    if s.lower().startswith("tonybet") or s.lower().startswith("betmgm"):
        # remove text parts if any
        import re
        found = re.findall(r"[-+]?\d*\.?\d+", s)
        s = found[0] if found else s
    try:
        # american like +120, -150
        if s.startswith("+") or s.startswith("-"):
            return int(s.replace("+", ""))
        # numeric: could be decimal or american without sign
        if "." in s:
            dec = float(s)
            if dec <= 0:
                return None
            # convert decimal to american approx:
            if dec >= 2.0:
                # positive american = (decimal -1)*100 rounded
                american = int(round((dec - 1.0) * 100))
                return american if american != 0 else 100
            else:
                # decimal <2 => negative american
                american = int(round(-100.0 / (dec - 1.0)))
                return american
        # integer-like
        val = int(float(s))
        # ambiguous: treat <100 as decimal? we'll return as-is
        return val
    except Exception:
        return None

def implied_probability_from_american(american: Optional[int]) -> Optional[float]:
    if american is None:
        return None
    try:
        o = int(american)
        if o > 0:
            return 100.0 / (o + 100.0)
        if o < 0:
            return float(-o) / (float(-o) + 100.0)
        return None
    except Exception:
        return None

def compute_edge_pct(model_prob: Optional[float], market_odds_raw: Any) -> Optional[float]:
    """
    edge_pct = (model_prob - market_implied_prob) * 100
    """
    if model_prob is None:
        return None
    amer = parse_american_or_decimal(market_odds_raw)
    implied = implied_probability_from_american(amer) if amer is not None else None
    if implied is None:
        return None
    return (model_prob - implied) * 100.0

# ------------------ GROQ wrapper & response parsing ------------------
def call_groq_model(payload: Dict[str, Any], url: Optional[str] = None, key: Optional[str] = None, timeout: int = 8, retries: int = 2) -> Dict[str, Any]:
    """
    Call external model endpoint with retries and timeout. Returns parsed JSON or {'error': str}.
    """
    target = url or GROQ_API_URL
    auth = key or GROQ_API_KEY
    if not target:
        return {"error": "GROQ_API_URL not configured."}
    headers = {"Content-Type": "application/json"}
    if auth:
        headers["Authorization"] = f"Bearer {auth}"
    last_exc = None
    for attempt in range(retries + 1):
        try:
            r = requests.post(target, headers=headers, json={"inputs": payload}, timeout=timeout)
            r.raise_for_status()
            try:
                return r.json()
            except Exception:
                return {"error": "Invalid JSON response", "text": r.text}
        except Exception as e:
            last_exc = e
            time.sleep(0.5 * (attempt + 1))
            continue
    return {"error": f"request failed: {last_exc}"}

def _extract_win_prob(model_out: Any) -> Optional[float]:
    """
    Best-effort extraction of a home-win probability between 0 and 1.
    """
    if model_out is None:
        return None
    # dict lookups
    if isinstance(model_out, dict):
        # common direct keys
        for k in ("win_prob_home", "home_win_prob", "prob_home", "home_probability", "home_prob"):
            if k in model_out and isinstance(model_out[k], (int, float)):
                return float(model_out[k])
        # nested structure probabilities: {"probabilities": {"home": 0.63}}
        if "probabilities" in model_out and isinstance(model_out["probabilities"], dict):
            p = model_out["probabilities"]
            if "home" in p and isinstance(p["home"], (int, float)):
                return float(p["home"])
        # predictions list: [{"label":"home","score":0.63}, ...]
        if "predictions" in model_out and isinstance(model_out["predictions"], list):
            for it in model_out["predictions"]:
                if isinstance(it, dict):
                    lab = str(it.get("label", "")).lower()
                    if lab in ("home", "home_team", "home_win") and ("score" in it or "probability" in it or "p" in it):
                        sc = it.get("score") or it.get("probability") or it.get("p")
                        if isinstance(sc, (int, float)):
                            return float(sc)
        # outputs array
        if "outputs" in model_out and isinstance(model_out["outputs"], list) and model_out["outputs"]:
            return _extract_win_prob(model_out["outputs"][0])
    # list/array responses
    if isinstance(model_out, (list, tuple)):
        numeric = [x for x in model_out if isinstance(x, (int, float))]
        if numeric:
            # if two numbers, guess home is index 1
            if len(numeric) >= 2:
                # if sum approx 1, pick the one that looks like a probability for home
                s = sum(numeric[:2])
                if 0.99 <= s <= 1.01:
                    return float(numeric[1])
                return float(numeric[0])
            return float(numeric[0])
    # fallback: if model returns a single number
    if isinstance(model_out, (int, float)):
        return float(model_out)
    return None

# ------------------ High-level prediction helper ------------------
def predict_from_row(row: Dict[str, Any], prefer_home_odds_col: str = "TonyBet Ontario", api_url: Optional[str] = None, api_key: Optional[str] = None, throttle: float = 0.05, use_cache: bool = True) -> Dict[str, Any]:
    """
    Build features, call model, return dict with model_out, home_win_prob, implied_prob, edge_pct, market_american_odds.
    Caches results in-memory keyed by matchup+odds+timestamp to avoid repeated calls during UI refresh.
    """
    matchup = row.get("Matchup") or f"{row.get('away','')} @ {row.get('home','')}"
    market_raw = row.get(prefer_home_odds_col) or row.get("TonyBet Ontario") or row.get("BetMGM Ontario")
    cache_key = f"{matchup}||{str(market_raw)}"

    if use_cache and cache_key in _prediction_cache:
        return _prediction_cache[cache_key]

    # Compose features (adapt to your model contract)
    features = {
        "matchup": matchup,
        "sport": row.get("Sport"),
        "home_team": row.get("home") or row.get("Pick Team"),
        "away_team": row.get("away"),
        "metadata": {k: row.get(k) for k in ("Time Metric", "Score Ticker") if k in row}
    }

    model_out = call_groq_model(features, url=api_url, key=api_key)
    home_prob = _extract_win_prob(model_out)
    market_america = parse_american_or_decimal(market_raw)
    implied = implied_probability_from_american(market_america) if market_america is not None else None
    edge = compute_edge_pct(home_prob, market_raw) if home_prob is not None else None

    result = {
        "model_out": model_out,
        "home_win_prob": float(home_prob) if home_prob is not None else None,
        "implied_prob": float(implied) if implied is not None else None,
        "edge_pct": float(edge) if edge is not None else None,
        "market_american_odds": int(market_america) if market_america is not None else None
    }
    # small throttle to avoid bursts
    if throttle and throttle > 0:
        time.sleep(throttle)

    _prediction_cache[cache_key] = result
    return result

# ------------------ Ledger helper ------------------
def write_settled_bet(ledger_file: str, timestamp: str, matchup: str, sport: str, pick: str, final_score: str, outcome_label: str, outcome_pl: float, running_bankroll: float):
    """
    Append a settled bet to a CSV ledger, with separate numeric P/L and outcome label.
    """
    row = {
        "Timestamp": timestamp,
        "Matchup": matchup,
        "Sport": sport,
        "AI Pick Selection": pick,
        "Final Score Line": final_score,
        "Outcome Label": outcome_label,
        "Trade Outcome Profit/Loss": outcome_pl,
        "Running Bankroll": running_bankroll
    }
    append_prediction_to_csv(ledger_file, row)