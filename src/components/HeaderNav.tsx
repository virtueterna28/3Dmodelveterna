import React from 'react';
import { Camera, Volume2, VolumeX, Maximize2, Minimize2, Info, Sparkles } from 'lucide-react';

interface HeaderNavProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTakeSnapshot: () => void;
  onOpenInfo: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  characterTitle: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  soundEnabled,
  onToggleSound,
  onTakeSnapshot,
  onOpenInfo,
  isFullscreen,
  onToggleFullscreen,
  characterTitle,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-4 md:p-6 flex items-start justify-between">
      {/* Title & Brand Badge */}
      <div className="pointer-events-auto flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800/90 py-1.5 px-3 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="relative w-11 h-11 rounded-xl bg-slate-900 border border-sky-400/40 p-1 flex items-center justify-center overflow-hidden shadow-inner shadow-sky-500/20">
            <img
              src="/images/logo_veterna.png"
              alt="Logo Veterna"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-widest uppercase font-mono text-sky-400">
                VETERNA
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-sky-400/70" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Official Mascot
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-bold tracking-wide text-slate-100 font-display drop-shadow-md">
              {characterTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-900/80 border border-slate-700/60 text-slate-300">
            Karakter 3D
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/50">
            PBR Ready • Meshopt
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40">
            Burung Hantu
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/70 border border-slate-800/80 p-1.5 rounded-xl shadow-lg backdrop-blur-md">
        <button
          onClick={onTakeSnapshot}
          className="p-2 rounded-lg text-slate-300 hover:text-sky-300 hover:bg-slate-800/60 transition-colors"
          title="Capture High-Res Screenshot (PNG)"
          aria-label="Capture Screenshot"
        >
          <Camera className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg transition-colors ${
            soundEnabled
              ? 'text-sky-400 hover:bg-sky-950/50'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
          }`}
          title={soundEnabled ? 'Mute synthesized sound effects (M)' : 'Enable sound effects (M)'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenInfo}
          className="p-2 rounded-lg text-slate-300 hover:text-sky-300 hover:bg-slate-800/60 transition-colors"
          title="Model Specs & Character Lore"
          aria-label="Model Information"
        >
          <Info className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-lg text-slate-300 hover:text-sky-300 hover:bg-slate-800/60 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
