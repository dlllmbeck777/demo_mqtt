from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    TagsDetailsView,
    TagsSaveView,
    TagsDeleteView,
    TagsPropertysView,
    TagsTypeLinkView,
    TagsNameViews,
    TagsSpesificDetailsView,
    TagsUomConversionView,
    TagsImportView,
    TagsImportDeleteView,
    TagsImportHistoryListView,
    TagsImportHistoryView,
    WorkflowItemGetTagView,
    TagsDetailsForLayerView,
    TagsToItemRPMView,
    GetVibrationsTagsView,
    GetFFTTagsView,
    GetTagNameAndShortNameByAssetView,
    GetTagsAndShortNameView,
    GetVisulationTagsView,
    # GetVelocityRMSTagsView,
    # GetTimeWaveFormTagsView,
    GetFFTByAssetTagsView,
    GetTagsUomsView,
    GetLiveDataView,
)

# from .elasticsearch.es_view import ESBlogViewSet

urlpatterns = [
    path("test/", GetLiveDataView.as_view(), name="tags save "),
    path("item/tags/", WorkflowItemGetTagView.as_view(), name="tags save "),
    path("save/", TagsSaveView.as_view(), name="tags save "),
    path("import/", TagsImportView.as_view(), name="tags save "),
    path(
        "import/history/list/<str:types>/",
        TagsImportHistoryListView.as_view(),
        name="import/histroy/list/",
    ),
    path(
        "import/delete/<str:types>/", TagsImportDeleteView.as_view(), name="tags save "
    ),
    path(
        "import/history/<str:keys>/<str:types>/",
        TagsImportHistoryView.as_view(),
        name="get import history ",
    ),
    path("delete/", TagsDeleteView.as_view(), name="tags delete "),
    path("details/", TagsDetailsView.as_view(), name="tags details"),
    path(
        "details/<str:layer>",
        TagsDetailsForLayerView.as_view(),
        name="tags details for layer",
    ),
    path("tags-property/", TagsPropertysView.as_view(), name="tags property"),
    # path("detailsold/",TypeDetailView.as_view() ,name='typeDetails'),#TypeDetailView.as_view()
    path("links/", TagsTypeLinkView.as_view(), name="tags link"),
    path("item/", TagsSpesificDetailsView.as_view(), name="tags link"),
    path("name/", TagsNameViews.as_view(), name="tags name"),
    path("uom-converison/", TagsUomConversionView.as_view(), name="tags name"),
    # path("es/<str:name>", ESBlogViewSet.as_view({"get": "list"}), name=""),
    path(
        "rpm/<str:layer>/",
        TagsToItemRPMView.as_view(),
        name="tags item prop get rpm for layer",
    ),
    path(
        "vibrations/<str:layer>/",
        GetVibrationsTagsView.as_view(),
        name="get vibrations tags for layer",
    ),
    path(
        "fft/<str:layer>/",
        GetFFTTagsView.as_view(),
        name="get fft for tags",
    ),
    path(
        "visulations/data/<str:layer>/",
        GetVisulationTagsView.as_view(),
        name="get fft for tags",
    ),
    # path(
    #     "velocity-rms/<str:layer>/",
    #     GetVelocityRMSTagsView.as_view(),
    #     name="get fft for tags",
    # ),
    # path(
    #     "timewaveform/<str:layer>/",
    #     GetTimeWaveFormTagsView.as_view(),
    #     name="get fft for tags",
    # ),
    path(
        "get/asset/",
        GetTagNameAndShortNameByAssetView.as_view(),
        name="get asset for tags",
    ),
    path(
        "fft/by/asset/<str:layer>/",
        GetFFTByAssetTagsView.as_view(),
        name="get fft for tags",
    ),
    path(
        "get/shortname/<str:layer>/",
        GetTagsAndShortNameView.as_view(),
        name="get shortname for tags",
    ),
    path(
        "get/ml/uom/<str:layer>/",
        GetTagsUomsView.as_view(),
        name="get shortname for tags",
    ),
]
