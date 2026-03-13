import joblib
import pandas as pd
import numpy as np
import json
import sys
import threading
from tensorflow.keras.models import load_model
from utils.service_config import BACKEND_API_BASE_URL


class predicts:
    def __init__(self):
        self.loaded_model = load_model("models/mesurment_model.h5_")
        self.return_dict = {}
        self.tag_name = ""
        import requests

        url = f"{BACKEND_API_BASE_URL}/api/v1/tags/get/ml/uom/Inkai/"

        response = requests.get(url)
        self.tag_uom = {}
        if response.status_code == 200:
            self.tag_uom = json.loads(response.text)
        else:
            # İstek hatalı oldu
            print("Hata:", response.status_code)

    def get_tags_uom(self, data):
        if data in self.tag_uom.keys():
            return self.tag_uom[data]["UOM"]
        return None

    def get_tags_asset(self, data):
        if data in self.tag_uom.keys():
            return self.tag_uom[data]["asset"]
        return None

    def get_joblibs(self):
        loaded_means = joblib.load("models/means.joblib")
        scaler = joblib.load("models/scaler.joblib")
        mapping = joblib.load("models/label_mapping.joblib")
        return loaded_means, scaler, mapping

    # def change_timestampt(self, timestamp_ms):
    #     try:
    #         timestamp_seconds = timestamp_ms / 1000
    #         import datetime

    #         # Convert the timestamp to a datetime object
    #         dt_object = datetime.datetime.fromtimestamp(timestamp_seconds).strftime(
    #             "%Y-%m-%d %H:%M:%S.%f%z"
    #         )
    #         return dt_object
    #     except Exception as e:
    #         print("HATA BURDA", timestamp_ms)

    def transform_data_batch(self, data):
        result_list = []
        loaded_means, self.scaler, mapping = self.get_joblibs()
        try:
            default_data = {
                "time": [data["_time"]],
                "asset": [mapping[self.get_tags_asset(mesurment_name)]],
                "bar": [loaded_means["bar"]],  # Change the values to test the model
                "C": loaded_means[
                    "C"
                ],  # You should replace None with appropriate values, possibly mean or median
                "g": loaded_means["g"],
                "Hz": [loaded_means["Hz"]],
                "m3/h": [loaded_means["m3/h"]],
                "mbar": [loaded_means["mbar"]],
            }
            mesurment_name = data["measurement"]
            if self.get_tags_uom(mesurment_name):
                default_data[self.get_tags_uom(mesurment_name)] = data["tag_value"]
                dataframe = pd.DataFrame.from_dict(default_data)
                return dataframe
            return pd.DataFrame()
        except:
            return pd.DataFrame()
        for data in data_list:
            try:
                mesurment_name = data["_measurement"]
                default_data = {
                    "time": data["_time"],
                    "asset": "",
                    "bar": loaded_means["bar"],
                    "C": loaded_means["C"],
                    "g": loaded_means["g"],
                    "Hz": loaded_means["Hz"],
                    "m3/h": loaded_means["m3/h"],
                    "mbar": loaded_means["mbar"],
                    "measurement": mesurment_name,
                }

                tag_value = data.get("tag_value")

                if self.get_tags_uom(mesurment_name) and tag_value is not None:
                    default_data[self.get_tags_uom(mesurment_name)] = tag_value

                result_list.append(default_data)

            except Exception as e:
                print(f"Error: {e}")

        # Her bir default_data sözlüğünün anahtarlarından sütun isimlerini al
        if result_list:
            columns = list(result_list[0].keys())

            # Sonuçları DataFrame'e dönüştür
            result_df = pd.DataFrame(result_list, columns=columns)

            return result_df
        return pd.DataFrame()

    def data_processing(self, data):
        columns_to_scale = ["bar", "C", "g", "Hz", "m3/h", "mbar"]
        scaled_new_data = self.scaler.transform(data[columns_to_scale])

        # If you want to replace the original data with the scaled data
        data[columns_to_scale] = scaled_new_data

        #   # Try to transform the 'asset' field using the loaded_label_encoder
        #   try:
        #       data['asset'] = loaded_label_encoder.transform(data['asset'])
        #   except ValueError as e:
        #       # Handle unknown labels here if necessary
        #       print(f"Error: {e} - The label was not seen in the training dataset")

        df = pd.DataFrame(data)
        df["time"] = pd.to_datetime(df["time"])

        df.set_index("time", inplace=True)
        return df

    def check_anomaly(self, df, value):
        reconstructed_data = self.loaded_model.predict(df)
        reconstruction_error = np.mean(np.power(df - reconstructed_data, 2), axis=1)
        loaded_threshold = joblib.load("models/threshold.joblib")

        squared_difference = np.power(df - reconstructed_data, 2)
        max_contrib_features = squared_difference.idxmax(axis=1)
        if reconstruction_error.item() > loaded_threshold.item():
            if self.get_tags_uom(value["measurement"]) == max_contrib_features.values:
                value["tag_quality"] = 100
                if self.return_dict[value["measurement"]]:
                    self.return_dict[value["measurement"]].append(value["time"])
                else:
                    self.return_dict[value["measurement"]] = [value["time"]]
        sys.exit()

    def send_db_batch(self, value):
        for item in value:
            if not self.transform_data_batch(item).empty:
                tdb = self.transform_data_batch(item)
                data = self.data_processing(tdb)
                thread = threading.Thread(target=self.check_anomaly, args=(data,))
                thread.start()
        return self.return_dict
