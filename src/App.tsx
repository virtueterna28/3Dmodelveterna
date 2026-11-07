import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas.tsx';
import { HeaderNav } from './components/HeaderNav.tsx';
import { ControlDock } from './components/ControlDock.tsx';
import { ModelInfoModal } from './components/ModelInfoModal.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { CameraPreset, ModelStats, ViewerSettings } from './types.ts';
import { playChimeSound, playClickSound, playWhooshSound } from './utils/audio.ts';

export default function App() {
  const [settings, setSettings] = useState<ViewerSettings>({
    renderMode: 'pbr',
    environment: 'citadel',
    autoRotate: true,
    rotateSpeed: 0.8,
    hoverFloat: true,
    showPedestal: true,
    showParticles: true,
    wireframeColor: '#38bdf8',
    lightIntensity: 1.0,
    soundEnabled: true,
  });

  const [activeCameraPreset, setActiveCameraPreset] = useState<CameraPreset>('front');
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(10);
  const [loadStatus, setLoadStatus] = useState<string>('Menghubungkan ke 3D Engine...');
  const [stats, setStats] = useState<ModelStats | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const snapshotExporterRef = useRef<(() => string) | null>(null);

  // Sound triggers
  const triggerSound = useCallback(
    (type: 'click' | 'chime' | 'whoosh') => {
      if (!settings.soundEnabled) return;
      if (type === 'click') playClickSound();
      else if (type === 'chime') playChimeSound(640);
      else if (type === 'whoosh') playWhooshSound();
    },
    [settings.soundEnabled]
  );

  // Settings update with sound feedback
  const handleUpdateSettings = useCallback(
    (updater: (prev: ViewerSettings) => ViewerSettings) => {
      setSettings((prev) => {
        const next = updater(prev);
        if (next.renderMode !== prev.renderMode) {
          triggerSound('chime');
        } else if (next.environment !== prev.environment) {
          triggerSound('chime');
        } else {
          triggerSound('click');
        }
        return next;
      });
    },
    [triggerSound]
  );

  // Camera preset selector
  const handleSelectCameraPreset = useCallback(
    (preset: CameraPreset) => {
      setActiveCameraPreset(preset);
      triggerSound('whoosh');
    },
    [triggerSound]
  );

  // Reset view
  const handleResetView = useCallback(() => {
    setActiveCameraPreset('front');
    triggerSound('whoosh');
  }, [triggerSound]);

  // Snapshot capture
  const handleTakeSnapshot = useCallback(() => {
    if (!snapshotExporterRef.current) return;
    try {
      triggerSound('click');
      const dataUrl = snapshotExporterRef.current();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `aethelgard-knight-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Snapshot failed:', err);
    }
  }, [triggerSound]);

  // Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    triggerSound('click');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, [triggerSound]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if inside input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'h' || e.key === 'H') {
        setIsDockCollapsed((prev) => !prev);
        triggerSound('click');
      } else if (e.key === ' ') {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, autoRotate: !prev.autoRotate }));
        triggerSound('click');
      } else if (e.key === 'r' || e.key === 'R') {
        handleResetView();
      } else if (e.key === 'm' || e.key === 'M') {
        setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
      } else if (e.key === '1') {
        handleSelectCameraPreset('front');
      } else if (e.key === '2') {
        handleSelectCameraPreset('helm');
      } else if (e.key === '3') {
        handleSelectCameraPreset('wings');
      } else if (e.key === '4') {
        handleSelectCameraPreset('hero');
      } else if (e.key === '5') {
        handleSelectCameraPreset('top');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleResetView, handleSelectCameraPreset, triggerSound]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D Scene Viewport */}
      <ThreeCanvas
        settings={settings}
        activeCameraPreset={activeCameraPreset}
        onCameraPresetChange={setActiveCameraPreset}
        onStatsReady={(newStats) => setStats(newStats)}
        onLoadProgress={(percent, status) => {
          setLoadProgress(percent);
          setLoadStatus(status);
        }}
        onLoadComplete={() => {
          setIsLoading(false);
          triggerSound('chime');
        }}
        canvasRefCallback={(exportFn) => {
          snapshotExporterRef.current = exportFn;
        }}
      />

      {/* Top Navigation Overlay */}
      <HeaderNav
        characterTitle="Aethelgard The Frostbound"
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onTakeSnapshot={handleTakeSnapshot}
        onOpenInfo={() => {
          setIsInfoOpen(true);
          triggerSound('click');
        }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Collapsible Bottom Control Dock */}
      <ControlDock
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        activeCameraPreset={activeCameraPreset}
        onSelectCameraPreset={handleSelectCameraPreset}
        onResetView={handleResetView}
        collapsed={isDockCollapsed}
        onToggleCollapsed={() => {
          setIsDockCollapsed((prev) => !prev);
          triggerSound('click');
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingScreen progress={loadProgress} status={loadStatus} />
      )}

      {/* Model Specs & Character Lore Dossier */}
      <ModelInfoModal
        isOpen={isInfoOpen}
        onClose={() => {
          setIsInfoOpen(false);
          triggerSound('click');
        }}
        stats={stats}
      />
    </main>
  );
}
