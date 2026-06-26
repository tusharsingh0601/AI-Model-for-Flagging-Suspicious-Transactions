import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# --- 1. GENERATE NEW TRAINING DATA ---
np.random.seed(42)
n_samples = 5000

# Create random amounts between $10 and $20,000
data = {
    'amount': np.random.randint(10, 20000, n_samples),
}
df = pd.DataFrame(data)

# --- 2. SET THE NEW RULE (The Critical Part) ---
# We tell the AI: "Only mark as Fraud if amount is > 9,000"
# This makes $8,000 SAFE.
df['is_fraud'] = (df['amount'] > 9000).astype(int)

# --- 3. TRAIN THE MODEL ---
X = df[['amount']]
y = df['is_fraud']

print("Training new AI Brain...")
model = RandomForestClassifier(n_estimators=50, random_state=42)
model.fit(X, y)

# --- 4. OVERWRITE THE OLD MODEL ---
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'model_v1.pkl')
joblib.dump(model, model_path)

print(f"✅ SUCCESS: Model Retrained!")
print(f"New Rule: Amounts under $9,000 are SAFE.")
print(f"Saved to: {model_path}")