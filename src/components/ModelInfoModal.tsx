import React from 'react';
import { X, Download, ExternalLink, Shield, Cpu, Sparkles, User, Box } from 'lucide-react';
import { ModelStats } from '../types.ts';

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ModelStats | null;
}

export const ModelInfoModal: React.FC<ModelInfoModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with character preview banner */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent overflow-hidden border-b border-slate-800/80">
          <img
            src="/images/character_preview.webp"
            alt="Armored Knight Preview"
            className="w-full h-full object-cover object-top opacity-50 scale-105 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner Title */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-950/80 border border-sky-700/60 text-sky-300">
                  Tripo3D Karakter
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/80 border border-slate-700 text-slate-300">
                  PBR Asset
                </span>
              </div>
              <h2 className="text-2xl font-bold font-display text-white tracking-wide">
                Aethelgard The Frostbound
              </h2>
              <p className="text-xs text-sky-300/90 font-medium">
                Winged Armored Knight in Silver Armor with Blue Cape and Icy Helm
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Quick Technical Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl flex flex-col">
              <span className="text-[11px] text-slate-400">Total Vertices</span>
              <span className="text-base font-mono font-bold text-sky-400 mt-0.5">
                {stats?.vertices ? stats.vertices.toLocaleString() : '2,016,526'}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl flex flex-col">
              <span className="text-[11px] text-slate-400">Total Poligon</span>
              <span className="text-base font-mono font-bold text-sky-400 mt-0.5">
                {stats?.triangles ? stats.triangles.toLocaleString() : '672,175'}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl flex flex-col">
              <span className="text-[11px] text-slate-400">Kompresi</span>
              <span className="text-base font-mono font-bold text-emerald-400 mt-0.5">
                EXT_meshopt
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl flex flex-col">
              <span className="text-[11px] text-slate-400">Ukuran Model</span>
              <span className="text-base font-mono font-bold text-amber-400 mt-0.5">
                {stats?.fileSize || '17.9 MB'}
              </span>
            </div>
          </div>

          {/* Metadata & Origin */}
          <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Detail Metadata Karakter</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Kreator: </span>
                <span className="text-slate-200 font-mono font-medium">
                  {stats?.author || 'abhiprayadamas2008'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Model ID: </span>
                <span className="text-slate-200 font-mono text-[11px]">
                  {stats?.id || '3baf7a5e-83b0-47ff-b0a5-40ccd8dde884'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400">Prompt Asli: </span>
                <span className="text-slate-300 italic">
                  "{stats?.description || 'winged armored knight in silver armor with blue cape and icy helm'}"
                </span>
              </div>
            </div>
          </div>

          {/* Equipment & Armor Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>Komponen Baju Zirah & Perlengkapan</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl">
                <div className="font-semibold text-sky-300">Glacial Helm (Helm Kristal Es)</div>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  Helm perak bertanduk es glasial dengan visor bercahaya biru magis.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl">
                <div className="font-semibold text-sky-300">Aegis Wings (Sayap Perak Bersayap)</div>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  Pelat sayap mekanikal di punggung untuk manuver dan pertahanan angkasa.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl">
                <div className="font-semibold text-sky-300">Cobalt Silk Mantle (Jubah Biru)</div>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  Jubah sutra kobalt beraksen kerajaan yang menjuntai di balik pelat sayap.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl">
                <div className="font-semibold text-sky-300">Silver Cuirass (Zirah Pelat PBR)</div>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  Zirah baja perak krom dengan pemantulan lingkungan tinggi (high metalness).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          <a
            href="https://studio.tripo3d.ai/3d-model/3baf7a5e-83b0-47ff-b0a5-40ccd8dde884?utm_campaign=3d_model&invite_code=B1GSFP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span>Buka di Tripo3D Studio</span>
          </a>

          <div className="flex items-center gap-2">
            <a
              href="/models/armored_knight.glb"
              download="armored_knight_tripo3d.glb"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20 transition-all font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Model 3D (.GLB)</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
