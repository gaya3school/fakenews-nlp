import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import PageTransition from '../components/layout/PageTransition';
import { getHistory } from '../services/api';

function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const openHistoryItem = (item) => {
    localStorage.setItem('latestAnalysis', JSON.stringify(item.analysis));
    navigate('/detailed-analysis');
  };

  return (
    <PageTransition>
      <section className="section">
        <div className="container-shell">
          <h1 className="font-display text-3xl mb-6">Analysis History</h1>
          <div className="grid gap-4">
            {loading && [1, 2, 3].map((id) => (
              <Card key={id}>
                <Skeleton className="h-6 w-36 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </Card>
            ))}

            {!loading && items.map((item) => (
              <Card key={item.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{item.date}</p>
                  <p className="max-w-3xl text-sm md:text-base">{item.snippet}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.result === 'REAL' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                    {item.result}
                  </span>
                  <Button variant="secondary" className="px-4 py-2 text-sm" onClick={() => openHistoryItem(item)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default HistoryPage;
