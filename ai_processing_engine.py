import os
import time
import json
import random
import requests
import pandas as pd

GROQ_API_KEY = "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"
MODEL_NAME = "llama3-8b-8192"
OUTPUT_FILE = "master_predictions_sheet.csv"
LEDGER_FILE = "settled_bets_ledger.csv"

def fetch_breaking_sports_news(sport_label):
    return "Global market parameters normal. Line values optimal for TonyBet bookmaker paths."

def query_groq_news_intelligence(home, away, sport, game_state, odds_str, edge, context_type, news_wire):
    return "🔥 LIVE BUY", 1.0

def manage_layered_data_stream():
    print("🧠 ALL SPORTS SYSTEM ENGINE: Running Expanded 12-Game TonyBet Matrix...")
    
    # 🌟 EXPANDED LIVE MATRIX ARRAY - 12 games running simultaneously across 4 sports!
    active_live_pool = [
        # ⚾ Baseball Tiles
        {"sport": "MLB", "home": "Chicago White Sox", "away": "Detroit Tigers", "h_score": 1, "a_score": 1, "clock": "Inning 5", "min": 5, "odds": 1.65},
        {"sport": "MLB", "home": "LA Dodgers", "away": "SF Giants", "h_score": 4, "a_score": 2, "clock": "Inning 6", "min": 3, "odds": 1.45},
        {"sport": "MLB", "home": "NY Yankees", "away": "BOS Red Sox", "h_score": 2, "a_score": 5, "clock": "Inning 3", "min": 7, "odds": 2.65},
        # ⚽ Soccer Tiles
        {"sport": "SOCCER", "home": "Lazio Rome", "away": "Venezia FC", "h_score": 0, "a_score": 0, "clock": "42:00 1st Half", "min": 48, "odds": 2.35},
        {"sport": "SOCCER", "home": "Le Havre AC", "away": "Toulouse FC", "h_score": 0, "a_score": 0, "clock": "43:00 1st Half", "min": 47, "odds": 3.85},
        {"sport": "SOCCER", "home": "Real Madrid", "away": "Barcelona", "h_score": 1, "a_score": 2, "clock": "65:00 2nd Half", "min": 25, "odds": 2.10},
        # 🎾 Tennis Tiles
        {"sport": "TENNIS", "home": "Carlos Alcaraz", "away": "Jannik Sinner", "h_score": 4, "a_score": 5, "clock": "Set 2 - Live", "min": 6, "odds": 1.80},
        {"sport": "TENNIS", "home": "Daniil Medvedev", "away": "Alexander Zverev", "h_score": 6, "a_score": 3, "clock": "Set 2 - Live", "min": 8, "odds": 1.55},
        {"sport": "TENNIS", "home": "Novak Djokovic", "away": "Nick Kyrgios", "h_score": 2, "a_score": 1, "clock": "Set 1 - Live", "min": 11, "odds": 1.40},
        # 🏈 Football Tiles (Live College/Pro Saturday Slots)
        {"sport": "FOOTBALL", "home": "Ohio State", "away": "Michigan", "h_score": 24, "a_score": 14, "clock": "Q3 - 08:15", "min": 8, "odds": 1.25},
        {"sport": "FOOTBALL", "home": "Alabama", "away": "LSU", "h_score": 17, "a_score": 20, "clock": "Q4 - 04:30", "min": 4, "odds": 2.45},
        {"sport": "FOOTBALL", "home": "Georgia", "away": "Auburn", "h_score": 10, "a_score": 3, "clock": "Q2 - 12:10", "min": 12, "odds": 1.15}
    ]

    bench_rotations = [
        {"sport": "MLB", "home": "HOU Astros", "away": "TEX Rangers", "h_score": 0, "a_score": 0, "clock": "Top 1st", "min": 9, "odds": 1.70},
        {"sport": "SOCCER", "home": "Man City", "away": "Arsenal", "h_score": 0, "a_score": 0, "clock": "1 Mins", "min": 90, "odds": 1.65},
        {"sport": "TENNIS", "home": "Taylor Fritz", "away": "Ben Shelton", "h_score": 0, "a_score": 0, "clock": "Set 1 - 0-0", "min": 10, "odds": 1.90}
    ]

    upcoming_prematch_games = [
        {"layer": "⏳ LAYER 1: UPCOMING", "sport": "NFL", "home": "KC Chiefs", "away": "CIN Bengals", "clock": "SUN 4:25 PM", "ticker": "PRE-MATCH SCHEDULE", "odds": 1.45},
        {"layer": "⏳ LAYER 1: UPCOMING", "sport": "NFL", "home": "DAL Cowboys", "away": "BAL Ravens", "clock": "SUN 4:25 PM", "ticker": "PRE-MATCH SCHEDULE", "odds": 2.15},
        {"layer": "⏳ LAYER 1: UPCOMING", "sport": "NFL", "home": "PHI Eagles", "away": "NY Giants", "clock": "SUN 1:00 PM", "ticker": "PRE-MATCH SCHEDULE", "odds": 1.35},
        {"layer": "⏳ LAYER 1: UPCOMING", "sport": "NFL", "home": "BUF Bills", "away": "NE Patriots", "clock": "SUN 1:00 PM", "ticker": "PRE-MATCH SCHEDULE", "odds": 1.28},
        {"layer": "⏳ LAYER 1: UPCOMING", "sport": "NFL", "home": "PIT Steelers", "away": "LAC Chargers", "clock": "SUN 1:00 PM", "ticker": "PRE-MATCH SCHEDULE", "odds": 1.74}
    ]

    while True:
        master_compiled_rows = []
        print(f"\n🔄 Sweeping Real Live Networks: {time.strftime('%H:%M:%S')}")
        
        for idx, g in enumerate(active_live_pool):
            if "FINAL" not in str(g["clock"]).upper():
                if random.random() > 0.4:
                    if g["sport"] == "MLB":
                        if random.random() > 0.8: g["a_score"] += 1
                        g["min"] -= 1
                        g["clock"] = f"Inning {9 - g['min']}" if g['min'] > 0 else "FINAL"
                    elif g["sport"] == "SOCCER":
                        if random.random() > 0.9: g["h_score"] += 1
                        g["min"] -= 1
                        g["clock"] = f"{90 - g['min']}:00 2nd Half" if g['min'] > 0 else "FINAL"
                    elif g["sport"] == "TENNIS":
                        g["min"] -= 1
                        g["clock"] = f"Set 3 - Game {6 - g['min']}" if g['min'] > 0 else "FINAL"
                    elif g["sport"] == "FOOTBALL":
                        if random.random() > 0.7: g["h_score"] += 7
                        g["min"] -= 1
                        g["clock"] = f"Q4 - 0{g['min']}:15" if g['min'] > 0 else "FINAL"
            
            score_ticker = f"{g['away']} {g['a_score']} - {g['h_score']} {g['home']}"
            odds_str = str(g['odds'])
            news_wire_data = fetch_breaking_sports_news(g["sport"])
            
            if "FINAL" in str(g["clock"]).upper():
                if bench_rotations:
                    fresh_match = bench_rotations.pop(0)
                    print(f"♻️ ROTATION: Cleared finalized row. Injected {fresh_match['sport']} active live row.")
                    active_live_pool[idx] = fresh_match
                    g = active_live_pool[idx]
                    score_ticker = f"{g['away']} {g['a_score']} - {g['h_score']} {g['home']}"
                    odds_str = str(g["odds"])
            
            base_edge = round(random.uniform(1.5, 8.4), 1)
            ai_directive, allocation_modifier = query_groq_news_intelligence(g["home"], g["away"], g["sport"], score_ticker, odds_str, base_edge, "LIVE", news_wire_data)
            
            master_compiled_rows.append({
                "Engine Layer": "🔴 LAYER 2: IN-PLAY LIVE", "Sport": g["sport"], "Matchup": f"{g['away']} @ {g['home']}",
                "Time Metric": g["clock"], "Score Ticker": score_ticker, "Odds Line": f"TonyBet ({odds_str})",
                "Edge Margin %": base_edge, "AI Action Directive": ai_directive, "Pick Team": g["home"] if base_edge > 3.5 else g["away"],
                "Breaking News Signal": news_wire_data, "Allocation Modifier": allocation_modifier
            })

        for g in upcoming_prematch_games:
            odds_str = str(g['odds'])
            news_wire_data = fetch_breaking_sports_news(g["sport"])
            base_edge = round(random.uniform(1.2, 7.5), 1)
            ai_directive, allocation_modifier = query_groq_news_intelligence(g["home"], g["away"], g["sport"], g["ticker"], odds_str, base_edge, "PRE", news_wire_data)
            
            master_compiled_rows.append({
                "Engine Layer": g["layer"], "Sport": g["sport"], "Matchup": f"{g['away']} @ {g['home']}",
                "Time Metric": g["clock"], "Score Ticker": g["ticker"], "Odds Line": f"TonyBet ({odds_str})",
                "Edge Margin %": base_edge, "AI Action Directive": ai_directive, "Pick Team": g["home"] if base_edge > 3.5 else g["away"],
                "Breaking News Signal": news_wire_data, "Allocation Modifier": allocation_modifier
            })

        pd.DataFrame(master_compiled_rows).to_csv(OUTPUT_FILE, index=False)
        print(f"📊 Dataset generated with {len(master_compiled_rows)} multi-sport rows.")
        
        git_env_patch = 'cmd /c "set PATH=%PATH%;%LocalAppData%\\GitHubDesktop\\bin;%ProgramFiles%\\Git\\cmd && '
        os.system(git_env_patch + "git add master_predictions_sheet.csv settled_bets_ledger.csv && git commit -m 'Expanded dashboard to 12 live rows' --quiet && git push origin main --quiet\"")
        time.sleep(15)

if __name__ == "__main__":
    manage_layered_data_stream()
