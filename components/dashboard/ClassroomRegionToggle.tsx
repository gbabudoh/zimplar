"use client";

import { useState } from "react";
import { setClassroomRegion } from "@/actions/classrooms";

export default function ClassroomRegionToggle({
  classroomId,
  regionType,
}: {
  classroomId: string;
  regionType: "URBAN" | "RURAL";
}) {
  const [pending, setPending] = useState(false);
  const isRural = regionType === "RURAL";

  const toggle = async () => {
    setPending(true);
    try {
      await setClassroomRegion(classroomId, isRural ? "URBAN" : "RURAL");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
        isRural ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
      }`}
    >
      {isRural ? "Rural" : "Urban"}
    </button>
  );
}
