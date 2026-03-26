"use client";

import React, { useEffect, useState } from "react";
import { 
  LiveKitRoom, 
  VideoConference, 
} from "@livekit/components-react";

import "@livekit/components-styles/index.css";


import DataCounter from "./DataCounter";


interface LiveKitPlayerProps {
  roomName: string;
  userName: string;
  userEmail?: string;
  isModerator?: boolean;
  mode?: "interactive" | "broadcast";
  onReady?: () => void;
}

const LiveKitPlayer: React.FC<LiveKitPlayerProps> = ({ 
  roomName, 
  userName, 
  userEmail, 
  isModerator = false, 
  mode = "interactive",
  onReady 
}) => {

  const [token, setToken] = useState("");
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://livekit.feendesk.com";

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit/token?room=${roomName}&username=${userName}${userEmail ? `&email=${encodeURIComponent(userEmail)}` : ''}${isModerator ? '&isModerator=true' : ''}&mode=${mode}`
        );


        const data = await resp.json();
        setToken(data.token);
        if (onReady) onReady();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [roomName, userName, onReady, isModerator, userEmail, mode]);




  if (token === "") {
    return (
      <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-z-blue/10 border-4 border-white relative group flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-z-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold">Loading LiveKit session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-z-blue/10 border-4 border-white relative group">
      <LiveKitRoom
        video={mode === "interactive" || isModerator}
        audio={mode === "interactive" || isModerator}
        token={token}

        serverUrl={serverUrl}
        // Use the default LiveKit styles
        data-lk-theme="default"
        style={{ height: '100%' }}
      >
        <VideoConference />
      </LiveKitRoom>
      
      {/* Data Usage Overlay */}
      <DataCounter isLive={true} />
    </div>
  );
};

export default LiveKitPlayer;
