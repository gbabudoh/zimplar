import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Link from "next/link";
import { 
  Building, 
  Users, 
  ShieldCheck, 
  Zap 
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
              <div className="mb-6 bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
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
              <div className="mb-6 bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-z-blue" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4">Private Schools</h3>
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed">Premium management with parent portals, advanced branding, and CRM tools.</p>
              <Link href="/dashboard/billing">
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

      {/* Additional sections can be added here */}
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
