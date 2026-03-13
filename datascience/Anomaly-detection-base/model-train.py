import os
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras import regularizers
from tensorflow.keras.callbacks import EarlyStopping

# Load the data
file_path = 'path\data.csv'
data = pd.read_csv(file_path, parse_dates=True, index_col=0)

# Handle missing values
data_filled = data.ffill().bfill()

# Normalize the data
scaler = StandardScaler()
data_scaled = pd.DataFrame(scaler.fit_transform(data_filled), columns=data_filled.columns, index=data_filled.index)

# Split the data
train_data, val_data = train_test_split(data_scaled, test_size=0.2, shuffle=False)

# Define the architecture of the autoencoder
input_dim = train_data.shape[1]
encoding_dim = int(input_dim / 2)
input_layer = Input(shape=(input_dim,))
encoder = Dense(encoding_dim, activation='relu', activity_regularizer=regularizers.l1(10e-5))(input_layer)
decoder = Dense(input_dim, activation='linear', activity_regularizer=regularizers.l1(10e-5))(encoder)
autoencoder = Model(inputs=input_layer, outputs=decoder)

# Compile and train the model
autoencoder.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
autoencoder.fit(train_data, train_data, epochs=3, batch_size=256, shuffle=True, validation_data=(val_data, val_data), callbacks=[early_stopping], verbose=1)

# Save the model
autoencoder.save('path_to_saved_model')
