import React from 'react';
import { QuizResult } from '../types';
import { Trophy, Frown, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface StatsProps {
  result: QuizResult;
  onRestart: () => void;
  onHome: () => void;
}

export const Stats: React.FC<StatsProps> = ({ result, onRestart, onHome }) => {
  const percentage = Math.round((result.correct / result.total) * 100);
  
  // Calculate stroke dasharray for the circle chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine message and color based on score
  let message = "Good effort!";
  let subMessage = "Keep practicing to improve.";
  let colorClass = "text-indigo-600";
  let bgClass = "bg-indigo-100";

  if (percentage === 100) {
    message = "Perfect Score!";
    subMessage = "You're a vocabulary master!";
    colorClass = "text-green-600";
    bgClass = "bg-green-100";
  } else if (percentage >= 80) {
    message = "Excellent!";
    subMessage = "You're doing great!";
    colorClass = "text-blue-600";
    bgClass = "bg-blue-100";
  } else if (percentage < 50) {
    message = "Don't give up!";
    subMessage = "Try again to memorize these words.";
    colorClass = "text-amber-600";
    bgClass = "bg-amber-100";
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100 p-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{message}</h2>
        <p className="text-slate-500 mb-10">{subMessage}</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
          
          {/* Custom SVG Circular Progress */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#e2e8f0"
                strokeWidth="16"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-1000 ease-out ${colorClass}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-4xl font-black ${colorClass}`}>{percentage}%</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4">
             <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100">
                <div className={`p-3 rounded-full ${bgClass} ${colorClass}`}>
                    <Trophy size={24} />
                </div>
                <div className="text-left">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold">Total Score</p>
                    <p className={`text-2xl font-bold ${colorClass}`}>{result.correct * 10} pts</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="bg-green-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-green-100">
                  <CheckCircle size={24} className="text-green-500 mb-2" />
                  <p className="text-2xl font-bold text-green-700">{result.correct}</p>
                  <p className="text-xs font-bold text-green-600">Correct</p>
               </div>

               <div className="bg-red-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-red-100">
                  {result.incorrect > 0 ? <Frown size={24} className="text-red-500 mb-2" /> : <Trophy size={24} className="text-red-400 mb-2" />}
                  <p className="text-2xl font-bold text-red-700">{result.incorrect}</p>
                  <p className="text-xs font-bold text-red-600">Review</p>
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={onRestart} className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-200">
                <RotateCcw size={20} />
                New Words
            </button>
            <button onClick={onHome} className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all">
                Change Topic
            </button>
        </div>
      </div>
    </div>
  );
};