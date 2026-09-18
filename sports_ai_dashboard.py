import streamlit as pd_stream
import pandas as pd
import os
import time

pd_stream.set_page_config(page_title="AI Live In-Play Trade Desk", layout="wide")

pd_stream.markdown("# 🧠 AI Real-Time In-Play Court Desk")
pd_stream.markdown("### Streaming Live Game Feeds, Score Tickers & Instantaneous Micro-Edge Directives")
pd_stream.write("---")

# 🔄 FORCE LIVE BACKGROUND REFRESH (Auto-reloads dashboard grid automatically every 5 seconds)
pd_stream.logo("https://icons8.com")
pd_stream.caption("🔴 LIVE FEED SYNCED - Tracking court updates via Groq AI Matrix Engine")

filename = "master_predictions_sheet.csv"

if not os.path.exists(filename):
    pd_stream.error("❌ master_predictions_sheet.csv not detected. Launch your engine in your VS Code terminal tab.")
else:
    df = pd.read_csv(filename)
    
    # Simple Metrics Banner
    c1, c2 = pd_stream.columns(2)
    c1.metric("Active Live Games Streaming", len(df))
    active_buys = len(df[df["AI In-Play Directive"].isin(["🔥 LIVE BUY", "🛡️ SLICE STAKE"])])
    c2.metric("Instant AI Trade Alerts", active_buys)
    
    pd_stream.write("### 🏀 Real-Time Game Ticker Matrix")
    pd_stream.dataframe(
        df,
        column_config={
            "Calculated Instant Edge": pd_stream.column_config.TextColumn("Instant Edge"),
            "AI In-Play Directive": pd_stream.column_config.TextColumn("Risk Directive"),
            "Target Execution Team": pd_stream.column_config.TextColumn("Recommended Play")
        },
        use_container_width=True,
        hide_index=True
    )
    
    pd_stream.write("---")
    pd_stream.write("### 📋 Court-Side Quick Execution Blueprint")
    
    buy_signals = df[df["AI In-Play Directive"].isin(["🔥 LIVE BUY", "🛡️ SLICE STAKE", "⏳ HOLD LINE"])]
    if buy_signals.empty:
        pd_stream.info("Waiting for market pricing inefficiencies to manifest on active basketball lines...")
    else:
        for _, row in buy_signals.iterrows():
            directive = row["AI In-Play Directive"]
            match = row["Matchup"]
            score = row["Current Score Ticker"]
            clock = row["Live Game Clock"]
            target = row["Target Execution Team"]
            line = row["Live Bookmaker Line"]
            
            blueprint_code = f"LIVE MATCH TICKER: [{clock}] | {score} | ACTION STATUS: [{directive}] -> EXECUTE ON: {target} via {line}"
            
            pd_stream.markdown(f"**📍 {match}** — Instant Edge: **{row['Calculated Instant Edge']}**")
            pd_stream.code(blueprint_code, language="text")

    # Force Streamlit to automatically rerun and refresh components
    time.sleep(5)
    pd_stream.rerun()
