import { useState, useRef } from 'react';
import Head from 'next/head';
import { Upload, FileText, AlertCircle, Loader2, X } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import ScoreCard from '@/components/features/ScoreCard';
import CVPreview from '@/components/features/CVPreview';
import { cn } from '@/lib/utils';

/**
 * UploadPage — Luồng B: Upload CV PDF → AI chấm điểm
 * Route: /upload
 */
export default function UploadPage() {
  const { user, loading } = useAuth(true);

  const [file, setFile]           = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const [isparsing, setIsParsing] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [parsedText, setParsedText] = useState('');
  const [scoreData, setScoreData] = useState(null);
  const [error, setError]         = useState(null);
  const [language, setLanguage]   = useState('vi');

  const fileInputRef = useRef(null);

  // ──────────────────────────────────────────────
  // FILE HANDLING
  // ──────────────────────────────────────────────

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Chỉ hỗ trợ file PDF. Vui lòng chọn lại.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File quá lớn. Tối đa 5MB.');
      return;
    }
    setFile(f);
    setError(null);
    setScoreData(null);
    setParsedText('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    handleFile(f);
  };

  const handleReset = () => {
    setFile(null);
    setScoreData(null);
    setParsedText('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ──────────────────────────────────────────────
  // ANALYZE: Parse → Score
  // ──────────────────────────────────────────────

  const handleAnalyze = async () => {
    if (!file) return;
    setError(null);

    // Step 1: Parse PDF
    setIsParsing(true);
    let cvText = '';
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const parseRes = await fetch('/api/cv/parse', {
        method: 'POST',
        body: formData,
      });
      const parseJson = await parseRes.json();
      if (!parseJson.success) throw new Error(parseJson.error);

      cvText = parseJson.data.text;
      setParsedText(cvText);
    } catch (err) {
      setError(`Lỗi đọc PDF: ${err.message}`);
      setIsParsing(false);
      return;
    } finally {
      setIsParsing(false);
    }

    // Step 2: Score
    setIsScoring(true);
    try {
      const scoreRes = await fetch('/api/ai/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, language }),
      });
      const scoreJson = await scoreRes.json();
      if (!scoreJson.success) throw new Error(scoreJson.error);
      setScoreData(scoreJson.data);
    } catch (err) {
      setError(`Lỗi chấm điểm: ${err.message}`);
    } finally {
      setIsScoring(false);
    }
  };

  // ──────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  const isProcessing = isparsing || isScoring;

  return (
    <>
      <Head>
        <title>Upload & Chấm điểm CV | AI Phù Thuỷ CV</title>
        <meta name="description" content="Upload CV PDF, AI chấm điểm chi tiết và gợi ý cải thiện ngay lập tức" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📄 Chấm điểm CV của bạn
          </h1>
          <p className="text-gray-500">Upload CV dạng PDF — AI phân tích và cho điểm chi tiết trong vài giây</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Upload + Controls */}
          <div className="space-y-4">

            {/* Language Selector */}
            <div className="flex gap-2">
              {[
                { code: 'vi', label: '🇻🇳 Tiếng Việt' },
                { code: 'en', label: '🇬🇧 English' },
                { code: 'zh', label: '🇨🇳 中文' },
              ].map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    language === code
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Drop Zone */}
            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all',
                  dragOver
                    ? 'border-blue-400 bg-blue-50 scale-[1.01]'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                )}
              >
                <Upload className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-gray-600 font-medium mb-1">Kéo thả file PDF vào đây</p>
                <p className="text-gray-400 text-sm">hoặc click để chọn file</p>
                <p className="text-gray-300 text-xs mt-3">PDF • Tối đa 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            ) : (
              /* File Selected */
              <div className="border border-gray-200 rounded-2xl p-5 flex items-center gap-4 bg-white">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="text-red-500" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex gap-2 items-start bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || isProcessing}
              className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isparsing ? 'Đang đọc PDF...' : 'AI đang chấm điểm...'}
                </>
              ) : (
                '✨ Phân tích & Chấm điểm'
              )}
            </button>

            {/* Score Result */}
            {scoreData && <ScoreCard scoreData={scoreData} />}
          </div>

          {/* Right: CV Preview (nếu đã parse được text) */}
          <div className="lg:sticky lg:top-24 h-fit">
            {parsedText ? (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Nội dung PDF đã đọc</span>
                  <span className="ml-auto text-xs text-gray-400">{parsedText.length} ký tự</span>
                </div>
                <pre className="px-5 py-4 text-xs text-gray-600 leading-relaxed overflow-y-auto max-h-[600px] whitespace-pre-wrap font-sans">
                  {parsedText}
                </pre>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-100 rounded-2xl p-12 text-center">
                <FileText size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-300 text-sm">Nội dung CV sẽ hiển thị ở đây sau khi upload</p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Global Toast Notification */}
      {isProcessing && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <Loader2 size={18} className="animate-spin text-blue-400" />
          <span className="text-sm font-medium">
            {isparsing ? 'Đang đọc nội dung PDF...' : 'AI đang phân tích và chấm điểm...'}
          </span>
        </div>
      )}
    </>
  );
}
