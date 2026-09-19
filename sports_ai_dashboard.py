import streamlit as pd_stream
import pandas as pd
import os
import time

pd_stream.set_page_config(page_title="Smitty's AI Risk Desk & Tracker", layout="wide")

pd_stream.markdown("# 🧠 Smitty's 2-Layer AI Trading Desk")
pd_stream.markdown("### Real-Time Split Engine: Synchronizing In-Play Live Systems & Upcoming Market Models")
pd_stream.write("---")

filename = "master_predictions_sheet.csv"
ledger_file = "settled_bets_ledger.csv"

if not os.path.exists(filename):
    pd_stream.error("❌ master_predictions_sheet.csv not detected. Initialize your loop in your VS Code terminal.")
else:
    df = pd.read_csv(filename)

    # 💰 RESTORED SIDEBAR CONTROL PANELS WITH STRICTNESS CONTROL FILTERS & LEDGER RESET BUTTONS
    pd_stream.sidebar.header("⚙️ Bankroll Management Desk")
    bankroll = pd_stream.sidebar.number_input("Total Trading Bankroll ($)", min_value=10.0, value=1000.0, step=50.0)
    selected_sport = pd_stream.sidebar.selectbox("Filter Market Sport", ["ALL"] + list(df["Sport"].unique()))
    
    # 🎯 NEW CONTROL: AI Strictness Edge Trigger Cutoff
    strictness_trigger = pd_stream.sidebar.slider("AI Minimum Value Edge Cutoff (%)", min_value=0.0, max_value=10.0, value=2.0, step=0.5)
    
    pd_stream.sidebar.write("---")
    pd_stream.sidebar.header("🏆 History Operations")
    
    # 🧹 NEW CONTROL: Master Ledger Reset Switch
    if pd_stream.sidebar.button("🧹 Wipe Graded Bet Ledger History"):
        if os.path.exists(ledger_file):
            os.remove(ledger_file)
            # Create a blank sheet instantly to override cloud cache memory
            blank_df = pd.DataFrame(columns=["Timestamp", "Matchup", "Sport", "AI Pick Selection", "Final Score Line", "Trade Outcome Profit/Loss"])
            blank_df.to_csv(ledger_file, index=False)
            
            # Force background git sync to wipe it out from the live web server instantly
            git_patch = 'set PATH=%PATH%;%LocalAppData%\\GitHubDesktop\\bin;%ProgramFiles%\\Git\\cmd;%ProgramFiles%\\Git\\bin && '
            os.system(git_patch + "git add settled_bets_ledger.csv && git commit -m 'Clear Ledger' --quiet && git push origin main --quiet")
            pd_stream.sidebar.success("Ledger wiped completely clean on your website!")
            time.sleep(1)
            pd_stream.rerun()

    # Apply layout dropdown filtering mechanics
    blueprint_df = df.copy()
    if selected_sport != "ALL":
        df = df[df["Sport"] == selected_sport]
        blueprint_df = blueprint_df[blueprint_df["Sport"] == selected_sport]

    # Apply layout strictness cutting metrics
    df = df[df["Edge Margin %"] >= strictness_trigger]

    # Separate layers
    live_layer_df = df[df["Engine Layer"].str.contains("LIVE")]
    upcoming_layer_df = df[df["Engine Layer"].str.contains("UPCOMING")]

    # --- TOP MAIN STATUS BLOCKS ---
    col1, col2, col3 = pd_stream.columns(3)
    col1.metric("Live Matches Tracking Now", len(live_layer_df))
    col2.metric("Upcoming Systems Calculated", len(upcoming_layer_df))
    col3.metric("Max Discovered Statistical Edge", f"+{df['Edge Margin %'].max()}%" if not df.empty else "0.0%")
    pd_stream.write("---")

    # 🔥 1. THE LIVE IN-PLAY LAYER SCREEN (Sports happening right now)
    pd_stream.write("### 🔴 LAYER 2: Live In-Play Systems (Active Scores & Clock Tickers)")
    if live_layer_df.empty:
        pd_stream.info(f"No active games match your current strictness trigger profile (+{strictness_trigger}%). Slide it down to see more entries.")
    else:
        pd_stream.dataframe(
            live_layer_df[["Sport", "Matchup", "Time Metric", "Score Ticker", "Odds Line", "Edge Margin %", "AI Action Directive", "Pick Team"]],
            use_container_width=True, hide_index=True
        )

    pd_stream.write("---")

    # ⏳ 2. THE UPCOMING LAYER SCREEN (Games playing later today/tonight)
    pd_stream.write("### ⏳ LAYER 1: Upcoming Pre-Match Models (Scheduled Selections)")
    if upcoming_layer_df.empty:
        pd_stream.info(f"No upcoming models match your current strictness trigger profile (+{strictness_trigger}%). Slide it down to see more entries.")
    else:
        pd_stream.dataframe(
            upcoming_layer_df[["Sport", "Matchup", "Odds Line", "Edge Margin %", "AI Action Directive", "Pick Team"]],
            use_container_width=True, hide_index=True
        )

    # --- 📋 LOWER CODES STATION (DYNAMIC RISK ALLOCATIONS STATION) ---
    pd_stream.write("---")
    pd_stream.write("### 📋 Automated Execution Order Blueprint (Scaled Cash Risks)")
    
    # Filter matrix by custom slider requirements
    active_orders = blueprint_df[blueprint_df["Edge Margin %"] >= strictness_trigger]
    active_orders = active_orders[~active_orders["AI Action Directive"].isin(["❌ NO VALUE", "🛑 PULL OUT DEPOSIT", "PASS", "❌ PASS LINE"])]
    
    if active_orders.empty:
        pd_stream.info("Waiting for edge percentages to match your minimum strictness cutoff limits...")
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
            
            pd_stream.markdown(f"**📍 {matchup_title} ({row['Sport']})** — Active Statistical Advantage: **+{edge_pct_value}%**")
            pd_stream.code(blueprint_string, language="text")

    # --- 🏆 HISTORICAL BET LEDGER COMPONENT ---
    pd_stream.write("---")
    pd_stream.write("### 🏆 Historical Performance Settlement Archive (Graded Bet Ledger)")
    if not os.path.exists(ledger_file):
        pd_stream.info("Waiting for first live match clock cycle to reach a FINAL outcome state to populate historical ledger items.")
    else:
        ledger_df = pd.read_csv(ledger_file)
        if ledger_df.empty:
            pd_stream.info("Ledger clear. Awaiting new game settlements.")
        else:
            pd_stream.dataframe(ledger_df, use_container_width=True, hide_index=True)

    time.sleep(5)
    pd_stream.rerun()
