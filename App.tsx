import React, { useState, useEffect } from 'react';
import { VocabWord, AppMode, TOPICS, QuizResult } from './types';
import { generateVocabulary } from './services/geminiService';
import { WordCard } from './components/WordCard';
import { Quiz } from './components/Quiz';
import { Stats } from './components/Stats';
import { BookOpen, GraduationCap, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<string>(TOPICS[0]);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.LEARN);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Function to load words
  const loadWords = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateVocabulary(topic);
      if (data && data.length > 0) {
        setWords(data);
      } else {
        throw new Error("No words generated.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate words. Please check your API Key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadWords(currentTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTopic = e.target.value;
    setCurrentTopic(newTopic);
    setMode(AppMode.LEARN);
    loadWords(newTopic);
  };

  const handleStartQuiz = () => {
    setMode(AppMode.QUIZ);
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setMode(AppMode.STATS);
  };

  const handleRestart = () => {
    setMode(AppMode.LEARN);
    loadWords(currentTopic); // Get fresh words for a new round? Or keep same? Let's refresh to keep it dynamic
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BookOpen size={24} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Junior Vocab<span className="text-indigo-600">Master</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             {mode === AppMode.LEARN && (
               <div className="hidden sm:flex items-center gap-2">
                 <label htmlFor="topic-select" className="text-sm font-medium text-slate-600">Topic:</label>
                 <select 
                   id="topic-select"
                   value={currentTopic} 
                   onChange={handleTopicChange}
                   disabled={isLoading}
                   className="form-select text-sm border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1.5"
                 >
                   {TOPICS.map(t => (
                     <option key={t} value={t}>{t}</option>
                   ))}
                 </select>
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle size={24} />
              <p>{error}</p>
              <button onClick={() => loadWords(currentTopic)} className="ml-auto text-sm font-bold hover:underline">Retry</button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 animate-pulse font-medium">Gemini AI is creating your lesson...</p>
            </div>
          )}

          {/* Learn Mode */}
          {!isLoading && !error && mode === AppMode.LEARN && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">{currentTopic}</h2>
                   <p className="text-slate-500 mt-1">Middle School Year 1 Vocabulary</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                        onClick={() => loadWords(currentTopic)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <RefreshCw size={18} /> Refresh Words
                    </button>
                    <button 
                        onClick={handleStartQuiz}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <GraduationCap size={20} /> Start Quiz
                    </button>
                </div>
              </div>

              {/* Mobile Topic Selector (Visible only on small screens) */}
              <div className="sm:hidden mb-6">
                 <select 
                   value={currentTopic} 
                   onChange={handleTopicChange}
                   className="w-full text-base border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2"
                 >
                   {TOPICS.map(t => (
                     <option key={t} value={t}>{t}</option>
                   ))}
                 </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {words.map((word, index) => (
                  <WordCard key={index} word={word} index={index} />
                ))}
              </div>
              
              <div className="mt-12 text-center text-slate-400 text-sm flex items-center justify-center gap-1">
                 <Sparkles size={14} /> Powered by Google Gemini 2.5
              </div>
            </>
          )}

          {/* Quiz Mode */}
          {!isLoading && mode === AppMode.QUIZ && (
            <Quiz 
              words={words} 
              onComplete={handleQuizComplete} 
              onExit={() => setMode(AppMode.LEARN)} 
            />
          )}

          {/* Stats Mode */}
          {!isLoading && mode === AppMode.STATS && quizResult && (
            <Stats 
              result={quizResult} 
              onRestart={handleRestart} 
              onHome={() => setMode(AppMode.LEARN)} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;