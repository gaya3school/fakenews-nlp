import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { UploadCloud, FileText, LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageTransition from '../components/layout/PageTransition';
import { analyzeFile } from '../services/api';

function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const acceptedTypes = useMemo(() => ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'], []);
  const acceptedExtensions = useMemo(() => ['.pdf', '.docx', '.txt'], []);

  const validateFile = (file) => {
    if (!file) return false;
    const lower = file.name.toLowerCase();
    const hasAllowedExtension = acceptedExtensions.some((ext) => lower.endsWith(ext));
    if (!acceptedTypes.includes(file.type) && !hasAllowedExtension) {
      toast.error('Only PDF, DOCX, and TXT files are supported.');
      return false;
    }
    return true;
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const onFilePick = (event) => {
    const file = event.target.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const onAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Select a document first.');
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeFile(selectedFile);
      localStorage.setItem('latestAnalysis', JSON.stringify(data));
      toast.success('File analyzed successfully.');
      navigate('/detailed-analysis');
    } catch {
      toast.error('File analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <section className="section">
        <div className="container-shell max-w-3xl">
          <Card>
            <h1 className="font-display text-3xl mb-5">Upload File</h1>
            <div
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className={`rounded-3xl border-2 border-dashed p-10 text-center transition-all ${dragOver ? 'border-accent-500 bg-indigo-50 dark:bg-slate-800/60' : 'border-slate-300 dark:border-slate-600'}`}
            >
              <UploadCloud className="h-10 w-10 mx-auto mb-3 text-accent-600" />
              <p className="font-medium mb-1">Drag and drop your document here</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Accepted formats: PDF, DOCX, TXT</p>
              <label className="inline-flex cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-white text-sm dark:bg-slate-100 dark:text-slate-900">
                Browse File
                <input type="file" accept=".pdf,.docx,.txt" onChange={onFilePick} className="hidden" />
              </label>
            </div>

            {selectedFile && (
              <div className="mt-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 p-4 flex items-center gap-3">
                <FileText className="h-5 w-5 text-accent-600" />
                <p className="text-sm">{selectedFile.name}</p>
              </div>
            )}

            <div className="mt-6">
              <Button onClick={onAnalyze} disabled={loading}>
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}

export default UploadPage;
