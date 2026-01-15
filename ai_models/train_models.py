import pandas as pd
import numpy as np
import os
import joblib
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), "processed_data")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")

if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

# Hyperparameters
LOOK_BACK = 4  # Number of past weeks to use for prediction
EPOCHS = 50
BATCH_SIZE = 16

def create_dataset(dataset, look_back=1):
    X, Y = [], []
    for i in range(len(dataset) - look_back - 1):
        a = dataset[i:(i + look_back), 0]
        X.append(a)
        Y.append(dataset[i + look_back, 0])
    return np.array(X), np.array(Y)

def train_lstm(data, model_name):
    print(f"\nTraining model for: {model_name}")
    
    # Normalize the dataset
    scaler = MinMaxScaler(feature_range=(0, 1))
    dataset = scaler.fit_transform(data.reshape(-1, 1))
    
    # Split into train and test sets
    train_size = int(len(dataset) * 0.8)
    test_size = len(dataset) - train_size
    train, test = dataset[0:train_size,:], dataset[train_size:len(dataset),:]
    
    # Reshape into X=t and Y=t+1
    look_back = LOOK_BACK
    trainX, trainY = create_dataset(train, look_back)
    testX, testY = create_dataset(test, look_back)
    
    # Reshape input to be [samples, time steps, features]
    trainX = np.reshape(trainX, (trainX.shape[0], 1, trainX.shape[1]))
    testX = np.reshape(testX, (testX.shape[0], 1, testX.shape[1]))
    
    # Build LSTM Network
    model = Sequential()
    model.add(LSTM(50, input_shape=(1, look_back)))
    model.add(Dropout(0.2))
    model.add(Dense(1))
    model.compile(loss='mean_squared_error', optimizer='adam')
    
    # Train
    model.fit(trainX, trainY, epochs=EPOCHS, batch_size=BATCH_SIZE, verbose=1)
    
    # Save Model & Scaler
    model.save(os.path.join(MODELS_DIR, f"{model_name}.h5"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, f"{model_name}_scaler.pkl"))
    print(f"Saved {model_name}.h5 and scaler.")

def main():
    # Load Data
    failures_path = os.path.join(DATA_DIR, "weekly_failures.csv")
    workload_path = os.path.join(DATA_DIR, "weekly_workload.csv")
    
    if os.path.exists(failures_path):
        df_fail = pd.read_csv(failures_path)
        
        # Train Failure Count Model
        if 'FailureCount' in df_fail.columns:
            train_lstm(df_fail['FailureCount'].values, "model_failure_count")
            
        # Train Downtime Model
        if 'TotalDowntime' in df_fail.columns:
            train_lstm(df_fail['TotalDowntime'].values, "model_downtime")
            
    if os.path.exists(workload_path):
        df_work = pd.read_csv(workload_path)
        
        # Train Workload Hours Model
        if 'TotalHours' in df_work.columns:
            train_lstm(df_work['TotalHours'].values, "model_workload_hours")

if __name__ == "__main__":
    main()
