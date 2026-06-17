"use client";

import React, { useState, useTransition } from "react";
import { Sparkles, RefreshCw, Eye, EyeOff, ClipboardCheck, BookOpen, Check, Loader2 } from "lucide-react";
import { generateClozeQuiz } from "@/lib/quiz-engine";
import { createAssessment } from "@/actions/assessments";

interface Course {
  id: string;
  title: string;
}

interface QuizGeneratorProps {
  courses: Course[];
}

export default function QuizGenerator({ courses }: QuizGeneratorProps) {
  const [inputText, setInputText] = useState("");
  const [quiz, setQuiz] = useState<{ question: string; answers: string[] } | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  // Publishing form state
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [type, setType] = useState<"QUIZ" | "EXAM" | "PROJECT">("QUIZ");
  const [dueDate, setDueDate] = useState("");
  const [publishStatus, setPublishStatus] = useState<"idle" | "success" | "error">("idle");
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    const result = generateClozeQuiz(inputText);
    setQuiz(result);
    setShowAnswers(false);
    setPublishStatus("idle");
    setTitle("Lecture Quiz"); // default title
    if (courses.length > 0) {
      setCourseId(courses[0].id); // default course
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId || !quiz) {
      setPublishStatus("error");
      setPublishError("Please fill out all required fields.");
      return;
    }

    setPublishError(null);
    startTransition(async () => {
      const res = await createAssessment({
        title,
        description: `Questions:\n${quiz.question}\n\nAnswer Key:\n${quiz.answers.join(", ")}`,
        type,
        dueDate: dueDate || undefined,
        courseId,
      });

      if (res.success) {
        setPublishStatus("success");
      } else {
        setPublishStatus("error");
        setPublishError(res.error || "Failed to publish assessment.");
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-z-red flex items-center justify-center shadow-xl shadow-z-red/20">
           <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
           <h2 className="text-3xl font-black text-zinc-800 tracking-tight leading-none">Smart Content Creator</h2>
           <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Convert notes to interactive quizzes instantly (NLP Offline engine)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-xl space-y-4">
             <div className="flex items-center space-x-2 px-2">
                <BookOpen className="w-4 h-4 text-z-red" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Input Teaching Notes</span>
             </div>
             <textarea 
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder="Paste your teaching materials here... (e.g. The Nigerian Civil War started in 1967 and ended in 1970.)"
               className="w-full h-80 bg-zinc-50/50 border border-zinc-200/60 rounded-2xl p-6 text-zinc-800 font-medium placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all resize-none text-sm leading-relaxed"
             />
             <button 
               onClick={handleGenerate}
               disabled={!inputText.trim()}
               className="w-full bg-z-red hover:bg-rose-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl shadow-z-red/20 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
             >
               <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
               <span>Generate Interactive Quiz</span>
             </button>
          </div>
        </div>

        {/* Output/Workspace Area */}
        <div className="space-y-6">
          {quiz ? (
            <div className="space-y-6">
              {/* Generated Quiz Card */}
              <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClipboardCheck className="w-5 h-5 text-z-red" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Generated Quiz Draft</span>
                  </div>
                  <button 
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="text-[10px] font-black text-z-red uppercase tracking-widest flex items-center space-x-1 hover:opacity-70 cursor-pointer"
                  >
                    {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAnswers ? "Hide Answers" : "Show Answers"}</span>
                  </button>
                </div>

                <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <p className="text-zinc-800 font-bold leading-relaxed whitespace-pre-wrap text-sm">
                    {quiz.question}
                  </p>
                </div>

                {showAnswers && (
                  <div className="pt-6 border-t border-zinc-200/50 space-y-3">
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

              {/* Publish Configuration */}
              <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-xl space-y-6">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-z-red" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Publish to Course</span>
                </div>

                {publishStatus === "success" ? (
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-800 uppercase tracking-widest font-black">Published Successfully</h4>
                      <p className="text-xs text-emerald-600 font-bold mt-1">This quiz is now active for enrolled students.</p>
                    </div>
                    <button
                      onClick={() => setPublishStatus("idle")}
                      className="text-[10px] font-black text-z-red uppercase tracking-widest hover:opacity-75 cursor-pointer"
                    >
                      Publish another instance
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePublish} className="space-y-4">
                    {publishStatus === "error" && publishError && (
                      <div className="p-4 bg-z-red/10 border border-z-red/20 rounded-xl text-xs font-black text-z-red uppercase tracking-widest">
                        {publishError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-2">Quiz Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. History Quiz 1"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          disabled={isPending}
                          className="w-full bg-zinc-50 border border-zinc-200/60 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all font-bold text-zinc-800 text-xs placeholder-zinc-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-2">Type</label>
                        <select 
                          value={type}
                          onChange={(e) => setType(e.target.value as any)}
                          disabled={isPending}
                          className="w-full bg-zinc-50 border border-zinc-200/60 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all font-bold text-zinc-800 text-xs appearance-none cursor-pointer"
                        >
                          <option value="QUIZ">Quiz</option>
                          <option value="EXAM">Exam</option>
                          <option value="PROJECT">Project</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-2">Target Course</label>
                        <select 
                          value={courseId}
                          onChange={(e) => setCourseId(e.target.value)}
                          disabled={isPending}
                          className="w-full bg-zinc-50 border border-zinc-200/60 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all font-bold text-zinc-800 text-xs appearance-none cursor-pointer"
                        >
                          {courses.length === 0 && <option value="">No courses available</option>}
                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>{course.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-2">Due Date (Optional)</label>
                        <input 
                          type="datetime-local" 
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          disabled={isPending}
                          className="w-full bg-zinc-50 border border-zinc-200/60 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all font-bold text-zinc-800 text-xs text-zinc-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-zinc-800 hover:bg-zinc-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-zinc-800/20 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-4"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Publishing Assessment...</span>
                        </>
                      ) : (
                        <span>Publish to Course</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-[2.5rem] border-2 border-dashed border-zinc-200/60 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
               <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-4 text-zinc-300">
                  <Sparkles className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-zinc-500 font-black text-xs uppercase tracking-widest">Awaiting Material</p>
                  <p className="text-zinc-400 text-[10px] font-bold max-w-[200px] mx-auto mt-2 leading-relaxed">
                     Provide lecture notes in the generator panel on the left to start building interactive assessments.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
