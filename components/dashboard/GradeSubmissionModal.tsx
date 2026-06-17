"use client";

import React, { useState, useEffect, useTransition } from "react";
import { X, Loader2, Award, Download } from "lucide-react";
import { gradeSubmission } from "@/actions/grading";

interface SubmissionDetail {
  id: string;
  studentName: string;
  courseTitle: string;
  taskTitle: string;
  fileUrl: string;
  grade?: string | null;
  feedback?: string | null;
}

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionDetail | null;
}

export default function GradeSubmissionModal({
  isOpen,
  onClose,
  submission,
}: GradeSubmissionModalProps) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (submission) {
      setGrade(submission.grade || "");
      setFeedback(submission.feedback || "");
    } else {
      setGrade("");
      setFeedback("");
    }
    setError(null);
  }, [submission]);

  if (!isOpen || !submission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade.trim()) {
      setError("Please specify a grade or score");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await gradeSubmission({
        submissionId: submission.id,
        grade,
        feedback: feedback || undefined,
      });

      if (res.success) {
        onClose();
      } else {
        setError(res.error || "Failed to submit grade");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 max-w-xl w-full border border-white premium-shadow animate-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute top-8 right-8 text-zinc-400 hover:text-z-red transition-colors p-2 hover:bg-zinc-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-z-red/10 rounded-2xl flex items-center justify-center text-z-red">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-zinc-800 tracking-tight leading-none">
              Grade Submission
            </h3>
            <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">
              Reviewer Suite
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">
                Student
              </p>
              <p className="text-sm font-black text-zinc-800">
                {submission.studentName}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">
                Course
              </p>
              <p className="text-sm font-black text-z-red truncate">
                {submission.courseTitle}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200/50">
            <div>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">
                Task Title
              </p>
              <p className="text-sm font-bold text-zinc-800 truncate">
                {submission.taskTitle}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">
                Submission File
              </p>
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-black text-z-red hover:underline mt-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">
                  {submission.fileUrl.split("/").pop() || "View File"}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-z-red/10 border border-z-red/20 rounded-2xl text-xs font-black text-z-red uppercase tracking-widest">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">
              Grade / Score
            </label>
            <input
              type="text"
              placeholder="e.g., A+, 95, Pass"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              disabled={isPending}
              className="w-full bg-slate-50 border border-zinc-200/60 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all font-bold text-zinc-800 placeholder-zinc-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">
              Feedback Comments
            </label>
            <textarea
              rows={4}
              placeholder="Provide constructive review comments for the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={isPending}
              className="w-full bg-slate-50 border border-zinc-200/60 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all font-medium text-zinc-700 placeholder-zinc-400 text-sm leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-4 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-4 bg-z-red text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-z-red/90 transition-all shadow-xl shadow-z-red/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Publish Grade</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
