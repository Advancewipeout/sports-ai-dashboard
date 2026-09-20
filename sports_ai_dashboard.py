import streamlit as pd_stream
import pandas as pd
import os
import time
from datetime import datetime

pd_stream.set_page_config(page_title="Smitty's AI Sports Risk Desk", layout="wide")

filename = "master_predictions_sheet.csv"
ledger_file = "settled_bets_ledger.csv"

# Try to import ai engine (optional). If absent, dashboard still runs.
has_engine = False
try:
    from ai_processing_engine import predict_from_row, append_prediction_to_csv  # type: ignore
    has_engine = True
except Exception:
    has_engine = False

# ---------- Sidebar: Bankroll / Filters / Live settings ----------
pd_stream.sidebar.header("⚙️ Bankroll Management Desk")
bankroll = pd_stream.sidebar.number_input("Total Trading Bankroll ($)", min_value=10.0, value=1000.0, step=50.0)

# Live update controls
pd_stream.sidebar.write("---")
pd_stream.sidebar.header("🔁 Live & Predict Controls")
live_updates = pd_stream.sidebar.checkbox("Enable live UI refresh", value=False)
auto_predict = pd_stream.sidebar.checkbox("Auto-predict when CSV changes (calls GROQ)", value=False)
refresh_interval = pd_stream.sidebar.slider("Refresh interval (seconds)", min_value=2, max_value=60, value=5, step=1)

# Sidebar filters (built after a safe CSV read)
# Safe initial read to populate sport options
def safe_read_initial(path: str) -> pd.DataFrame:
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        return pd.DataFrame()
    try:
        df = pd.read_csv(path)
        df.columns = [c.strip() for c in df.columns]
        return df
    except Exception:
        return pd.DataFrame()

df_init = safe_read_initial(filename)
sport_options = ["ALL"]
if not df_init.empty and "Sport" in df_init.columns:
    sport_options = ["ALL"] + list(df_init["Sport"].dropna().unique())

selected_sport = pd_stream.sidebar.selectbox("Filter Market Sport", sport_options)
strictness_trigger = pd_stream.sidebar.slider("AI Minimum Value Edge Cutoff (%)", min_value=0.0, max_value=50.0, value=0.0, step=0.5)

# ---------- Subscriber Login ----------
pd_stream.sidebar.write("---")
pd_stream.sidebar.header("🔐 Subscriber Portal Login")
if "authenticated" not in pd_stream.session_state:
    pd_stream.session_state["authenticated"] = False

username_input = pd_stream.sidebar.text_input("User Name Label")
password_input = pd_stream.sidebar.text_input("Security Access Key Pin (4-Digit)", type="password")

if pd_stream.sidebar.button("🔓 Authenticate Premium Pass"):
    if username_input == "smitty" and password_input == "8501":
        pd_stream.session_state["authenticated"] = True
        pd_stream.sidebar.success("Access Granted!")
        pd_stream.experimental_rerun()
    else:
        pd_stream.sidebar.error("Invalid credentials block.")

if pd_stream.sidebar.button("🔒 Secure Lock Logs Out"):
    pd_stream.session_state["authenticated"] = False
    pd_stream.experimental_rerun()

if pd_stream.sidebar.button("🧹 Wipe Graded Bet Ledger History"):
    if os.path.exists(ledger_file):
        try:
            os.remove(ledger_file)
        except Exception:
            pass
    blank_df = pd.DataFrame(columns=["Timestamp", "Matchup", "Sport", "AI Pick Selection", "Final Score Line", "Trade Outcome Profit/Loss", "Running Bankroll"])
    blank_df.to_csv(ledger_file, index=False)
    pd_stream.sidebar.success("Ledger wiped clean!")
    pd_stream.experimental_rerun()

