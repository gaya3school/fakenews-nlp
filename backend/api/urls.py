from django.urls import path
from .views import AnalyzeView, HistoryView

urlpatterns = [
    path('analyze/', AnalyzeView.as_view(), name='api_analyze'),
    path('history/', HistoryView.as_view(), name='api_history'),
]