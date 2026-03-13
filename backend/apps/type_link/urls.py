from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    TypeLinkSaveView,
    TypeLinkView,
    TypeLinkDetailsView,
    TypeNewLinkSchemasView,
    RelatedTypeView,
)

urlpatterns = [
    path("save/", TypeLinkSaveView.as_view(), name="type-linkSave"),
    # path("saveAndProperty/", TypeAndPropertySaveView.as_view(),name='typeAndPropertySave'),
    # path("update/", TypeUpdateView.as_view(),name='typeUpdate'),
    # path("delete/", TypeDeleteeView.as_view(),name='typeDelete'),
    path("scripts/", TypeLinkView.as_view(), name="typeLink"),
    path("details/", TypeLinkDetailsView.as_view(), name="typeDetails"),
    path("schema/", TypeNewLinkSchemasView.as_view(), name="typeDetails"),
    path("related/", RelatedTypeView.as_view(), name="typeDetails"),
]
