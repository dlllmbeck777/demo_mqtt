from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern
from .views import (
    TagCalculatedSaveView,
    TagCalculatedTVDetailsView,
    TagCalculatedDetailsByIDView,
    TagCalculatedPropertyView,
    TagsCalculatedSaveAndUpdateView,
    TagsCalculatedDeleteView,
    TagsCalculatedImportView,
)

urlpatterns = [
    path("create/", TagCalculatedSaveView.as_view(), name="tag_calculated_save"),
    path("import/", TagsCalculatedImportView.as_view(), name="tag_calculated_save"),
    path(
        "details/",
        TagCalculatedTVDetailsView.as_view(),
        name="tag_calculated_tv_details",
    ),
    path(
        "item/",
        TagCalculatedDetailsByIDView.as_view(),
        name="tag_calculated_by_id_details",
    ),
    path(
        "property/",
        TagCalculatedPropertyView.as_view(),
        name="tag_calculated_property",
    ),
    path(
        "save/",
        TagsCalculatedSaveAndUpdateView.as_view(),
        name="tag_calculated_save_and_update",
    ),
    path(
        "delete/",
        TagsCalculatedDeleteView.as_view(),
        name="tag_calculated_delete",
    ),
]
