"""
SpamShield AI — FastAPI Backend
Run:  py -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, json, re, os
import numpy as np
import scipy.sparse as sp
import warnings
warnings.filterwarnings("ignore")

# ─── Urgency words (must match train_models.py) ───────────────────────────────
URGENCY_WORDS = [
    "urgent", "free", "winner", "won", "prize", "claim", "offer", "limited",
    "act now", "click here", "unsubscribe", "congratulations", "selected",
    "expires", "immediately", "risk-free", "guaranteed", "exclusive",
    "discount", "deal", "cash", "money", "earn", "income", "profit",
    "investment", "loan", "credit", "debt", "bank", "account", "verify",
    "password", "login", "update", "confirm", "suspended", "blocked",
    "lottery", "jackpot", "bonus", "reward", "gift", "voucher", "coupon"
]

MODELS_DIR = "models"

app = FastAPI(title="SpamShield AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load artefacts on startup ────────────────────────────────────────────────
vectorizer = dt_model = xgb_model = le = metrics_data = feat_dist = None

def _load_models():
    global vectorizer, dt_model, xgb_model, le, metrics_data, feat_dist
    needed = ["tfidf_vectorizer.joblib", "decision_tree.joblib",
              "xgboost_model.joblib", "label_encoder.joblib", "metrics.json"]
    missing = [f for f in needed if not os.path.exists(f"{MODELS_DIR}/{f}")]
    if missing:
        return False, missing
    vectorizer = joblib.load(f"{MODELS_DIR}/tfidf_vectorizer.joblib")
    dt_model   = joblib.load(f"{MODELS_DIR}/decision_tree.joblib")
    xgb_model  = joblib.load(f"{MODELS_DIR}/xgboost_model.joblib")
    le         = joblib.load(f"{MODELS_DIR}/label_encoder.joblib")
    with open(f"{MODELS_DIR}/metrics.json") as f:
        metrics_data = json.load(f)
    fd_path = f"{MODELS_DIR}/feature_distributions.json"
    if os.path.exists(fd_path):
        with open(fd_path) as f:
            feat_dist = json.load(f)
    return True, []

_ready, _missing = _load_models()

# ─── Helpers ──────────────────────────────────────────────────────────────────
def extract_features(text: str):
    words    = text.split()
    links    = len(re.findall(r'http[s]?://|www\.', text, re.IGNORECASE))
    urgency  = sum(1 for w in URGENCY_WORDS if w.lower() in text.lower())
    capitals = sum(1 for c in text if c.isupper())
    return np.array([[len(words), links, urgency, capitals]])

def predict_email(text: str):
    X_tfidf = vectorizer.transform([text])
    X_feat  = extract_features(text)
    X       = sp.hstack([X_tfidf, X_feat])

    dt_pred  = int(dt_model.predict(X)[0])
    dt_prob  = dt_model.predict_proba(X)[0].tolist()
    xgb_pred = int(xgb_model.predict(X)[0])
    xgb_prob = xgb_model.predict_proba(X)[0].tolist()

    classes = le.classes_.tolist()   # ['ham', 'spam']
    spam_idx = classes.index("spam") if "spam" in classes else 1

    feats = {
        "word_count":      len(text.split()),
        "link_count":      int(len(re.findall(r'http[s]?://|www\.', text, re.IGNORECASE))),
        "urgency_words":   int(sum(1 for w in URGENCY_WORDS if w.lower() in text.lower())),
        "capital_letters": int(sum(1 for c in text if c.isupper())),
    }

    return {
        "decision_tree": {
            "prediction":      "SPAM" if dt_pred == spam_idx else "NOT SPAM",
            "is_spam":         dt_pred == spam_idx,
            "spam_probability":  round(dt_prob[spam_idx] * 100, 2),
            "ham_probability":   round(dt_prob[1 - spam_idx] * 100, 2),
        },
        "xgboost": {
            "prediction":      "SPAM" if xgb_pred == spam_idx else "NOT SPAM",
            "is_spam":         xgb_pred == spam_idx,
            "spam_probability":  round(xgb_prob[spam_idx] * 100, 2),
            "ham_probability":   round(xgb_prob[1 - spam_idx] * 100, 2),
        },
        "features": feats,
        "overall_verdict": "SPAM" if (dt_pred == spam_idx or xgb_pred == spam_idx) else "NOT SPAM",
        "overall_is_spam":  dt_pred == spam_idx or xgb_pred == spam_idx,
        "consensus":        dt_pred == xgb_pred,
    }

# ─── Schemas ──────────────────────────────────────────────────────────────────
class EmailRequest(BaseModel):
    email_text: str

# ─── Routes ───────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "SpamShield AI API is running 🚀", "ready": _ready}

@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": _ready, "missing_files": _missing}

@app.post("/predict")
def predict(req: EmailRequest):
    if not _ready:
        raise HTTPException(
            status_code=503,
            detail=f"Models not loaded. Run train_models.py first. Missing: {_missing}"
        )
    if not req.email_text.strip():
        raise HTTPException(status_code=400, detail="Email text cannot be empty.")
    try:
        result = predict_email(req.email_text.strip())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics")
def get_metrics():
    if not _ready:
        raise HTTPException(status_code=503, detail="Models not loaded.")
    return metrics_data

@app.get("/feature-distributions")
def get_feature_distributions():
    if not _ready:
        raise HTTPException(status_code=503, detail="Models not loaded.")
    if feat_dist is None:
        raise HTTPException(status_code=404, detail="Feature distribution data not found.")
    return feat_dist

@app.get("/model-info")
def model_info():
    if not _ready:
        raise HTTPException(status_code=503, detail="Models not loaded.")
    return {
        "decision_tree": {
            "name": "Decision Tree",
            "description": "A tree-based classifier that splits data on feature thresholds.",
            "hyperparameters": {"max_depth": 20, "min_samples_split": 5, "min_samples_leaf": 2},
        },
        "xgboost": {
            "name": "XGBoost",
            "description": "Gradient-boosted ensemble of decision trees using XGBoost library.",
            "hyperparameters": {"n_estimators": 200, "max_depth": 6, "learning_rate": 0.1},
        },
    }
