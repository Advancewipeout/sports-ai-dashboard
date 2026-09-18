import streamlit as pd_stream
import pandas as pd
import os

pd_stream.set_page_config(page_title="AI Sports Risk Engine & Tracker", layout="wide")

pd_stream.markdown("# 🧠 Advanced AI Sports Trade Desk")
pd_stream.markdown("### Multi-Sport Execution Network, Live Weather Radar & Performance Ledger")
pd_stream.write("---")

predictions_file = "master_predictions_sheet.csv"
log_file = "bankroll_performance_history.csv"

# Render Bankroll Profit Graph if the log data exists
if os.path.exists(log_file):
    pd_stream.write("### 📈 Automated Bankroll Performance History Tracker")
    log_df = pd.read_csv(log_file)
    pd_stream.line_chart(log_df, x="Timestamp", y="Current Total Bankroll ($)")
    
    # Quick Status Metrics Block
    c1, c2, c3 = pd_stream.columns(3)
    c1.metric("Current Account Net Equity", f"${log_df['Current Total Bankroll ($)'].iloc[-1]}")
    c2.metric("Last Run PnL Delta", f"${log_df['Simulated PnL ($)'].iloc[-1]}")
    c3.metric("Historical Analytics Sessions", len(log_df))
    pd_stream.write("---")

if not os.path.exists(predictions_file):
    pd_stream.error("❌ master_predictions_sheet.csv not detected. Run your updated script first.")
else:
    df = pd.read_csv(predictions_file)
    
    pd_stream.sidebar.header("⚙️ Bankroll Controls")
    bankroll = pd_stream.sidebar.number_input("Total Trading Bankroll ($)", min_value=10.0, value=1000.0, step=50.0)
    selected_sport = pd_stream.sidebar.selectbox("Select Sports Market", ["ALL"] + list(df["Sport"].unique()))
    
    if selected_sport != "ALL": 
        df = df[df["Sport"] == selected_sport]

    pd_stream.write("### 🗂 Live Order Execution Grid (Weather-Enabled)")
    pd_stream.dataframe(df, use_container_width=True, hide_index=True)
    
    pd_stream.write("---")
    pd_stream.write("### 📋 Trade Execution Blueprint & Climate Analytics")
    
    active_plays = df[df["AI Action Directive"] != "❌ NO VALUE"]
    if active_plays.empty:
        pd_stream.info("No active high-value play directives matching current parameters.")
    else:
        for _, row in active_plays.iterrows():
            with pd_stream.container():
                directive = row['AI Action Directive']
                match = f"{row['Away Team']} @ {row['Home Team']}"
                pick = row['Recommended Selection']
                weather = row['Live Stadium Weather']
                allocation = round((row['Suggested Allocation ($)'] / 1000.0) * bankroll, 2)
                
                blueprint_text = f"ORDER STATUS: [{directive}] | SELECTION: {pick} | WEATHER PROFILE: {weather} | TOTAL RISK ALLOCATION: ${allocation}"
                
                pd_stream.markdown(f"**📍 {match} ({row['Sport']})** — Edge: **+{row['Calculated Edge %']}%**")
                pd_stream.code(blueprint_text, language="text")
