"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import JitsiPlayer from "@/components/video/JitsiPlayer";
import OwncastPlayer from "@/components/video/OwncastPlayer";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  ArrowRight,
  ChevronLeft,
  Share2,
  Hand,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

import AIProctor from "@/components/video/AIProctor";

export default function ClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const [sessionStatus, setSessionStatus] = useState<"connecting" | "live" | "ended">("connecting");
  const [activeTab, setActiveTab] = useState<"chat" | "files" | "students">("chat");
  const [playerMode, setPlayerMode] = useState<"interactive" | "broadcast">("interactive");
  const [alerts, setAlerts] = useState<{id: string, type: string, time: string}[]>([]);
  const [messages, setMessages] = useState<{id: string, sender: string, text: string, isTeacher: boolean}[]>([
    { id: "1", sender: "Teacher", text: "Welcome everyone! Today we focus on Chapter 12.", isTeacher: true },
    { id: "2", sender: "John Doe", text: "Can we review the last proof before we start?", isTeacher: false }
  ]);
  const [messageInput, setMessageInput] = useState("");
  const alertCounterRef = React.useRef(0);
  const isModerator = (session?.user as { role?: string })?.role === "TEACHER";

  const handleAIAlert = (type: string, severity: string) => {
    console.log(`AI PROCTOR ALERT: ${type} (${severity})`);
    const newAlert = {
      id: `${Date.now()}-${++alertCounterRef.current}`,
      type: type.replace("_", " "),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 5));
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      sender: session?.user?.name || "User",
      text: messageInput,
      isTeacher: isModerator
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageInput("");
  };

  // Simulate Handshake
  React.useEffect(() => {
    const timer = setTimeout(() => setSessionStatus("live"), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between z-50">
        <div className="flex items-center space-x-4">
          <Link href={isModerator ? "/dashboard/teacher/classrooms" : "/dashboard/student"} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-white/60" />
          </Link>
          <div className="bg-z-red px-3 py-1 rounded-lg flex items-center space-x-2">
             <div className={`w-1.5 h-1.5 rounded-full bg-white ${sessionStatus === 'live' ? 'animate-pulse' : 'opacity-50'}`}></div>
             <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                {sessionStatus === 'live' ? 'Live Room' : 'Initializing'}: {id}
             </span>
          </div>
          <h1 className="text-sm font-black text-white tracking-widest uppercase">Mathematics & Advanced Logic</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all cursor-pointer">
             <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-z-red hover:bg-z-red/90 rounded-xl text-white transition-all shadow-lg flex items-center space-x-2 px-4 cursor-pointer">
             <Hand className="w-4 h-4 fill-white" />
             <span className="text-xs font-black uppercase">Raise Hand</span>
          </button>
        </div>
      </nav>

      {/* Main Classroom Layout */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left: Video Area */}
        <div className="flex-grow p-4 relative bg-black/40 flex items-center justify-center">
            {/* AI Proctoring Overlay */}
            <AIProctor onAlert={handleAIAlert} />

            <div className="w-full max-w-6xl relative">
               {sessionStatus === 'connecting' && (
                 <div className="absolute inset-0 z-10 bg-slate-900/50 backdrop-blur-xl flex flex-col items-center justify-center rounded-[2.5rem]">
                    <div className="w-12 h-12 border-4 border-z-red border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Establishing Secure Link...</p>
                 </div>
               )}
               {sessionStatus === 'live' && (
                 <div className="absolute top-8 right-8 z-20 flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
                    <button 
                      onClick={() => setPlayerMode("interactive")}
                      className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${playerMode === 'interactive' ? 'bg-z-red text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      Interactive
                    </button>
                    <button 
                      onClick={() => setPlayerMode("broadcast")}
                      className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${playerMode === 'broadcast' ? 'bg-z-red text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      Broadcast
                    </button>
                 </div>
               )}

               {playerMode === "interactive" ? (
                 <JitsiPlayer 
                   roomName={id} 
                   userName={session?.user?.name || "User"}
                   userEmail={session?.user?.email ?? undefined}
                   isModerator={isModerator}
                 />
               ) : (
                 <div className="relative">
                   <OwncastPlayer />
                   {isModerator && (
                     <div className="absolute bottom-10 right-10 w-64 h-48 bg-slate-800 rounded-3xl border-4 border-white/20 shadow-2xl overflow-hidden z-30 group">
                       <p className="absolute top-4 left-4 text-[8px] font-black text-white uppercase tracking-widest z-10 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-md">Local Preview (Broadcasting)</p>
                       <video 
                         id="local-broadcast-preview"
                         autoPlay 
                         muted 
                         ref={(el) => {
                           if (el && !el.srcObject) {
                             navigator.mediaDevices.getUserMedia({ video: true }).then(s => el.srcObject = s);
                           }
                         }}
                         className="w-full h-full object-cover"
                       />
                     </div>
                   )}
                 </div>
               )}
            </div>
        </div>

        {/* Right: Interaction Sidebar */}
        <aside className="w-96 bg-slate-900 border-l border-white/10 flex flex-col">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-white/5">
             <button 
               onClick={() => setActiveTab("chat")}
               className={`flex-1 p-4 flex flex-col items-center space-y-1 transition-all ${activeTab === 'chat' ? 'bg-white/5 border-b-2 border-z-red' : 'opacity-40 hover:opacity-100'}`}
             >
                <MessageSquare className="w-5 h-5 text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Chat</span>
             </button>
             <button 
               onClick={() => setActiveTab("files")}
               className={`flex-1 p-4 flex flex-col items-center space-y-1 transition-all ${activeTab === 'files' ? 'bg-white/5 border-b-2 border-z-red' : 'opacity-40 hover:opacity-100'}`}
             >
                <FileText className="w-5 h-5 text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Materials</span>
             </button>
             <button 
               onClick={() => setActiveTab("students")}
               className={`flex-1 p-4 flex flex-col items-center space-y-1 transition-all ${activeTab === 'students' ? 'bg-white/5 border-b-2 border-z-red' : 'opacity-40 hover:opacity-100'}`}
             >
                <Users className="w-5 h-5 text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Peers</span>
             </button>
          </div>

          {/* Content Area */}
          <div className="flex-grow overflow-y-auto p-6 scrollbar-hide">
            {/* Real-time Alert Monitor (Internal Logic Demo) */}
            {alerts.length > 0 && (
              <div className="mb-8 space-y-3">
                 <p className="text-[9px] font-black text-z-red uppercase tracking-widest flex items-center">
                    <ShieldAlert className="w-3 h-3 mr-2" />
                    Security Log
                 </p>
                 {alerts.map(alert => (
                   <div key={alert.id} className="bg-z-red/5 border border-z-red/20 p-3 rounded-xl flex justify-between items-center animate-in slide-in-from-right duration-500">
                      <span className="text-[10px] font-black text-z-red uppercase tracking-tighter">{alert.type}</span>
                      <span className="text-[8px] font-medium text-zinc-500">{alert.time}</span>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-6">
                 {messages.map(msg => (
                   <div key={msg.id} className={`flex items-start space-x-3 ${msg.isTeacher ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full shrink-0 ${msg.isTeacher ? 'bg-z-red' : 'bg-slate-400'}`}></div>
                      <div>
                         <p className={`text-[10px] font-black uppercase mb-0.5 ${msg.isTeacher ? 'text-z-gold' : 'text-white/40'}`}>{msg.sender}</p>
                         <p className="text-xs text-white/80 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">{msg.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === 'files' && (
               <div className="space-y-4">
                  {[
                    { name: "Algebra_Basics.pdf", type: "PDF", size: "1.2MB" },
                    { name: "Proof_Techniques.docx", type: "DOC", size: "850KB" },
                    { name: "Live_Logic_Flow.png", type: "IMG", size: "2.5MB" },
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                       <div className="flex items-center space-x-3">
                          <div className="bg-z-red p-2 rounded-lg">
                             <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div>
                             <h4 className="text-xs font-bold text-white leading-tight">{file.name}</h4>
                             <p className="text-[10px] text-white/40">{file.type} • {file.size}</p>
                          </div>
                       </div>
                       <button className="text-white/20 group-hover:text-white transition-colors">
                          <Share2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
               </div>
            )}
          </div>

          {/* Chat Input (Sticky) */}
          {activeTab === 'chat' && (
            <div className="p-4 border-t border-white/5">
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-z-red/50 cursor-pointer"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1.5 p-2 bg-z-red rounded-lg shadow-lg hover:bg-z-red/90 transition-all cursor-pointer"
                  >
                     <ArrowRight className="w-4 h-4 text-white" />
                  </button>
               </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
