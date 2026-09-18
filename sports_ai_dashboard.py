import streamlit as pd_stream
import pandas as pd
import os

pd_stream.set_page_config(page_title="AI Sports Risk Engine", layout="wide")

pd_stream.markdown("# 🧠 Advanced AI Sports Trade Desk")
pd_stream.markdown("### Multi-Sport Execution Network, Volatility Allocations & Management Action Triggers")
pd_stream.write("---")

filename = "master_predictions_sheet.csv"

if not os.path.exists(filename):
    pd_stream.error("❌ master_predictions_sheet.csv not detected. Run your script locally first.")
else:
    df = pd.read_csv(filename)
    
    pd_stream.sidebar.header("⚙️ Bankroll Controls")
    bankroll = pd_stream.sidebar.number_input("Total Trading Bankroll ($)", min_value=10.0, value=1000.0, step=50.0)
    
    # Real-Time Filter Dashboard Panels
    selected_sport = pd_stream.sidebar.selectbox("Select Sports Market", ["ALL"] + list(df["Sport"].unique()))
    selected_action = pd_stream.sidebar.selectbox("Filter By AI Action Directive", ["ALL", "🔥 FULL BUY", "🛡️ MITIGATED RISK", "⏳ HOLD LINE", "🛑 PULL OUT"])
    
    if selected_sport != "ALL": df = df[df["Sport"] == selected_sport]
    if selected_action != "ALL": df = df[df["AI Action Directive"] == selected_action]

    # Metrics
    col1, col2, col3 = pd_stream.columns(3)
    col1.metric("Total Market Lines Parsed", len(df))
    col2.metric("Active Execution Orders", len(df[df["AI Action Directive"].isin(["🔥 FULL BUY", "🛡️ MITIGATED RISK"])]))
    col3.metric("Peak Statistical Edge", f"+{df['Calculated Edge %'].max()}%" if not df.empty else "0.0%")
    
    pd_stream.write("### 🗂 Live Order Execution Grid")
    pd_stream.dataframe(df, use_container_width=True, hide_index=True)
    
    pd_stream.write("---")
    pd_stream.write("### 📋 Trade Execution Blueprint (Copy Station)")
    
    active_plays = df[df["AI Action Directive"] != "❌ NO VALUE"]
    if active_plays.empty:
        pd_stream.info("No active play directives matching current risk rules.")
    else:
        for _, row in active_plays.iterrows():
            with pd_stream.container():
                directive = row['AI Action Directive']
                match = f"{row['Away Team']} @ {row['Home Team']}"
                pick = row['Recommended Selection']
                allocation = round((row['Suggested Allocation ($)'] / 1000.0) * bankroll, 2)
                
                blueprint_text = f"ORDER STATUS: [{directive}] | SELECTION: {pick} | TOTAL RISK ALLOCATION: ${allocation}"
                
                pd_stream.markdown(f"**📍 {match} ({row['Sport']})** — Edge: **+{row['Calculated Edge %']}%**")
                pd_stream.code(blueprint_text, language="text")
