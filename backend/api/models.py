from django.db import models

class AnalysisResult(models.Model):
    url = models.URLField(blank=True, null=True)
    text_snippet = models.TextField()
    verdict = models.CharField(max_length=50)
    score = models.FloatField()

    entities = models.JSONField(default=dict)
    metrics = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.verdict} ({self.score}%)"