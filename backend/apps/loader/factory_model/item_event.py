from utils.utils import get_info_message
from utils.validations import CustomValidationError400
from .base_model import ModelImporter


class ItemEventImporter(ModelImporter):
    def transform_data(self, chunk):
        model_list = []
        for data in chunk:
            data["ITEM_ID"] = super()._find_item(data["ITEM_ID"])
            data = self.has_start_or_end_time(data)
            data = super().transform_data(data)
            start_time = []
            ids = []
            for item in data:
                start_time.append(item["START_DATETIME"])
                ids.append(item["ITEM_ID"])
            obj = self.get_model().objects.filter(
                START_DATETIME__in=start_time, ITEM_ID__in=ids
            )
            if obj:
                msg = get_info_message("DASHBOARD.CREATE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )
            model_data = self.get_model()(**data)
            model_list.append(model_data)
        return model_list

    def get_model(self):
        from apps.item_event.models import item_event

        return item_event
