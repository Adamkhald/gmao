import pandas as pd
import numpy as np
import os
import joblib
import json
from tensorflow.keras.models import load_model

# Paths
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "processed_data")
MODELS_DIR = os.path.join(BASE_DIR, "saved_models")
PUBLIC_DATA_DIR = os.path.join(BASE_DIR, "../public/data")

LOOK_BACK = 4

def create_dataset(dataset, look_back=1):
    X, Y = [], []
    for i in range(len(dataset) - look_back - 1):
        a = dataset[i:(i + look_back), 0]
        X.append(a)
        Y.append(dataset[i + look_back, 0])
    return np.array(X), np.array(Y)

def generate_predictions(data, model_name, feature_name):
    model_path = os.path.join(MODELS_DIR, f"{model_name}.h5")
    scaler_path = os.path.join(MODELS_DIR, f"{model_name}_scaler.pkl")
    
    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        print(f"Model or scaler not found for {model_name}")
        return []

    print(f"Generating predictions for {model_name}...")
    
    # Load Model & Scaler
    model = load_model(model_path)
    scaler = joblib.load(scaler_path)
    
    # Preprocess
    dataset = scaler.transform(data.reshape(-1, 1))
    X, Y = create_dataset(dataset, LOOK_BACK)
    
    # Reshape for LSTM
    X_input = np.reshape(X, (X.shape[0], 1, X.shape[1]))
    
    # Predict
    predictions = model.predict(X_input)
    
    # Inverse Transform
    actual = scaler.inverse_transform(Y.reshape(-1, 1))
    predicted = scaler.inverse_transform(predictions)
    
    results = []
    # We start from LOOK_BACK because we need past data to predict
    for i in range(len(actual)):
        results.append({
            "step": i + 1,
            "actual": float(actual[i][0]),
            "predicted": float(predicted[i][0])
        })
        
    return results

def main():
    failures_path = os.path.join(DATA_DIR, "weekly_failures.csv")
    workload_path = os.path.join(DATA_DIR, "weekly_workload.csv")
    
    output_data = {}
    
    # 1. Failure Counts
    if os.path.exists(failures_path):
        df = pd.read_csv(failures_path)
        if 'FailureCount' in df.columns:
            output_data['failures'] = generate_predictions(df['FailureCount'].values, "model_failure_count", "FailureCount")
        if 'TotalDowntime' in df.columns:
            output_data['downtime'] = generate_predictions(df['TotalDowntime'].values, "model_downtime", "TotalDowntime")
            
    # 2. Workload
    if os.path.exists(workload_path):
        df = pd.read_csv(workload_path)
        if 'TotalHours' in df.columns:
            output_data['workload'] = generate_predictions(df['TotalHours'].values, "model_workload_hours", "TotalHours")
            
    # Save to JSON in public/data for frontend
    if not os.path.exists(PUBLIC_DATA_DIR):
        os.makedirs(PUBLIC_DATA_DIR)
        
    output_path = os.path.join(PUBLIC_DATA_DIR, "ml_predictions.json")
    with open(output_path, 'w') as f:
        json.dump(output_data, f, indent=2)
        
    print(f"Predictions exported to {output_path}")

if __name__ == "__main__":
    main()
