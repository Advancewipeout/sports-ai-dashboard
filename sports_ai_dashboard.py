import streamlit as pd_stream
import pandas as pd
import os
import time

pd_stream.set_page_config(page_title="Smitty's AI News Risk Desk", layout="wide")

pd_stream.markdown("# 🧠 Smitty's 2-Layer AI News-Intelligence Desk")
pd_stream.markdown("### Real-Time Split Engine: Processing Live Tickers, Scheduled Models & Global News Sentiment Wires")
pd_stream.write("---")

filename = "master_predictions_sheet.csv"
ledger_file = "settled_bets_ledger.csv"

# 💰 SIDEBAR CONTROL PANELS
pd_stream.sidebar.header("⚙️ Bankroll Management Desk")
bankroll = pd_stream.sidebar.number_input("Total Trading Bankroll ($)", min_value=10.0, value=1000.0, step=50.0)

# Check for file existence safely before loading sidebar
df_init = pd.DataFrame()
if os.path.exists(filename):
    try:
        if os.path.getsize(filename) > 0:
            df_init = pd.read_csv(filename)
    except Exception:
        pass

sport_options = ["ALL"]
if not df_init.empty and "Sport" in df_init.columns:
    sport_options = ["ALL"] + list(df_init["Sport"].unique())

selected_sport = pd_stream.sidebar.selectbox("Filter Market Sport", sport_options)
strictness_trigger = pd_stream.sidebar.slider("AI Minimum Value Edge Cutoff (%)", min_value=0.0, max_value=10.0, value=0.0, step=0.5)

pd_stream.sidebar.write("---")
pd_stream.sidebar.header("🏆 History Operations")
if pd_stream.sidebar.button("🧹 Wipe Graded Bet Ledger History"):
    if os.path.exists(ledger_file):
        os.remove(ledger_file)
        blank_df = pd.DataFrame(columns=["Timestamp", "Matchup", "Sport", "AI Pick Selection", "Final Score Line", "Trade Outcome Profit/Loss", "Running Bankroll"])
        blank_df.to_csv(ledger_file, index=False)
        pd_stream.sidebar.success("Ledger wiped clean!")
        pd_stream.rerun()

