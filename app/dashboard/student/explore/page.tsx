"use client";

import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search, Filter, Clock, Star, Users, PlayCircle } from "lucide-react";

const categories = ["All", "Mathematics", "Science", "Technology", "Arts", "Language", "Business"];

const mockCourses = [
  {
    id: 1,
    title: "Advanced Algebra & Logic",
    category: "Mathematics",
    instructor: "Dr. Kwame Mensah",
    rating: 4.9,
    students: "1.2k",
    duration: "12h 30m",
    price: "Free",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    level: "Advanced",
    color: "bg-z-red"
  },
  {
    id: 2,
    title: "Introduction to Solar Physics",
    category: "Science",
    instructor: "Prof. Sarah Okafor",
    rating: 4.8,
    students: "850",
    duration: "8h 15m",
    price: "Premium",
    image: "https://images.unsplash.com/photo-1506467024213-aa69d518358d?auto=format&fit=crop&q=80&w=800",
    level: "Beginner",
    color: "bg-z-gold"
  },
  {
    id: 3,
    title: "Web Development Fundamentals",
    category: "Technology",
    instructor: "Eng. Chidi Obi",
    rating: 5.0,
    students: "2.5k",
    duration: "20h 45m",
    price: "Free",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    level: "Intermediate",
    color: "bg-z-blue"
  },
  {
    id: 4,
    title: "Global Business Ethics",
    category: "Business",
    instructor: "Amina Yusuf",
    rating: 4.7,
    students: "600",
    duration: "6h 20m",
    price: "Free",
    image: "https://images.unsplash.com/photo-1454165833767-0266b196773f?auto=format&fit=crop&q=80&w=800",
    level: "Intermediate",
    color: "bg-z-rose"
  },
  {
    id: 5,
    title: "Creative Writing Workshop",
    category: "Arts",
    instructor: "Elena Vance",
    rating: 4.9,
    students: "1.1k",
    duration: "10h 10m",
    price: "Free",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    level: "Beginner",
    color: "bg-z-gray"
  },
  {
    id: 6,
    title: "Basic Biology: Cells & Life",
    category: "Science",
    instructor: "Dr. David Smith",
    rating: 4.6,
    students: "920",
    duration: "9h 45m",
    price: "Free",
    image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800",
    level: "Beginner",
    color: "bg-z-blue"
  }
];

export default function StudentExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar />
      
      <main className="flex-grow p-10 ml-72">
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
                  className="w-full bg-white border border-zinc-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all shadow-sm"
                />
              </div>
              <button className="bg-white border border-zinc-200 p-3 rounded-2xl hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer">
                <Filter className="w-6 h-6 text-z-red" />
              </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <div 
                key={course.id}
                className="group bg-white rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Thumbnail Area */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={course.image} 
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase text-white tracking-widest ${course.color}`}>
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg">
                     <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-black text-zinc-800">{course.rating}</span>
                     </div>
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
                        <span className="text-[10px] font-bold">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-zinc-400">
                        <Users className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{course.students}</span>
                      </div>
                    </div>
                    
                    <span className={`text-xs font-black ${course.price === 'Free' ? 'text-emerald-500' : 'text-z-gold'}`}>
                      {course.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
