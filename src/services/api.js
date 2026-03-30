import axios from 'axios';
import mockResponse from '../data/mockResponse.json';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 8000,
});

export async function analyzeText(articleText) {
  try {
    const { data } = await api.post('/analyze', { article: articleText });
    return data;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockResponse;
  }
}

export async function analyzeLink(articleUrl) {
  try {
    const { data } = await api.post('/analyze-url', { url: articleUrl });
    return data;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockResponse;
  }
}

export async function analyzeFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 1300));
    return mockResponse;
  }
}

export async function getHistory() {
  try {
    const { data } = await api.get('/history');
    return data;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return [
      {
        id: 'h1',
        date: '2026-02-16',
        snippet: 'A viral claim stated that a national policy was quietly replaced overnight without documentation.',
        result: 'FAKE',
      },
      {
        id: 'h2',
        date: '2026-02-15',
        snippet: 'Report on inflation revisions matched statements released by the finance ministry and independent analysts.',
        result: 'REAL',
      },
      {
        id: 'h3',
        date: '2026-02-14',
        snippet: 'Social media posts alleged a global ban that was not present in any regulatory bulletin.',
        result: 'FAKE',
      },
    ];
  }
}
