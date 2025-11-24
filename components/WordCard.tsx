import React from 'react';
import { Volume2 } from 'lucide-react';
import { VocabWord } from '../types';
import { playPronunciation } from '../services/geminiService';

interface WordCardProps {
  word: VocabWord;
  index: number;
}

export const WordCard: React.FC<WordCardProps> = ({ word, index }) => {
  const handlePlayAudio = async () => {
    await playPronunciation(word.word);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-slate-100 p-6 flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-3xl font-bold text-indigo-700 mb-1">{word.word}</h3>
          <span className="text-slate-500 font-mono text-sm">{word.pronunciation}</span>
        </div>
        <button 
          onClick={handlePlayAudio}
          className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Play pronunciation"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-1">의미 (Meaning)</h4>
        <p className="text-slate-600 text-lg">{word.meaning}</p>
      </div>

      <div className="mt-auto bg-slate-50 rounded-lg p-4 border border-slate-100">
        <p className="text-slate-700 italic mb-2">"{word.exampleSentence}"</p>
        <p className="text-slate-500 text-sm border-t border-slate-200 pt-2 mt-2">{word.exampleTranslation}</p>
      </div>
    </div>
  );
};