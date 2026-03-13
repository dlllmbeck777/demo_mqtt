import os
import pandas as pd
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras import regularizers
from tensorflow.keras.callbacks import EarlyStopping
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
FILE_PATH = 'path_to_data'
MODEL_SAVE_PATH = 'path_to_saved_model'
EPOCHS = 3
BATCH_SIZE = 256

def load_data(file_path):
    return pd.read_csv(file_path, parse_dates=True, index_col=0)

def preprocess_data(data):
    data_filled = data.ffill().bfill()
    scaler = StandardScaler()
    data_scaled = pd.DataFrame(scaler.fit_transform(data_filled), columns=data_filled.columns, index=data_filled.index)
    return train_test_split(data_scaled, test_size=0.2, shuffle=False)

def build_and_train_model(train_data):
    input_dim = train_data.shape[1]
    encoding_dim = int(input_dim / 2)
    input_layer = Input(shape=(input_dim,))
    encoder = Dense(encoding_dim, activation='relu', activity_regularizer=regularizers.l1(10e-5))(input_layer)
    decoder = Dense(input_dim, activation='linear', activity_regularizer=regularizers.l1(10e-5))(encoder)
    autoencoder = Model(inputs=input_layer, outputs=decoder)
    autoencoder.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')
    early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    autoencoder.fit(train_data, train_data, epochs=EPOCHS, batch_size=BATCH_SIZE, shuffle=True, validation_split=0.2, callbacks=[early_stopping], verbose=1)
    return autoencoder

def detect_anomalies(model, val_data):
    reconstructed_data = model.predict(val_data)
    reconstruction_error = np.mean(np.power(val_data - reconstructed_data, 2), axis=1)
    
    # Determine the threshold for anomalies based on the 99th percentile
    threshold = np.percentile(reconstruction_error, 99)
    
    anomalies = val_data[reconstruction_error > threshold]
    return anomalies, threshold  # Return anomalies and the threshold

def analyze_sensors(val_data, anomalies, reconstructed_data, data_filled):
    squared_difference = np.power(val_data - reconstructed_data, 2)
    anomalies_sensor_contribution = squared_difference.loc[anomalies.index].idxmax(axis=1)
    sensor_counts = anomalies_sensor_contribution.value_counts()
    top_two_sensors = sensor_counts.head(2).index


def main():
    logger.info("Loading data...")
    data = load_data(FILE_PATH)
    train_data, val_data = preprocess_data(data)
    
    logger.info("Building and training the model...")
    autoencoder = build_and_train_model(train_data)
    
    logger.info("Detecting anomalies...")
    anomalies, threshold = detect_anomalies(autoencoder, val_data)
    logger.info(f"Detected {len(anomalies)} anomalies with a threshold of {threshold}.")
    
    logger.info("Analyzing sensors responsible for anomalies...")
    reconstructed_data = autoencoder.predict(val_data)
    analyze_sensors(val_data, anomalies, reconstructed_data, data)
    
    # Save the model
    logger.info("Saving the model...")
    autoencoder.save(MODEL_SAVE_PATH)

if __name__ == "__main__":
    main()
