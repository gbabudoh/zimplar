"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { ShieldAlert, UserCheck, Eye, MonitorOff, MousePointer2, Smartphone } from "lucide-react";

interface AIProctorProps {
  onAlert?: (type: string, severity: "LOW" | "MEDIUM" | "HIGH") => void;
}

const AIProctor: React.FC<AIProctorProps> = ({ onAlert }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faceModel, setFaceModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [objectModel, setObjectModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [status, setStatus] = useState<"READY" | "MONITORING" | "ALERT">("READY");
  const [violations, setViolations] = useState<string[]>([]);
  const [personCount, setPersonCount] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Load Models
  useEffect(() => {
    async function loadModels() {
      await tf.ready();
      const [fModel, oModel] = await Promise.all([
        blazeface.load(),
        cocoSsd.load()
      ]);
      setFaceModel(fModel);
      setObjectModel(oModel);
      console.log("AI Proctor: All AI Models Loaded");
    }
    loadModels();
  }, []);

  // Setup Camera
  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraError(null);
          }
        })
        .catch((err) => {
          console.error("Camera Access Error:", err);
          setCameraError(err.name === "NotAllowedError" ? "Camera permission denied" : "Camera not found");
        });
    }
  }, []);

  const addViolation = useCallback((type: string, severity: "LOW" | "MEDIUM" | "HIGH") => {
    setStatus("ALERT");
    setViolations(prev => Array.from(new Set([...prev, type])));
    if (onAlert) onAlert(type, severity);
    
    // Clear alert status after 3 seconds unless it's a persistent violation
    setTimeout(() => {
       if (type !== "MULTIPLE_PEOPLE" && type !== "SECONDARY_DEVICE") setStatus("MONITORING");
    }, 3000);
  }, [onAlert]);

  // Browser Integrity Listeners (Phase 1)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation("TAB_SWITCHED", "HIGH");
      }
    };

    const handleBlur = () => {
      addViolation("WINDOW_UNFOCUSED", "MEDIUM");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [addViolation]);

  // Continuous Detection Loop
  useEffect(() => {
    if (!faceModel || !videoRef.current) return;

    let frameCount = 0;
    let lastObjectCheck = 0;

    const detect = async () => {
      frameCount++;
      const now = Date.now();
      
      if (videoRef.current && videoRef.current.readyState === 4) {
        // Face & Gaze Detection (Every 2 frames for smoothness)
        if (frameCount % 2 === 0) {
          const rawPredictions = await faceModel.estimateFaces(videoRef.current, false);
          const predictions = rawPredictions as unknown as { landmarks: number[][] }[];
          setPersonCount(predictions.length);

          if (predictions.length > 1) {
            addViolation("MULTIPLE_PEOPLE", "HIGH");
          } else if (predictions.length === 0) {
            addViolation("OUT_OF_FRAME", "MEDIUM");
          } else {
            const face = predictions[0];
            const landmarks = face.landmarks;
            if (landmarks && landmarks.length >= 3) {
              const rightEye = landmarks[0];
              const leftEye = landmarks[1];
              const nose = landmarks[2];
              
              if (rightEye && leftEye && nose) {
                const gazeRatio = Math.abs(nose[0] - leftEye[0]) / Math.abs(rightEye[0] - leftEye[0]);
                if (gazeRatio < 0.3 || gazeRatio > 0.7) {
                   addViolation("GAZE_EVASION", "LOW");
                } else {
                   if (status !== 'ALERT') setStatus("MONITORING");
                }
              }
            }
          }
        }

        // Object Detection (Secondary Devices) - Every 5 seconds to save CPU
        if (objectModel && now - lastObjectCheck > 5000) {
           lastObjectCheck = now;
           const rawObjects = await objectModel.detect(videoRef.current);
           const objects = rawObjects as { class: string; score: number }[];
           const forbidden = objects.find(obj => 
             ["cell phone", "laptop", "tablet"].includes(obj.class) && obj.score > 0.6
           );
           
           if (forbidden) {
             addViolation("SECONDARY_DEVICE", "HIGH");
           }
        }
      }
      requestAnimationFrame(detect);
    };

    detect();
  }, [faceModel, objectModel, addViolation, status]);

  return (
    <div className="absolute top-6 left-6 z-50 animate-in fade-in duration-1000">
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-[2rem] shadow-2xl flex items-center space-x-4">
        <div className="relative">
           <video 
             ref={videoRef} 
             autoPlay 
             muted 
             className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 bg-slate-800"
           />
           <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-slate-900 ${status === 'ALERT' ? 'bg-z-red animate-pulse' : 'bg-green-500'}`}>
              {status === 'ALERT' ? <ShieldAlert className="w-3 h-3 text-white" /> : <UserCheck className="w-3 h-3 text-white" />}
           </div>
        </div>
        
        <div className="space-y-1">
           <div className="flex items-center space-x-2">
              <Eye className="w-3 h-3 text-z-gold" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">AI Integrity Shield v3</span>
           </div>
           <div>
              <p className={`text-xs font-black uppercase ${status === 'ALERT' ? 'text-z-red' : 'text-white'}`}>
                {status === 'ALERT' ? 'Integrity Warning' : 'Monitoring Active'}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">
                  {personCount} Person{personCount !== 1 ? 's' : ''} in view
                </p>
                {violations.length > 0 && (
                   <span className="text-[8px] font-black text-z-red uppercase tracking-tighter">
                     • {violations[violations.length - 1]}
                   </span>
                )}
              </div>
           </div>
        </div>
      </div>

      {status === 'ALERT' && (
        <div className="mt-2 flex flex-col space-y-1">
           <div className="bg-z-red/90 backdrop-blur-md px-4 py-2 rounded-xl border border-z-red shadow-lg animate-bounce flex items-center space-x-2">
              <MonitorOff className="w-3 h-3 text-white" />
              <p className="text-[8px] font-black text-white uppercase tracking-widest">Malpractice Warning</p>
           </div>
           
           <div className="flex flex-col space-y-1">
              {violations.includes("TAB_SWITCHED") && (
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-2 animate-in slide-in-from-left duration-300">
                  <MousePointer2 className="w-3 h-3 text-z-red" />
                  <p className="text-[7px] font-black text-zinc-300 uppercase tracking-widest">External Navigation</p>
                </div>
              )}
              {violations.includes("SECONDARY_DEVICE") && (
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-2 animate-in slide-in-from-left duration-500">
                  <Smartphone className="w-3 h-3 text-amber-500" />
                  <p className="text-[7px] font-black text-zinc-300 uppercase tracking-widest">Prohibited Device</p>
                </div>
              )}
           </div>
        </div>
      )}

      {cameraError && (
        <div className="mt-2 bg-amber-500/90 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-400 shadow-lg">
           <p className="text-[8px] font-black text-white uppercase tracking-widest flex items-center">
             <ShieldAlert className="w-3 h-3 mr-1" />
             {cameraError}
           </p>
        </div>
      )}
    </div>
  );
};

export default AIProctor;
