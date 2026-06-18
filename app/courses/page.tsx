"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import { Search, Clock, Users, ArrowRight, BookOpen } from "lucide-react";
import { getExploreCourses } from "@/actions/courses";

interface ExploreCourse {
  id: string;
  title: string;
  category: string;
  instructor: string;
  students: number;
  lessons: number;
  image: string | null;
  color: string;
}

const PAGE_SIZE = 6;

const CoursesPage = () => {
  const [courses, setCourses] = useState<ExploreCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    async function loadCourses() {
      const data = await getExploreCourses();
      setCourses(data);
      setLoading(false);
    }
    loadCourses();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.category))).sort();
    return ["All", ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchTerm]);

  const visibleCourses = filteredCourses.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />

      {/* Background Decorative Elemets */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-z-blue/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-z-rose/20 rounded-full blur-3xl -z-10"></div>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-z-red tracking-tight leading-none">
              Explore <br />
              <span className="text-z-blue filter brightness-90">Knowledge</span>
            </h1>
            <p className="text-z-gray text-lg font-medium max-w-md">
              Discover a world of high-quality courses designed for the future of learners in Africa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-grow md:w-80">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-z-gray group-focus-within:text-z-red transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="w-full bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Categories Scroller */}
        {categories.length > 1 && (
          <div className="flex items-center space-x-3 overflow-x-auto pb-4 mb-12 scrollbar-none no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border-2 cursor-pointer ${
                  selectedCategory === cat
                  ? "bg-z-red border-z-red text-white shadow-lg shadow-z-red/20 scale-105"
                  : "bg-white/40 border-z-blue/10 text-z-gray hover:border-z-red/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-z-red/20 border-t-z-red rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-black text-z-gray uppercase tracking-widest">Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleCourses.map((course) => (
                <Link
                  key={course.id}
                  href="/signup"
                  className="group bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* Thumbnail Area */}
                  <div className="relative h-60 w-full overflow-hidden bg-zinc-100">
                    {course.image ? (
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className={`absolute inset-0 flex items-center justify-center ${course.color}`}>
                        <BookOpen className="w-16 h-16 text-white/60" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-widest ${course.color}`}>
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-grow relative">
                    <div className="mb-4">
                      <p className="text-z-gray text-xs font-bold uppercase tracking-thighter mb-1">{course.instructor}</p>
                      <h3 className="text-xl font-black text-z-red group-hover:text-z-blue transition-colors leading-tight">
                        {course.title}
                      </h3>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-z-blue/10">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5 text-z-gray">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-bold tracking-tighter">{course.lessons} Lessons</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-z-gray">
                          <Users className="w-4 h-4" />
                          <span className="text-xs font-bold tracking-tighter">{course.students}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Link */}
                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                       <div className="bg-z-red p-2 rounded-lg shadow-lg">
                          <ArrowRight className="w-5 h-5 text-white" />
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {visibleCount < filteredCourses.length && (
              <div className="mt-16 text-center">
                 <button
                   onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                   className="px-12 py-5 bg-white border-2 border-z-blue/20 rounded-3xl font-black text-z-red hover:bg-z-blue/5 hover:border-z-red/30 transition-all shadow-xl shadow-z-blue/5 cursor-pointer transform hover:-translate-y-1 active:scale-95"
                 >
                    LOAD MORE COURSES
                 </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <BookOpen className="w-12 h-12 text-z-blue/30 mx-auto mb-4" />
            <p className="text-lg font-black text-z-gray">No courses found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursesPage;
