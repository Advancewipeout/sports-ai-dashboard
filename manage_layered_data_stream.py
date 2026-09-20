import os
import time
import random
import pandas as pd
from ai_processing_engine import write_settled_bet  # optional if you want to call directly

OUTPUT_FILE = "master_predictions_sheet.csv"
LEDGER_FILE = "settled_bets_ledger.csv"

def _atomic_write(df: pd.DataFrame, path: str):
    tmp = path + ".tmp"
    df.to_csv(tmp, index=False)
    os.replace(tmp, path)

def check_and_grade_final_scores(game_row):
    # load ledger safely
    if not os.path.exists(LEDGER_FILE):
        ledger_df = pd.DataFrame(columns=["Timestamp", "Matchup", "Sport", "AI Pick Selection", "Final Score Line", "Outcome Label", "Trade Outcome Profit/Loss", "Running Bankroll"])
    else:
        try:
            ledger_df = pd.read_csv(LEDGER_FILE)
        except Exception:
            ledger_df = pd.DataFrame(columns=["Timestamp", "Matchup", "Sport", "AI Pick Selection", "Final Score Line", "Outcome Label", "Trade Outcome Profit/Loss", "Running Bankroll"])
    match_title = game_row["Matchup"]
    # don't grade twice
    if not ledger_df.empty and match_title in ledger_df["Matchup"].values:
        return
    current_funds = ledger_df["Running Bankroll"].iloc[-1] if not ledger_df.empty and "Running Bankroll" in ledger_df.columns else 1000.0
    # pick an outcome label and numeric P/L
    outcome_label = random.choice(["🏆 WIN SYSTEM ORDER", "❌ LOSS MARKET EDGE"])
    if "WIN" in outcome_label:
        pl = random.choice([45.0, 75.0, 110.0])
    else:
        pl = random.choice([-35.0, -60.0, -80.0])
    current_funds = round(current_funds + pl, 2)
    new_row = {
        "Timestamp": time.strftime("%Y-%m-%d %H:%M"),
        "Matchup": match_title,
        "Sport": game_row.get("Sport", "UNKNOWN"),
        "AI Pick Selection": f"Target: {game_row.get('Pick Team')}",
        "Final Score Line": game_row.get("Score Ticker"),
        "Outcome Label": outcome_label,
        "Trade Outcome Profit/Loss": pl,
        "Running Bankroll": current_funds
    }
    if ledger_df.empty:
        ledger_df = pd.DataFrame([new_row])
    else:
        ledger_df = pd.concat([ledger_df, pd.DataFrame([new_row])], ignore_index=True)
    _atomic_write(ledger_df, LEDGER_FILE)

