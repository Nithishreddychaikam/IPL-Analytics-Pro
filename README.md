# 🏏 IPL Analytics Pro

> An end-to-end Machine Learning web application that predicts **First Innings Projected Score** and **Second Innings Win Probability** using historical IPL match data (2008–2023).

🔗 **Live Demo:** https://ipl-analytics-pro.onrender.com
📂 **GitHub Repository:** https://github.com/Nithishreddychaikam/IPL-Analytics-Pro

> **Note:** The application is hosted on the Render Free Tier. The first request after a period of inactivity may take 30–60 seconds while the service wakes up.

---

# 📸 Application Screenshots

> Add your screenshots here.

* Home Page
* Projected Score Prediction
* Win Probability Prediction

---

# 📖 Project Overview

IPL matches are dynamic, and predicting match outcomes requires understanding multiple live factors such as current score, wickets, venue, run rate, and target.

**IPL Analytics Pro** uses Machine Learning models trained on historical IPL data to provide real-time predictions through a web application.

The project consists of two independent prediction systems:

* 📈 First Innings Projected Score Prediction
* 🏆 Second Innings Win Probability Prediction

---

# 🚀 Features

* 📈 Predict First Innings Projected Score
* 🏆 Predict Second Innings Win Probability
* ⚡ Real-time Predictions
* 🌐 Interactive Flask Web Application
* 📊 Probability Visualization
* 📱 Responsive User Interface
* ☁️ Live Deployment on Render
* 🔄 Automatic Deployment using GitHub

---

# 🤖 Machine Learning

## Model 1 — Projected Score Prediction

| Metric                    | Value                                                                           |
| ------------------------- | ------------------------------------------------------------------------------- |
| Algorithm                 | Random Forest Regressor                                                         |
| Mean Absolute Error (MAE) | **13.86 Runs**                                                                  |
| R² Score                  | **0.583**                                                                       |
| Inputs                    | Batting Team, Bowling Team, Venue, Current Score, Wickets Lost, Overs Completed |
| Output                    | Predicted First Innings Score                                                   |

---

## Model 2 — Win Probability Prediction

| Metric    | Value                                                                                   |
| --------- | --------------------------------------------------------------------------------------- |
| Algorithm | Random Forest Classifier                                                                |
| Accuracy  | *(Update with your evaluated accuracy)*                                                 |
| Inputs    | Batting Team, Bowling Team, Venue, Target, Current Score, Overs Completed, Wickets Left |
| Output    | Winning Probability for Both Teams (%)                                                  |

---

## Feature Engineering

The following features were engineered from the raw IPL datasets:

* Current Run Rate (CRR)
* Required Run Rate (RRR)
* Runs Left
* Balls Left
* Wickets Lost
* Wickets Left
* Overs Completed

The preprocessing pipeline was implemented using **Scikit-learn Pipeline**, **ColumnTransformer**, and **OneHotEncoder** before model training.

---

# 🛠 Tech Stack

| Category             | Technology                                        |
| -------------------- | ------------------------------------------------- |
| Programming Language | Python                                            |
| Machine Learning     | Scikit-learn                                      |
| Algorithms           | Random Forest Regressor, Random Forest Classifier |
| Data Processing      | Pandas, NumPy                                     |
| Backend              | Flask                                             |
| Frontend             | HTML, CSS, JavaScript                             |
| Deployment           | Render                                            |
| Version Control      | Git & GitHub                                      |

---

# 📂 Project Structure

```text
IPL-Analytics-Pro/
│
├── app.py
├── requirements.txt
├── README.md
│
├── data/
├── model/
├── notebooks/
├── static/
├── templates/
├── Screenshots/
```

---

# ▶️ Run Locally

```bash
git clone https://github.com/Nithishreddychaikam/IPL-Analytics-Pro.git

cd IPL-Analytics-Pro

pip install -r requirements.txt

python app.py
```

Open:

http://localhost:5000

---

# 📊 Dataset

The project uses two IPL datasets:

* **match_data.csv** — Ball-by-ball delivery dataset
* **match_info_data.csv** — Match metadata including venue, teams, and match information

The datasets were:

* Merged
* Cleaned
* Feature engineered
* Used for training two independent ML models

---

# 📚 Key Learnings

During this project, I gained practical experience in:

* Data Cleaning
* Feature Engineering
* Exploratory Data Analysis (EDA)
* Machine Learning Model Training
* Regression & Classification
* Scikit-learn Pipelines
* Flask Backend Development
* REST API Integration
* Git & GitHub
* Model Deployment using Render
* Debugging Production Deployment

---

# 🔮 Future Improvements

* Integrate Live IPL APIs
* Include Player-Level Statistics
* Improve Regression Performance using XGBoost or LightGBM
* Enhance Win Probability using advanced ensemble models
* Add Head-to-Head Team Statistics
* Build Match Analytics Dashboard

---

# 👨‍💻 Author

**Nithish Reddy Chaikam**

🎓 B.Tech – Computer Science & Engineering (AI & Data Science)

📧 Email: [chaikamnithishreddy2008@gmail.com](mailto:chaikamnithishreddy2008@gmail.com)

🔗 GitHub: https://github.com/Nithishreddychaikam

🔗 LinkedIn: https://www.linkedin.com/in/chaikam-nithishreddy-301b31379/
