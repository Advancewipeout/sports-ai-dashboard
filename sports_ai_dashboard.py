# sport_ai_dashboard.py (CLEAN, DUPLICATE-COLUMN FIX + ROBUSTNESS)
import os
import time
from datetime import datetime
import pandas as pd
import streamlit as pd_stream

# Optional: import engine if present
try:
    from ai_processing_engine import predict_from_row, append_prediction_to_csv  # type: ignore
    HAS_ENGINE = True
except Exception:
    HAS_ENGINE = False

pd_stream.set_page_config(page_title="Smitty's AI Sports Risk Desk", layout="wide")

MASTER_CSV = "master_predictions_sheet.csv"
LEDGER_CSV = "settled_bets_ledger.csv"


# -------------------- Utilities --------------------
def make_unique_columns(columns):
    """
    Ensure column names are unique by appending _1, _2... to duplicated names.
    Keeps first occurrence unchanged.
    """
    seen = {}
    out = []
    for c in columns:
        # convert to string for safe hashing
        key = str(c)
        if key in seen:
            seen[key] += 1
            out.append(f"{key}_{seen[key]}")
        else:
            seen[key] = 0
            out.append(key)
    return out


@pd_stream.cache_data(ttl=10)
def load_master(path: str) -> pd.DataFrame:
    """Safely load master CSV and normalize basic columns."""
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        return pd.DataFrame()
    try:
        df = pd.read_csv(path)
    except Exception:
        # corrupted or unreadable file -> return empty
        return pd.DataFrame()

    # Trim column names
    df.columns = [str(c).strip() for c in df.columns]

    # Normalize "Edge Margin %" to numeric when present (strip %).
    if "Edge Margin %" in df.columns:
        try:
            df["Edge Margin %"] = pd.to_numeric(df["Edge Margin %"].astype(str).str.replace("%", "", regex=False), errors="coerce")
        except Exception:
            # if conversion fails, leave as-is (will be filtered safely later)
            pass
    return df


def file_mtime(path: str):
    try:
        return os.path.getmtime(path)
    except Exception:
        return None


# -------------------- Sidebar / Controls --------------------
pd_stream.sidebar.header("⚙️ Bankroll Management Desk")
bankroll = pd_stream.sidebar.number_input("Total Trading Bankroll ($)", min_value=10.0, value=1000.0, step=50.0)

pd_stream.sidebar.write("---")
pd_stream.sidebar.header("🔁 Live & Predict Controls")
live_updates = pd_stream.sidebar.checkbox("Enable live UI refresh", value=False)
auto_predict = pd_stream.sidebar.checkbox("Auto-predict when CSV changes (calls GROQ)", value=False)
refresh_interval = pd_stream.sidebar.slider("Refresh interval (seconds)", min_value=2, max_value=60, value=5, step=1)

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
    try:
        if os.path.exists(LEDGER_CSV):
            os.remove(LEDGER_CSV)
    except Exception:
        pass
    blank_df = pd.DataFrame(columns=["Timestamp", "Matchup", "Sport", "AI Pick Selection", "Final Score Line", "Outcome Label", "Trade Outcome Profit/Loss", "Running Bankroll"])
    blank_df.to_csv(LEDGER_CSV, index=False)
    pd_stream.sidebar.success("Ledger wiped clean!")
    pd_stream.experimental_rerun()

# -------------------- Headline / Intro --------------------
pd_stream.markdown(
    """
    <div style='background-color:#0c1017;padding:12px;border-radius:8px;border:1px solid #1f2937;margin-bottom:20px;'>
      <p style='color:#00ff66;font-family:monospace;font-weight:bold;margin:0;white-space:nowrap;'>
        ⚡ Smitty's Live AI Desk — Clocks, Scheduled Models & Subscriber Blueprints
      </p>
    </div>
    """,
    unsafe_allow_html=True
)

pd_stream.title("🧠 Smitty's 2-Layer AI News-Intelligence SaaS Desk")
pd_stream.write("---")

# -------------------- Auto-refresh logic --------------------
if live_updates:
    # try to use streamlit_autorefresh if installed for better behavior
    try:
        from streamlit_autorefresh import st_autorefresh  # type: ignore
        st_autorefresh(interval=refresh_interval * 1000, limit=None, key="autorefresh")
    except Exception:
        # fallback: manual cheap rerun scheduling
        now = time.time()
        last_run = pd_stream.session_state.get("_live_last_run", 0)
        if now - last_run >= max(1.0, refresh_interval):
            pd_stream.session_state["_live_last_run"] = now
            pd_stream.experimental_rerun()


