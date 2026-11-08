import React from 'react';
import { X, Download, Shield, Sparkles, User } from 'lucide-react';
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

          {/* Banner Title & Veterna Brand */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-slate-950/90 border border-sky-400/40 p-1.5 flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
              <img
                src="/images/logo_veterna.png"
                alt="Logo Veterna"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-950/80 border border-sky-700/60 text-sky-300 font-bold">
                  VETERNA
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/80 border border-slate-700 text-slate-300">
                  Maskot Resmi
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 border border-amber-800/40 text-amber-300">
                  Burung Hantu
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide">
                Maskot Burung Hantu Veterna
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
                <span className="text-slate-400">Nama Maskot: </span>
                <span className="text-sky-300 font-semibold">
                  burung hantu veterna
                </span>
              </div>
              <div>
                <span className="text-slate-400">Kreator: </span>
                <span className="text-slate-200 font-mono font-medium">
                  {stats?.author || 'Dzaky Nafil'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400">Model ID: </span>
                <span className="text-slate-200 font-mono text-[11px]">
                  {stats?.id || '11289'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400">Deskripsi Maskot: </span>
                <span className="text-slate-300">
                  Maskot Burung Hantu Veterna melambangkan kebijaksanaan dan perlindungan abadi, diwujudkan dalam rupa ksatria bersayap perak dengan helm kristal es dan jubah biru Veterna.
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
                <div className="font-semibold text-sky-300">Glacial Helm (Helm Burung Hantu Es)</div>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  Helm bertanduk es glasial khas burung hantu dengan visor bercahaya biru magis.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl">
                <div className="font-semibold text-sky-300">Aegis Wings (Sayap Perak Burung Hantu)</div>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  Pelat sayap mekanikal di punggung melambangkan kecepatan dan kebebasan terbang.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl">
                <div className="font-semibold text-sky-300">Cobalt Silk Mantle (Jubah Biru Veterna)</div>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  Jubah sutra kobalt beraksen kehormatan khas identitas warna Veterna.
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
          <div className="text-xs text-slate-400 font-mono">
            ID: <span className="text-slate-300">{stats?.id || '3dveterna28'}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/models/armored_knight.glb"
              download="maskot_burung_hantu_veterna.glb"
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
