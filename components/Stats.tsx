import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { QuizResult } from '../types';
import { Trophy, Frown, CheckCircle } from 'lucide-react';

interface StatsProps {
  result: QuizResult;
  onRestart: () => void;
  onHome: () => void;
}

export const Stats: React.FC<StatsProps> = ({ result, onRestart, onHome }) => {
  const data = [
    { name: 'Correct', value: result.correct },
    { name: 'Incorrect', value: result.incorrect },
  ];

  const COLORS = ['#4f46e5', '#ef4444']; // Indigo-600, Red-500

  const percentage = Math.round((result.correct / result.total) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
        <p className="text-slate-500 mb-8">Here is how you performed</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
          <div className="w-full md:w-1/2 h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4">
             <div className="bg-indigo-50 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                    <Trophy size={24} />
                </div>
                <div className="text-left">
                    <p className="text-sm text-indigo-600 font-semibold">Score</p>
                    <p className="text-2xl font-bold text-indigo-900">{percentage}%</p>
                </div>
             </div>

             <div className="bg-green-50 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <CheckCircle size={24} />
                </div>
                <div className="text-left">
                    <p className="text-sm text-green-600 font-semibold">Correct Answers</p>
                    <p className="text-2xl font-bold text-green-900">{result.correct} / {result.total}</p>
                </div>
             </div>

             {result.incorrect > 0 && (
                <div className="bg-red-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <Frown size={24} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm text-red-600 font-semibold">To Review</p>
                        <p className="text-2xl font-bold text-red-900">{result.incorrect}</p>
                    </div>
                </div>
             )}
          </div>
        </div>

        <div className="flex justify-center gap-4">
            <button onClick={onRestart} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Take New Quiz
            </button>
            <button onClick={onHome} className="px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 transition-colors">
                Back to Topics
            </button>
        </div>
      </div>
    </div>
  );
};