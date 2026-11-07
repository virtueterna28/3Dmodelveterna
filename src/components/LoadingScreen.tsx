import React from 'react';
import { Sparkles, Shield } from 'lucide-react';

interface LoadingScreenProps {
  progress: number;
  status: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, status }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center">
        {/* Veterna Logo */}
        <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border border-sky-400/40 p-2 flex items-center justify-center mb-4 text-sky-400 shadow-xl shadow-sky-500/20">
          <img
            src="/images/logo_veterna.png"
            alt="Logo Veterna"
            className="w-full h-full object-contain filter drop-shadow"
          />
          <Sparkles className="w-4 h-4 text-sky-300 absolute -top-1.5 -right-1.5" />
        </div>

        <div className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold mb-1">
          VETERNA
        </div>
        <h3 className="text-lg font-bold font-display text-white tracking-wide">
          Maskot Burung Hantu Veterna
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          Memuat Model 3D Ksatria Bersayap & Helm Kristal Es...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 mb-3 overflow-hidden border border-slate-700/50 p-0.5">
          <div
            className="bg-gradient-to-r from-sky-500 to-blue-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>

        {/* Status text */}
        <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-mono">
          <span className="truncate pr-2">{status || 'Memuat...'}</span>
          <span className="text-sky-400 font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
