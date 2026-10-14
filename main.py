import json, joblib, numpy as np
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from features import extract_features

M = Path(__file__).parent / "models"
app = FastAPI(title="SpamShield AI")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
NAMES = {"decision_tree": "Decision Tree", "xgboost": "XGBoost"}

def load():
    try: return {k: joblib.load(M / f"{k}.joblib") for k in NAMES}
    except FileNotFoundError: return None
models = load()

class Req(BaseModel):
    text: str

@app.get("/api/health")
def health(): return {"models_loaded": models is not None}

@app.post("/api/predict")
def predict(r: Req):
    global models
    models = models or load()
    if models is None: raise HTTPException(503, "Models not trained yet. Run: python train.py")
    if not r.text.strip(): raise HTTPException(400, "Email text is empty.")
    res = {}
    for k, pipe in models.items():
        tf, clf = pipe.named_steps["tfidf"], pipe.named_steps["clf"]
        vec = tf.transform([r.text])
        pr = clf.predict_proba(vec)[0]
        idx = vec.nonzero()[1]
        imp = np.asarray(clf.feature_importances_)
        top = sorted(idx, key=lambda i: imp[i], reverse=True)[:8]
        terms = tf.get_feature_names_out()
        res[k] = {"name": NAMES[k], "label": "SPAM" if pr[1] >= 0.5 else "NOT SPAM",
                  "spam_probability": float(pr[1]), "legit_probability": float(pr[0]),
                  "top_terms": [{"term": terms[i], "importance": float(imp[i])} for i in top if imp[i] > 0]}
    avg = float(np.mean([v["spam_probability"] for v in res.values()]))
    return {"final": "SPAM" if avg >= 0.5 else "NOT SPAM", "confidence": max(avg, 1 - avg),
            "features": extract_features(r.text), "models": res}

@app.get("/api/dashboard")
def dashboard():
    f = M / "metrics.json"
    if not f.exists(): raise HTTPException(503, "metrics.json missing. Run: python train.py")
    return json.loads(f.read_text())
