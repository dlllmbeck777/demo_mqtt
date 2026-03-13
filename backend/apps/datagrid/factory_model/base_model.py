from abc import ABC, abstractmethod
from datetime import datetime
from dateutil import parser
import uuid
from apps.item_property.models import item_property
from django.db import transaction


class ModelImporter(ABC):
    def save_to_database(self, data):
        for item in data:
            item = self.transform_data(item)
            # print(item)

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

    def transform_data(self, value):
        if isinstance(value, dict):
            value = self._transform_data(value)
            # model_data = self.get_model()(**data)
            return value
        # else:
        #     return self._transform_data(chunk)

    def _transform_data(self, value):
        value["VERSION"] = uuid.uuid4().hex
        value["ROW_ID"] = uuid.uuid4().hex
        self._transform_last_data(value)
        return value

    def _transform_last_data(self, value):
        value["LAST_UPDT_DATE"] = datetime.now().timestamp() * 1000
        value["LAST_UPDT_USER"] = str(self._get_request().user)
        return value

    def has_start_or_end_time(self, value):
        if value["END_DATETIME"]:
            value["END_DATETIME"] = self.convert_to_standard_format(
                value["END_DATETIME"]
            )
        else:
            value["END_DATETIME"] = 9999999999999
        value["START_DATETIME"] = self.convert_to_standard_format(
            value["START_DATETIME"]
        )
        return value

    def _get_request(self):
        return self.request

    def get_request(self, request):
        self.request = request

    @abstractmethod
    def get_model(self):
        pass

    def update_obj(self, data):
        with transaction.atomic():
            try:
                for item in data:
                    self._transform_last_data(item)
                    row_id = item["ROW_ID"]
                    self.get_model().objects.filter(ROW_ID=row_id).update(**item)
            except Exception as e:
                print(str(e))
                transaction.set_rollback(True)

    def delete_obj(self, data):
        with transaction.atomic():
            try:
                for item in data:
                    self.get_model().objects.filter(ROW_ID=item).delete()
            except Exception as e:
                print(str(e))
                transaction.set_rollback(True)

    def create_obj(self, data):
        with transaction.atomic():
            try:
                for item in data:
                    item = self.transform_data(item)
                    self.get_model().objects.create(**item)
            except Exception as e:
                print(str(e))
                transaction.set_rollback(True)
                # msg = get_info_message("WIDGET.CREATE.FAIL")
                # raise CustomValidationError400(
                #     detail={"status_code": 400, "status_message": msg}
                # )
