Anomaly Detection System

Overview
This repository contains an anomaly detection system designed to identify irregularities in time-series sensor data using an autoencoder neural network.

Technical Documentation
A detailed technical documentation can be found in the file [Anomaly Detection System.docx](./Anomaly Detection System.docx).

Structure

1. Python Scripts
- `app.py`: Main application script for the anomaly detection system. It utilizes libraries like TensorFlow, pandas, numpy, and scikit-learn.
- `model-train.py`: Script dedicated to training the anomaly detection model. It includes steps for data loading, preprocessing, and model training.

2. Jupyter Notebook
- `p2-a-detailed.ipynb`: A comprehensive guide that walks through the process of loading, preprocessing, and analyzing time-series sensor data for anomaly detection.

Getting Started

1. **Prerequisites**: Ensure you have the following libraries installed:
    - pandas
    - numpy
    - tensorflow
    - scikit-learn
    - matplotlib

2. **Data**: The primary data source is a CSV file. Make sure to update the `FILE_PATH` placeholder in the scripts with the path to your data.

3. **Run the Model Training Script**: Execute `model-train.py` to train the anomaly detection model.

4. **Run the Application**: Execute `app.py` to run the main application and visualize anomalies.

5. **Detailed Guide**: For a step-by-step guide on the anomaly detection system, refer to the Jupyter notebook `p2-a-detailed.ipynb`.
