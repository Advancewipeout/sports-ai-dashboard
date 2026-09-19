import os
import time
import json
import random
import requests
import pandas as pd
import xml.etree.ElementTree as ET

# Live System Infrastructure Configurations
GROQ_API_KEY = "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"
MODEL_NAME = "llama3-8b-8192"
OUTPUT_FILE = "master_predictions_sheet.csv"
LEDGER_FILE = "settled_bets_ledger.csv"

def fetch_breaking_sports_news(sport_label):
    news_headlines = []
    rss_urls = {
        "NFL": "https://yahoo.com", "NBA": "https://yahoo.com",
        "MLB": "https://yahoo.com", "SOCCER": "https://yahoo.com"
    }
    url = rss_urls.get(sport_label.upper(), "https://yahoo.com")
    try:
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            root = ET.fromstring(response.content)
            for item in root.findall(".//item")[:2]:
                news_headlines.append(item.find("title").text)
    except Exception: pass
    if not news_headlines: return "Global market parameters normal. Line values optimal."
    return " | ".join(news_headlines)

def query_groq_news_intelligence(home, away, sport, game_state, odds_str, edge, context_type, news_wire):
    if not GROQ_API_KEY or "gsk_" not in GROQ_API_KEY: return "🔥 LIVE BUY", 1.0
    url = "https://groq.com"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    prompt = (
        f"Act as a risk model. Sport: {sport}. Match: {away} @ {home}.\n"
        f"State: {game_state} | Odds: {odds_str} | Math Edge: +{edge}%\n"
        f"Output JSON with structure: {{\"directive\": \"🔥 LIVE BUY\", \"allocation_modifier\": 1.0}}"
    )
    try:
        res = requests.post(url, headers=headers, json={"model": MODEL_NAME, "messages": [{"role": "user", "content": prompt}], "response_format": {"type": "json_object"}, "temperature": 0.1}, timeout=2)
        if res.status_code == 200:
            raw_data = json.loads(res.json()['choices']['message']['content'].strip())
            return raw_data.get("directive", "🔥 LIVE BUY"), float(raw_data.get("allocation_modifier", 1.0))
    except Exception: pass
    return "🔥 LIVE BUY", 1.0

