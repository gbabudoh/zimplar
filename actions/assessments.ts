"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function getStudentAssessments() {
  const session = await auth();
  if (!session?.user?.id) return { active: [], history: [], stats: { gpa: "0.0", completed: 0, pending: 0 } };

  try {
    const db = prisma as unknown as { 
      assessment: { findMany: (a: unknown) => Promise<unknown[]> },
      assignment: { findMany: (a: unknown) => Promise<unknown[]> },
      submission: { findMany: (a: unknown) => Promise<unknown[]>, count: (a: unknown) => Promise<number> },
      course: { findUnique: (a: unknown) => Promise<unknown> }
    };

    // 1. Fetch Active Assessments (Quizzes/Exams)
    const assessments = await db.assessment.findMany({
      where: {
        course: {
          enrollments: { some: { userId: session.user.id } }
        },
        dueDate: { gt: new Date() }
      },
      include: {
        course: { select: { title: true } },
        submissions: { where: { studentId: session.user.id } }
      }
    });

    // 2. Fetch Active Assignments
    const assignments = await db.assignment.findMany({
      where: {
        lesson: {
          course: {
            enrollments: { some: { userId: session.user.id } }
          }
        },
        createdAt: { gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      },
      include: {
        lesson: { include: { course: { select: { title: true } } } },
        submissions: { where: { studentId: session.user.id } }
      }
    });

    // 3. Fetch Grade History
    const history = await db.submission.findMany({
      where: {
        studentId: session.user.id,
        status: "GRADED"
      },
      include: {
        assignment: { include: { lesson: { include: { course: { select: { title: true } } } } } },
        assessment: { include: { course: { select: { title: true } } } }
      },
      orderBy: { updatedAt: "desc" }
    });

    // 4. Calculate Stats
    const completedCount = await db.submission.count({
      where: { studentId: session.user.id, status: "GRADED" }
    });
    
    const pendingCount = (assessments.length + assignments.length) - (await db.submission.count({
        where: { studentId: session.user.id, status: "PENDING" }
    }));

    interface AssessmentResult { id: string; title: string; type: string; dueDate: Date | null; course: { title: string }; submissions: unknown[] }
    interface AssignmentResult { id: string; title: string; lesson: { course: { title: string } }; submissions: unknown[] }
    interface HistoryResult { id: string; grade: string | null; updatedAt: Date; assignment?: { title: string; lesson: { course: { title: string } } }; assessment?: { title: string; course: { title: string } } }

    return {
      active: [
        ...(assessments as unknown as AssessmentResult[]).map(a => ({
          id: a.id,
          title: a.title,
          course: a.course.title,
          deadline: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "No Deadline",
          type: a.type,
          status: a.submissions.length > 0 ? "Submitted" : "Pending",
          timeRemaining: calculateTimeRemaining(a.dueDate),
          color: "text-amber-500",
          bg: "bg-amber-500/10"
        })),
        ...(assignments as unknown as AssignmentResult[]).map(a => ({
          id: a.id,
          title: a.title,
          course: a.lesson.course.title,
          deadline: "TBA",
          type: "Assignment",
          status: a.submissions.length > 0 ? "Submitted" : "Pending",
          timeRemaining: "Ongoing",
          color: "text-blue-500",
          bg: "bg-blue-500/10"
        }))
      ],
      history: (history as unknown as HistoryResult[]).map(h => ({
        id: h.id,
        title: h.assignment?.title || h.assessment?.title || "Unknown Task",
        course: h.assignment?.lesson.course.title || h.assessment?.course.title || "General",
        grade: h.grade || "N/A",
        percentage: parseInt(h.grade || "0") || 0,
        date: new Date(h.updatedAt).toLocaleDateString(),
        status: "Completed"
      })),
      stats: {
        gpa: "3.5",
        completed: completedCount,
        pending: Math.max(0, pendingCount)
      }
    };
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
    return { active: [], history: [], stats: { gpa: "0.0", completed: 0, pending: 0 } };
  }
}

function calculateTimeRemaining(dueDate: Date | null) {
  if (!dueDate) return "N/A";
  const now = new Date();
  const diff = new Date(dueDate).getTime() - now.getTime();
  if (diff < 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days} days`;
}
