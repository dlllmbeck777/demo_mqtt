from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    ItemLinkSaveView,
    ItemLinkDeleteView,
    ItemLinkDetailsView,
    ItemLinkUpdateView,
    ItemLinkHierarchyView,
    TagsLinksSelectedView,
    ItemLinkHierarchySearchView,
    TagsLinksView,
    ItemLinkSchemaView,
    ItemLinkCardinaltyCheckView,
    TagCalAndTagsLinksSelectedView,
)

urlpatterns = [
    path("save/", ItemLinkSaveView.as_view(), name="itemlinksave"),
    path("update/", ItemLinkUpdateView.as_view(), name="itemlinkupdate"),
    path("delete/", ItemLinkDeleteView.as_view(), name="itemlinkdelete"),
    path("details/", ItemLinkDetailsView.as_view(), name="itemlinkdetails"),
    path("hierarchy/", ItemLinkHierarchyView.as_view(), name="hierarchy"),
    path("tags/", TagsLinksView.as_view(), name="cardinalty"),
    path("linked/tags/", TagsLinksSelectedView.as_view(), name="test"),
    path("linked/calcTags/", TagCalAndTagsLinksSelectedView.as_view(), name="test"),
    path("hierarchy/search/", ItemLinkHierarchySearchView.as_view(), name="test"),
    path("schema/", ItemLinkSchemaView.as_view(), name="test"),
    path("cardinalty-check/", ItemLinkCardinaltyCheckView.as_view(), name="test"),
]
