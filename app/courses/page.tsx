"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import { Search, Filter, Clock, Star, Users, ArrowRight, PlayCircle } from "lucide-react";

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

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

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
                className="w-full bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all shadow-sm"
              />
            </div>
            <button className="bg-white border border-z-blue/20 p-4 rounded-2xl hover:bg-z-blue/10 transition-colors shadow-sm cursor-pointer">
              <Filter className="w-6 h-6 text-z-red" />
            </button>
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 mb-12 scrollbar-none no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCourses.map((course) => (
            <div 
              key={course.id}
              className="group bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Thumbnail Area */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image 
                  src={course.image} 
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white opacity-80" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-widest ${course.color}`}>
                    {course.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/50">
                   <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black text-z-red">{course.rating}</span>
                   </div>
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
                      <span className="text-xs font-bold tracking-tighter">{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-z-gray">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-bold tracking-tighter">{course.students}</span>
                    </div>
                  </div>
                  
                  <span className={`text-sm font-black ${course.price === 'Free' ? 'text-green-500' : 'text-z-gold'}`}>
                    {course.price}
                  </span>
                </div>

                {/* Hover Link */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                   <div className="bg-z-red p-2 rounded-lg shadow-lg">
                      <ArrowRight className="w-5 h-5 text-white" />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button Placeholder */}
        <div className="mt-16 text-center">
           <button className="px-12 py-5 bg-white border-2 border-z-blue/20 rounded-3xl font-black text-z-red hover:bg-z-blue/5 hover:border-z-red/30 transition-all shadow-xl shadow-z-blue/5 cursor-pointer transform hover:-translate-y-1 active:scale-95">
              LOAD MORE INSIGHTS
           </button>
        </div>
      </main>
    </div>
  );
};

export default CoursesPage;
