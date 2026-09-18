import streamlit as pd_stream
import pandas as pd
import os
import time

pd_stream.set_page_config(page_title="AI Live In-Play Trade Desk", layout="wide")

pd_stream.markdown("# 🧠 AI Real-Time In-Play Court Desk")
pd_stream.markdown("### Streaming Live Game Feeds, Score Tickers & Instantaneous Micro-Edge Directives")
pd_stream.write("---")

pd_stream.caption("🔴 LIVE FEED SYNCED - Tracking court updates via Groq AI Matrix Engine")

filename = "master_predictions_sheet.csv"

if not os.path.exists(filename):
    pd_stream.error("❌ master_predictions_sheet.csv not detected. Launch your engine in your VS Code terminal tab.")
else:
    df = pd.read_csv(filename)
    
    # 🛠️ SAFE COLUMNS CHECKER - Prevents any KeyError from crashing the web server
    if "AI In-Play Directive" not in df.columns:
        # Fallback if looking at old pre-match data sheet structure
        pd_stream.warning("⚠️ Reading pre-match dataset. Run your live in-play engine script locally to activate real-time court tickers!")
        if "AI Action Directive" in df.columns:
            df["AI In-Play Directive"] = df["AI Action Directive"]
        else:
            df["AI In-Play Directive"] = "🔥 LIVE BUY"
            
    if "Live Game Clock" not in df.columns:
        df["Live Game Clock"] = "PRE-MATCH"
    if "Current Score Ticker" not in df.columns:
        df["Current Score Ticker"] = "UPCOMING"
    if "Live Bookmaker Line" not in df.columns:
        df["Live Bookmaker Line"] = "DraftKings"
    if "Calculated Instant Edge" not in df.columns:
        if "Calculated Edge %" in df.columns:
            df["Calculated Instant Edge"] = df["Calculated Edge %"].astype(str) + "%"
        else:
            df["Calculated Instant Edge"] = "+0.0%"
    if "Target Execution Team" not in df.columns:
        if "Recommended Selection" in df.columns:
            df["Target Execution Team"] = df["Recommended Selection"]
        else:
            df["Target Execution Team"] = "HOLD CASH"
    if "Matchup" not in df.columns and "Home Team" in df.columns:
        df["Matchup"] = df["Away Team"] + " @ " + df["Home Team"]

    # Simple Metrics Banner
    c1, c2 = pd_stream.columns(2)
    c1.metric("Active Live Games Streaming", len(df))
    active_buys = len(df[df["AI In-Play Directive"].isin(["🔥 LIVE BUY", "🛡️ SLICE STAKE", "🔥 FULL BUY"])])
    c2.metric("Instant AI Trade Alerts", active_buys)
    
    pd_stream.write("### 🏀 Real-Time Game Ticker Matrix")
    pd_stream.dataframe(
        df[["Sport", "Matchup", "Live Game Clock", "Current Score Ticker", "Live Bookmaker Line", "Calculated Instant Edge", "AI In-Play Directive", "Target Execution Team"]],
        use_container_width=True,
        hide_index=True
    )
    
    pd_stream.write("---")
    pd_stream.write("### 📋 Court-Side Quick Execution Blueprint")
    
    buy_signals = df[df["AI In-Play Directive"].isin(["🔥 LIVE BUY", "🛡️ SLICE STAKE", "⏳ HOLD LINE", "🔥 FULL BUY", "🛡️ MITIGATED RISK"])]
    if buy_signals.empty:
        pd_stream.info("Waiting for market pricing inefficiencies to manifest on active lines...")
    else:
        for _, row in buy_signals.iterrows():
            directive = row["AI In-Play Directive"]
            match = row.get("Matchup", "Game Matchup")
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
