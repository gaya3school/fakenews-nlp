import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SearchCheck, Trash2, AlertCircle, Link2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import ProgressBar from '../components/ui/ProgressBar';
import PageTransition from '../components/layout/PageTransition';
import { analyzeText, analyzeLink } from '../services/api';

function AnalyzePage() {
  const navigate = useNavigate();
  const [article, setArticle] = useState('');
  const [articleLink, setArticleLink] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onAnalyze = async () => {
    if (!article.trim()) {
      toast.error('Please paste an article before analysis.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await analyzeText(article);
      setResult(data);
      localStorage.setItem('latestAnalysis', JSON.stringify(data));
      toast.success('Analysis complete.');
    } catch {
      setError('Analysis failed. Please try again.');
      toast.error('Unable to process article right now.');
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setArticle('');
    setArticleLink('');
    setResult(null);
    setError('');
  };

  const onAnalyzeLink = async () => {
    if (!articleLink.trim()) {
      toast.error('Please enter a direct article link.');
      return;
    }

    try {
      // URL constructor validates absolute URL format.
      new URL(articleLink.trim());
    } catch {
      toast.error('Enter a valid URL (include http:// or https://).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await analyzeLink(articleLink.trim());
      setResult(data);
      localStorage.setItem('latestAnalysis', JSON.stringify(data));
      toast.success('Link analysis complete.');
    } catch {
      setError('Analysis failed. Please try again.');
      toast.error('Unable to process link right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <section className="section">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <Card>
            <h1 className="font-display text-3xl mb-4">Analyze Text</h1>
            <textarea
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              className="w-full min-h-[320px] rounded-2xl border border-slate-200 bg-white/80 p-4 outline-none focus:ring-2 focus:ring-accent-500 dark:bg-slate-900/60 dark:border-slate-700"
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
                onChange={(e) => setArticleLink(e.target.value)}
                placeholder="https://news-site.com/article"
                className="w-full rounded-2xl border border-slate-200 bg-white/80 p-3 outline-none focus:ring-2 focus:ring-accent-500 dark:bg-slate-900/60 dark:border-slate-700"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={onAnalyze} disabled={loading}>
                <SearchCheck className="h-4 w-4" /> Analyze
              </Button>
              <Button variant="secondary" onClick={onAnalyzeLink} disabled={loading}>
                <Link2 className="h-4 w-4" /> Analyze Link
              </Button>
              <Button variant="secondary" onClick={onClear}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            </div>
            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700 text-sm flex items-center gap-2 dark:bg-red-950/30 dark:text-red-300">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-display text-2xl mb-5">Result</h2>
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {!loading && !result && <p className="text-slate-600 dark:text-slate-300">Run analysis to view prediction confidence and linguistic indicators.</p>}

            {!loading && result && (
              <div className="space-y-5">
                <div className="flex items-center justify-between rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-4 py-3">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Prediction</span>
                  <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${result.prediction === 'REAL' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                    {result.prediction}
                  </span>
                </div>

                <ProgressBar label="Confidence" value={result.confidence} />
                <ProgressBar label="Writing Style Score" value={result.writingStyleScore} color="from-indigo-500 to-cyan-500" />
                <ProgressBar label="Exaggeration Level" value={result.exaggerationLevel} color="from-rose-500 to-orange-500" />

                <Button variant="ghost" className="px-0" onClick={() => navigate('/detailed-analysis')}>
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
