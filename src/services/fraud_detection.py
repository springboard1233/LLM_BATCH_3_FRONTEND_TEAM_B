import pickle
import os
import numpy as np
import pandas as pd

def load_model():
    model_path = os.path.join('..', 'models', 'random_forest_model.pkl')
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def predict_fraud(transaction_data):
    """
    Predict if a transaction is fraudulent
    
    Expected features:
    - transaction_amount
    - account_age_days
    - kyc_status
    - channel_atm, channel_mobile, channel_pos, channel_web
    - hour, day, weekday
    - avg_txn_per_customer
    - txns_count_per_customer
    - amt_deviation
    - high_amount_flag
    - is_night
    - is_weekend
    """
    try:
        # Load model
        model = load_model()
        
        # Convert data to DataFrame if it's a dict
        if isinstance(transaction_data, dict):
            transaction_data = pd.DataFrame([transaction_data])
            
        # Make prediction
        prediction = model.predict(transaction_data)[0]
        probability = model.predict_proba(transaction_data)[0][1]
        
        return {
            'is_fraud': bool(prediction),
            'fraud_probability': float(probability),
            'risk_level': 'High' if probability > 0.7 else 'Medium' if probability > 0.3 else 'Low'
        }
        
    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")