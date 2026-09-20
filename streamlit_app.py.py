import streamlit as st
import pandas as pd
import os
import time

st.set_page_config(
    page_title="Smitty's 2-Layer Sports AI Desk",
    page_icon="⚡",
    layout="wide"
)

if "bankroll" not in st.session_state:
    st.session_state.bankroll = 1000.0

if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

# Sidebar
with st.sidebar:
    st.title("⚙️ Bankroll Desk")
    st.session_state.bankroll = st.number_input("Bankroll ($)", min_value=10.0, value=float(st.session_state.bankroll), step=50.0)
    
    st.markdown("---")
    st.subheader("🔁 Live Controls")
    live_refresh = st.toggle("Enable live UI refresh", value=False)
    refresh_sec = st.slider("Refresh interval (seconds)", 2, 30, 5)
    
    st.markdown("---")
    st.subheader("🔐 Subscriber Portal")
    if not st.session_state.authenticated:
        pin = st.text_input("4-Digit PIN (smitty:8501)", type="password")
        if st.button("Unlock Blueprint"):
            if pin == "8501":
                st.session_state.authenticated = True
                st.success("Unlocked!")
                st.rerun()
            else:
                st.error("Invalid PIN")
    else:
        st.success("VIP Active (smitty)")
        if st.button("Lock"):
            st.session_state.authenticated = False
            st.rerun()

# Header
st.title("⚡ Smitty's 2-Layer AI News-Intelligence Desk")

# Sample Data
data = [
    {"Sport": "MLB", "Matchup": "SF Giants @ LA Dodgers", "Layer": "🔴 LIVE", "Time Metric": "Inning 7 - Active", "Score": "SF 3 - 2 LAD", "TonyBet": "+125", "BetMGM": "-105", "Edge Margin %": 7.3, "Directive": "🔥 LIVE BUY", "Pick": "SF Giants"},
    {"Sport": "NFL", "Matchup": "KC Chiefs @ BUF Bills", "Layer": "⏳ UPCOMING", "Time Metric": "SUN 16:25", "Score": "Scheduled", "TonyBet": "-120", "BetMGM": "+110", "Edge Margin %": 6.8, "Directive": "🔥 FULL BUY", "Pick": "KC Chiefs"},
    {"Sport": "NBA", "Matchup": "BOS Celtics @ MIA Heat", "Layer": "🔴 LIVE", "Time Metric": "Q3 04:12", "Score": "BOS 88 - 82 MIA", "TonyBet": "-115", "BetMGM": "-102", "Edge Margin %": 3.1, "Directive": "🔥 LIVE BUY", "Pick": "BOS Celtics"},
    {"Sport": "SOCCER", "Matchup": "Arsenal vs Chelsea", "Layer": "🔴 LIVE", "Time Metric": "68:51", "Score": "ARS 2 - 1 CHE", "TonyBet": "+140", "BetMGM": "+120", "Edge Margin %": 3.8, "Directive": "🔥 LIVE BUY", "Pick": "Arsenal"}
]
df = pd.DataFrame(data)

# Metrics
c1, c2, c3 = st.columns(3)
c1.metric("Live Matches Tracking", len(df[df["Layer"].str.contains("LIVE")]))
c2.metric("Upcoming Models", len(df[df["Layer"].str.contains("UPCOMING")]))
c3.metric("Max Statistical Edge", f"+{df['Edge Margin %'].max()}%")

# Tables
st.subheader("🔴 LAYER 2: Live In-Play Systems")
st.dataframe(df[df["Layer"].str.contains("LIVE")], use_container_width=True, hide_index=True)

st.subheader("⏳ LAYER 1: Upcoming Pre-Match Models")
st.dataframe(df[df["Layer"].str.contains("UPCOMING")], use_container_width=True, hide_index=True)

# Blueprint
st.subheader("📋 Execution Order Blueprint")
if not st.session_state.authenticated:
    st.warning("🔒 Buy directives & scaled allocations encrypted. Enter PIN 8501 in sidebar.")
else:
    st.success("🌟 AI POSITIONS UNLOCKED")
    for _, row in df.iterrows():
        wager = round(st.session_state.bankroll * 0.05, 2)
        st.code(f"EDGE: +{row['Edge Margin %']}% -> ALLOCATION RISK: ${wager} ON: {row['Pick']} ({row['TonyBet']})")

if live_refresh:
    time.sleep(refresh_sec)
    st.rerun()