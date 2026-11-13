'use client';
import { useState } from 'react';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resume, jd_text: jd }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setResult(data.analysis);
      } else {
        setResult('Error: ' + data.message);
      }
    } catch (error) {
      setResult("System Error: Unable to connect to the local inference engine.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Agentic AI Screening Engine</h1>
          <p className="text-slate-500 mt-2">Local LLM-Powered Candidate Evaluation Pipeline</p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Candidate Resume (Text)</label>
            <textarea 
              className="w-full h-72 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-mono shadow-inner bg-slate-50" 
              placeholder="Paste raw resume text..." 
              value={resume} 
              onChange={(e) => setResume(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Target Job Description</label>
            <textarea 
              className="w-full h-72 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-mono shadow-inner bg-slate-50" 
              placeholder="Paste JD requirements..." 
              value={jd} 
              onChange={(e) => setJd(e.target.value)} 
            />
          </div>
        </div>
        
        <button 
          onClick={handleAnalyze} 
          disabled={loading || !resume || !jd} 
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}
        >
          {loading ? 'Initiating Agentic Analysis...' : 'Run Neural Evaluation'}
        </button>

        {result && (
          <div className="mt-8 p-6 bg-slate-900 text-green-400 rounded-lg font-mono text-sm whitespace-pre-wrap shadow-inner overflow-x-auto">
            <div className="text-slate-400 mb-2 text-xs uppercase tracking-widest border-b border-slate-700 pb-2">Terminal Output // LLM Response</div>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