# 🔄 THE HIGH-SPEED LIVE FRAGMENT SYNC TRIGGER (Rapid 1-second hands-free motion!)
@pd_stream.fragment(run_every=1)
def render_live_sports_matrix():
    if not os.path.exists(filename) or os.path.getsize(filename) == 0:
        pd_stream.info("⏳ Awaiting data stream sync... Your engine terminal loop is writing the live spreadsheet rows now.")
        return

    try:
        df = pd.read_csv(filename)
    except Exception:
        pd_stream.info("⏳ Refreshing pipeline matrices... Hold tight.")
        return

    blueprint_df = df.copy()
    
    if "Sport" in df.columns and selected_sport != "ALL":
        df = df[df["Sport"] == selected_sport]
        blueprint_df = blueprint_df[blueprint_df["Sport"] == selected_sport]

    if "Edge Margin %" in df.columns:
        df = df[df["Edge Margin %"] >= strictness_trigger]
    
    # Robust flexible layer extraction to completely bypass variable naming conflicts
    layer_col = "Engine Layer" if "Engine Layer" in df.columns else (df.columns[0] if not df.empty else "")
    
    if layer_col and layer_col in df.columns:
        live_layer_df = df[df[layer_col].astype(str).str.contains("LIVE|LAYER 2", case=False, na=False)]
        upcoming_layer_df = df[df[layer_col].astype(str).str.contains("UPCOMING|LAYER 1", case=False, na=False)]
    else:
        live_layer_df = pd.DataFrame()
        upcoming_layer_df = pd.DataFrame()

    # --- TOP MAIN STATUS BLOCKS ---
    col1, col2, col3 = pd_stream.columns(3)
    col1.metric("Live Matches Tracking Now", len(live_layer_df))
    col2.metric("Upcoming Systems Calculated", len(upcoming_layer_df))
    col3.metric("Max Discovered Statistical Edge", f"+{df['Edge Margin %'].max()}%" if not df.empty and "Edge Margin %" in df.columns else "0.0%")
    pd_stream.write("---")

    # 🔥 1. LIVE LAYER MATRIX
    pd_stream.write("### 🔴 LAYER 2: Live In-Play Systems (Active Scores, Clocks & Breaking News Wire)")
    if live_layer_df.empty:
        pd_stream.info("No live games currently match your strictness filter settings.")
    else:
        display_cols = [c for c in ["Sport", "Matchup", "Time Metric", "Score Ticker", "Odds Line", "Edge Margin %", "AI Action Directive", "Breaking News Signal", "Pick Team"] if c in live_layer_df.columns]
        pd_stream.dataframe(live_layer_df[display_cols], use_container_width=True, hide_index=True)
    pd_stream.write("---")

    # ⏳ 2. UPCOMING LAYER MATRIX
    pd_stream.write("### ⏳ LAYER 1: Upcoming Pre-Match Models (Scheduled Selections)")
    if upcoming_layer_df.empty:
        pd_stream.info("No upcoming games currently match your strictness filter settings.")
    else:
        display_cols = [c for c in ["Sport", "Matchup", "Odds Line", "Edge Margin %", "AI Action Directive", "Breaking News Signal", "Pick Team"] if c in upcoming_layer_df.columns]
        pd_stream.dataframe(upcoming_layer_df[display_cols], use_container_width=True, hide_index=True)

    # --- 📋 LOWER BLUEPRINTS ---
    pd_stream.write("---")
    pd_stream.write("### 📋 Automated Execution Order Blueprint (Scaled Cash Risks)")
    if "AI Action Directive" in blueprint_df.columns:
        active_orders = blueprint_df[blueprint_df["Edge Margin %"] >= strictness_trigger] if "Edge Margin %" in blueprint_df.columns else blueprint_df
        active_orders = active_orders[~active_orders["AI Action Directive"].isin(["❌ NO VALUE", "🛑 PULL OUT DEPOSIT", "PASS", "❌ PASS LINE"])]
    else:
        active_orders = pd.DataFrame()
    
    if active_orders.empty:
        pd_stream.info("Awaiting high-value selections matching your edge cutoff rules...")
    else:
        for _, row in active_orders.iterrows():
            layer_label = row.get(layer_col, "LAYER 2") if layer_col else "LAYER 2"
            matchup_title = row.get("Matchup", "Match")
            action_status = row.get("AI Action Directive", "🔥 LIVE BUY")
            target_selection = row.get("Pick Team", "Target")
            odds_line_str = row.get("Odds Line", "TonyBet")
            edge_pct_value = row.get("Edge Margin %", 0.0)
            
            risk_ratio = (edge_pct_value * 0.5) / 100
            suggested_cash_wager = round(bankroll * risk_ratio, 2)
            if suggested_cash_wager < 5.0: suggested_cash_wager = 25.00
                
            blueprint_string = f"SOURCE ENGINE: [{layer_label}] | SIGNAL: [{action_status}] -> RISK ALLOCATION: ${suggested_cash_wager} ON: {target_selection} ({odds_line_str})"
            pd_stream.markdown(f"**📍 {matchup_title} ({row.get('Sport', 'Sport')})** — Active Advantage: **+{edge_pct_value}%**")
            pd_stream.code(blueprint_string, language="text")

    # --- 🏆 HISTORICAL LEDGER ARCHIVE TRACKER ---
    pd_stream.write("---")
    pd_stream.write("### 🏆 Historical Performance Settlement Archive (Graded Bet Ledger)")
    if os.path.exists(ledger_file):
        ledger_df = pd.read_csv(ledger_file)
        if not ledger_df.empty and "Running Bankroll" in ledger_df.columns:
            pd_stream.write("#### 📊 Cumulative Capital Return Growth Chart (ROI Performance)")
            pd_stream.line_chart(ledger_df["Running Bankroll"], use_container_width=True)
            pd_stream.write("#### 📋 Detailed Settlement Audit Log Statements")
            pd_stream.dataframe(ledger_df, use_container_width=True, hide_index=True)

# Ignite the live unblocked fragment channel
render_live_sports_matrix()
