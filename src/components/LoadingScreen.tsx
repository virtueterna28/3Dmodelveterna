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
        {/* Animated Icon Avatar */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/20 border border-sky-400/30 flex items-center justify-center mb-4 text-sky-400 shadow-lg shadow-sky-500/10">
          <Shield className="w-8 h-8 text-sky-400" />
          <Sparkles className="w-4 h-4 text-sky-300 absolute -top-1 -right-1" />
        </div>

        <h3 className="text-lg font-bold font-display text-white tracking-wide">
          Aethelgard
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-5">
          Memuat Karakter 3D Ksatria Bersayap...
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
