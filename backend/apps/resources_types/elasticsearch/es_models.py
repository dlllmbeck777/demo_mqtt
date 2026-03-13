# from django_elasticsearch_dsl import Document
# from django_elasticsearch_dsl.registries import registry
# from apps.resources_types.models import resources_types


# @registry.register_document
# class ResourceTypesDocument(Document):
#     class Index:
#         name = "resources_types"
#         settings = {"number_of_shards": 1, "number_of_replicas": 0}

#     class Django:
#         model = resources_types
#         fields = [
#             "CULTURE",
#             "SHORT_LABEL",
#             "ID",
#             "MOBILE_LABEL",
#             "LAYER_NAME",
#             "ROW_ID",
#             "SORT_ORDER",
#             "PARENT",
#         ]
