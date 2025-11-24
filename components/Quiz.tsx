import React, { useState, useEffect } from 'react';
import { VocabWord, QuizResult } from '../types';
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { playPronunciation } from '../services/geminiService';

interface QuizProps {
  words: VocabWord[];
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ words, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [history, setHistory] = useState<{ word: string; isCorrect: boolean }[]>([]);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (!currentWord) return;

    // Generate random options from other words
    const otherMeanings = words
      .filter(w => w.word !== currentWord.word)
      .map(w => w.meaning);
    
    // Shuffle and pick 3 wrong answers
    const wrongOptions = otherMeanings.sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [...wrongOptions, currentWord.meaning].sort(() => 0.5 - Math.random());
    
    setOptions(allOptions);
    setSelectedOption(null);
    setIsCorrect(null);
    playPronunciation(currentWord.word); // Auto-play audio on new card
  }, [currentIndex, words, currentWord]);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // Prevent double clicking

    setSelectedOption(option);
    const correct = option === currentWord.meaning;
    setIsCorrect(correct);
    
    setHistory(prev => [...prev, { word: currentWord.word, isCorrect: correct }]);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const correctCount = history.filter(h => h.isCorrect).length + (isCorrect ? 1 : 0);
      onComplete({
        total: words.length,
        correct: correctCount,
        incorrect: words.length - correctCount,
        history: [...history, { word: currentWord.word, isCorrect: !!isCorrect }]
      });
    }
  };

  if (!currentWord) return <div>Loading quiz...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <span className="font-bold text-lg">Quiz {currentIndex + 1} / {words.length}</span>
          <button onClick={onExit} className="text-white/80 hover:text-white text-sm">Exit</button>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-4xl font-bold text-indigo-900 mb-8">{currentWord.word}</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {options.map((option, idx) => {
              let btnClass = "p-4 rounded-xl text-lg font-medium transition-all duration-200 border-2 text-left ";
              
              if (selectedOption === null) {
                btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700";
              } else if (option === currentWord.meaning) {
                btnClass += "bg-green-100 border-green-500 text-green-800";
              } else if (option === selectedOption && option !== currentWord.meaning) {
                btnClass += "bg-red-100 border-red-500 text-red-800";
              } else {
                btnClass += "bg-slate-50 border-slate-100 text-slate-400";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                  className={btnClass}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {selectedOption !== null && option === currentWord.meaning && <CheckCircle size={20} />}
                    {selectedOption === option && option !== currentWord.meaning && <XCircle size={20} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedOption && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              {currentIndex === words.length - 1 ? "Finish" : "Next"} <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};