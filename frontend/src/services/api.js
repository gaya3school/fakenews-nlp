import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 12000,
});

const HISTORY_STORAGE_KEY = "analysisHistory";

const clampPercentage = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  if (numericValue <= 1) {
    return Math.round(numericValue * 100);
  }

  return Math.max(0, Math.min(Math.round(numericValue), 100));
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const buildFallbackDetails = (details = {}) => ({
  exaggeration_score: Number(details?.exaggeration_score ?? 0),
  emotion_score: Number(details?.emotion_score ?? 0),
  vague_source_score: Number(details?.vague_source_score ?? 0),
  uncertainty_score: Number(details?.uncertainty_score ?? 0),
  clickbait_score: Number(details?.clickbait_score ?? 0),
  conspiracy_score: Number(details?.conspiracy_score ?? 0),
  absolute_claim_score: Number(details?.absolute_claim_score ?? 0),
  fake_statistics_score: Number(details?.fake_statistics_score ?? 0),
  caps_score: Number(details?.caps_score ?? 0),
  punctuation_score: Number(details?.punctuation_score ?? 0),
  repeated_word_score: Number(details?.repeated_word_score ?? 0),
  future_claim_score: Number(details?.future_claim_score ?? 0),
  real_source_score: Number(details?.real_source_score ?? 0),
  sentiment: details?.sentiment ?? "neutral",
  sentiment_polarity: Number(details?.sentiment_polarity ?? 0),
  token_count: Number(details?.token_count ?? 0),
  word_count: Number(details?.word_count ?? 0),
  readability_score: Number(details?.readability_score ?? 0),
  source_type: details?.source_type ?? "text",
});

export const normalizeAnalysisResponse = (payload = {}) => {
  const details = buildFallbackDetails(payload?.details);

  return {
    prediction: payload?.prediction === "FAKE" ? "FAKE" : "REAL",
    confidence: clampPercentage(payload?.confidence),
    entities: ensureArray(payload?.entities).map((entity) => ({
      person: entity?.person ?? "",
      place: entity?.place ?? "",
      organization: entity?.organization ?? "",
    })),
    linguistic: {
      posDistribution: ensureArray(payload?.linguistic?.posDistribution).map((item) => ({
        label: item?.label ?? "Unknown",
        value: clampPercentage(item?.value),
      })),
      sentenceComplexity: clampPercentage(payload?.linguistic?.sentenceComplexity),
    },
    semanticSimilarity: {
      trustedSimilarity: clampPercentage(payload?.semanticSimilarity?.trustedSimilarity),
      headlines: ensureArray(payload?.semanticSimilarity?.headlines).filter(Boolean),
    },
    suspiciousIndicators: ensureArray(payload?.suspiciousIndicators).filter(Boolean),
    details,
    source_url: payload?.source_url ?? "",
    filename: payload?.filename ?? "",
    extracted_length: Number(payload?.extracted_length ?? 0),
  };
};

const getErrorMessage = (error, fallbackMessage) => {
  const message = error?.response?.data?.detail || error?.response?.data?.error || error?.message;
  return message || fallbackMessage;
};

const buildHistoryItem = (analysis) => {
  const sourceLabel = analysis.filename || analysis.source_url || analysis.details?.source_type || "text";
  const snippet = analysis.semanticSimilarity?.headlines?.[0] || analysis.suspiciousIndicators?.[0] || sourceLabel;

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    snippet: String(snippet).slice(0, 140) || "Analysis completed",
    result: analysis.prediction,
    analysis,
  };
};

export const getStoredHistory = () => {
  try {
    const rawHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed = rawHistory ? JSON.parse(rawHistory) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => ({
      id: item?.id ?? crypto.randomUUID(),
      date: item?.date ?? new Date().toISOString(),
      snippet: item?.snippet ?? "Analysis completed",
      result: item?.result === "FAKE" ? "FAKE" : "REAL",
      analysis: normalizeAnalysisResponse(item?.analysis),
    }));
  } catch {
    return [];
  }
};

const saveHistoryItem = (analysis) => {
  const history = [buildHistoryItem(analysis), ...getStoredHistory()].slice(0, 20);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
};

const handleAnalysisResponse = (payload) => {
  const normalized = normalizeAnalysisResponse(payload);
  localStorage.setItem("latestAnalysis", JSON.stringify(normalized));
  saveHistoryItem(normalized);
  return normalized;
};

export const analyzeText = async (articleText) => {
  try {
    const { data } = await api.post("/analyze/text", { text: articleText });
    return handleAnalysisResponse(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to analyze the provided text."));
  }
};

export const analyzeURL = async (url) => {
  try {
    const { data } = await api.post("/analyze/url", { url });
    return handleAnalysisResponse(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to analyze the provided URL."));
  }
};

export const analyzeFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await api.post("/analyze/file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return handleAnalysisResponse(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to analyze the uploaded file."));
  }
};

export const getHistory = async () => getStoredHistory();
