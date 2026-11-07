import React, { useState } from 'react';
import {
  Layers,
  Sun,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Play,
  Pause,
  Sparkles,
  Shield,
  CircleDot,
} from 'lucide-react';
import { CameraPreset, EnvironmentPreset, RenderMode, ViewerSettings } from '../types.ts';
import { ENVIRONMENT_CONFIGS } from '../utils/threeUtils.ts';

interface ControlDockProps {
  settings: ViewerSettings;
  onUpdateSettings: (updater: (prev: ViewerSettings) => ViewerSettings) => void;
  activeCameraPreset: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  onResetView: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

type TabType = 'modes' | 'environment' | 'camera' | 'dynamics';

export const ControlDock: React.FC<ControlDockProps> = ({
  settings,
  onUpdateSettings,
  activeCameraPreset,
  onSelectCameraPreset,
  onResetView,
  collapsed,
  onToggleCollapsed,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('modes');

  const renderModes: { id: RenderMode; label: string; desc: string }[] = [
    { id: 'pbr', label: 'PBR Tekstur', desc: 'Silver armor & blue cape' },
    { id: 'clay', label: 'Clay Skulpsi', desc: 'Studio sculpt mode' },
    { id: 'wireframe', label: 'Wireframe', desc: 'Mesh topologi' },
    { id: 'normals', label: 'Normal Map', desc: 'Surface normals' },
    { id: 'frost', label: 'Frost Aura', desc: 'Glacial crystal effect' },
  ];

  const cameraAngles: { id: CameraPreset; label: string; sub: string }[] = [
    { id: 'front', label: 'Full Body', sub: 'Frontal' },
    { id: 'helm', label: 'Icy Helm', sub: 'Visor Close-Up' },
    { id: 'wings', label: 'Sayap & Jubah', sub: 'Backplate' },
    { id: 'hero', label: 'Hero Angle', sub: 'Low Dramatic' },
    { id: 'top', label: 'Top View', sub: 'Tactical' },
  ];

  const envs: { id: EnvironmentPreset; label: string }[] = [
    { id: 'citadel', label: ENVIRONMENT_CONFIGS.citadel.name },
    { id: 'throne', label: ENVIRONMENT_CONFIGS.throne.name },
    { id: 'studio', label: ENVIRONMENT_CONFIGS.studio.name },
    { id: 'abyss', label: ENVIRONMENT_CONFIGS.abyss.name },
  ];

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ease-out flex flex-col items-center ${
        collapsed ? 'bottom-0 translate-y-[calc(100%-28px)]' : 'bottom-4 md:bottom-6 translate-y-0'
      }`}
      style={{ width: 'min(940px, 94vw)' }}
    >
      {/* Collapse / Expand Tab Button */}
      <button
        onClick={onToggleCollapsed}
        className="group flex items-center gap-1.5 px-3 py-1 mb-1 rounded-t-lg bg-slate-900/90 border-t border-x border-slate-700/80 text-xs text-slate-300 hover:text-sky-300 transition-colors shadow-lg cursor-pointer"
        aria-label={collapsed ? 'Tampilkan Kontrol' : 'Sembunyikan Kontrol'}
        title="Shortcut: Tekan 'H' pada keyboard"
      >
        {collapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-sky-400 group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-medium tracking-wide">Tampilkan Kontrol (H)</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
            <span className="font-medium tracking-wide">Mode Sinema (H)</span>
          </>
        )}
      </button>

      {/* Main Glassmorphic Dock Container */}
      <div className="w-full bg-slate-950/85 border border-slate-800/90 rounded-2xl shadow-2xl p-3 md:p-4 text-slate-200">
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('modes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'modes'
                  ? 'bg-sky-500/15 border border-sky-400/30 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mode Render</span>
            </button>

            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'camera'
                  ? 'bg-sky-500/15 border border-sky-400/30 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Sudut Kamera</span>
            </button>

            <button
              onClick={() => setActiveTab('environment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'environment'
                  ? 'bg-sky-500/15 border border-sky-400/30 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Pencahayaan</span>
            </button>

            <button
              onClick={() => setActiveTab('dynamics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dynamics'
                  ? 'bg-sky-500/15 border border-sky-400/30 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Dinamika & Panggung</span>
            </button>
          </div>

          {/* Quick Turntable & Reset actions on right of tabs */}
          <div className="flex items-center gap-1.5 pl-2">
            <button
              onClick={() =>
                onUpdateSettings((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
                settings.autoRotate
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                  : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Auto-Rotate Turntable (Spasi)"
            >
              {settings.autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Putar</span>
            </button>

            <button
              onClick={onResetView}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-sky-300 transition-colors"
              title="Reset Posisi Kamera (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[52px] flex items-center">
          {/* TAB 1: Render Modes */}
          {activeTab === 'modes' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
              {renderModes.map((mode) => {
                const isActive = settings.renderMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() =>
                      onUpdateSettings((prev) => ({ ...prev, renderMode: mode.id }))
                    }
                    className={`flex flex-col items-start p-2 rounded-xl text-left transition-all border ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm shadow-sky-500/20'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full">
                      <CircleDot
                        className={`w-3 h-3 ${isActive ? 'text-sky-400' : 'text-slate-500'}`}
                      />
                      <span className="text-xs font-semibold">{mode.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {mode.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: Camera Angles */}
          {activeTab === 'camera' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
              {cameraAngles.map((cam) => {
                const isActive = activeCameraPreset === cam.id;
                return (
                  <button
                    key={cam.id}
                    onClick={() => onSelectCameraPreset(cam.id)}
                    className={`flex flex-col items-start p-2 rounded-xl text-left transition-all border ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm shadow-sky-500/20'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-semibold">{cam.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{cam.sub}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 3: Environment Lighting */}
          {activeTab === 'environment' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 w-full sm:w-auto">
                {envs.map((env) => {
                  const isActive = settings.environment === env.id;
                  return (
                    <button
                      key={env.id}
                      onClick={() =>
                        onUpdateSettings((prev) => ({ ...prev, environment: env.id }))
                      }
                      className={`p-2 rounded-xl text-xs font-semibold text-center transition-all border ${
                        isActive
                          ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm shadow-sky-500/20'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {env.label}
                    </button>
                  );
                })}
              </div>

              {/* Light Intensity Slider */}
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-[11px] text-slate-400 whitespace-nowrap">Intensitas:</span>
                <input
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.1"
                  value={settings.lightIntensity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateSettings((prev) => ({ ...prev, lightIntensity: val }));
                  }}
                  className="w-24 sm:w-28 accent-sky-400 cursor-pointer"
                />
                <span className="text-[11px] font-mono text-sky-300 w-8 text-right">
                  {settings.lightIntensity.toFixed(1)}x
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: Dynamics & Stage Controls */}
          {activeTab === 'dynamics' && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, hoverFloat: !prev.hoverFloat }))
                }
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  settings.hoverFloat
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Melayang (Levitasi)</span>
              </button>

              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, showPedestal: !prev.showPedestal }))
                }
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  settings.showPedestal
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Pedestal Runa Es</span>
              </button>

              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, showParticles: !prev.showParticles }))
                }
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  settings.showParticles
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Partikel Salju & Es</span>
              </button>

              {/* Rotation speed slider */}
              {settings.autoRotate && (
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 ml-auto">
                  <span className="text-[11px] text-slate-400">Kecepatan Putar:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={settings.rotateSpeed}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateSettings((prev) => ({ ...prev, rotateSpeed: val }));
                    }}
                    className="w-20 accent-sky-400 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-sky-300">
                    {settings.rotateSpeed.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
