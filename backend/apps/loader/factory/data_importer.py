from abc import ABC, abstractmethod


class DataImporter(ABC):
    @abstractmethod
    def load_data(self, data_source="", seperator=""):
        pass
