"""
SpamShield AI - Model Training Script
Trains Decision Tree and XGBoost models on email spam dataset.
Run this ONCE before starting the backend server.
"""

import pandas as pd
import numpy as np
import os
import re
import json
import joblib
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.tree import DecisionTreeClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, confusion_matrix)
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
import xgboost as xgb

# ─── Configuration ───────────────────────────────────────────────────────────
DATA_PATH   = "data/spam.csv"
MODELS_DIR  = "models"
RANDOM_STATE = 42

# ─── Urgency words list ───────────────────────────────────────────────────────
URGENCY_WORDS = [
    "urgent", "free", "winner", "won", "prize", "claim", "offer", "limited",
    "act now", "click here", "unsubscribe", "congratulations", "selected",
    "expires", "immediately", "risk-free", "guaranteed", "exclusive",
    "discount", "deal", "cash", "money", "earn", "income", "profit",
    "investment", "loan", "credit", "debt", "bank", "account", "verify",
    "password", "login", "update", "confirm", "suspended", "blocked",
    "lottery", "jackpot", "bonus", "reward", "gift", "voucher", "coupon"
]

# ─── Feature extraction ───────────────────────────────────────────────────────
def extract_features(text):
    text_str = str(text)
    words     = text_str.split()
    links     = len(re.findall(r'http[s]?://|www\.', text_str, re.IGNORECASE))
    urgency   = sum(1 for w in URGENCY_WORDS if w.lower() in text_str.lower())
    capitals  = sum(1 for c in text_str if c.isupper())
    return {
        "word_count":     len(words),
        "link_count":     links,
        "urgency_words":  urgency,
        "capital_letters": capitals,
    }

# ─── Load dataset ─────────────────────────────────────────────────────────────
def load_dataset():
    """Try to load the user's dataset; fall back to a synthetic one."""
    if os.path.exists(DATA_PATH):
        print(f"[+] Loading dataset from {DATA_PATH}")
        try:
            df = pd.read_csv(DATA_PATH, encoding="latin-1")
            # Auto-detect text/label columns
            if "v2" in df.columns and "v1" in df.columns:
                df = df[["v1", "v2"]].rename(columns={"v1": "label", "v2": "text"})
            elif "label" in df.columns and "text" in df.columns:
                df = df[["label", "text"]]
            elif "Category" in df.columns and "Message" in df.columns:
                df = df[["Category", "Message"]].rename(columns={"Category": "label", "Message": "text"})
            else:
                text_col  = df.select_dtypes(include="object").columns[1]
                label_col = df.select_dtypes(include="object").columns[0]
                df = df[[label_col, text_col]].rename(columns={label_col: "label", text_col: "text"})
            df["label"] = df["label"].str.strip().str.lower()
            df = df[df["label"].isin(["spam", "ham"])].dropna()
            print(f"    Loaded {len(df)} rows  |  spam={df['label'].eq('spam').sum()}  ham={df['label'].eq('ham').sum()}")
            return df
        except Exception as e:
            print(f"[!] Could not parse dataset: {e}. Using synthetic data.")

    print("[!] No dataset found at data/spam.csv — generating synthetic training data.")
    print("    To use your own data: place spam.csv inside spamshield-backend/data/")
    return _generate_synthetic_dataset()

