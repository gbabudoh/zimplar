"use client";

import React, { useEffect, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

import DataCounter from "./DataCounter";

interface JitsiPlayerProps {
  roomName: string;
  userName: string;
  userEmail?: string;
  isModerator?: boolean;
  onReady?: () => void;
}

const JitsiPlayer: React.FC<JitsiPlayerProps> = ({ roomName, userName, userEmail, isModerator = false, onReady }) => {
  const [isClient, setIsClient] = useState(false);
  const domain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || "meet.jit.si";
  const appId = process.env.NEXT_PUBLIC_JITSI_APP_ID;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-z-blue/10 border-4 border-white relative group flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-z-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold">Loading video conference...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-z-blue/10 border-4 border-white relative group">
      <JitsiMeeting
        domain={domain}
        roomName={appId ? `${appId}/${roomName}` : roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false,
          prejoinPageEnabled: false,
          // Optimization for low bandwidth
          resolution: 480,
          constraints: {
            video: {
              height: { ideal: 480, max: 480, min: 240 },
            }
          }
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'toggle-camera', 'download-logs'
          ],
        }}
        userInfo={{
          displayName: userName,
          email: userEmail || "",
        }}
        onApiReady={(api) => {
          if (isModerator) {
            api.executeCommand('password', 'moderator');
          }
          if (onReady) onReady();
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
        }}
      />
      
      {/* Data Usage Overlay */}
      <DataCounter isLive={true} />
    </div>
  );
};

export default JitsiPlayer;
