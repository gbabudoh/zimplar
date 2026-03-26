"use client";

import React from "react";
import LiveKitPlayer from "./LiveKitPlayer";
import VODPlayer from "./VODPlayer";

interface SmartVideoPlayerProps {
  source: string;
  userName: string;
  userEmail?: string;
  isModerator?: boolean;
  mode?: "interactive" | "broadcast";
  onReady?: () => void;
}

const SmartVideoPlayer: React.FC<SmartVideoPlayerProps> = ({ 
  source, 
  userName, 
  userEmail, 
  isModerator = false, 
  mode = "interactive",
  onReady 
}) => {
  // Simple detection: if it starts with http or ends with a video extension, it's VOD
  const isVOD = source.startsWith("http") || 
                source.endsWith(".mp4") || 
                source.endsWith(".m3u8") || 
                source.includes("/api/storage/m/"); // Common for MinIO links

  if (isVOD) {
    return <VODPlayer url={source} onReady={onReady} />;
  }

  return (
    <LiveKitPlayer
      roomName={source}
      userName={userName}
      userEmail={userEmail}
      isModerator={isModerator}
      mode={mode}
      onReady={onReady}
    />
  );
};

export default SmartVideoPlayer;