def _generate_synthetic_dataset():
    spam_templates = [
        "Congratulations! You have won a FREE prize worth $1000. Click here to claim now!",
        "URGENT: Your bank account has been suspended. Verify immediately at http://fake.com",
        "Limited time offer! Earn $500 daily from home. No experience needed. Act now!",
        "You are selected for exclusive lottery jackpot. Claim your $50000 prize today!",
        "FREE iPhone! You are our lucky winner. Click the link to get your gift voucher.",
        "WINNER! Our records show you are due a tax refund of $3200. Confirm your details.",
        "Make money fast! Risk-free investment opportunity. Guaranteed income every week.",
        "Dear friend, I need your help to transfer $5,000,000. I will give you 30% commission.",
        "Congratulations, you won! Click here immediately to collect your reward money.",
        "Special deal just for you! Buy now and get 80% discount. Offer expires tonight!",
        "Your account will be blocked unless you login and update your password now.",
        "Earn $200 per hour working from home. No skills needed. Apply immediately!",
        "FREE credit check! Your loan has been pre-approved. Claim your cash now!",
        "ALERT: Suspicious activity on your account. Verify login at http://secure-bank.fake",
        "You have been chosen for our exclusive membership program. Free bonus gift inside!",
        "Last chance! Your prize expires in 24 hours. Unsubscribe if you do not want $500.",
        "Debt consolidation! Reduce your monthly payments by 50%. Free consultation today!",
        "Nigerian prince needs your help urgently. Profit sharing guaranteed. Reply fast.",
        "Hot singles in your area want to meet you. Click here for free access tonight!",
        "Your PayPal account is limited. Confirm your identity to restore full access now.",
        "Win big at our online casino! Free spins no deposit required. Join instantly!",
        "Cheap medications online! Viagra, Cialis 80% off. No prescription needed. Order now!",
        "CONGRATULATIONS! Selected as grand prize winner. Send your details to claim.",
        "Investment opportunity! Double your money in 30 days. 100% guaranteed returns.",
        "FREE weight loss pills! Lose 30 pounds in 30 days. Limited stock available now!",
    ]
    ham_templates = [
        "Hi, can we reschedule our meeting to Thursday at 3pm? Let me know if that works.",
        "Please find attached the quarterly report for your review and feedback.",
        "The project deadline has been moved to next Friday. Please update your timelines.",
        "Just wanted to check in and see how you are doing. Hope everything is going well.",
        "Can you please send me the contact details for the new client we discussed?",
        "The team lunch is confirmed for noon tomorrow at the usual restaurant downtown.",
        "I have reviewed your proposal and have some suggestions. Can we discuss on call?",
        "Please complete the timesheet for this week by end of day Friday.",
        "Your order #12345 has been shipped. Expected delivery within 3-5 business days.",
        "Reminder: Performance review scheduled for next Monday at 10am in conference room.",
        "Thank you for attending the workshop today. Here are the notes from our session.",
        "The library books you requested are now available for pickup at the front desk.",
        "Your appointment with Dr. Smith is confirmed for October 15 at 2:30 PM.",
        "Please review the attached contract and sign by end of business today.",
        "The server maintenance window is scheduled for Sunday night from 2am to 4am.",
        "Happy birthday! Wishing you a wonderful day filled with joy and celebration.",
        "I am working on the presentation and will share the draft with you by evening.",
        "The conference call link for tomorrow's standup meeting has been updated.",
        "Could you please approve the expense report I submitted on Monday?",
        "Looking forward to seeing you at the networking event next week. See you there!",
        "The invoice for last month's services is attached. Payment due within 30 days.",
        "Thanks for the introduction! I will reach out to them early next week.",
        "Your subscription to the newsletter has been confirmed. Welcome aboard!",
        "The annual company picnic is on Saturday. Please bring your family along.",
        "I have updated the shared document with all the required information. Please review.",
    ]

    rows = []
    np.random.seed(RANDOM_STATE)

    # 2174 ham, 747 spam  (approx UCI SMS dataset distribution)
    for _ in range(3000):
        t = np.random.choice(spam_templates)
        t += " " * np.random.randint(0, 5)   # tiny variation
        rows.append({"label": "spam", "text": t + str(np.random.randint(1, 9999))})
    for _ in range(4825):
        t = np.random.choice(ham_templates)
        rows.append({"label": "ham", "text": t + " " + str(np.random.randint(1, 9999))})

    df = pd.DataFrame(rows).sample(frac=1, random_state=RANDOM_STATE).reset_index(drop=True)
    print(f"    Synthetic dataset: {len(df)} rows  |  spam={df['label'].eq('spam').sum()}  ham={df['label'].eq('ham').sum()}")
    return df

