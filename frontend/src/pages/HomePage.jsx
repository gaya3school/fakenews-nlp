import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, ScanSearch, Binary, AlertTriangle, ShieldCheck, FileSearch2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageTransition from '../components/layout/PageTransition';
import { timelineSteps } from '../data/timeline';

const features = [
  { title: 'Linguistic Analysis', icon: Brain, text: 'Evaluates syntax patterns, tense irregularities, and persuasive tone markers.' },
  { title: 'Entity Verification', icon: ScanSearch, text: 'Extracts people, places, and organizations for factual cross-checking.' },
  { title: 'Semantic Similarity', icon: Binary, text: 'Matches claims against trusted headlines and verified source summaries.' },
  { title: 'Exaggeration Detection', icon: AlertTriangle, text: 'Flags sensational wording, certainty inflation, and emotional triggers.' },
  { title: 'AI Classification', icon: ShieldCheck, text: 'Combines linguistic and semantic signals into a final real/fake outcome.' },
];

function HomePage() {
  return (
    <PageTransition>
      <section className="section relative overflow-hidden">
        <div className="absolute left-10 top-10 h-44 w-44 rounded-full bg-indigo-300/25 blur-3xl animate-float" />
        <div className="absolute right-8 bottom-2 h-48 w-48 rounded-full bg-teal-300/25 blur-3xl animate-float" />
        <div className="container-shell relative z-10">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-white/70 px-4 py-1.5 text-sm text-accent-700 dark:bg-slate-800/70 dark:text-indigo-300">Fake News Linguistic Pattern Detector</p>
              <h1 className="font-display text-4xl md:text-5xl leading-tight">Detect misleading news using linguistic and semantic intelligence.</h1>
              <p className="text-slate-600 dark:text-slate-300 max-w-xl">A production-grade NLP dashboard that scores writing style, semantic consistency, and suspicious indicators before misinformation spreads.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/analyze"><Button>Analyze Article</Button></Link>
                <Link to="/upload"><Button variant="secondary">Upload Document</Button></Link>
              </div>
            </div>

            <Card className="relative">
              <div className="absolute -top-5 -right-5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 p-3 text-white shadow-glow">
                <FileSearch2 className="h-6 w-6" />
              </div>
              <svg viewBox="0 0 500 300" className="w-full h-auto">
                <rect x="40" y="35" width="420" height="230" rx="20" fill="rgba(79,70,229,0.08)" />
                <rect x="70" y="70" width="180" height="18" rx="9" fill="#4f46e5" opacity="0.85" />
                <rect x="70" y="100" width="230" height="10" rx="5" fill="#94a3b8" opacity="0.7" />
                <rect x="70" y="120" width="210" height="10" rx="5" fill="#94a3b8" opacity="0.55" />
                <circle cx="360" cy="130" r="45" fill="#14b8a6" opacity="0.2" />
                <circle cx="360" cy="130" r="24" fill="#14b8a6" opacity="0.5" />
                <path d="M337 130h46" stroke="#0f766e" strokeWidth="6" strokeLinecap="round" />
                <rect x="70" y="160" width="150" height="16" rx="8" fill="#ef4444" opacity="0.75" />
                <rect x="70" y="190" width="270" height="12" rx="6" fill="#cbd5e1" />
                <rect x="70" y="210" width="240" height="12" rx="6" fill="#cbd5e1" opacity="0.8" />
              </svg>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">AI-assisted visual summary of linguistic cues, semantic mismatch, and confidence trends.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-shell">
          <h2 className="font-display text-3xl mb-8">Core Features</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
              >
                <Card>
                  <feature.icon className="h-8 w-8 text-accent-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{feature.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-shell">
          <Card>
            <h2 className="font-display text-3xl mb-7">How It Works</h2>
            <div className="grid gap-5 md:grid-cols-5">
              {timelineSteps.map((step, idx) => (
                <div key={step} className="relative rounded-2xl bg-slate-50/80 dark:bg-slate-800/70 p-4 text-center">
                  <div className="mx-auto mb-3 h-8 w-8 rounded-full bg-gradient-to-r from-accent-500 to-teal-500 text-white text-sm flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}

export default HomePage;
