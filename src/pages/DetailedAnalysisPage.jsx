import { useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import PageTransition from '../components/layout/PageTransition';
import mockResponse from '../data/mockResponse.json';

const tabs = ['Entities', 'Linguistic Patterns', 'Semantic Similarity', 'Suspicious Indicators'];

function DetailedAnalysisPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const data = useMemo(() => {
    try {
      const stored = localStorage.getItem('latestAnalysis');
      return stored ? JSON.parse(stored) : mockResponse;
    } catch {
      return mockResponse;
    }
  }, []);

  return (
    <PageTransition>
      <section className="section">
        <div className="container-shell">
          <Card>
            <h1 className="font-display text-3xl mb-6">Detailed Analysis</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm transition ${activeTab === tab ? 'bg-gradient-to-r from-accent-500 to-teal-500 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Entities' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100/80 dark:bg-slate-800/60">
                    <tr>
                      <th className="text-left p-3">Person</th>
                      <th className="text-left p-3">Place</th>
                      <th className="text-left p-3">Organization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.entities.map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-200 dark:border-slate-700">
                        <td className="p-3">{row.person}</td>
                        <td className="p-3">{row.place}</td>
                        <td className="p-3">{row.organization}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Linguistic Patterns' && (
              <div className="space-y-4">
                {data.linguistic.posDistribution.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Sentence Complexity</p>
                  <p className="text-2xl font-bold">{data.linguistic.sentenceComplexity}%</p>
                </div>
              </div>
            )}

            {activeTab === 'Semantic Similarity' && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Trusted Source Similarity</p>
                  <p className="text-2xl font-bold">{data.semanticSimilarity.trustedSimilarity}%</p>
                </div>
                <div className="space-y-2">
                  {data.semanticSimilarity.headlines.map((headline) => (
                    <div key={headline} className="rounded-xl bg-white/85 p-3 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-700 text-sm">
                      {headline}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Suspicious Indicators' && (
              <div className="flex flex-wrap gap-2">
                {data.suspiciousIndicators.map((item) => (
                  <span key={item} className="rounded-full bg-rose-100 px-4 py-2 text-sm text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}

export default DetailedAnalysisPage;
