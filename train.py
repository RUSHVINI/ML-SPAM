"""Trains Decision Tree + XGBoost on data/emails.csv, saves models + metrics."""
import json, sys, joblib, numpy as np, pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from xgboost import XGBClassifier
from features import extract_features

BASE = Path(__file__).parent
CSV = BASE / "data" / "emails.csv"
if not CSV.exists():
    sys.exit("Dataset missing. Put your CSV at backend/data/emails.csv (see README: needs a text column and a label column).")

df = pd.read_csv(CSV, encoding="latin-1")
low = {c.lower(): c for c in df.columns}
tcol = next((low[c] for c in ["text","message","email","body","v2","content"] if c in low), None)
lcol = next((low[c] for c in ["label","category","class","spam","v1","target"] if c in low), None)
if not tcol or not lcol:
    sys.exit(f"Could not find text/label columns in {list(df.columns)}. Rename them to 'text' and 'label'.")
df = df[[tcol, lcol]].dropna().rename(columns={tcol: "text", lcol: "label"})
df["y"] = df["label"].astype(str).str.strip().str.lower().isin(["spam","1","true","yes"]).astype(int)
print(f"Loaded {len(df)} emails | spam={df.y.sum()} legit={(1-df.y).sum()}")

X_tr, X_te, y_tr, y_te = train_test_split(df.text, df.y, test_size=0.2, stratify=df.y, random_state=42)
def make(clf): return Pipeline([("tfidf", TfidfVectorizer(stop_words="english", max_features=5000, ngram_range=(1,2), sublinear_tf=True)), ("clf", clf)])
models = {
    "decision_tree": make(DecisionTreeClassifier(max_depth=25, min_samples_leaf=2, random_state=42)),
    "xgboost": make(XGBClassifier(n_estimators=250, max_depth=6, learning_rate=0.1, subsample=0.9, eval_metric="logloss", random_state=42)),
}
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
out = {"total": int(len(df)), "spam": int(df.y.sum()), "legit": int((1-df.y).sum()), "models": {}, "features": {}}
for name, pipe in models.items():
    cv = cross_validate(pipe, X_tr, y_tr, cv=skf, scoring=["accuracy","precision","recall","f1"])
    pipe.fit(X_tr, y_tr)
    p = pipe.predict(X_te)
    out["models"][name] = {
        "test": {"accuracy": accuracy_score(y_te,p), "precision": precision_score(y_te,p,zero_division=0), "recall": recall_score(y_te,p,zero_division=0), "f1": f1_score(y_te,p,zero_division=0)},
        "confusion_matrix": confusion_matrix(y_te,p).tolist(),
        "cv": {m: [float(v) for v in cv["test_"+m]] for m in ["accuracy","precision","recall","f1"]},
    }
    joblib.dump(pipe, BASE / "models" / f"{name}.joblib")
    print(name, out["models"][name]["test"])

feats = pd.DataFrame([extract_features(t) for t in df.text])
for f in feats.columns:
    hi = max(float(np.percentile(feats[f], 95)), 1.0)
    edges = np.linspace(0, hi, 11)
    cl = feats[f].clip(upper=hi)
    out["features"][f] = {
        "bins": [f"{edges[i]:.0f}-{edges[i+1]:.0f}" for i in range(10)],
        "spam": np.histogram(cl[df.y==1], bins=edges)[0].tolist(),
        "legit": np.histogram(cl[df.y==0], bins=edges)[0].tolist(),
        "avg_spam": float(feats[f][df.y==1].mean()), "avg_legit": float(feats[f][df.y==0].mean()),
    }
(BASE / "models" / "metrics.json").write_text(json.dumps(out, indent=2))
print("Done. Models and metrics saved in backend/models/")
