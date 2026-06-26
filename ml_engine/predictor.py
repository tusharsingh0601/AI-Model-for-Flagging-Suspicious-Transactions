import pickle
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model_v1.pkl')

# Lazy load — won't crash if model not trained yet
model = None
encoder = None
FEATURES = None

def _load_model():
    global model, encoder, FEATURES
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                "Model not trained yet. Run: python transactions/ml_engine/train_model.py"
            )
        with open(MODEL_PATH, 'rb') as f:
            bundle = pickle.load(f)
        model    = bundle['model']
        encoder  = bundle['encoder']
        FEATURES = bundle['features']


def predict_single(transaction: dict) -> dict:
    _load_model()
    """
    Predict fraud for a single transaction.
    transaction = {
        'step': 1, 'type': 'TRANSFER', 'amount': 5000,
        'oldbalanceOrg': 5000, 'newbalanceOrig': 0,
        'oldbalanceDest': 0, 'newbalanceDest': 5000
    }
    """
    # Encode type
    try:
        type_encoded = encoder.transform([transaction['type']])[0]
    except ValueError:
        type_encoded = -1  # unknown type

    amount         = float(transaction['amount'])
    oldbalanceOrg  = float(transaction['oldbalanceOrg'])
    newbalanceOrig = float(transaction['newbalanceOrig'])
    oldbalanceDest = float(transaction['oldbalanceDest'])
    newbalanceDest = float(transaction['newbalanceDest'])

    features = [[
        int(transaction['step']),
        type_encoded,
        amount,
        oldbalanceOrg,
        newbalanceOrig,
        oldbalanceDest,
        newbalanceDest,
        oldbalanceOrg  - newbalanceOrig,   # orig_balance_diff
        newbalanceDest - oldbalanceDest,   # dest_balance_diff
        int(oldbalanceOrg  == 0),          # orig_was_zero
        int(oldbalanceDest == 0),          # dest_was_zero
        int(newbalanceOrig == 0),          # orig_now_zero
    ]]

    prediction   = model.predict(features)[0]
    probability  = model.predict_proba(features)[0][1]  # fraud probability

    return {
        'is_fraud': bool(prediction),
        'fraud_probability': round(float(probability) * 100, 2),
        'risk_level': (
            'HIGH'   if probability >= 0.7 else
            'MEDIUM' if probability >= 0.4 else
            'LOW'
        )
    }


def predict_batch(df) -> list:
    _load_model()
    """Predict fraud for a pandas DataFrame (CSV upload)."""
    import pandas as pd

    df['type_encoded']      = df['type'].apply(
        lambda x: encoder.transform([x])[0] if x in encoder.classes_ else -1
    )
    df['orig_balance_diff'] = df['oldbalanceOrg']  - df['newbalanceOrig']
    df['dest_balance_diff'] = df['newbalanceDest'] - df['oldbalanceDest']
    df['orig_was_zero']     = (df['oldbalanceOrg']  == 0).astype(int)
    df['dest_was_zero']     = (df['oldbalanceDest'] == 0).astype(int)
    df['orig_now_zero']     = (df['newbalanceOrig'] == 0).astype(int)

    X           = df[FEATURES]
    predictions = model.predict(X)
    probas      = model.predict_proba(X)[:, 1]

    results = []
    for i, (pred, prob) in enumerate(zip(predictions, probas)):
        results.append({
            'row':              i + 1,
            'type':             df.iloc[i]['type'],
            'amount':           df.iloc[i]['amount'],
            'is_fraud':         bool(pred),
            'fraud_probability': round(float(prob) * 100, 2),
            'risk_level': (
                'HIGH'   if prob >= 0.7 else
                'MEDIUM' if prob >= 0.4 else
                'LOW'
            )
        })
    return results