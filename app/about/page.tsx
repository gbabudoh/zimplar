"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import { GraduationCap, Target, Users, Globe, ShieldCheck, Zap, Heart, ArrowRight } from "lucide-react";

const values = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Accessibility",
    description: "Removing barriers to education for every student in Africa, regardless of their location or bandwidth.",
    color: "bg-z-red"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community",
    description: "Building a supportive ecosystem where teachers and students thrive together through shared knowledge.",
    color: "bg-z-blue"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Innovation",
    description: "Leveraging cutting-edge technology to optimize learning for real-world impact and future readiness.",
    color: "bg-z-gold"
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Quality",
    description: "Curating world-class educational content that meets global standards while remaining locally relevant.",
    color: "bg-z-rose"
  }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-z-red/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-z-blue/10 rounded-full blur-[100px] -z-10"></div>

      <main className="max-w-7xl mx-auto px-4 pt-40 pb-24 relative z-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-z-gold/10 text-z-gold font-black text-xs uppercase tracking-widest mb-4">
                Our Story
              </span>
              <h1 className="text-6xl md:text-7xl font-black text-z-red leading-none mb-6">
                Bridging the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-z-blue to-z-gray">Digital Gap.</span>
              </h1>
              <p className="text-z-gray text-xl font-medium leading-relaxed max-w-xl">
                Zimplar was born from a simple yet powerful idea: that every mind in Africa deserves access to 
                world-class education, unhindered by infrastructure or location.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-z-blue/5 px-4 py-2 rounded-xl border border-z-blue/10">
                <Globe className="w-5 h-5 text-z-blue" />
                <span className="text-sm font-bold text-z-gray">Pan-African Vision</span>
              </div>
              <div className="flex items-center space-x-2 bg-z-red/5 px-4 py-2 rounded-xl border border-z-red/10">
                <Heart className="w-5 h-5 text-z-red" />
                <span className="text-sm font-bold text-z-gray">Student-Centric</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="relative w-full h-[500px] bg-z-blue rounded-[3rem] overflow-hidden shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-all duration-700">
              <Image 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800" 
                alt="African students collaborating" 
                fill 
                className="object-cover mix-blend-overlay opacity-70 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-z-red/60 to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <p className="text-white text-2xl font-black leading-tight italic">
                  &quot;Education is the most powerful weapon which you can use to change the world.&quot;
                </p>
                <p className="text-white/80 font-bold mt-2 uppercase tracking-widest text-sm">— Nelson Mandela</p>
              </div>
            </div>
            {/* Decorative floaters */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-z-gold rounded-full shadow-xl animate-bounce-slow flex items-center justify-center">
               <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="relative mb-32">
          <div className="bg-white/40 backdrop-blur-3xl p-12 md:p-20 rounded-[4rem] border border-white/60 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-z-blue/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-z-red rounded-3xl flex items-center justify-center shrink-0 shadow-2xl transform rotate-12 group-hover:rotate-0 transition-all">
                <Target className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-4xl font-black text-z-red">Our Mission</h2>
                <p className="text-z-gray text-2xl font-medium leading-relaxed">
                  To empower <span className="text-z-blue font-black">1 million learners</span> across the continent by 2030 
                  with digital tools that make high-quality education as accessible as air.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-5xl font-black text-z-red uppercase tracking-tighter">Core Values</h2>
             <p className="text-z-gray font-bold max-w-lg mx-auto">The principles that guide every feature we build and every course we curate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-[2.5rem] bg-white border border-z-blue/10 shadow-xl hover:shadow-2xl hover:border-z-red/30 transition-all duration-500 flex flex-col items-center text-center space-y-6"
              >
                <div className={`${val.color} p-5 rounded-2xl text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  {val.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-z-red">{val.title}</h3>
                  <p className="text-z-gray text-sm font-medium leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join the Journey CTA */}
        <div className="mt-40 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-96 bg-z-gold/10 rounded-full blur-[100px] -z-10"></div>
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-black text-z-red tracking-tight leading-none">
              Ready to <br />
              <span className="text-z-blue">Join the Journey?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={() => window.location.href='/signup'} className="px-12 py-5 bg-z-red text-white rounded-2xl font-black text-lg shadow-xl shadow-z-red/30 hover:shadow-z-red/50 transform hover:-translate-y-1 transition-all flex items-center space-x-3 cursor-pointer">
                <span>Become a Student</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => window.location.href='/signup'} className="px-12 py-5 bg-white border-2 border-z-blue text-z-gray rounded-2xl font-black text-lg hover:bg-z-blue/5 transition-all cursor-pointer">
                Join as a Teacher
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
