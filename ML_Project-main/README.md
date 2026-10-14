# SpamShield AI — Smart Email Protection Using Machine Learning

A complete, modern web application using **React.js + FastAPI + Decision Tree + XGBoost** for spam email detection.

---

## Project Structure

```
ML Rushvini/
├── spamshield-backend/          # Python FastAPI backend
│   ├── main.py                  # FastAPI server + API endpoints
│   ├── train_models.py          # ML training script (run once)
│   ├── requirements.txt         # Python dependencies
│   ├── start_server.bat         # One-click backend starter
│   ├── data/
│   │   └── spam.csv             # (Optional) Your real dataset here
│   └── models/                  # Auto-generated after training
│       ├── decision_tree.joblib
│       ├── xgboost_model.joblib
│       ├── tfidf_vectorizer.joblib
│       ├── label_encoder.joblib
│       ├── metrics.json
│       └── feature_distributions.json
│
└── spamshield-frontend/         # React.js frontend
    ├── src/
    │   ├── App.js               # Root component + navigation
    │   ├── index.js             # React entry point
    │   ├── styles/
    │   │   └── global.css       # All styles (light theme, animations)
    │   ├── components/
    │   │   ├── Navbar.jsx       # Sticky navigation bar
    │   │   └── Icons.jsx        # SVG icons and illustrations
    │   ├── pages/
    │   │   ├── HomePage.jsx     # Landing page (Page 1)
    │   │   ├── AnalyzerPage.jsx # Email analyzer (Page 2)
    │   │   ├── ResultsPage.jsx  # ML results (Page 3)
    │   │   ├── DashboardPage.jsx# Analytics dashboard (Page 4)
    │   │   └── AboutPage.jsx    # About / How it works (Page 5)
    │   └── services/
    │       └── api.js           # All API calls to backend
    ├── public/
    │   └── index.html
    └── start_frontend.bat       # One-click frontend starter
```

---

## Quick Start (Windows)

### Step 1 — Start the Backend

Open a **Command Prompt** or **PowerShell** in `spamshield-backend/`:

```cmd
cd "d:\2nd year\ML Rushvini\spamshield-backend"
start_server.bat
```

Or manually:
```cmd
py train_models.py        # Only needed once
py -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at → **http://localhost:8000**

### Step 2 — Start the Frontend

Open a **second** Command Prompt in `spamshield-frontend/`:

```cmd
cd "d:\2nd year\ML Rushvini\spamshield-frontend"
start_frontend.bat
```

Or manually:
```cmd
npm start
```

Frontend opens at → **http://localhost:3000**

---

## Using Your Own Dataset

1. Place your `spam.csv` inside `spamshield-backend/data/`
2. The CSV must have one of these column formats:
   - `v1` (label), `v2` (text) — UCI SMS Spam format
   - `label`, `text` — generic format
   - `Category`, `Message` — alternate format
3. Labels must be `spam` or `ham` (case-insensitive)
4. Run `py train_models.py` again to retrain on your data

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check if server & models are loaded |
| POST | `/predict` | Classify an email (body: `{"email_text": "..."}`) |
| GET | `/metrics` | Model accuracy, F1, confusion matrix, CV scores |
| GET | `/feature-distributions` | Feature histogram data for dashboard |
| GET | `/model-info` | Model hyperparameters |

---

## Website Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with features and CTA |
| Email Analyzer | Click "Check Your Email" | Paste email, get AI result |
| Analysis Results | After prediction | Dual model comparison |
| Dashboard | "View Dashboard" | Charts, metrics, confusion matrices |
| About | "About" in navbar | How the system works |

---

## ML Models

| | Decision Tree | XGBoost |
|--|--|--|
| Library | scikit-learn | xgboost |
| Max Depth | 20 | 6 |
| Features | TF-IDF (3000) + 4 manual | Same |
| Validation | 5-fold stratified CV | Same |

---

## Install from Scratch

```cmd
REM Python packages
py -m pip install fastapi uvicorn scikit-learn xgboost pandas numpy joblib python-multipart

REM Node packages (inside spamshield-frontend)
npm install
npm install chart.js react-chartjs-2
```

---

## Troubleshooting

- **"Models not loaded"** → Run `py train_models.py` in the backend folder
- **CORS error in browser** → Make sure FastAPI is running on port 8000
- **Port 8000 in use** → Change `--port 8001` and update `src/services/api.js`
- **Charts not showing** → Ensure `npm install chart.js react-chartjs-2` was run
