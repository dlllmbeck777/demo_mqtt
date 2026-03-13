from django.urls import path
from . import views as appviews
from django.contrib.auth import views
urlpatterns = [
    path('',appviews.homePage, name='dashboard'),
    path('motor/<int:pk>',appviews.motorView, name='motor-view'),
    path('work/',appviews.techWorkPage, name='works'),
    path('repair/',appviews.repairPage, name='repair'),
    path('work/history/',appviews.workHistoryPage, name='work-work'),
    path('repair/history/',appviews.repairHistoryPage, name='repair-history'),
    path('repair/history/export/',appviews.repiarExport, name='repair-history-export'),
    path('work/history/export/',appviews.maintenanceExport, name='work-history-export'),
    # path('getreport/', appviews.getReport, name='get-report')
    ]
