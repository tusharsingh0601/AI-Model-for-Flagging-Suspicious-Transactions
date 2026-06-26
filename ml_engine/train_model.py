import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import pickle
import os

def train():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    CSV_PATH = os.path.join(BASE_DIR, 'dataset.csv')

    # ── 1. Load Real Data ─────────────────────────────────────
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"dataset.csv not found at {CSV_PATH}")

    print(f"Loading dataset from {CSV_PATH} ...")
    df = pd.read_csv(CSV_PATH)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    # ── 2. Feature Engineering ────────────────────────────────
    le = LabelEncoder()
    df['type_encoded']      = le.fit_transform(df['type'])
    df['orig_balance_diff'] = df['oldbalanceOrg']  - df['newbalanceOrig']
    df['dest_balance_diff'] = df['newbalanceDest'] - df['oldbalanceDest']
    df['orig_was_zero']     = (df['oldbalanceOrg']  == 0).astype(int)
    df['dest_was_zero']     = (df['oldbalanceDest'] == 0).astype(int)
    df['orig_now_zero']     = (df['newbalanceOrig'] == 0).astype(int)

    # ── 3. Select Features ────────────────────────────────────
    FEATURES = [
        'step', 'type_encoded', 'amount',
        'oldbalanceOrg', 'newbalanceOrig',
        'oldbalanceDest', 'newbalanceDest',
        'orig_balance_diff', 'dest_balance_diff',
        'orig_was_zero', 'dest_was_zero', 'orig_now_zero'
    ]

    X = df[FEATURES]
    y = df['isFraud']

    print(f"Fraud cases: {y.sum()} / {len(y)} ({y.mean()*100:.2f}%)")

    # ── 4. Train/Test Split ───────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # ── 5. Train Model ────────────────────────────────────────
    print("Training Random Forest... (this may take a few minutes)")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # ── 6. Evaluate ───────────────────────────────────────────
    y_pred = model.predict(X_test)
    print("\n── Evaluation ──────────────────────────────────────")
    print(classification_report(y_test, y_pred, target_names=['Legit', 'Fraud']))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # ── 7. Save Model ─────────────────────────────────────────
    MODEL_PATH = os.path.join(BASE_DIR, 'model_v1.pkl')
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump({'model': model, 'encoder': le, 'features': FEATURES}, f)

    print(f"\n✅ Model saved to {MODEL_PATH}")

if __name__ == '__main__':
    train()