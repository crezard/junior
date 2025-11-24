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
    <div 
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full animate-fade-in-up group" 
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-4xl font-extrabold text-indigo-600 mb-2 tracking-tight group-hover:text-indigo-700">{word.word}</h3>
            <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-slate-500 font-mono text-sm">{word.pronunciation}</span>
          </div>
          <button 
            onClick={handlePlayAudio}
            className="p-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Play pronunciation"
          >
            <Volume2 size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meaning</div>
          <p className="text-2xl font-bold text-slate-800">{word.meaning}</p>
        </div>

        <div className="mt-auto bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Example</div>
          <p className="text-slate-800 font-medium text-lg leading-relaxed mb-2">"{word.exampleSentence}"</p>
          <p className="text-slate-500 text-sm border-t border-slate-200 pt-2">{word.exampleTranslation}</p>
        </div>
      </div>
      <div className="h-1 bg-indigo-500 w-0 group-hover:w-full transition-all duration-500"></div>
    </div>
  );
};