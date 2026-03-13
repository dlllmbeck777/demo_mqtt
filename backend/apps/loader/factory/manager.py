from .csv_importer import CSVDataImporter
from .excel_importer import ExcelDataImporter


def get_data(extension):
    DATA_IMPORTERS = {
        "excel": ExcelDataImporter(),
        "csv": CSVDataImporter(),
    }
    return DATA_IMPORTERS[extension]
