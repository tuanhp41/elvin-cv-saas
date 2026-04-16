import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * ScoreCard — Hiển thị kết quả chấm điểm CV từ AI
 * @param {Object} scoreData - Kết quả từ /api/ai/score
 * @param {string} className
 */
export default function ScoreCard({ scoreData, className }) {
  const [expanded, setExpanded] = useState(null);

  if (!scoreData) return null;

  const { total_score, grade, sections, top_3_improvements, summary } = scoreData;

  // Màu theo điểm
  const getScoreColor = (score, max) => {
    const pct = score / max;
    if (pct >= 0.8) return 'text-green-600';
    if (pct >= 0.6) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getGradeBg = (g) => {
    const map = { A: 'bg-green-100 text-green-700', B: 'bg-blue-100 text-blue-700', C: 'bg-yellow-100 text-yellow-700', D: 'bg-red-100 text-red-600' };
    return map[g] || 'bg-gray-100 text-gray-600';
  };

  // Danh sách sections hiển thị
  const sectionList = [
    { key: 'completeness',  label: 'Đầy đủ thông tin', max: 20 },
    { key: 'language',      label: 'Ngôn ngữ chuyên nghiệp', max: 25 },
    { key: 'ats',           label: 'ATS-friendly', max: 20 },
    { key: 'length',        label: 'Độ dài phù hợp', max: 15 },
    { key: 'objective',     label: 'Objective/Summary', max: 10 },
    { key: 'achievements',  label: 'Thành tích cụ thể', max: 10 },
  ];

  // Tính % cho gauge
  const pct = Math.min(100, Math.max(0, total_score));
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className={cn('bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden', className)}>

      {/* Header: Gauge + Grade */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-6 flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            {/* Background circle */}
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" stroke="#e5e7eb" />
            {/* Score arc */}
            <circle
              cx="60" cy="60" r="52" fill="none" strokeWidth="8"
              stroke={pct >= 80 ? '#16a34a' : pct >= 60 ? '#ca8a04' : '#dc2626'}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-3xl font-bold', getScoreColor(pct, 100))}>{total_score}</span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>

        {/* Grade + Summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('text-2xl font-bold px-3 py-1 rounded-lg', getGradeBg(grade))}>
              {grade}
            </span>
            <span className="text-sm text-gray-500">
              {grade === 'A' ? 'Xuất sắc 🎉' : grade === 'B' ? 'Tốt 👍' : grade === 'C' ? 'Trung bình ⚠️' : 'Cần cải thiện 🔧'}
            </span>
          </div>
          {summary && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{summary}</p>
          )}
        </div>
      </div>

      {/* Section Breakdown */}
      <div className="px-6 py-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Chi tiết từng tiêu chí
        </h3>
        <div className="space-y-2">
          {sectionList.map(({ key, label, max }) => {
            const sec = sections?.[key];
            if (!sec) return null;
            const secPct = (sec.score / max) * 100;
            const isOpen = expanded === key;

            return (
              <div key={key} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {/* Mini bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className={cn('text-sm font-bold', getScoreColor(sec.score, max))}>
                        {sec.score}/{max}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-700',
                          secPct >= 80 ? 'bg-green-500' : secPct >= 60 ? 'bg-yellow-500' : 'bg-red-400'
                        )}
                        style={{ width: `${secPct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-300 text-xs flex-shrink-0">{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Expandable comment */}
                {isOpen && sec.comment && (
                  <div className="px-4 pb-3 pt-1 bg-gray-50 text-sm text-gray-600 border-t border-gray-100">
                    {sec.comment}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 3 Improvements */}
      {top_3_improvements?.length > 0 && (
        <div className="px-6 pb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            🎯 Cải thiện ngay để tăng điểm
          </h3>
          <ol className="space-y-2">
            {top_3_improvements.map((tip, i) => (
              <li key={i} className="flex gap-3 items-start bg-blue-50 rounded-xl px-4 py-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-blue-800 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
