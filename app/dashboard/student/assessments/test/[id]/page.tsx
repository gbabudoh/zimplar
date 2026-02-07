"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Save,
  Flag
} from "lucide-react";
import AIProctor from "@/components/video/AIProctor";

// Mock Exam Data
const examData = {
  id: "EX-2024-001",
  title: "Advanced Logic & Reasoning Finals",
  course: "Logic 101",
  durationMinutes: 45,
  totalQuestions: 5,
  questions: [
    {
      id: 1,
      text: "Which of the following is NOT a fundamental law of classical logic?",
      options: [
        "Law of Identity",
        "Law of Non-Contradiction",
        "Law of Excluded Middle",
        "Law of Infinite Regress"
      ]
    },
    {
      id: 2,
      text: "If P implies Q, and Q is false, what can we conclude about P?",
      options: [
        "P must be True",
        "P must be False",
        "P is Undetermined",
        "P is both True and False"
      ]
    },
    {
      id: 3,
      text: "In a valid deductive argument, if the premises are true, the conclusion must be:",
      options: [
        "False",
        "Probable",
        "True",
        "Uncertain"
      ]
    },
    {
      id: 4,
      text: "Who is considered the father of formal logic?",
      options: [
        "Plato",
        "Socrates",
        "Aristotle",
        "Descartes"
      ]
    },
    {
      id: 5,
      text: "What prevents the 'Liar Paradox' ('This statement is false') from having a truth value?",
      options: [
        "Self-Reference",
        "Restricted Syntax",
        "Binary Limitations",
        "All of the above"
      ]
    }
  ]
};

export default function TestInterfacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(examData.durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 2000);
  };

  // Timer Logic
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOptionSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };


  const handleAIAlert = (type: string, severity: string) => {
    console.warn(`[AI PROCTOR] Alert: ${type} - Severity: ${severity}`);
    // In production, push this to a server log associated with the attempt
  };

  // Completion View
  if (isCompleted) {
    return (
      <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-8 text-center">
        <div className="glass-card p-12 rounded-[3.5rem] max-w-2xl w-full shadow-2xl flex flex-col items-center animate-in zoom-in duration-500">
           <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 text-emerald-500">
              <CheckCircle2 className="w-10 h-10" />
           </div>
           <h1 className="text-4xl font-black text-zinc-800 tracking-tighter mb-4">Exam Submitted!</h1>
           <p className="text-zinc-500 font-medium mb-12 max-w-md mx-auto">
             Your responses have been securely recorded. The AI Integrity report verified your session as 
             <span className="text-emerald-600 font-black ml-1">Valid</span>.
           </p>
           
           <div className="grid grid-cols-2 gap-6 w-full mb-12">
              <div className="bg-zinc-50 p-6 rounded-3xl">
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Time Taken</p>
                 <p className="text-2xl font-black text-zinc-800">32m 45s</p>
              </div>
              <div className="bg-zinc-50 p-6 rounded-3xl">
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Questions Answered</p>
                 <p className="text-2xl font-black text-zinc-800">{Object.keys(answers).length}/{examData.totalQuestions}</p>
              </div>
           </div>

           <Link href="/dashboard/student/assessments">
              <button className="px-10 py-4 bg-z-red text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-z-red/20">
                 Return to Hub
              </button>
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-z-red selection:text-white">
       {/* AI Proctoring Layer */}
       <AIProctor onAlert={handleAIAlert} />

       {/* Focus Header */}
       <header className="fixed top-0 inset-x-0 h-24 bg-white/80 backdrop-blur-md border-b border-zinc-200/50 z-40 flex items-center justify-between px-12">
         <div className="flex items-center space-x-6">
            <div className="bg-z-red w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm">
               Z
            </div>
            <div>
               <h1 className="text-lg font-black text-zinc-800 tracking-tight">{examData.title}</h1>
               <p className="text-xs font-bold text-zinc-400">{examData.course} • ID: {id}</p>
            </div>
         </div>

         <div className="flex items-center space-x-8">
            <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border transition-colors ${timeLeft < 300 ? 'bg-red-50 border-red-100 text-red-600 animate-pulse' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>
               <Clock className="w-5 h-5" />
               <span className="text-xl font-black tracking-tight tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-400">
               <span className="text-[10px] font-black uppercase tracking-widest">Proctoring Active</span>
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
         </div>
       </header>

       {/* Main Exam Area */}
       <main className="flex-grow pt-32 pb-32 px-12 max-w-6xl mx-auto w-full flex flex-col justify-center">
          
          {/* Progress Bar */}
          <div className="mb-12">
             <div className="flex justify-between items-end mb-4">
               <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Question {currentQuestion + 1} of {examData.totalQuestions}</span>
               <span className="text-[10px] font-black text-z-red uppercase tracking-widest">{Math.round(((currentQuestion + 1) / examData.totalQuestions) * 100)}% Completed</span>
             </div>
             <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-z-red transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestion + 1) / examData.totalQuestions) * 100}%` }}
                ></div>
             </div>
          </div>

          {/* Question Card */}
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-zinc-100 min-h-[400px] flex flex-col justify-between relative overflow-hidden group">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-z-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10">
                <h2 className="text-3xl font-black text-zinc-800 leading-tight mb-12">
                   {examData.questions[currentQuestion].text}
                </h2>

                <div className="space-y-4">
                   {examData.questions[currentQuestion].options.map((option, idx) => {
                      const isSelected = answers[currentQuestion] === option;
                      return (
                         <button
                           key={idx}
                           onClick={() => handleOptionSelect(option)}
                           className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group/opt ${isSelected ? 'border-z-red bg-z-red/5 shadow-lg shadow-z-red/10' : 'border-zinc-100 bg-white hover:border-zinc-300 hover:bg-zinc-50'}`}
                         >
                            <div className="flex items-center space-x-6">
                               <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-colors ${isSelected ? 'border-z-red bg-z-red text-white' : 'border-zinc-200 text-zinc-400 group-hover/opt:border-zinc-400'}`}>
                                  {String.fromCharCode(65 + idx)}
                               </div>
                               <span className={`text-lg font-bold ${isSelected ? 'text-zinc-800' : 'text-zinc-500'}`}>{option}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-6 h-6 text-z-red animate-in zoom-in duration-200" />}
                         </button>
                      );
                   })}
                </div>
             </div>
          </div>
       </main>

       {/* Navigation Footer */}
       <footer className="fixed bottom-0 inset-x-0 h-24 bg-white/80 backdrop-blur-md border-t border-zinc-200/50 z-40 flex items-center justify-between px-12">
          <div className="flex items-center space-x-4">
             <button className="flex items-center space-x-2 text-zinc-400 hover:text-z-red transition-colors px-4 py-2">
                <Flag className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Mark for Review</span>
             </button>
          </div>

          <div className="flex items-center space-x-6">
             <button 
               onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
               disabled={currentQuestion === 0}
               className="px-6 py-3 rounded-xl font-bold text-zinc-500 hover:text-zinc-800 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors flex items-center space-x-2"
             >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
             </button>

             {currentQuestion < examData.questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentQuestion(prev => Math.min(examData.questions.length - 1, prev + 1))}
                  className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl flex items-center space-x-3"
                >
                   <span>Next Question</span>
                   <ChevronRight className="w-4 h-4" />
                </button>
             ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-z-red text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-z-red/20 flex items-center space-x-3"
                >
                   {isSubmitting ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <Save className="w-4 h-4" />
                   )}
                   <span>{isSubmitting ? 'Submitting...' : 'Submit Exam'}</span>
                </button>
             )}
          </div>
       </footer>
    </div>
  );
}
