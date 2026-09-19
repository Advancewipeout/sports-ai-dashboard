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

# 💰 SIDEBAR CONTROL PANELS (Fully Restored & Protected from Resetting!)
pd_stream.sidebar.header("⚙️ Bankroll Management Desk")
bankroll = pd_stream.sidebar.number_input("Total Trading Bankroll ($)", min_value=10.0, value=1000.0, step=50.0)

# Ensure data core exists before populating sidebar filter choices
if os.path.exists(filename):
    df_init = pd.read_csv(filename)
    sport_options = ["ALL"] + list(df_init["Sport"].unique())
else:
    sport_options = ["ALL"]

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
    if not os.path.exists(filename):
        pd_stream.error("❌ master_predictions_sheet.csv not detected. Initialize your loop script inside VS Code.")
        return

    # Force a rapid reload of the fresh spreadsheet numbers from your computer
    df = pd.read_csv(filename)
    blueprint_df = df.copy()
    
    if selected_sport != "ALL":
        df = df[df["Sport"] == selected_sport]
        blueprint_df = blueprint_df[blueprint_df["Sport"] == selected_sport]

    # Filter main views dynamically by your strictness cutoff slider
    df = df[df["Edge Margin %"] >= strictness_trigger]
    
    live_layer_df = df[df["Engine Layer"].str.contains("LIVE")]
    upcoming_layer_df = df[df["Engine Layer"].str.contains("UPCOMING")]

    # --- TOP MAIN STATUS BLOCKS ---
    col1, col2, col3 = pd_stream.columns(3)
    col1.metric("Live Matches Tracking Now", len(live_layer_df))
    col2.metric("Upcoming Systems Calculated", len(upcoming_layer_df))
    col3.metric("Max Discovered Statistical Edge", f"+{df['Edge Margin %'].max()}%" if not df.empty else "0.0%")
    pd_stream.write("---")

    # 🔥 1. LIVE LAYER MATRIX
    pd_stream.write("### 🔴 LAYER 2: Live In-Play Systems (Active Scores, Clocks & Breaking News Wire)")
    if live_layer_df.empty:
        pd_stream.info("No live games currently match your strictness filter settings.")
    else:
        pd_stream.dataframe(live_layer_df[["Sport", "Matchup", "Time Metric", "Score Ticker", "Odds Line", "Edge Margin %", "AI Action Directive", "Breaking News Signal", "Pick Team"]], use_container_width=True, hide_index=True)
    pd_stream.write("---")

    # ⏳ 2. UPCOMING LAYER MATRIX
    pd_stream.write("### ⏳ LAYER 1: Upcoming Pre-Match Models (Scheduled Selections)")
    if upcoming_layer_df.empty:
        pd_stream.info("No upcoming games currently match your strictness filter settings.")
    else:
        pd_stream.dataframe(upcoming_layer_df[["Sport", "Matchup", "Odds Line", "Edge Margin %", "AI Action Directive", "Breaking News Signal", "Pick Team"]], use_container_width=True, hide_index=True)

    # --- 📋 LOWER BLUEPRINTS ---
    pd_stream.write("---")
    pd_stream.write("### 📋 Automated Execution Order Blueprint (Scaled Cash Risks)")
    active_orders = blueprint_df[blueprint_df["Edge Margin %"] >= strictness_trigger]
    active_orders = active_orders[~active_orders["AI Action Directive"].isin(["❌ NO VALUE", "🛑 PULL OUT DEPOSIT", "PASS", "❌ PASS LINE"])]
    
    if active_orders.empty:
        pd_stream.info("Awaiting high-value selections matching your edge cutoff rules...")
    else:
        for _, row in active_orders.iterrows():
            layer_label = row["Engine Layer"]
            matchup_title = row["Matchup"]
            action_status = row["AI Action Directive"]
            target_selection = row["Pick Team"]
            odds_line_str = row["Odds Line"]
            edge_pct_value = row["Edge Margin %"]
            
            risk_ratio = (edge_pct_value * 0.5) / 100
            suggested_cash_wager = round(bankroll * risk_ratio, 2)
            if suggested_cash_wager < 5.0: suggested_cash_wager = 25.00
                
            blueprint_string = f"SOURCE ENGINE: [{layer_label}] | SIGNAL: [{action_status}] -> RISK ALLOCATION: ${suggested_cash_wager} ON: {target_selection} ({odds_line_str})"
            pd_stream.markdown(f"**📍 {matchup_title} ({row['Sport']})** — Active Advantage: **+{edge_pct_value}%**")
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
