"use client";

import React, { useState, useTransition } from "react";
import { X, Loader2, Video } from "lucide-react";
import { createClassroom } from "@/actions/classrooms";

interface Course {
  id: string;
  title: string;
}

interface InitializeRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
}

export default function InitializeRoomModal({
  isOpen,
  onClose,
  courses,
}: InitializeRoomModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Classroom name is required");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await createClassroom({
        name,
        description: description || undefined,
        courseId: courseId || undefined,
      });

      if (res.success) {
        setName("");
        setDescription("");
        setCourseId("");
        onClose();
      } else {
        setError(res.error || "Failed to initialize classroom");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 max-w-xl w-full border border-white premium-shadow animate-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-zinc-400 hover:text-z-red transition-colors p-2 hover:bg-zinc-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-z-red/10 rounded-2xl flex items-center justify-center text-z-red">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-zinc-800 tracking-tight leading-none">
              Initialize Classroom
            </h3>
            <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">
              Live Learning Node
            </p>
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
              Classroom Name
            </label>
            <input
              type="text"
              placeholder="e.g., Room Logic-A, Quantum Lab 01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="w-full bg-slate-50 border border-zinc-200/60 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all font-bold text-zinc-800 placeholder-zinc-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide a brief context or notes for this cohort..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className="w-full bg-slate-50 border border-zinc-200/60 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all font-medium text-zinc-700 placeholder-zinc-400 text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">
              Linked Course
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={isPending}
              className="w-full bg-slate-50 border border-zinc-200/60 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all font-bold text-zinc-800 appearance-none cursor-pointer"
            >
              <option value="">-- Select Linked Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
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
                  <span>Initializing...</span>
                </>
              ) : (
                <span>Initialize Room</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