# ---------- Marquee / Header ----------
pd_stream.markdown(
    """
    <div style='background-color: #0c1017; padding: 12px; border-radius: 8px; border: 1px solid #1f2937; margin-bottom: 20px; overflow: hidden;'>
        <p style='color: #00ff66; font-family: monospace; font-weight: bold; margin: 0; white-space: nowrap; animation: marquee 25s linear infinite;'>
            ⚡ [BREAKING ATHLETIC WIRE AI]: Line parameter shifts detected on TonyBet pools ... 
            ⚾ MLB: Extra-Inning volatility parameters normal across night frames ... 
            🏈 NFL WEATHER UPDATE: Winds picking up ahead of tomorrow's massive Sunday football matchups ... 
            ⚽ LIVE FUTBOL: Global market liquidity levels optimal for high-value edge margin capture! ⚡
        </p>
    </div>
    <style>
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
    </style>
    """,
    unsafe_allow_html=True
)

pd_stream.markdown("# 🧠 Smitty's 2-Layer AI News-Intelligence SaaS Desk")
pd_stream.markdown("### Real-Time Global Synchronized Split Engine: Clocks, Scheduled Models & Subscriber Value Blueprints")
pd_stream.write("---")

# ---------- Utilities: cached CSV loader, safe numeric parsing ----------
@pd_stream.cache_data(ttl=10)
def load_master(path: str) -> pd.DataFrame:
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        return pd.DataFrame()
    try:
        df = pd.read_csv(path)
        df.columns = [c.strip() for c in df.columns]
        # normalize edge margin column if present
        if "Edge Margin %" in df.columns:
            df["Edge Margin %"] = pd.to_numeric(df["Edge Margin %"].astype(str).str.replace("%", "", regex=False), errors="coerce")
        return df
    except Exception:
        return pd.DataFrame()

def file_mtime(path: str):
    try:
        return os.path.getmtime(path)
    except Exception:
        return None

# Session state bookkeeping
if "last_master_mtime" not in pd_stream.session_state:
    pd_stream.session_state["last_master_mtime"] = None
if "last_predictions" not in pd_stream.session_state:
    pd_stream.session_state["last_predictions"] = None
if "live_last_run" not in pd_stream.session_state:
    pd_stream.session_state["live_last_run"] = 0

# ---------- Auto-refresh / run scheduling ----------
# If user enabled live_updates, we attempt to autorefresh client using streamlit_autorefresh (if available).
if live_updates:
    try:
        from streamlit_autorefresh import st_autorefresh  # type: ignore
        # Convert seconds to milliseconds
        st_autorefresh(interval=refresh_interval * 1000, limit=None, key="autorefresh")
    except Exception:
        # fallback: a simple time-based cheap rerun
        now = time.time()
        if now - pd_stream.session_state["live_last_run"] >= refresh_interval:
            pd_stream.session_state["live_last_run"] = now
            # safe rerun to pick up changed CSV / UI values
            pd_stream.experimental_rerun()

