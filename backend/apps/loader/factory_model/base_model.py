from abc import ABC, abstractmethod
from datetime import datetime
from dateutil import parser
import uuid
from apps.item_property.models import item_property


class ModelImporter(ABC):
    def save_to_database(self, data=[]):
        chunked_data = [data[i : i + 1000] for i in range(0, len(data), 1000)]
        for chunk in chunked_data:
            model_list = self.transform_data(chunk)
            self.get_model().objects.bulk_create(model_list)

    def convert_to_standard_format(self, date):
        try:
            if date:
                parsed_date = parser.parse(date)
                timestamp = parsed_date.timestamp()
                if len(str(timestamp)) < 13:
                    timestamp = timestamp * 1000
                return timestamp
            return int(datetime.now().timestamp() * 1000)
        except ValueError:
            pass

        return "Invalid format"

    def transform_data(self, chunk):
        model_list = []
        if isinstance(chunk, list):
            for data in chunk:
                data = self._transform_data(data)
                model_data = self.get_model()(**data)
                model_list.append(model_data)
            return model_list
        else:
            return self._transform_data(chunk)

    def _transform_data(self, data):
        data["VERSION"] = uuid.uuid4().hex
        data["ROW_ID"] = uuid.uuid4().hex
        data["LAST_UPDT_DATE"] = self.convert_to_standard_format(str(datetime.now()))

        return data

    def has_start_or_end_time(self, data):
        if data["END_DATETIME"]:
            data["END_DATETIME"] = self.convert_to_standard_format(data["END_DATETIME"])
        else:
            data["END_DATETIME"] = 9999999999999
        data["START_DATETIME"] = self.convert_to_standard_format(data["START_DATETIME"])
        return data

    def _find_item(self, item):
        obj = (
            item_property.objects.filter(PROPERTY_TYPE="NAME", PROPERTY_STRING=item)
            .order_by("-START_DATETIME")
            .values_list("ITEM_ID", flat=True)
            .first()
        )
        return obj

    @abstractmethod
    def get_model(self):
        pass
