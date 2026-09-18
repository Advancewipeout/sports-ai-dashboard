import streamlit as pd_stream
import pandas as pd
import os
import time

pd_stream.set_page_config(page_title="2-Layer AI Risk Desk & Tracker", layout="wide")

pd_stream.markdown("# 🧠 Smitty's 2-Layer AI Trading Desk")
pd_stream.markdown("### Real-Time Split Engine: Synchronizing In-Play Live Systems & Upcoming Market Models")
pd_stream.write("---")

filename = "master_predictions_sheet.csv"
ledger_file = "settled_bets_ledger.csv"

if not os.path.exists(filename):
    pd_stream.error("❌ master_predictions_sheet.csv not detected.")
else:
    df = pd.read_csv(filename)

    # RESTORED SIDEBAR CONTROL PANELS
    pd_stream.sidebar.header("⚙️ Bankroll Management Desk")
    bankroll = pd_stream.sidebar.number_input("Total Trading Bankroll ($)", min_value=10.0, value=1000.0, step=50.0)
    selected_sport = pd_stream.sidebar.selectbox("Filter Market Sport", ["ALL"] + list(df["Sport"].unique()))
    
    if selected_sport != "ALL": df = df[df["Sport"] == selected_sport]

    live_layer_df = df[df["Engine Layer"].str.contains("LIVE")]
    upcoming_layer_df = df[df["Engine Layer"].str.contains("UPCOMING")]

    # Render Visual Layer Displays
    pd_stream.write("### 🔴 LAYER 2: Live In-Play Systems (Active Scores & Clock Tickers)")
    pd_stream.dataframe(live_layer_df[["Sport", "Matchup", "Time Metric", "Score Ticker", "Odds Line", "Edge Margin %", "AI Action Directive", "Pick Team"]], use_container_width=True, hide_index=True)
    pd_stream.write("---")

    pd_stream.write("### ⏳ LAYER 1: Upcoming Pre-Match Models (Scheduled Selections)")
    pd_stream.dataframe(upcoming_layer_df[["Sport", "Matchup", "Odds Line", "Edge Margin %", "AI Action Directive", "Pick Team"]], use_container_width=True, hide_index=True)
    
    # 🏆 NEW ACTIVE SYSTEM LEDGER COMPONENT (Displays graded wins/losses dynamically)
    pd_stream.write("---")
    pd_stream.write("### 🏆 Historical Performance Settlement Archive (Graded Bet Ledger)")
    if not os.path.exists(ledger_file):
        pd_stream.info("Waiting for first live match clock cycle to reach a FINAL outcome state to populate historical ledger items.")
    else:
        ledger_df = pd.read_csv(ledger_file)
        pd_stream.dataframe(ledger_df, use_container_width=True, hide_index=True)

    time.sleep(5)
    pd_stream.rerun()
