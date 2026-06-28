from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# ==========================
# Load ML Models
# ==========================

projected_score_model = joblib.load("model/projected_score_model.pkl")
win_probability_model = joblib.load("model/win_probability_model.pkl")

# ==========================
# Metadata
# ==========================

TEAMS = [
    "Chennai Super Kings",
    "Deccan Chargers",
    "Delhi Capitals",
    "Delhi Daredevils",
    "Gujarat Lions",
    "Gujarat Titans",
    "Kings XI Punjab",
    "Kochi Tuskers Kerala",
    "Kolkata Knight Riders",
    "Lucknow Super Giants",
    "Mumbai Indians",
    "Pune Warriors",
    "Punjab Kings",
    "Rajasthan Royals",
    "Rising Pune Supergiant",
    "Rising Pune Supergiants",
    "Royal Challengers Bangalore",
    "Sunrisers Hyderabad"
]

VENUES = [
    "Arun Jaitley Stadium",
    "Arun Jaitley Stadium, Delhi",
    "Barabati Stadium",
    "Barsapara Cricket Stadium, Guwahati",
    "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
    "Brabourne Stadium",
    "Brabourne Stadium, Mumbai",
    "Buffalo Park",
    "De Beers Diamond Oval",
    "Dr DY Patil Sports Academy",
    "Dr DY Patil Sports Academy, Mumbai",
    "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium",
    "Dubai International Cricket Stadium",
    "Eden Gardens",
    "Eden Gardens, Kolkata",
    "Feroz Shah Kotla",
    "Green Park",
    "Himachal Pradesh Cricket Association Stadium",
    "Himachal Pradesh Cricket Association Stadium, Dharamsala",
    "Holkar Cricket Stadium",
    "JSCA International Stadium Complex",
    "Kingsmead",
    "M Chinnaswamy Stadium",
    "M Chinnaswamy Stadium, Bengaluru",
    "M.Chinnaswamy Stadium",
    "MA Chidambaram Stadium",
    "MA Chidambaram Stadium, Chepauk",
    "MA Chidambaram Stadium, Chepauk, Chennai",
    "Maharashtra Cricket Association Stadium",
    "Maharashtra Cricket Association Stadium, Pune",
    "Narendra Modi Stadium, Ahmedabad",
    "Nehru Stadium",
    "New Wanderers Stadium",
    "Newlands",
    "OUTsurance Oval",
    "Punjab Cricket Association IS Bindra Stadium",
    "Punjab Cricket Association IS Bindra Stadium, Mohali",
    "Punjab Cricket Association IS Bindra Stadium, Mohali, Chandigarh",
    "Punjab Cricket Association Stadium, Mohali",
    "Rajiv Gandhi International Stadium",
    "Rajiv Gandhi International Stadium, Uppal",
    "Rajiv Gandhi International Stadium, Uppal, Hyderabad",
    "Sardar Patel Stadium, Motera",
    "Saurashtra Cricket Association Stadium",
    "Sawai Mansingh Stadium",
    "Sawai Mansingh Stadium, Jaipur",
    "Shaheed Veer Narayan Singh International Stadium",
    "Sharjah Cricket Stadium",
    "Sheikh Zayed Stadium",
    "St George's Park",
    "Subrata Roy Sahara Stadium",
    "SuperSport Park",
    "Vidarbha Cricket Association Stadium, Jamtha",
    "Wankhede Stadium",
    "Wankhede Stadium, Mumbai",
    "Zayed Cricket Stadium, Abu Dhabi"
]

# ==========================
# Home Route
# ==========================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================
# Metadata Route
# ==========================

@app.route("/metadata")
def metadata():
    return jsonify({
        "teams": TEAMS,
        "venues": VENUES
    })


# ==========================
# Projected Score Prediction
# ==========================

@app.route("/predict-score", methods=["POST"])
def predict_score():

    data = request.get_json()

    batting_team = data["batting_team"]
    bowling_team = data["bowling_team"]
    venue = data["venue"]
    current_score = int(data["current_score"])
    wickets_lost = int(data["wickets_lost"])
    overs = float(data["overs"])

    # Validate overs
    if overs <= 0 or overs > 20:
        return jsonify({
            "success": False,
            "message": "Overs must be between 0 and 20."
        }), 400

    # Current Run Rate
    crr = current_score / overs

    input_df = pd.DataFrame({
        "batting_team": [batting_team],
        "bowling_team": [bowling_team],
        "venue_x": [venue],
        "current_score": [current_score],
        "wickets_lost": [wickets_lost],
        "overs_completed": [overs],
        "current_run_rate": [crr]
    })

    print("\nInput DataFrame:")
    print(input_df)

    prediction = projected_score_model.predict(input_df)[0]

    # Logical safety check
    prediction = max(round(prediction), current_score)

    return jsonify({
        "success": True,
        "projected_score": prediction
    })


# ==========================
# Win Probability Prediction
# ==========================

@app.route("/predict-win", methods=["POST"])
def predict_win():

    data = request.get_json()

    batting_team = data["batting_team"]
    bowling_team = data["bowling_team"]
    venue = data["venue"]

    target = int(data["target"])
    current_score = int(data["current_score"])
    overs = float(data["overs"])
    wickets_left = int(data["wickets_left"])

    # Runs left
    runs_left = max(target - current_score, 0)

    # Balls bowled
    completed_overs = int(overs)
    balls_in_current_over = round((overs - completed_overs) * 10)

    balls_bowled = completed_overs * 6 + balls_in_current_over
    balls_left = 120 - balls_bowled

    # Run rates
    crr = current_score / overs if overs > 0 else 0
    rrr = (runs_left * 6 / balls_left) if balls_left > 0 else 0

    input_df = pd.DataFrame({
    "batting_team": [batting_team],
    "bowling_team": [bowling_team],
    "venue_x": [venue],
    "current_score": [current_score],
    "runs_left": [runs_left],
    "balls_left": [balls_left],
    "wickets_left": [wickets_left],
    "current_run_rate": [crr],
    "required_run_rate": [rrr]
    })
    print("\nWin Probability Input:")
    print(input_df)


    probability = win_probability_model.predict_proba(input_df)[0]

    batting_win = round(probability[1] * 100, 2)
    bowling_win = round(probability[0] * 100, 2)

    return jsonify({
        "success": True,
        "batting_team": batting_team,
        "bowling_team": bowling_team,
        "batting_win_probability": batting_win,
        "bowling_win_probability": bowling_win
    })


# ==========================
# Run App
# ==========================

if __name__ == "__main__":
    app.run(debug=True)