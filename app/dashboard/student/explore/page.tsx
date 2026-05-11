import Sidebar from "@/components/dashboard/Sidebar";
import ExploreClient from "@/components/student/ExploreClient";
import { getExploreCourses } from "@/actions/courses";

export default async function StudentExplorePage() {
  const courses = await getExploreCourses();

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar />
      
      <main className="flex-grow p-10 ml-72">
        <ExploreClient initialCourses={courses} />
      </main>
    </div>
  );
}
