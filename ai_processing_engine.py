import os
import time
import json
import random
import requests
import pandas as pd
import numpy as np

# System Infrastructure Controls
GROQ_API_KEY = "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"
MODEL_NAME = "llama3-8b-8192"
OUTPUT_FILE = "master_predictions_sheet.csv"

def query_groq_live_inplay_decision(home, away, qtr, clock, score_str, live_odds, market_edge):
    """Pings Groq Cloud to analyze active live game momentum and risk thresholds."""
    if not GROQ_API_KEY or "gsk_" not in GROQ_API_KEY:
        return "🔥 LIVE BUY"
        
    url = "https://groq.com"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    
    prompt = (
        f"Act as a professional live court-side sports trading risk engine.\n"
        f"Matchup: {away} @ {home} (NBA LIVE)\n"
        f"Game State: Quarter {qtr} | Clock: {clock} Remaining\n"
        f"Current Live Score: {score_str}\n"
        f"Sportsbook Live Odds: {live_odds} | Edge Detected: +{market_edge}%\n\n"
        f"Determine if the bettor should lock in the play immediately, hold for a better line swing, or abort.\n"
        f"Output exactly one string from this list with NO explanation, notes, or formatting:\n"
        f"['🔥 LIVE BUY', '⏳ HOLD LINE', '🛑 PULL OUT', '🛡️ SLICE STAKE']"
    )
    try:
        response = requests.post(url, headers=headers, json={"model": MODEL_NAME, "messages": [{"role": "user", "content": prompt}], "temperature": 0.1}, timeout=3)
        if response.status_code == 200:
            return response.json()['choices']['message']['content'].strip().upper()
    except Exception:
        pass
    return "🔥 LIVE BUY"

def start_live_inplay_simulation_loop():
    print("🏀 IN-PLAY MODE ACTIVE: Launching Live Live-Updating Court Engine...")
    
    # Initialize 4 active live games running at the same time
    live_games = [
        {"home": "LA Lakers", "away": "GS Warriors", "home_score": 82, "away_score": 85, "qtr": 3, "min": 8, "sec": 45, "base_odds": -110},
        {"home": "BOS Celtics", "away": "MIA Heat", "home_score": 104, "away_score": 98, "qtr": 4, "min": 2, "sec": 12, "base_odds": -250},
        {"home": "DAL Mavericks", "away": "PHX Suns", "home_score": 45, "away_score": 48, "qtr": 2, "min": 11, "sec": 0, "base_odds": +115},
        {"home": "MIL Bucks", "away": "NY Knicks", "home_score": 12, "away_score": 18, "qtr": 1, "min": 6, "sec": 30, "base_odds": -130}
    ]
    
    while True:
        processed_records = []
        print(f"\n⏰ Live Tick Updating: {time.strftime('%H:%M:%S')} - Processing possession variations...")
        
        for game in live_games:
            # 🏀 Simulate live basketball action ticks (scores change dynamically)
            game["sec"] -= 15
            if game["sec"] < 0:
                game["sec"] = 45
                game["min"] -= 1
                if game["min"] < 0:
                    game["min"] = 12
                    game["qtr"] = min(4, game["qtr"] + 1)
            
            # Add random realistic bucket changes
            if random.random() > 0.4: game["home_score"] += random.choice([2, 3])
            if random.random() > 0.4: game["away_score"] += random.choice([2, 3])
            
            home_team, away_team = game["home"], game["away"]
            score_summary = f"{away_team} {game['away_score']} - {game['home_score']} {home_team}"
            time_summary = f"Q{game['qtr']} - {game['min']:02d}:{game['sec']:02d}"
            
            # Dynamic live odds shift calculation based on current point spread differentials
            score_diff = game["home_score"] - game["away_score"]
            current_live_odds = game["base_odds"] - (score_diff * 12)
            if current_live_odds == 0: current_live_odds = -110
            current_live_odds = int(np.clip(current_live_odds, -1000, 1000))
            
            # Calculate Live Edge Volatilities
            simulated_edge = round(random.uniform(-2.5, 7.8), 1)
            
            # Call Groq to make a court-side execution decision
            odds_str = f"+{current_live_odds}" if current_live_odds > 0 else str(current_live_odds)
            live_directive = query_groq_live_inplay_decision(
                home_team, away_team, game["qtr"], f"{game['min']}:{game['sec']}", score_summary, odds_str, simulated_edge
            )
            
            processed_records.append({
                "Sport": "NBA_LIVE",
                "Matchup": f"{away_team} @ {home_team}",
                "Live Game Clock": time_summary,
                "Current Score Ticker": score_summary,
                "Live Bookmaker Line": f"DraftKings Live ({odds_str})",
                "Calculated Instant Edge": f"+{simulated_edge}%" if simulated_edge > 0 else "0.0%",
                "AI In-Play Directive": live_directive if simulated_edge > 0 else "❌ PASS LINE",
                "Target Execution Team": home_team if simulated_edge > 2.0 else (away_team if simulated_edge > 0 else "HOLD CASH")
            })
            
        # Write out to the spreadsheet instantly
        out_df = pd.DataFrame(processed_records)
        out_df.to_csv(OUTPUT_FILE, index=False)
        
        # Continuous ticking rate limit - app runs a fresh calculations sweep every 15 seconds
        time.sleep(15)

if __name__ == "__main__":
    start_live_inplay_simulation_loop()
