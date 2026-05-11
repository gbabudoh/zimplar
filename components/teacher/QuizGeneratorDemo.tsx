"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, Eye, EyeOff, ClipboardCheck, BookOpen } from "lucide-react";
import { generateClozeQuiz } from "@/lib/quiz-engine";

export default function QuizGeneratorDemo() {
  const [inputText, setInputText] = useState("");
  const [quiz, setQuiz] = useState<{ question: string; answers: string[] } | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    const result = generateClozeQuiz(inputText);
    setQuiz(result);
    setShowAnswers(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-z-red flex items-center justify-center shadow-xl shadow-z-red/20">
           <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
           <h2 className="text-2xl font-black text-white tracking-tight">Smart Content Creator</h2>
           <p className="text-zinc-500 font-bold text-sm">Convert notes to interactive quizzes instantly (No LLM / Private)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-4">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 space-y-4">
             <div className="flex items-center space-x-2 px-2">
                <BookOpen className="w-4 h-4 text-z-red" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Input Lecture Notes</span>
             </div>
             <textarea 
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder="Paste your teaching materials here... (e.g. The Nigerian Civil War started in 1967 and ended in 1970.)"
               className="w-full h-64 bg-black/40 border border-white/5 rounded-2xl p-4 text-white font-medium placeholder:text-zinc-700 focus:outline-none focus:border-z-red/50 transition-colors resize-none"
             />
             <button 
               onClick={handleGenerate}
               disabled={!inputText.trim()}
               className="w-full bg-z-red hover:bg-rose-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl shadow-z-red/20 transition-all flex items-center justify-center space-x-2 group"
             >
               <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
               <span>Generate Interactive Quiz</span>
             </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
           {quiz ? (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-500">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                       <ClipboardCheck className="w-5 h-5 text-z-red" />
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Generated Quiz</span>
                    </div>
                    <button 
                      onClick={() => setShowAnswers(!showAnswers)}
                      className="text-[10px] font-black text-z-red uppercase tracking-widest flex items-center space-x-1 hover:opacity-70"
                    >
                      {showAnswers ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showAnswers ? "Hide Answers" : "Show Answers"}</span>
                    </button>
                 </div>

                 <div className="prose prose-zinc">
                    <p className="text-zinc-800 font-bold leading-relaxed whitespace-pre-wrap">
                       {quiz.question}
                    </p>
                 </div>

                 {showAnswers && (
                    <div className="pt-6 border-t border-zinc-100 space-y-3">
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Answer Key</p>
                       <div className="flex flex-wrap gap-2">
                          {quiz.answers.map((ans, i) => (
                             <span key={i} className="bg-z-red/10 text-z-red px-3 py-1.5 rounded-full text-xs font-black">
                                {ans}
                             </span>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
           ) : (
              <div className="h-full bg-zinc-900/20 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white/10" />
                 </div>
                 <div>
                    <p className="text-white/40 font-black text-xs uppercase tracking-widest">Awaiting Content</p>
                    <p className="text-white/20 text-[10px] font-bold max-w-[200px] mx-auto mt-2">
                       Once you paste your notes and click generate, the quiz will appear here.
                    </p>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
