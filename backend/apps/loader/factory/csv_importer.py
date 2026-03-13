from .data_importer import DataImporter
import pandas as pd
import json


class CSVDataImporter(DataImporter):
    def load_data(self, data_source="", seperator=""):
        data = pd.read_csv(data_source, seperator).to_json(
            orient="records",
        )
        return json.loads(data)
