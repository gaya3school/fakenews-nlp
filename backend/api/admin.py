from django.contrib import admin
from .models import AnalysisResult

@admin.register(AnalysisResult)
class AnalysisResultAdmin(admin.ModelAdmin):
    list_display = ('verdict', 'score', 'created_at')
    list_filter = ('verdict',)
    search_fields = ('text_snippet', 'url')