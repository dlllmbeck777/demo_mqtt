from .base_model import ModelImporter


class TagsImporter(ModelImporter):
    def transform_data(self, chunk):
        model_list = []
        for data in chunk:
            data["ITEM_ID"] = super()._find_item(data["LINK_TO"])
            data.pop("LINK_TO")
            data = self.has_start_or_end_time(data)
            data = super().transform_data(data)
            model_data = self.get_model()(**data)
            model_list.append(model_data)

        return model_list

    def get_model(self):
        from apps.tags.models import tags

        return tags
