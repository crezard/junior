import React from 'react';
import { QuizResult } from '../types';
import { Trophy, Frown, CheckCircle, RefreshCcw, Home } from 'lucide-react';

interface StatsProps {
  result: QuizResult;
  onRestart: () => void;
  onHome: () => void;
}

export const Stats: React.FC<StatsProps> = ({ result, onRestart, onHome }) => {
  const percentage = Math.round((result.correct / result.total) * 100);
  
  // SVG Pie Chart Calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.correct / result.total) * circumference;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
        <p className="text-slate-500 mb-8">학습 결과를 확인해보세요</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
          {/* Custom SVG Pie Chart */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full">
              {/* Background Circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#f1f5f9"
                strokeWidth="20"
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#4f46e5"
                strokeWidth="20"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold text-slate-800">{percentage}%</span>
              <span className="text-xs text-slate-500 uppercase font-semibold">정답률</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4">
             <div className="bg-indigo-50 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                    <Trophy size={24} />
                </div>
                <div className="text-left">
                    <p className="text-sm text-indigo-600 font-semibold">총 점수</p>
                    <p className="text-2xl font-bold text-indigo-900">{percentage}점</p>
                </div>
             </div>

             <div className="bg-green-50 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <CheckCircle size={24} />
                </div>
                <div className="text-left">
                    <p className="text-sm text-green-600 font-semibold">맞은 문제</p>
                    <p className="text-2xl font-bold text-green-900">{result.correct} / {result.total}</p>
                </div>
             </div>

             {result.incorrect > 0 && (
                <div className="bg-red-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <Frown size={24} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm text-red-600 font-semibold">복습이 필요해요</p>
                        <p className="text-2xl font-bold text-red-900">{result.incorrect}개</p>
                    </div>
                </div>
             )}
          </div>
        </div>

        <div className="flex justify-center gap-4">
            <button onClick={onRestart} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                <RefreshCcw size={18} /> 다시 풀기
            </button>
            <button onClick={onHome} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 transition-colors">
                <Home size={18} /> 주제 목록으로
            </button>
        </div>
      </div>
    </div>
  );
};