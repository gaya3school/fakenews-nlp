from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import AnalysisResult
from .serializers import AnalysisResultSerializer
from .services import extract_content, analyze_text


class AnalyzeView(APIView):
    def post(self, request):
        url = request.data.get('url')
        text = request.data.get('text')

        if url:
            try:
                text = extract_content(url)
            except:
                return Response({"error": "Failed to scrape URL"}, status=status.HTTP_400_BAD_REQUEST)

        if not text:
            return Response({"error": "No text provided"}, status=status.HTTP_400_BAD_REQUEST)

        results = analyze_text(text)

        obj = AnalysisResult.objects.create(
            url=url,
            text_snippet=text[:200],
            **results
        )

        serializer = AnalysisResultSerializer(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class HistoryView(APIView):
    """Returns the last 10 scans for the history sidebar."""

    def get(self, request):
        history = AnalysisResult.objects.all().order_by('-created_at')[:10]
        serializer = AnalysisResultSerializer(history, many=True)
        return Response(serializer.data)