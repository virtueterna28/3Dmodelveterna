import React from 'react';
import { Camera, Volume2, VolumeX, Maximize2, Minimize2, Info, ExternalLink, Sparkles } from 'lucide-react';

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
      {/* Title & Badge */}
      <div className="pointer-events-auto flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-sm shadow-sky-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wider text-slate-100 font-display drop-shadow-md">
              {characterTitle}
            </h1>
            <p className="text-xs text-sky-300/80 font-medium tracking-wide">
              Winged Armored Knight • Silver PBR Armor & Icy Helm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-900/80 border border-slate-700/60 text-slate-300">
            Tripo3D Model
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/50">
            PBR Ready • Meshopt
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

        <a
          href="https://studio.tripo3d.ai/3d-model/3baf7a5e-83b0-47ff-b0a5-40ccd8dde884?utm_campaign=3d_model&invite_code=B1GSFP"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-slate-300 hover:text-sky-300 hover:bg-slate-800/60 transition-colors"
          title="Open in Tripo3D Studio"
          aria-label="Open Tripo3D"
        >
          <ExternalLink className="w-4 h-4" />
        </a>

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