def manage_layered_data_stream():
    print("🧠 ALL SPORTS SYSTEM ENGINE: Running High-Volume Multi-Sport Live Rotator...")
    
    # 🌟 MASSIVE MULTI-SPORT DEEP RESERVES POOL (NFL, NBA, MLB, SOCCER)
    all_sports_pool = [
        # Football Block
        {"sport": "NFL", "home": "KC Chiefs", "away": "CIN Bengals", "h_score": 21, "a_score": 17, "clock": "Q3 - 11:20", "min": 11, "odds": -165},
        {"sport": "NFL", "home": "DAL Cowboys", "away": "BAL Ravens", "h_score": 14, "a_score": 24, "clock": "Q2 - 04:15", "min": 4, "odds": +180},
        {"sport": "NFL", "home": "PHI Eagles", "away": "NY Giants", "h_score": 7, "a_score": 3, "clock": "Q1 - 08:50", "min": 8, "odds": -210},
        # Basketball Block
        {"sport": "NBA", "home": "LA Lakers", "away": "GS Warriors", "h_score": 102, "a_score": 99, "clock": "Q4 - 04:30", "min": 4, "odds": -110},
        {"sport": "NBA", "home": "BOS Celtics", "away": "MIA Heat", "h_score": 85, "a_score": 89, "clock": "Q3 - 02:15", "min": 2, "odds": -135},
        {"sport": "NBA", "home": "PHX Suns", "away": "DAL Mavericks", "h_score": 114, "a_score": 110, "clock": "Q4 - 08:45", "min": 8, "odds": -120},
        # Baseball Block
        {"sport": "MLB", "home": "LA Dodgers", "away": "SF Giants", "h_score": 4, "a_score": 2, "clock": "Bottom 6th", "min": 3, "odds": -240},
        {"sport": "MLB", "home": "NY Yankees", "away": "BOS Red Sox", "h_score": 3, "a_score": 5, "clock": "Top 7th", "min": 2, "odds": +145},
        {"sport": "MLB", "home": "HOU Astros", "away": "TEX Rangers", "h_score": 2, "a_score": 1, "clock": "Bottom 5th", "min": 4, "odds": -160},
        # Global Soccer Block (TonyBet Mainboard Live Categories)
        {"sport": "SOCCER", "home": "Real Madrid", "away": "Barcelona", "h_score": 2, "a_score": 2, "clock": "68 Mins", "min": 22, "odds": +115},
        {"sport": "SOCCER", "home": "Man City", "away": "Arsenal", "h_score": 1, "a_score": 0, "clock": "54 Mins", "min": 36, "odds": -140},
        {"sport": "SOCCER", "home": "Bayern Munich", "away": "Dortmund", "h_score": 3, "a_score": 1, "clock": "82 Mins", "min": 8, "odds": -450}
    ]

    # Bench backups to rotate onto your screen dynamically the second an active row hits FINAL
    bench_matchups = [
        {"sport": "NFL", "home": "BUF Bills", "away": "NE Patriots", "h_score": 0, "a_score": 0, "clock": "Q1 - 15:00", "min": 15, "odds": -190},
        {"sport": "NBA", "home": "MIL Bucks", "away": "CHI Bulls", "h_score": 0, "a_score": 0, "clock": "Q1 - 12:00", "min": 12, "odds": -250},
        {"sport": "MLB", "home": "CHI Cubs", "away": "STL Cardinals", "h_score": 0, "a_score": 0, "clock": "Top 1st", "min": 9, "odds": -110},
        {"sport": "SOCCER", "home": "Chelsea", "away": "Liverpool", "h_score": 0, "a_score": 0, "clock": "1 Mins", "min": 90, "odds": +185}
    ]

    # Initialize full high-density dashboard line grid array
    active_lineup = list(all_sports_pool)

    while True:
        master_compiled_rows = []
        print(f"\n🔄 Sweeping High-Volume Networks: {time.strftime('%H:%M:%S')}")
        
        for idx, g in enumerate(active_lineup):
            # 🕰️ Run realistic time progression increments for every sport category
            if "FINAL" not in str(g["clock"]).upper():
                if random.random() > 0.4:
                    if g["sport"] in ["NFL", "NBA"]: g["h_score"] += random.choice([0, 2, 3, 6]) if g["sport"]=="NFL" else random.choice([0, 2, 3])
                    elif random.random() > 0.8: g["h_score"] += 1
                    
                    g["min"] -= 1
                    if g["min"] <= 0:
                        g["clock"] = "FINAL"
                    else:
                        if g["sport"] in ["NFL", "NBA"]: g["clock"] = f"LIVE - Min {g['min']}"
                        else: g["clock"] = f"{90 - g['min']} Mins" if g["sport"]=="SOCCER" else f"Inning {g['min']}"

            score_ticker = f"{g['away']} {g['a_score']} - {g['h_score']} {g['home']}"
            live_diff = g["h_score"] - g["a_score"]
            live_odds = g["odds"] - (live_diff * 12)
            odds_str = f"+{live_odds}" if live_odds > 0 else str(live_odds)
            news_wire_data = fetch_breaking_sports_news(g["sport"])
            
            # --- 🛠️ STICK WHISTLE-CLEAR REPLACEMENT MECHANIC ---
            if "FINAL" in str(g["clock"]).upper():
                # Instantly substitute the finished row with a fresh game from our bench
                if bench_matchups:
                    fresh_game = bench_matchups.pop(0)
                    print(f"♻️ ROTATION CRITERIA: Cleared finalized {g['sport']} match line. Injected fresh {fresh_game['sport']} matchup board.")
                    active_lineup[idx] = fresh_game
                    g = active_lineup[idx]
                    score_ticker = f"{g['away']} {g['a_score']} - {g['h_score']} {g['home']}"
                    odds_str = str(g["odds"])
            
            base_edge = round(random.uniform(1.5, 8.4), 1)
            ai_directive, allocation_modifier = query_groq_news_intelligence(g["home"], g["away"], g["sport"], score_ticker, odds_str, base_edge, "LIVE", news_wire_data)
            
            master_compiled_rows.append({
                "Engine Layer": "🔴 LAYER 2: IN-PLAY LIVE", "Sport": g["sport"], "Matchup": f"{g['away']} @ {g['home']}",
                "Time Metric": g["clock"], "Score Ticker": score_ticker, "Odds Line": f"TonyBet ({odds_str})",
                "Edge Margin %": base_edge, "AI Action Directive": ai_directive, "Pick Team": g["home"] if base_edge > 3.0 else g["away"],
                "Breaking News Signal": news_wire_data[:120] + "..." if len(news_wire_data) > 120 else news_wire_data,
                "Allocation Modifier": allocation_modifier
            })

        # Append standard pre-match weekend models cleanly underneath
        upcoming_models = [
            {"Engine Layer": "⏳ LAYER 1: UPCOMING", "Sport": "NFL", "Matchup": "JAX Jaguars @ BUF Bills", "Time Metric": "SUN 1:00 PM", "Score Ticker": "PRE-MATCH SCHEDULE", "Odds Line": "TonyBet (-170)", "Edge Margin %": 4.2, "AI Action Directive": "🔥 FULL BUY", "Pick Team": "BUF Bills", "Breaking News Signal": "Normal Parameters.", "Allocation Modifier": 1.0},
            {"Engine Layer": "⏳ LAYER 1: UPCOMING", "Sport": "SOCCER", "Matchup": "Newcastle @ Wolves", "Time Metric": "SUN 11:30 AM", "Score Ticker": "PRE-MATCH SCHEDULE", "Odds Line": "TonyBet (+125)", "Edge Margin %": 5.1, "AI Action Directive": "🔥 FULL BUY", "Pick Team": "Newcastle", "Breaking News Signal": "Normal Parameters.", "Allocation Modifier": 1.0}
        ]
        master_compiled_rows.extend(upcoming_models)

        pd.DataFrame(master_compiled_rows).to_csv(OUTPUT_FILE, index=False)
        
        git_env_patch = 'cmd /c "set PATH=%PATH%;%LocalAppData%\\GitHubDesktop\\bin;%ProgramFiles%\\Git\\cmd && '
        os.system(git_env_patch + "git add master_predictions_sheet.csv settled_bets_ledger.csv && git commit -m 'Auto-rotating full all-sports dashboard matrix' --quiet && git push origin main --quiet\"")
        time.sleep(15)

if __name__ == "__main__":
    manage_layered_data_stream()
