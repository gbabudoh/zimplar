"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Clock, Users, BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  students: number;
  lessons: number;
  image: string | null;
  color: string;
}

export default function ExploreClient({ initialCourses }: { initialCourses: Course[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(initialCourses.map((c) => c.category))).sort();
    return ["All", ...unique];
  }, [initialCourses]);

  const filteredCourses = initialCourses.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-zinc-800 tracking-tight leading-none">
            Explore <span className="text-z-blue">Knowledge</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-md">
            Discover high-quality courses designed for your growth.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-grow md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-z-red transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === cat 
              ? "bg-z-red border-z-red text-white shadow-lg shadow-z-red/20" 
              : "bg-white border-zinc-200 text-zinc-500 hover:border-z-red/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-20 text-center space-y-6 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-zinc-200">
           <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-zinc-300" />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black text-zinc-800">No courses found</h3>
              <p className="text-zinc-500 font-medium">Try adjusting your search or category filters.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Thumbnail Area */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                {course.image ? (
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className={`absolute inset-0 flex items-center justify-center ${course.color}`}>
                    <BookOpen className="w-12 h-12 text-white/60" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase text-white tracking-widest ${course.color}`}>
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="mb-4">
                  <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">{course.instructor}</p>
                  <h3 className="text-lg font-black text-zinc-800 group-hover:text-z-red transition-colors leading-tight line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-zinc-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-bold">{course.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center space-x-1 text-zinc-400">
                      <Users className="w-3 h-3" />
                      <span className="text-[10px] font-bold">{course.students}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
