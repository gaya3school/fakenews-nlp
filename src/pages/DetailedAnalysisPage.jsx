import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import PageTransition from "../components/layout/PageTransition";
import mockResponse from "../data/mockResponse.json";
import { normalizeAnalysisResponse } from "../services/api";

const tabs = ["Entities", "Linguistic Patterns", "Semantic Similarity", "Suspicious Indicators", "Details"];

const EmptyState = ({ message }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
    {message}
  </div>
);

function DetailedAnalysisPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const data = useMemo(() => {
    try {
      const stored = localStorage.getItem("latestAnalysis");
      return normalizeAnalysisResponse(stored ? JSON.parse(stored) : mockResponse);
    } catch {
      return normalizeAnalysisResponse(mockResponse);
    }
  }, []);

  const entities = data?.entities ?? [];
  const posDistribution = data?.linguistic?.posDistribution ?? [];
  const headlines = data?.semanticSimilarity?.headlines ?? [];
  const suspiciousIndicators = data?.suspiciousIndicators ?? [];
  const detailsEntries = [
    ["Exaggeration score", data?.details?.exaggeration_score],
    ["Emotion score", data?.details?.emotion_score],
    ["Vague source score", data?.details?.vague_source_score],
    ["Uncertainty score", data?.details?.uncertainty_score],
    ["Clickbait score", data?.details?.clickbait_score],
    ["Conspiracy score", data?.details?.conspiracy_score],
    ["Absolute claim score", data?.details?.absolute_claim_score],
    ["Fake statistics score", data?.details?.fake_statistics_score],
    ["Caps score", data?.details?.caps_score],
    ["Punctuation score", data?.details?.punctuation_score],
    ["Repeated word score", data?.details?.repeated_word_score],
    ["Future claim score", data?.details?.future_claim_score],
    ["Real source score", data?.details?.real_source_score],
    ["Sentiment", data?.details?.sentiment],
    ["Sentiment polarity", data?.details?.sentiment_polarity],
    ["Token count", data?.details?.token_count],
    ["Word count", data?.details?.word_count],
    ["Readability score", data?.details?.readability_score],
    ["Source type", data?.details?.source_type],
    ["Source URL", data?.source_url],
    ["Filename", data?.filename],
    ["Extracted length", data?.extracted_length],
  ].filter(([, value]) => value !== "" && value !== null && value !== undefined);

  const predictionStyles =
    data.prediction === "REAL"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";

  return (
    <PageTransition>
      <section className="section">
        <div className="container-shell">
          <Card>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="mb-2 font-display text-3xl">Detailed Analysis</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Review the extracted signals behind the current prediction.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/70">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Prediction</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${predictionStyles}`}>
                    {data.prediction}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{data.confidence}% confidence</span>
                </div>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-accent-500 to-teal-500 text-white"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Entities" && (
              <>
                {entities.length === 0 ? (
                  <EmptyState message="No named entities were extracted for this analysis." />
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/60">
                        <tr>
                          <th className="p-3 text-left">Person</th>
                          <th className="p-3 text-left">Place</th>
                          <th className="p-3 text-left">Organization</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(entities || []).map((row, index) => (
                          <tr
                            key={`${row?.person || "person"}-${row?.place || "place"}-${row?.organization || "org"}-${index}`}
                            className="border-t border-slate-200 dark:border-slate-700"
                          >
                            <td className="p-3">{row?.person || "-"}</td>
                            <td className="p-3">{row?.place || "-"}</td>
                            <td className="p-3">{row?.organization || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {activeTab === "Linguistic Patterns" && (
              <div className="space-y-4">
                {posDistribution.length === 0 ? (
                  <EmptyState message="Part-of-speech distribution is not available for this response." />
                ) : (
                  (posDistribution || []).map((item) => (
                    <div key={`${item?.label || "unknown"}-${item?.value ?? 0}`} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item?.label || "Unknown"}</span>
                        <span>{item?.value ?? 0}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                          style={{ width: `${item?.value ?? 0}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
                <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-800/70">
                  <p className="mb-1 text-sm text-slate-600 dark:text-slate-300">Sentence Complexity</p>
                  <p className="text-2xl font-bold">{data?.linguistic?.sentenceComplexity ?? 0}%</p>
                </div>
              </div>
            )}

            {activeTab === "Semantic Similarity" && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-800/70">
                  <p className="mb-1 text-sm text-slate-600 dark:text-slate-300">Trusted Source Similarity</p>
                  <p className="text-2xl font-bold">{data?.semanticSimilarity?.trustedSimilarity ?? 0}%</p>
                </div>
                {headlines.length === 0 ? (
                  <EmptyState message="No supporting headline comparisons were returned by the backend." />
                ) : (
                  <div className="space-y-2">
                    {(headlines || []).map((headline, index) => (
                      <div
                        key={`${headline || "headline"}-${index}`}
                        className="rounded-xl border border-slate-200 bg-white/85 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/60"
                      >
                        {headline}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Suspicious Indicators" && (
              <>
                {suspiciousIndicators.length === 0 ? (
                  <EmptyState message="No suspicious indicators were flagged for this sample." />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(suspiciousIndicators || []).map((item, index) => (
                      <span
                        key={`${item || "indicator"}-${index}`}
                        className="rounded-full bg-rose-100 px-4 py-2 text-sm text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "Details" && (
              <>
                {detailsEntries.length === 0 ? (
                  <EmptyState message="No extra analysis details were returned." />
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {detailsEntries.map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-800/70">
                        <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
                        <p className="mt-1 break-words text-lg font-semibold capitalize">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}

export default DetailedAnalysisPage;
