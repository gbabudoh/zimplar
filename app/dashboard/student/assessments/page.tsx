import Sidebar from "@/components/dashboard/Sidebar";
import AssessmentsClient from "@/components/student/AssessmentsClient";
import { getStudentAssessments } from "@/actions/assessments";

export default async function StudentAssessmentsPage() {
  const { active, history, stats } = await getStudentAssessments();

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar />
      
      <main className="flex-grow p-12 ml-72">
        <AssessmentsClient 
          initialActive={active} 
          initialHistory={history} 
          stats={stats} 
        />
      </main>
    </div>
  );
}
