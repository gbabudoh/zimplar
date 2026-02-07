"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award, GraduationCap } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-z-blue rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-z-gold rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-z-rose/10 pointer-events-none rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-z-rose text-z-red font-bold text-sm mb-4 animate-bounce">
                The Future of Learning in Africa 🌍
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-z-red leading-tight">
                Unlock Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-z-red to-z-gray">
                  Potential
                </span>{" "}
                Everywhere
              </h1>
              <p className="mt-6 text-xl text-z-gray max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Affordable, high-quality education optimized for low bandwidth. 
                Learn, grow, and succeed with Zimplar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full px-10 py-5 bg-z-red text-white rounded-2xl font-bold text-lg shadow-xl shadow-z-red/20 hover:shadow-2xl hover:shadow-z-red/30 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-2 cursor-pointer">
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/courses" className="w-full sm:w-auto">
                <button className="w-full px-10 py-5 bg-white border-2 border-z-blue text-z-gray rounded-2xl font-bold text-lg hover:bg-z-blue/20 transition-all flex items-center justify-center space-x-2 cursor-pointer">
                  <span>View Courses</span>
                </button>
              </Link>
            </div>

            <div className="pt-8 border-t border-z-blue/50 flex flex-wrap justify-center lg:justify-start gap-8">
              <div className="flex items-center space-x-2 text-z-gray">
                <BookOpen className="w-5 h-5 text-z-red" />
                <span className="font-semibold text-sm">500+ Courses</span>
              </div>
              <div className="flex items-center space-x-2 text-z-gray">
                <Users className="w-5 h-5 text-z-red" />
                <span className="font-semibold text-sm">10k+ Students</span>
              </div>
              <div className="flex items-center space-x-2 text-z-gray">
                <Award className="w-5 h-5 text-z-red" />
                <span className="font-semibold text-sm">Verified Certs</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            {/* Main Hero Image Placeholder with Zimplar Styling */}
            <div className="relative z-10 w-full h-[600px] bg-z-blue rounded-[3rem] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-700">
                   <div className="absolute inset-x-8 inset-y-12">
                      <div className="w-full h-full bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden relative group">
                         {/* Student + Teacher Image */}
                         <Image 
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" 
                            alt="Student and Teacher learning" 
                            fill
                            className="object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700"
                         />
                         
                         {/* Overlaying UI elements for "Modern UX" feel */}
                         <div className="absolute inset-0 bg-gradient-to-t from-z-red/40 to-transparent flex flex-col justify-end p-8">
                            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                               <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-z-red rounded-lg">
                                     <GraduationCap className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                     <p className="text-xs font-bold text-z-red uppercase tracking-tighter">Live Session</p>
                                     <p className="text-sm font-black text-z-gray">Mathematics & Logic</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Pulse Glow Effect */}
                         <div className="absolute -top-24 -right-24 w-48 h-48 bg-z-blue/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                      </div>
                   </div>
            </div>
            
            {/* Floating Card 1 */}
            <div className="absolute top-10 -left-10 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 animate-bounce-slow">
               <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                 <div className="w-4 h-4 bg-green-500 rounded-full pulse-ping"></div>
               </div>
               <div>
                  <p className="text-xs font-bold text-z-gray uppercase tracking-widest">Active Lessons</p>
                  <p className="text-lg font-black text-z-red">2,481</p>
               </div>
            </div>

             {/* Floating Card 2 */}
             <div className="absolute bottom-10 -right-6 z-20 bg-white p-6 rounded-[2rem] shadow-xl max-w-[200px]">
                <div className="flex items-center space-x-1 mb-2">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-4 rounded-full bg-z-gold"></div>)}
                </div>
                <p className="text-sm font-bold text-z-gray">&quot;This changed my career!&quot;</p>
                <p className="text-xs text-z-gray/60 mt-2">— Sarah K., Nairobi</p>
             </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Hero;
