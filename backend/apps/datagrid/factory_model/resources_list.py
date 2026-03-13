from .base_model import ModelImporter


class ResourcesList(ModelImporter):
    def get_model(self):
        from apps.resources_types.models import resources_types

        return resources_types