# -------------------- Main renderer --------------------
def render_enterprise_matrix():
    df = load_master(MASTER_CSV)

    if df.empty:
        pd_stream.info("⏳ Awaiting loop synchronization... Your background engine terminal is writing the live data rows now.")
        return

    # --- Automated column alignment mapping (case-insensitive detection)
    rename_map = {}
    for col in df.columns:
        lc = col.lower()
        if "sport" in lc:
            rename_map[col] = "Sport"
        if "matchup" in lc:
            rename_map[col] = "Matchup"
        if "time" in lc or "clock" in lc:
            rename_map[col] = "Time Metric"
        if "ticker" in lc or "score" in lc:
            rename_map[col] = "Score Ticker"
        if "tony" in lc:
            # map both "tony" and "tonybet" variants to a canonical key
            rename_map[col] = "TonyBet Ontario"
        if "mgm" in lc or "betmgm" in lc:
            rename_map[col] = "BetMGM Ontario"
        if "edge" in lc or "margin" in lc:
            rename_map[col] = "Edge Margin %"
        if "directive" in lc or "action" in lc:
            rename_map[col] = "AI Action Directive"
        if "pick" in lc or "team" in lc:
            rename_map[col] = "Pick Team"
        if "layer" in lc:
            rename_map[col] = "Engine Layer"

    # perform rename
    df = df.rename(columns=rename_map)

    # --- FIX: avoid duplicate column names which crash pyarrow/streamlit dataframe renderer
    if df.columns.duplicated().any():
        dup_list = [c for i, c in enumerate(df.columns) if df.columns.duplicated()[i]]
        # warn in UI (helpful during debugging)
        pd_stream.warning(f"Duplicate columns detected in source CSV and renamed internally: {dup_list}")
        # make columns unique preserving first occurrence
        df.columns = make_unique_columns(df.columns)

    # copy for blueprint / member view
    blueprint_df = df.copy()

    # --- Sidebar filters (re-evaluate available sports after normalization)
    sport_options = ["ALL"]
    if "Sport" in df.columns:
        sport_options = ["ALL"] + list(df["Sport"].dropna().unique())

    # We re-show the sport selector if needed (keeps earlier selection if present)
    global selected_sport
    try:
        selected_sport = pd_stream.session_state.get("selected_sport", "ALL")
    except Exception:
        selected_sport = "ALL"

    # Ensure the UI shows the sport selector (non-blocking)
    selected_sport = pd_stream.selectbox("Filter Market Sport", sport_options, index=0, key="selected_sport")

    strictness_trigger = pd_stream.session_state.get("strictness_trigger", None)
    if strictness_trigger is None:
        strictness_trigger = 0.0
    # small UI slider for strictness
    strictness_trigger = pd_stream.slider("AI Minimum Value Edge Cutoff (%)", min_value=0.0, max_value=50.0, value=float(strictness_trigger), step=0.5, key="strictness_trigger")

    # apply sport filter
    if "Sport" in df.columns and selected_sport != "ALL":
        df = df[df["Sport"] == selected_sport]
        blueprint_df = blueprint_df[blueprint_df["Sport"] == selected_sport]

    # apply edge cutoff safely
    if "Edge Margin %" in df.columns:
        try:
            df = df[pd.to_numeric(df["Edge Margin %"], errors="coerce").fillna(0.0) >= float(strictness_trigger)]
        except Exception:
            # in case of weird types, ignore filter to avoid crash
            pass

    # partition layers safely
    live_df = pd.DataFrame()
    upcoming_df = pd.DataFrame()
    if "Engine Layer" in df.columns:
        try:
            live_df = df[df["Engine Layer"].str.contains("LIVE|LAYER 2", case=False, na=False)]
            upcoming_df = df[df["Engine Layer"].str.contains("UPCOMING|LAYER 1", case=False, na=False)]
        except Exception:
            # string operation failed due to types - coerce to str and retry
            try:
                tmp_layer = df["Engine Layer"].astype(str)
                live_df = df[tmp_layer.str.contains("LIVE|LAYER 2", case=False, na=False)]
                upcoming_df = df[tmp_layer.str.contains("UPCOMING|LAYER 1", case=False, na=False)]
            except Exception:
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

    # Live matrix display
    pd_stream.subheader("🔴 LAYER 2: Live In-Play Systems (Active Scores, Clocks & Ontario Odds Boards)")
    if live_df.empty:
        pd_stream.info("No active live matches match your sidebar filter settings.")
    else:
        # choose columns that exist and are safe to display
        preferred_cols = ["Sport", "Matchup", "Time Metric", "Score Ticker", "TonyBet Ontario", "BetMGM Ontario", "Edge Margin %", "AI Action Directive"]
        available_cols = [c for c in preferred_cols if c in live_df.columns]
        try:
            pd_stream.dataframe(live_df[available_cols], use_container_width=True, hide_index=True)
        except Exception as e:
            # fallback: stream raw head if pyarrow conversion still fails
            pd_stream.error("Unable to render live table due to internal column type issue. Showing a compact preview.")
            pd_stream.write(live_df[available_cols].head(25))

    pd_stream.write("---")

    # Upcoming layer display
    pd_stream.subheader("⏳ LAYER 1: Upcoming Pre-Match Models (Scheduled Selections)")
    if upcoming_df.empty:
        pd_stream.info("No upcoming models computed.")
    else:
        preferred_cols = ["Sport", "Matchup", "Time Metric", "TonyBet Ontario", "BetMGM Ontario", "Edge Margin %", "AI Action Directive"]
        available_cols = [c for c in preferred_cols if c in upcoming_df.columns]
        try:
            pd_stream.dataframe(upcoming_df[available_cols], use_container_width=True, hide_index=True)
        except Exception:
            pd_stream.write(upcoming_df[available_cols].head(25))

    pd_stream.write("---")

    # Member execution blueprint
    pd_stream.subheader("📋 Automated Execution Order Blueprint (Scaled Cash Risks)")
    if pd_stream.session_state.get("authenticated"):
        pd_stream.success("🌟 AI PREMIUM MEMBER POSITIONS UNLOCKED")
        # determine active orders from blueprint (unfiltered copy)
        if "Edge Margin %" in blueprint_df.columns:
            try:
                active_orders = blueprint_df[pd.to_numeric(blueprint_df["Edge Margin %"], errors="coerce").fillna(0.0) >= float(strictness_trigger)]
            except Exception:
                active_orders = blueprint_df.copy()
        else:
            active_orders = blueprint_df.copy()

        if "AI Action Directive" in active_orders.columns:
            active_orders = active_orders[~active_orders["AI Action Directive"].isin(["❌ NO VALUE", "🛑 PULL OUT DEPOSIT", "PASS", "❌ PASS LINE"])]

        if active_orders.empty:
            pd_stream.info("No high-value selections match your minimum value edge cutoff.")
        else:
            pd_stream.write("**Actions:**")
            predictive_button_label = "🔮 Predict with GROQ for active orders (calls API)" if HAS_ENGINE else "🔮 Predict (ai_processing_engine.py missing)"
            if pd_stream.button(predictive_button_label):
                if not HAS_ENGINE:
                    pd_stream.error("ai_processing_engine.py not found or failed to import. Place it beside this dashboard to enable model calls.")
                else:
                    out_rows = []
                    with pd_stream.spinner("Calling model for active orders..."):
                        for _, row in active_orders.iterrows():
                            try:
                                rd = row.to_dict()
                                pred = predict_from_row(rd, throttle=0.05)
                                rd["model_home_win_prob"] = pred.get("home_win_prob")
                                rd["model_edge_pct"] = pred.get("edge_pct")
                                out_rows.append(rd)
                            except Exception as e:
                                rd = row.to_dict()
                                rd["model_error"] = str(e)
                                out_rows.append(rd)
                    if out_rows:
                        out_df = pd.DataFrame(out_rows)
                        pd_stream.dataframe(out_df.head(200), use_container_width=True, hide_index=True)
                        if pd_stream.checkbox("Append these predictions to master CSV as summary rows"):
                            appended = 0
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
                                    append_prediction_to_csv(MASTER_CSV, summary)
                                    appended += 1
                                except Exception:
                                    # fallback csv append via pandas (atomic best-effort)
                                    try:
                                        pd.DataFrame([summary]).to_csv(MASTER_CSV, mode="a", header=not os.path.exists(MASTER_CSV), index=False)
                                        appended += 1
                                    except Exception:
                                        pass
                            pd_stream.success(f"Appended {appended} summary rows to master CSV.")
            # display suggested stakes (no model calls)
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

    # Historical ledger tracker
    pd_stream.write("---")
    pd_stream.subheader("🏆 Historical Performance Settlement Archive (Graded Bet Ledger)")
    if os.path.exists(LEDGER_CSV):
        try:
            ledger_df = pd.read_csv(LEDGER_CSV)
            if not ledger_df.empty and "Running Bankroll" in ledger_df.columns:
                pd_stream.write("#### 📊 Cumulative Capital Return Growth Chart (ROI Performance)")
                try:
                    pd_stream.line_chart(ledger_df["Running Bankroll"])
                except Exception:
                    # fallback to showing the raw dataframe
                    pd_stream.write(ledger_df[["Timestamp", "Running Bankroll"]].head(200))
                pd_stream.write("#### 📋 Detailed Settlement Audit Log Statements")
                pd_stream.dataframe(ledger_df, use_container_width=True, hide_index=True)
            else:
                pd_stream.dataframe(ledger_df.head(200), use_container_width=True, hide_index=True)
        except Exception:
            pd_stream.warning("Could not read ledger file.")
    else:
        pd_stream.info("No ledger file found.")


# -------------------- Execute render --------------------
# Use pd_stream.fragment if available in your environment; otherwise render once.
try:
    fragment = getattr(pd_stream, "fragment", None)
    if fragment:
        @fragment(run_every=1)
        def _run_matrix():
            render_enterprise_matrix()
        _run_matrix()
    else:
        render_enterprise_matrix()
except Exception:
    # last-resort: try a single render and show error inline
    try:
        render_enterprise_matrix()
    except Exception as e:
        pd_stream.error(f"Dashboard rendering failed: {e}")