import streamlit as pd_stream
import pandas as pd
import os
import time

pd_stream.set_page_config(page_title="2-Layer AI Risk Desk & Tracker", layout="wide")

pd_stream.markdown("# 🧠 Smitty's 2-Layer AI Trading Desk")
pd_stream.markdown("### Real-Time Split Engine: Synchronizing In-Play Live Systems & Upcoming Market Models")
pd_stream.write("---")

filename = "master_predictions_sheet.csv"

if not os.path.exists(filename):
    pd_stream.error("❌ master_predictions_sheet.csv not detected. Initialize your engine loop in your VS Code terminal.")
else:
    df = pd.read_csv(filename)

    # 💰 RESTORED SIDEBAR CONTROL PANELS
    pd_stream.sidebar.header("⚙️ Bankroll Management Desk")
    bankroll = pd_stream.sidebar.number_input("Total Trading Bankroll ($)", min_value=10.0, value=1000.0, step=50.0)
    selected_sport = pd_stream.sidebar.selectbox("Filter Market Sport", ["ALL"] + list(df["Sport"].unique()))
    
    # Keep an unfiltered copy for the blueprint generator below
    blueprint_df = df.copy()
    
    if selected_sport != "ALL":
        df = df[df["Sport"] == selected_sport]
        blueprint_df = blueprint_df[blueprint_df["Sport"] == selected_sport]

    # SEPARATE DUAL-LAYERS IN REAL-TIME
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
        pd_stream.info("No games are active in-play right at this second. Waiting for next game block...")
    else:
        pd_stream.dataframe(
            live_layer_df[["Sport", "Matchup", "Time Metric", "Score Ticker", "Odds Line", "Edge Margin %", "AI Action Directive", "Pick Team"]],
            use_container_width=True, hide_index=True
        )

    pd_stream.write("---")

    # ⏳ 2. THE UPCOMING LAYER SCREEN (Games playing later today/tonight)
    pd_stream.write("### ⏳ LAYER 1: Upcoming Pre-Match Models (Scheduled Selections)")
    if upcoming_layer_df.empty:
        pd_stream.info("No upcoming matches detected matching current filters.")
    else:
        pd_stream.dataframe(
            upcoming_layer_df[["Sport", "Matchup", "Odds Line", "Edge Margin %", "AI Action Directive", "Pick Team"]],
            use_container_width=True, hide_index=True
        )

    # --- 📋 LOWER CODES STATION (PERMANENTLY RENDERED CASH PRICE MATRIX) ---
    pd_stream.write("---")
    pd_stream.write("### 📋 Automated Execution Order Blueprint (Scaled Cash Risks)")
    
    # Filter out passes to only show high-value trading entries
    active_orders = blueprint_df[~blueprint_df["AI Action Directive"].isin(["❌ NO VALUE", "🛑 PULL OUT DEPOSIT", "PASS", "❌ PASS LINE"])]
    
    if active_orders.empty:
        pd_stream.info("Waiting for high-value edge signals to cross threshold models...")
    else:
        for _, row in active_orders.iterrows():
            layer_label = row["Engine Layer"]
            matchup_title = row["Matchup"]
            action_status = row["AI Action Directive"]
            target_selection = row["Pick Team"]
            odds_line_str = row["Odds Line"]
            edge_pct_value = row["Edge Margin %"]
            
            # Dynamic cash value calculator locked directly back to your sidebar input box
            risk_ratio = (edge_pct_value * 0.5) / 100
            suggested_cash_wager = round(bankroll * risk_ratio, 2)
            if suggested_cash_wager < 5.0: 
                suggested_cash_wager = 25.00  # Default baseline risk protection
                
            blueprint_string = f"SOURCE ENGINE: [{layer_label}] | SIGNAL: [{action_status}] -> RISK ALLOCATION: ${suggested_cash_wager} ON: {target_selection} ({odds_line_str})"
            
            pd_stream.markdown(f"**📍 {matchup_title} ({row['Sport']})** — Active Statistical Advantage: **+{edge_pct_value}%**")
            pd_stream.code(blueprint_string, language="text")

    # Dynamic page background reload synchronization tick (5 seconds)
    time.sleep(5)
    pd_stream.rerun()