# ─── Main training ─────────────────────────────────────────────────────────────
def train():
    os.makedirs(MODELS_DIR, exist_ok=True)

    df = load_dataset()

    # Encode labels  (spam=1, ham=0)
    le = LabelEncoder()
    y  = le.fit_transform(df["label"])          # ham→0, spam→1

    # Extract manual features
    feats_df = df["text"].apply(extract_features).apply(pd.Series)

    # TF-IDF
    print("[+] Fitting TF-IDF vectorizer …")
    vectorizer = TfidfVectorizer(max_features=3000, stop_words="english",
                                  ngram_range=(1, 2), sublinear_tf=True)
    X_tfidf = vectorizer.fit_transform(df["text"])

    # Combine
    import scipy.sparse as sp
    X = sp.hstack([X_tfidf, feats_df.values])

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y)

    # ── Decision Tree ──────────────────────────────────────────────────────
    print("[+] Training Decision Tree …")
    dt = DecisionTreeClassifier(max_depth=20, min_samples_split=5,
                                min_samples_leaf=2, random_state=RANDOM_STATE)
    dt.fit(X_train, y_train)
    dt_preds  = dt.predict(X_test)
    dt_proba  = dt.predict_proba(X_test)

    # ── XGBoost ───────────────────────────────────────────────────────────
    print("[+] Training XGBoost …")
    xgb_model = xgb.XGBClassifier(n_estimators=200, max_depth=6,
                                   learning_rate=0.1, use_label_encoder=False,
                                   eval_metric="logloss", random_state=RANDOM_STATE,
                                   n_jobs=-1)
    xgb_model.fit(X_train, y_train)
    xgb_preds = xgb_model.predict(X_test)
    xgb_proba = xgb_model.predict_proba(X_test)

    # ── Stratified CV ──────────────────────────────────────────────────────
    print("[+] Running 5-fold stratified cross-validation …")
    skf     = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    scoring = ["accuracy", "precision", "recall", "f1"]

    dt_cv  = cross_validate(dt,        X, y, cv=skf, scoring=scoring, n_jobs=-1)
    xgb_cv = cross_validate(xgb_model, X, y, cv=skf, scoring=scoring, n_jobs=-1)

    # ── Metrics ───────────────────────────────────────────────────────────
    def metrics(name, preds, proba, y_true, cv_res):
        cm = confusion_matrix(y_true, preds)
        return {
            "model":     name,
            "accuracy":  round(accuracy_score(y_true, preds) * 100, 2),
            "precision": round(precision_score(y_true, preds, zero_division=0) * 100, 2),
            "recall":    round(recall_score(y_true, preds, zero_division=0) * 100, 2),
            "f1":        round(f1_score(y_true, preds, zero_division=0) * 100, 2),
            "confusion_matrix": cm.tolist(),
            "cv_accuracy":  [round(v * 100, 2) for v in cv_res["test_accuracy"].tolist()],
            "cv_precision": [round(v * 100, 2) for v in cv_res["test_precision"].tolist()],
            "cv_recall":    [round(v * 100, 2) for v in cv_res["test_recall"].tolist()],
            "cv_f1":        [round(v * 100, 2) for v in cv_res["test_f1"].tolist()],
        }

    dt_metrics  = metrics("Decision Tree", dt_preds,  dt_proba,  y_test, dt_cv)
    xgb_metrics = metrics("XGBoost",       xgb_preds, xgb_proba, y_test, xgb_cv)

    total   = len(df)
    n_spam  = int(df["label"].eq("spam").sum())
    n_ham   = total - n_spam

    summary = {
        "total_emails":       total,
        "spam_emails":        n_spam,
        "legitimate_emails":  n_ham,
        "decision_tree":      dt_metrics,
        "xgboost":            xgb_metrics,
        "label_classes":      le.classes_.tolist(),
        "feature_names":      ["word_count", "link_count", "urgency_words", "capital_letters"],
    }

    # ── Save artefacts ─────────────────────────────────────────────────────
    joblib.dump(vectorizer,  f"{MODELS_DIR}/tfidf_vectorizer.joblib")
    joblib.dump(dt,          f"{MODELS_DIR}/decision_tree.joblib")
    joblib.dump(xgb_model,   f"{MODELS_DIR}/xgboost_model.joblib")
    joblib.dump(le,          f"{MODELS_DIR}/label_encoder.joblib")

    with open(f"{MODELS_DIR}/metrics.json", "w") as f:
        json.dump(summary, f, indent=2)

    # Feature distributions (for dashboard)
    feats_df["label"] = df["label"].values
    feature_data = {}
    for feat in ["word_count", "link_count", "urgency_words", "capital_letters"]:
        spam_vals = feats_df.loc[feats_df["label"] == "spam", feat].tolist()
        ham_vals  = feats_df.loc[feats_df["label"] == "ham",  feat].tolist()
        # bin them for histogram
        combined  = spam_vals + ham_vals
        bins      = np.histogram_bin_edges(combined, bins=20)
        spam_hist, _ = np.histogram(spam_vals, bins=bins)
        ham_hist,  _ = np.histogram(ham_vals,  bins=bins)
        bin_labels = [f"{bins[i]:.0f}-{bins[i+1]:.0f}" for i in range(len(bins)-1)]
        feature_data[feat] = {
            "bins":       bin_labels,
            "spam_hist":  spam_hist.tolist(),
            "ham_hist":   ham_hist.tolist(),
            "spam_mean":  round(float(np.mean(spam_vals)), 2),
            "ham_mean":   round(float(np.mean(ham_vals)),  2),
        }
    with open(f"{MODELS_DIR}/feature_distributions.json", "w") as f:
        json.dump(feature_data, f, indent=2)

    print("\n[OK] Training complete!")
    print(f"    Decision Tree  - Accuracy: {dt_metrics['accuracy']}%   F1: {dt_metrics['f1']}%")
    print(f"    XGBoost        - Accuracy: {xgb_metrics['accuracy']}%   F1: {xgb_metrics['f1']}%")
    print(f"\n    Saved to: {MODELS_DIR}/")

if __name__ == "__main__":
    train()
