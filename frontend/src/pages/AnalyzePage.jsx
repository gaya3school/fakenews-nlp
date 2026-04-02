import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SearchCheck, Trash2, AlertCircle, Link2 } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import ProgressBar from "../components/ui/ProgressBar";
import PageTransition from "../components/layout/PageTransition";
import { analyzeText, analyzeURL } from "../services/api";

function AnalyzePage() {
  const navigate = useNavigate();
  const [article, setArticle] = useState("");
  const [articleLink, setArticleLink] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async (requestFn, successMessage) => {
    setLoading(true);
    setError("");

    try {
      const data = await requestFn();
      setResult(data);
      toast.success(successMessage);
    } catch (requestError) {
      const message = requestError?.message || "Analysis failed. Please try again.";
      setError(message);
      setResult(null);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onAnalyze = async () => {
    if (!article.trim()) {
      toast.error("Please paste an article before analysis.");
      return;
    }

    await runAnalysis(() => analyzeText(article.trim()), "Analysis complete.");
  };

  const onClear = () => {
    setArticle("");
    setArticleLink("");
    setResult(null);
    setError("");
  };

  const onAnalyzeLink = async () => {
    if (!articleLink.trim()) {
      toast.error("Please enter a direct article link.");
      return;
    }

    const normalizedLink = articleLink.trim().startsWith("http://") || articleLink.trim().startsWith("https://")
      ? articleLink.trim()
      : `https://${articleLink.trim()}`;

    try {
      new URL(normalizedLink);
    } catch {
      toast.error("Enter a valid article URL.");
      return;
    }

    await runAnalysis(() => analyzeURL(normalizedLink), "Link analysis complete.");
  };

  const details = result?.details;
  const predictionStyles =
    result?.prediction === "REAL"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";

  return (
    <PageTransition>
      <section className="section">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <Card>
            <h1 className="mb-4 font-display text-3xl">Analyze Text</h1>
            <textarea
              value={article}
              onChange={(event) => setArticle(event.target.value)}
              className="min-h-[320px] w-full rounded-2xl border border-slate-200 bg-white/80 p-4 outline-none focus:ring-2 focus:ring-accent-500 dark:border-slate-700 dark:bg-slate-900/60"
              placeholder="Paste your news article here..."
            />
            <div className="mt-4 space-y-2">
              <label htmlFor="article-link" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Or provide a direct link
              </label>
              <input
                id="article-link"
                type="url"
                value={articleLink}
                onChange={(event) => setArticleLink(event.target.value)}
                placeholder="https://news-site.com/article"
                className="w-full rounded-2xl border border-slate-200 bg-white/80 p-3 outline-none focus:ring-2 focus:ring-accent-500 dark:border-slate-700 dark:bg-slate-900/60"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={onAnalyze} disabled={loading}>
                <SearchCheck className="h-4 w-4" /> Analyze
              </Button>
              <Button variant="secondary" onClick={onAnalyzeLink} disabled={loading}>
                <Link2 className="h-4 w-4" /> Analyze Link
              </Button>
              <Button variant="secondary" onClick={onClear} disabled={loading}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            </div>
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-5 font-display text-2xl">Result</h2>
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {!loading && !result && (
              <p className="text-slate-600 dark:text-slate-300">
                Run analysis to view the prediction, confidence, and language indicators.
              </p>
            )}

            {!loading && result && (
              <div className="space-y-5">
                <div className="flex items-center justify-between rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/70">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Prediction</span>
                  <span
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold ${predictionStyles}`}
                  >
                    {result.prediction}
                  </span>
                </div>

                <ProgressBar label="Confidence" value={result.confidence} />
                <ProgressBar
                  label="Trusted Similarity"
                  value={result.semanticSimilarity?.trustedSimilarity ?? 0}
                  color="from-indigo-500 to-cyan-500"
                />
                <ProgressBar
                  label="Sentence Complexity"
                  value={result.linguistic?.sentenceComplexity ?? 0}
                  color="from-rose-500 to-orange-500"
                />

                <div className="grid gap-3 rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-800/70 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Sentiment</p>
                    <p className="text-lg font-semibold capitalize">{details?.sentiment ?? "neutral"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Word Count</p>
                    <p className="text-lg font-semibold">{details?.word_count ?? 0}</p>
                  </div>
                </div>

                <Button variant="ghost" className="px-0" onClick={() => navigate("/detailed-analysis")}>
                  View detailed analysis
                </Button>
              </div>
            )}
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}

export default AnalyzePage;