def manage_layered_data_stream():
    print("🧠 ALL SPORTS SYSTEM ENGINE: Running Fluid Real-Time Matrix...")
    backup_live_deck = [
        {"sport": "BASEBALL", "home": "St. Louis Cardinals", "away": "Washington Nationals", "h_score": 5, "a_score": 8, "clock": "Extra Inning Bottom", "elapsed": 420, "duration": 540, "odds": 3.09, "layer": "🔴 LAYER 2: IN-PLAY LIVE"},
        {"sport": "BASEBALL", "home": "Arizona Diamondbacks", "away": "New York Yankees", "h_score": 3, "a_score": 3, "clock": "Break top 9 bottom 8", "elapsed": 300, "duration": 540, "odds": 2.00, "layer": "🔴 LAYER 2: IN-PLAY LIVE"},
        {"sport": "BASEBALL", "home": "San Diego Padres", "away": "Miami Marlins", "h_score": 6, "a_score": 5, "clock": "7th inning top", "elapsed": 180, "duration": 540, "odds": 1.14, "layer": "🔴 LAYER 2: IN-PLAY LIVE"},
        {"sport": "SOCCER", "home": "Inter Miami CF", "away": "Orlando City SC", "h_score": 2, "a_score": 1, "clock": "54:53 Live Ticker", "elapsed": 3293, "duration": 5400, "odds": 2.15, "layer": "🔴 LAYER 2: IN-PLAY LIVE"},
        {"sport": "FOOTBALL", "home": "San Francisco 49ers", "away": "Miami Dolphins", "clock": "SUN 04:25 p.m.", "ticker": "PRE-MATCH SCHEDULE", "odds": 7.25, "layer": "⏳ LAYER 1: UPCOMING"},
        {"sport": "FOOTBALL", "home": "Los Angeles Rams", "away": "New York Giants", "clock": "MON 08:15 p.m.", "ticker": "PRE-MATCH SCHEDULE", "odds": 2.88, "layer": "⏳ LAYER 1: UPCOMING"},
        {"sport": "FOOTBALL", "home": "Denver Broncos", "away": "Jacksonville Jaguars", "clock": "SUN 04:05 p.m.", "ticker": "PRE-MATCH SCHEDULE", "odds": 2.37, "layer": "⏳ LAYER 1: UPCOMING"}
    ]

    while True:
        master_compiled_rows = []
        for idx in range(len(backup_live_deck)):
            g = backup_live_deck[idx]
            # live in-play updates
            if "LIVE" in g["layer"]:
                if g["elapsed"] < g["duration"]:
                    g["elapsed"] += 1
                    # random scoring
                    if g["sport"] == "SOCCER":
                        if random.random() > 0.998:
                            g["h_score"] += 1
                        total_min = g["elapsed"] // 60
                        rem_sec = g["elapsed"] % 60
                        sec_str = f"0{rem_sec}" if rem_sec < 10 else str(rem_sec)
                        g["clock"] = f"{total_min}:{sec_str} Live Ticker"
                        score_ticker = f"{g['away']} {g['a_score']} - {g['h_score']} {g['home']}"
                    elif g["sport"] == "BASEBALL":
                        if random.random() > 0.995:
                            g["a_score"] += 1
                        current_inn = (g["elapsed"] // 60) + 1
                        g["clock"] = f"Inning {current_inn} - Active"
                        score_ticker = f"{g['away']} {g['a_score']} - {g['h_score']} {g['home']}"
                else:
                    g["clock"] = "FINAL"
                    score_ticker = f"{g['away']} {g['a_score']} - {g['h_score']} {g['home']}"
                    # grade final
                    completed_card = {"Sport": g["sport"], "Matchup": f"{g['away']} @ {g['home']}", "Score Ticker": score_ticker, "Pick Team": g.get("home")}
                    check_and_grade_final_scores(completed_card)
                    # rotate to a new fixture for demo
                    backup_live_deck[idx] = {"sport": "BASEBALL", "home": "LA Dodgers", "away": "SF Giants", "h_score": 2, "a_score": 0, "clock": "Inning 1 - Active", "elapsed": 1, "duration": 540, "odds": 1.74, "layer": "🔴 LAYER 2: IN-PLAY LIVE"}
                    g = backup_live_deck[idx]
                    score_ticker = f"{g['away']} {g['a_score']} - {g['h_score']} {g['home']}"

                base_edge = round(random.uniform(1.5, 8.4), 1)
                pick_team = g["home"] if base_edge > 3.5 else g["away"]

                odds_val = g["odds"]
                master_compiled_rows.append({
                    "Engine Layer": g["layer"],
                    "Sport": g["sport"],
                    "Matchup": f"{g['away']} @ {g['home']}",
                    "Time Metric": g["clock"],
                    "Score Ticker": score_ticker,
                    "TonyBet": f"TonyBet ({odds_val})",
                    "TonyBet_raw": odds_val,
                    "BetMGM": f"BetMGM ({round(odds_val * round(random.uniform(0.98, 1.02), 2), 2)})",
                    "BetMGM_raw": round(odds_val * round(random.uniform(0.98, 1.02), 2), 2),
                    "Edge Margin %": base_edge,
                    "AI Action Directive": "🔥 LIVE BUY",
                    "Pick Team": pick_team
                })
            else:
                base_edge = round(random.uniform(1.2, 7.5), 1)
                odds_val = g["odds"]
                master_compiled_rows.append({
                    "Engine Layer": g["layer"],
                    "Sport": g["sport"],
                    "Matchup": f"{g['away']} @ {g['home']}",
                    "Time Metric": g["clock"],
                    "Score Ticker": g.get("ticker", ""),
                    "TonyBet": f"TonyBet ({odds_val})",
                    "TonyBet_raw": odds_val,
                    "BetMGM": f"BetMGM ({round(odds_val * round(random.uniform(0.98, 1.02), 2), 2)})",
                    "BetMGM_raw": round(odds_val * round(random.uniform(0.98, 1.02), 2), 2),
                    "Edge Margin %": base_edge,
                    "AI Action Directive": "🔥 FULL BUY",
                    "Pick Team": g["home"] if base_edge > 3.5 else g["away"]
                })

        df = pd.DataFrame(master_compiled_rows)
        _atomic_write(df, OUTPUT_FILE)
        # modest sleep - tune to how often you need updates
        time.sleep(1)

if __name__ == "__main__":
    manage_layered_data_stream()