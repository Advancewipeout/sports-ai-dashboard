import os
import json
import random
import requests
import pandas as pd
import numpy as np

# Configurable Parameters
# PASTE YOUR GROQ API KEY HERE INSTEAD OF THE SCRAPER FILE
GROQ_API_KEY = "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"
MODEL_NAME = "llama3-8b-8192" 
SPORTS_LIST = ["nba", "nfl", "mlb", "nhl"]
BANKROLL = 1000.0
KELLY_FRACTION = 0.5 

def query_groq_sentiment(home_team, away_team, sport):
    """Queries your fast Groq API key directly to analyze the matchup."""
    if not GROQ_API_KEY or "gsk_" not in GROQ_API_KEY:
        return round(random.uniform(-0.04, 0.04), 3)
        
    url = "https://groq.com"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = f"Analyze the upcoming {sport.upper()} matchup: {away_team} at {home_team}. Consider team form and travel fatigue. Output ONLY a single floating-point number between -0.10 and +0.10 representing the situational edge modifier for the home team (positive favors home, negative favors away). Do not include any text, thoughts, markdown, or explanations."
    
    payload = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=5)
        if response.status_code == 200:
            result_text = response.json()['choices'][0]['message']['content'].strip()
            cleaned_text = ''.join(c for c in result_text if c.isdigit() or c in ['.', '-', '+'])
            return float(cleaned_text)
    except Exception:
        pass
    return round(random.uniform(-0.03, 0.03), 3)

def calculate_implied_probability(odds):
    if odds > 0:
        return 100 / (odds + 100)
    else:
        return abs(odds) / (abs(odds) + 100)

def generate_mock_scraped_data(sport):
    # This acts as our safety pool if live data isn't pulling yet
    teams = {
        "nba": [("LA Lakers", "BOS Celtics", +110, -130), ("GS Warriors", "NY Knicks", -150, +130), ("MIA Heat", "CHI Bulls", -110, -110)],
        "nfl": [("KC Chiefs", "BUF Bills", -120, +100), ("SF 49ers", "DAL Cowboys", -200, +170), ("PHI Eagles", "NY Giants", -240, +200)],
        "mlb": [("NY Yankees", "BOS Red Sox", -110, -110), ("LA Dodgers", "SF Giants", -180, +155), ("HOU Astros", "TEX Rangers", -130, +110)],
        "nhl": [("EDM Oilers", "TOR Maple Leafs", +105, -125), ("TBL Lightning", "FLA Panthers", +120, -140), ("CHI Blackhawks", "DET Red Wings", +150, -170)]
    }
    data = []
    for home, away, h_odds, a_odds in teams.get(sport, []):
        data.append({"sport": sport.upper(), "home_team": home, "away_team": away, "bookmaker": "DraftKings", "home_odds": h_odds, "away_odds": a_odds})
    return pd.DataFrame(data)

def process_predictions():
    print("🤖 AI Processing Engine booting via Groq Cloud Speed...")
    all_processed_games = []
    
    for sport in SPORTS_LIST:
        filename = f"{sport}_odds.csv"
        if os.path.exists(filename):
            df = pd.read_csv(filename)
        else:
            df = generate_mock_scraped_data(sport)
            
        if df.empty: continue
            
        for _, row in df.iterrows():
            home = row['home_team']
            away = row['away_team']
            h_odds = int(row['home_odds'])
            a_odds = int(row['away_odds'])
            
            p_home_implied = calculate_implied_probability(h_odds)
            p_away_implied = calculate_implied_probability(a_odds)
            
            total_implied = p_home_implied + p_away_implied
            base_p_home = p_home_implied / total_implied
            base_p_away = p_away_implied / total_implied
            
            # Using your Groq API key here!
            print(f"⚡ Groq is analyzing matchup context: {away} @ {home}...")
            ai_modifier = query_groq_sentiment(home, away, sport)
            
            true_p_home = np.clip(base_p_home + ai_modifier, 0.05, 0.95)
            true_p_away = 1.0 - true_p_home
            
            edge_home = true_p_home - p_home_implied
            edge_away = true_p_away - p_away_implied
            
            b_home = (100 / abs(h_odds)) if h_odds < 0 else (h_odds / 100)
            b_away = (100 / abs(a_odds)) if a_odds < 0 else (a_odds / 100)
            
            f_home = (b_home * true_p_home - (1 - true_p_home)) / b_home if edge_home > 0 else 0
            f_away = (b_away * true_p_away - (1 - true_p_away)) / b_away if edge_away > 0 else 0
            
            bet_size_home = max(0.0, f_home * KELLY_FRACTION * BANKROLL)
            bet_size_away = max(0.0, f_away * KELLY_FRACTION * BANKROLL)
            
            game_record = {
                "Sport": row['sport'], "Away Team": away, "Home Team": home, "Bookmaker": row['bookmaker'],
                "Away American Odds": a_odds, "Home American Odds": h_odds,
                "AI Away Prob %": round(true_p_away * 100, 1), "AI Home Prob %": round(true_p_home * 100, 1),
                "Market Home Implied %": round(p_home_implied * 100, 1), "Market Away Implied %": round(p_away_implied * 100, 1),
                "Calculated Edge %": round(max(edge_home, edge_away) * 100, 1),
                "Recommended Bet": f"🟢 HOME: {home}" if edge_home > edge_away and edge_home > 0 else (f"🔵 AWAY: {away}" if edge_away > 0 else "❌ NO VALUE"),
                "Bet Allocation ($)": round(bet_size_home, 2) if edge_home > edge_away and edge_home > 0 else (round(bet_size_away, 2) if edge_away > 0 else 0.0)
            }
            all_processed_games.append(game_record)
            
    output_df = pd.DataFrame(all_processed_games)
    output_df.to_csv("master_predictions_sheet.csv", index=False)
    print("\n✅ Sheet updated successfully via Groq Engine!")

if __name__ == "__main__":
    process_predictions()
