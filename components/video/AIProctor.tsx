"use client";

import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import { ShieldAlert, UserCheck, Eye } from "lucide-react";

interface AIProctorProps {
  onAlert?: (type: string, severity: "LOW" | "MEDIUM" | "HIGH") => void;
}

const AIProctor: React.FC<AIProctorProps> = ({ onAlert }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [status, setStatus] = useState<"READY" | "MONITORING" | "ALERT">("READY");
  const [personCount, setPersonCount] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Load Model
  useEffect(() => {
    async function loadModel() {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
      console.log("AI Proctor: BlazeFace Model Loaded");
    }
    loadModel();
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

  // Continuous Detection
  useEffect(() => {
    if (!model || !videoRef.current) return;

    const detect = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const predictions = await model.estimateFaces(videoRef.current, false);
        setPersonCount(predictions.length);

        if (predictions.length > 1) {
          setStatus("ALERT");
          if (onAlert) onAlert("MULTIPLE_PEOPLE", "HIGH");
        } else if (predictions.length === 0) {
          setStatus("ALERT");
          if (onAlert) onAlert("OUT_OF_FRAME", "MEDIUM");
        } else {
          setStatus("MONITORING");
        }
      }
      requestAnimationFrame(detect);
    };

    detect();
  }, [model, onAlert]);

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
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">AI Integrity Shield</span>
           </div>
           <div>
              <p className={`text-xs font-black uppercase ${status === 'ALERT' ? 'text-z-red' : 'text-white'}`}>
                {status === 'ALERT' ? 'Violation Detected' : 'Monitoring Active'}
              </p>
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">
                {personCount} Person{personCount !== 1 ? 's' : ''} in view
              </p>
           </div>
        </div>
      </div>

      {status === 'ALERT' && (
        <div className="mt-2 bg-z-red/90 backdrop-blur-md px-4 py-2 rounded-xl border border-z-red shadow-lg animate-bounce">
           <p className="text-[8px] font-black text-white uppercase tracking-widest">Malpractice Warning</p>
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
