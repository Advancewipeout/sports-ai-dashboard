import streamlit as pd_stream
import pandas as pd
import os
import time

pd_stream.set_page_config(page_title="2-Layer AI Risk Desk", layout="wide")

pd_stream.markdown("# 🧠 Institutional 2-Layer AI Trading Desk")
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
    
    if selected_sport != "ALL":
        df = df[df["Sport"] == selected_sport]

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

    # --- LOWER SYSTEM BLUEPRINTS (DYNAMIC SCALING STATIONS) ---
    pd_stream.write("---")
    pd_stream.write("### 📋 Automated Execution Order Blueprint (Scaled Risk Actions)")
    
    active_orders = df[~df["AI Action Directive"].isin(["❌ NO VALUE", "🛑 PULL OUT DEPOSIT"])]
    if active_orders.empty:
        pd_stream.info("No active play recommendations found under current configurations.")
    else:
        for _, row in active_orders.iterrows():
            layer = row["Engine Layer"]
            match = row["Matchup"]
            directive = row["AI Action Directive"]
            target = row["Pick Team"]
            line = row["Odds Line"]
            edge = row["Edge Margin %"]
            
            # Dynamic calculation formula hooked straight back to your side money input slider
            allocation_pct = (edge * 0.5) / 100
            dollar_risk = round(bankroll * allocation_pct, 2)
            if dollar_risk < 5.0: dollar_risk = 25.00 # Minimum default trade threshold protection
            
            blueprint_code = f"SOURCE LAYER: [{layer}] | ORDER STATUS: [{directive}] -> EXECUTE ACTION ON: {target} ({line}) | DYNAMIC SUGGESTED RISK: ${dollar_risk}"
            
            pd_stream.markdown(f"**📍 {match} ({row['Sport']})** — Instant Calculated Value Edge: **+{edge}%**")
            pd_stream.code(blueprint_code, language="text")

    # Auto-loop background refreshing hooks every 5 seconds
    time.sleep(5)
    pd_stream.rerun()
