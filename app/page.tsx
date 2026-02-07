import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Link from "next/link";
import { 
  Building, 
  Users, 
  ShieldCheck, 
  Zap,
  Globe,
  CreditCard,
  Orbit,
  ChevronRight
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Zimplar Growth Pathways */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-z-red/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tight">
              A Platform for <span className="text-z-red underline decoration-z-gold/30 underline-offset-8">Every Impact</span>
            </h2>
            <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto">
              Whether you are a national government or an independent educator, Zimplar provides the 
              specialized infrastructure to scale your mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Government Pathway */}
            <div className="p-8 bg-zinc-50 rounded-[3rem] border border-zinc-100 hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="mb-6 bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4">Governments</h3>
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed">Mass education suites for regional deployments with nationwide data management.</p>
              <Link href="/dashboard/billing">
                <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-z-red transition-all shadow-xl shadow-zinc-900/10">
                  Institutional Onboarding
                </button>
              </Link>
            </div>

            {/* NGO Pathway */}
            <div className="p-8 bg-zinc-50 rounded-[3rem] border border-zinc-100 hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="mb-6 bg-z-red/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-z-red" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4">NGOs & Charities</h3>
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed">Impact-first logic for rural schools with subsidies and donor reporting tools.</p>
              <Link href="/dashboard/billing">
                <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-z-red transition-all shadow-xl shadow-zinc-900/10">
                  Impact Enrollment
                </button>
              </Link>
            </div>

            {/* Private School Pathway */}
            <div className="p-8 bg-zinc-50 rounded-[3rem] border border-zinc-100 hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-z-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="mb-6 bg-z-blue/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-z-blue" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4">Private Schools</h3>
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed">Premium management with parent portals, advanced branding, and CRM tools.</p>
              <Link href="/dashboard/private">
                <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-z-red transition-all shadow-xl shadow-zinc-900/10">
                  School Activation
                </button>
              </Link>
            </div>

            {/* Individual Teacher Pathway */}
            <div className="p-8 bg-zinc-900 rounded-[3rem] shadow-2xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                <Zap className="w-8 h-8 text-z-gold" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Teachers</h3>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">Monetize your expertise globally with direct student billing and live rooms.</p>
              <Link href="/dashboard/billing">
                <button className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-z-gold transition-all">
                  Create Classroom
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Spotlight / Creator Hub */}
      <section className="py-24 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-z-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-z-red/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-z-gold/20 text-z-gold px-4 py-2 rounded-full border border-z-gold/30">
                <Zap className="w-4 h-4 fill-z-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Independent Creator Hub</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                Monetize Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-z-gold via-white to-z-gold/50">Expertise Globally.</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                Zimplar isn&apos;t just for institutions. We provide individual educators with 
                high-fidelity live rooms, direct student billing, and AI-driven classroom 
                integrity. Build your digital academy in minutes.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                <div className="flex items-start space-x-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="bg-z-gold/10 p-3 rounded-2xl">
                    <CreditCard className="w-6 h-6 text-z-gold" />
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase text-[10px] tracking-widest mb-1">Direct Billing</h4>
                    <p className="text-xs text-zinc-500 font-bold">Automated tuitions & payments.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="bg-z-red/10 p-3 rounded-2xl">
                    <Orbit className="w-6 h-6 text-z-red" />
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase text-[10px] tracking-widest mb-1">Live Rooms</h4>
                    <p className="text-xs text-zinc-500 font-bold">4K streams & interactive tools.</p>
                  </div>
                </div>
              </div>

              <div className="pt-10">
                <Link href="/dashboard/teacher">
                  <button className="bg-white text-zinc-900 px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center space-x-3 hover:scale-105 transition-all shadow-2xl shadow-z-gold/20">
                    <span>Create Your Classroom</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-z-red via-z-gold to-z-blue rounded-[4rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
              <div className="relative bg-zinc-800 rounded-[3.5rem] p-4 border border-white/10 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
                 {/* Mock UI Preview */}
                 <div className="w-full h-full bg-slate-900 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute top-8 left-8 flex items-center space-x-2 bg-z-red px-3 py-1 rounded-full">
                       <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                       <span className="text-[8px] font-black text-white uppercase">Live: Room Logic-A</span>
                    </div>
                    <div className="text-center space-y-4">
                       <div className="w-20 h-20 bg-z-gold/20 rounded-3xl flex items-center justify-center mx-auto border border-z-gold/30">
                          <Users className="w-10 h-10 text-z-gold" />
                       </div>
                       <p className="text-white font-black text-xl tracking-tight">Broadcasting to 48 Students</p>
                       <div className="flex justify-center -space-x-3">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-slate-900 ring-2 ring-white/10 flex items-center justify-center text-[8px] font-bold">ST</div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-zinc-100 hidden md:block animate-bounce-slow">
                 <div className="flex items-center space-x-4">
                    <div className="bg-emerald-100 p-3 rounded-2xl">
                       <Globe className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Total revenue</p>
                       <h4 className="text-2xl font-black text-zinc-900 tracking-tighter">$12,482.00</h4>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Zimplar? */}
      <section className="py-20 bg-z-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-z-red mb-4 uppercase tracking-wider">Why Choose Zimplar?</h2>
          <div className="w-20 h-1 bg-z-gold mx-auto mb-8"></div>
          <p className="text-z-gray max-w-2xl mx-auto text-lg">
            We provide a world-class learning experience tailored for the unique challenges 
            of the African digital landscape.
          </p>
        </div>
      </section>
    </main>
  );
}
