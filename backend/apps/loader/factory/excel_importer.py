from .data_importer import DataImporter
import pandas as pd


class ExcelDataImporter(DataImporter):
    def load_data(self, data_source="", seperator=""):
        return pd.read_excel(self.data_source)