# ---------- Main rendering logic ----------
def render_enterprise_matrix():
    # master file check
    if not os.path.exists(filename) or os.path.getsize(filename) == 0:
        pd_stream.info("⏳ Awaiting loop synchronization... Your background engine terminal is writing the live data rows now.")
        return

    df = load_master(filename)
    if df.empty:
        pd_stream.info("⏳ Master CSV found but no parsable rows.")
        return

    # AUTOMATED COLUMN ALIGNMENT MAPPING (case-insensitive detection)
    rename_map = {}
    for col in df.columns:
        lc = col.lower()
        if "sport" in lc: rename_map[col] = "Sport"
        if "matchup" in lc: rename_map[col] = "Matchup"
        if "time" in lc or "clock" in lc: rename_map[col] = "Time Metric"
        if "ticker" in lc or "score" in lc: rename_map[col] = "Score Ticker"
        if "tony" in lc: rename_map[col] = "TonyBet Ontario"
        if "mgm" in lc or "betmgm" in lc: rename_map[col] = "BetMGM Ontario"
        if "edge" in lc or "margin" in lc: rename_map[col] = "Edge Margin %"
        if "directive" in lc or "action" in lc: rename_map[col] = "AI Action Directive"
        if "pick" in lc or "team" in lc: rename_map[col] = "Pick Team"
        if "layer" in lc: rename_map[col] = "Engine Layer"
    df = df.rename(columns=rename_map)
    blueprint_df = df.copy()

    # apply filters
    if "Sport" in df.columns and selected_sport != "ALL":
        df = df[df["Sport"] == selected_sport]
        blueprint_df = blueprint_df[blueprint_df["Sport"] == selected_sport]

    if "Edge Margin %" in df.columns:
        df = df[pd.to_numeric(df["Edge Margin %"], errors="coerce").fillna(0.0) >= strictness_trigger]

    # partition layers safely
    if "Engine Layer" in df.columns:
        live_df = df[df["Engine Layer"].str.contains("LIVE|LAYER 2", case=False, na=False)]
        upcoming_df = df[df["Engine Layer"].str.contains("UPCOMING|LAYER 1", case=False, na=False)]
    else:
        live_df = pd.DataFrame()
        upcoming_df = pd.DataFrame()

    # Top metrics
    col1, col2, col3 = pd_stream.columns(3)
    col1.metric("Live Matches Tracking Now", len(live_df))
    col2.metric("Upcoming Systems Calculated", len(upcoming_df))
    max_edge = 0.0
    if "Edge Margin %" in df.columns and not df["Edge Margin %"].isna().all():
        try:
            max_edge = float(df["Edge Margin %"].max())
        except Exception:
            max_edge = 0.0
    col3.metric("Max Discovered Statistical Edge", f"+{round(max_edge,2)}%")
    pd_stream.write("---")

    # LIVE LAYER MATRIX
    pd_stream.write("### 🔴 LAYER 2: Live In-Play Systems (Active Scores, Clocks & Ontario Odds Boards)")
    if live_df.empty:
        pd_stream.info("No active live matches match your sidebar filter settings.")
    else:
        available_cols = [c for c in ["Sport", "Matchup", "Time Metric", "Score Ticker", "TonyBet Ontario", "BetMGM Ontario", "Edge Margin %", "AI Action Directive"] if c in live_df.columns]
        pd_stream.dataframe(live_df[available_cols], use_container_width=True, hide_index=True)
    pd_stream.write("---")

    # UPCOMING LAYER MATRIX
    pd_stream.write("### ⏳ LAYER 1: Upcoming Pre-Match Models (Scheduled Selections)")
    if upcoming_df.empty:
        pd_stream.info("No upcoming models computed.")
    else:
        available_cols = [c for c in ["Sport", "Matchup", "Time Metric", "TonyBet Ontario", "BetMGM Ontario", "Edge Margin %", "AI Action Directive"] if c in upcoming_df.columns]
        pd_stream.dataframe(upcoming_df[available_cols], use_container_width=True, hide_index=True)
    pd_stream.write("---")

    # MEMBER EXECUTION BLUEPRINT
    pd_stream.write("### 📋 Automated Execution Order Blueprint (Scaled Cash Risks)")
    if pd_stream.session_state["authenticated"]:
        pd_stream.success("🌟 AI PREMIUM MEMBER POSITIONS UNLOCKED")
        active_orders = blueprint_df[blueprint_df["Edge Margin %"] >= strictness_trigger] if "Edge Margin %" in blueprint_df.columns else blueprint_df
        if "AI Action Directive" in active_orders.columns:
            active_orders = active_orders[~active_orders["AI Action Directive"].isin(["❌ NO VALUE", "🛑 PULL OUT DEPOSIT", "PASS", "❌ PASS LINE"])]

        if active_orders.empty:
            pd_stream.info("No high-value selections match your minimum value edge cutoff.")
        else:
            # Predict button (explicit)
            pd_stream.write("**Actions:**")
            predictive_button_label = "🔮 Predict with GROQ for active orders (calls API)" if has_engine else "🔮 Predict (ai_processing_engine.py missing)"
            if pd_stream.button(predictive_button_label):
                if not has_engine:
                    pd_stream.error("ai_processing_engine.py not found or failed to import. Place it beside this dashboard to enable model calls.")
                else:
                    out_rows = []
                    with pd_stream.spinner("Calling model for active orders... (throttled)"):
                        for _, row in active_orders.iterrows():
                            try:
                                row_dict = row.to_dict()
                                pred = predict_from_row(row_dict, throttle=0.05)
                                # attach predictions to the shown row
                                row_dict.update({
                                    "model_home_win_prob": pred.get("home_win_prob"),
                                    "model_edge_pct": pred.get("edge_pct"),
                                })
                                out_rows.append(row_dict)
                            except Exception as e:
                                # don't crash UI on single-row failure
                                row_dict = row.to_dict()
                                row_dict.update({"model_home_win_prob": None, "model_edge_pct": None, "model_error": str(e)})
                                out_rows.append(row_dict)
                    if out_rows:
                        out_df = pd.DataFrame(out_rows)
                        pd_stream.dataframe(out_df.head(200), use_container_width=True, hide_index=True)
                        # optional: append summary to master CSV
                        if pd_stream.checkbox("Append these predictions to master CSV as summary rows"):
                            for _, r in out_df.iterrows():
                                summary = {
                                    "Timestamp": datetime.utcnow().isoformat(),
                                    "Matchup": r.get("Matchup"),
                                    "Sport": r.get("Sport"),
                                    "Pick Team": r.get("Pick Team"),
                                    "TonyBet Ontario": r.get("TonyBet Ontario"),
                                    "model_home_win_prob": r.get("model_home_win_prob"),
                                    "model_edge_pct": r.get("model_edge_pct"),
                                }
                                try:
                                    append_prediction_to_csv(filename, summary)
                                except Exception:
                                    # fallback: pandas append
                                    try:
                                        pd.DataFrame([summary]).to_csv(filename, mode="a", header=not os.path.exists(filename), index=False)
                                    except Exception:
                                        pass
                            pd_stream.success("Appended predictions to master CSV.")
            # show suggested stakes (without predicting) as default
            for _, row in active_orders.iterrows():
                edge_val = row.get("Edge Margin %", 0.0) or 0.0
                odds_val = row.get("TonyBet Ontario", "TonyBet")
                pick_val = row.get("Pick Team", "Target Selection")
                match_val = row.get("Matchup", "Match")
                sport_val = row.get("Sport", "Sport")
                layer_val = row.get("Engine Layer", "LAYER 2")

                risk_ratio = max(0.01, min((edge_val * 0.5) / 100.0, 0.2))
                suggested_cash_wager = round(bankroll * risk_ratio, 2)
                if suggested_cash_wager < 5.0:
                    suggested_cash_wager = 25.00

                blueprint_string = f"SOURCE ENGINE: [{layer_val}] | EDGE: +{edge_val}% -> ALLOCATION RISK: ${suggested_cash_wager} ON: {pick_val} ({odds_val})"
                pd_stream.markdown(f"**📍 {match_val} ({sport_val})**")
                pd_stream.code(blueprint_string, language="text")
    else:
        pd_stream.warning("🔒 The AI Decision buy directives and scaled cash allocations are encrypted. Authenticate your 4-digit passkey pin in the subscriber portal sidebar to view.")

    # HISTORICAL LEDGER ARCHIVE TRACKER
    pd_stream.write("---")
    pd_stream.write("### 🏆 Historical Performance Settlement Archive (Graded Bet Ledger)")
    if os.path.exists(ledger_file):
        try:
            ledger_df = pd.read_csv(ledger_file)
            if not ledger_df.empty and "Running Bankroll" in ledger_df.columns:
                pd_stream.write("#### 📊 Cumulative Capital Return Growth Chart (ROI Performance)")
                pd_stream.line_chart(ledger_df["Running Bankroll"], use_container_width=True)
                pd_stream.write("#### 📋 Detailed Settlement Audit Log Statements")
                pd_stream.dataframe(ledger_df, use_container_width=True, hide_index=True)
            else:
                pd_stream.dataframe(ledger_df.head(200), use_container_width=True)
        except Exception:
            pd_stream.warning("Could not read ledger file.")
    else:
        pd_stream.info("No ledger file found.")

# render once (the decorator @pd_stream.fragment may not exist in your environment)
try:
    # if the user's environment provided a `fragment` decorator, prefer it (keeps behavior)
    fragment = getattr(pd_stream, "fragment", None)
    if fragment:
        @fragment(run_every=1)
        def _run_matrix():
            render_enterprise_matrix()
        _run_matrix()
    else:
        render_enterprise_matrix()
except Exception:
    # fallback safe call
    render_enterprise_matrix()