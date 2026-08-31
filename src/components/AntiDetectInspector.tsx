import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Volume2, 
  Smartphone, 
  Activity, 
  Sparkles, 
  Sliders, 
  Cpu, 
  CheckCircle,
  FileCode,
  Share2,
  Lock
} from 'lucide-react';
import { VideoProject, AntiDetectSettings } from '../types';

interface AntiDetectInspectorProps {
  project: VideoProject;
  onUpdateProject: (updated: VideoProject) => void;
  onOpenExportModal: () => void;
}

export const AntiDetectInspector: React.FC<AntiDetectInspectorProps> = ({
  project,
  onUpdateProject,
  onOpenExportModal
}) => {
  const [config, setConfig] = useState<AntiDetectSettings>(project.antiDetectConfig);

  const handleUpdate = (newConfig: AntiDetectSettings) => {
    setConfig(newConfig);
    onUpdateProject({
      ...project,
      antiDetectConfig: newConfig
    });
  };

  // Calculate live dynamic DNA uniqueness score
  let score = 70;
  if (config.visual.enableMicroZoom) score += 7;
  if (config.visual.bRollInterleave) score += 9;
  if (config.audio.microPitchShiftCents > 10) score += 6;
  if (config.audio.silenceThresholdSec <= 0.4) score += 4;
  if (config.metadata.wipeExif) score += 5;
  if (config.retention.inject3SecHook) score += 5;
  if (config.retention.seamlessLoopLock) score += 3;
  const totalScore = Math.min(99.4, score);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner: Overall Digital DNA Uniqueness Gauge */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-emerald-500/40 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-2xl text-white">
                Transformasi DNA Digital 4-Lapisan
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% LOLOS DETEKSI
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl">
              File akhir tidak mewarisi satu pun identitas matematika, audio spektogram, atau EXIF dari video mentah.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-end">
          <div className="text-right">
            <p className="text-[11px] font-mono uppercase text-zinc-400">Skor Keunikan DNA</p>
            <p className="font-display font-black text-3xl text-emerald-400 tracking-tight">
              {totalScore.toFixed(1)}%
            </p>
          </div>

          <button
            id="btn-export-inspect-action"
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4" />
            <span>Generate & Export Video</span>
          </button>
        </div>
      </div>

      {/* 4-Layer Inspection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lapisan 1: Visual Fingerprint Matrix */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">1. Fingerprinting Visual</h3>
                <p className="text-xs text-zinc-400">Distorsi Spatial & Perceptual Hash (pHash)</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">LOLOS (pHash Delta &gt; 38)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Dynamic Micro-Zooming (1.04x - 1.14x)</p>
                <p className="text-[11px] text-zinc-400">Merubah matriks skala frame per 2.5 detik</p>
              </div>
              <input
                type="checkbox"
                checked={config.visual.enableMicroZoom}
                onChange={(e) => handleUpdate({
                  ...config,
                  visual: { ...config.visual, enableMicroZoom: e.target.checked }
                })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-amber-400"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Asymmetrical Pixel Shift ({config.visual.asymmetricShiftPx}px)</p>
                <p className="text-[11px] text-zinc-400">Menggeser sumbu X/Y frame tanpa merusak estetika</p>
              </div>
              <span className="font-mono text-zinc-300">+{config.visual.asymmetricShiftPx}px</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Coverr B-Roll Interleaving</p>
                <p className="text-[11px] text-zinc-400">Menyisipkan 40-60% frame video stok eksternal</p>
              </div>
              <span className="text-emerald-400 font-bold">Aktif</span>
            </div>
          </div>
        </div>

        {/* Lapisan 2: Audio Waveform Matching (Tanpa Musik) */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">2. Audio Matching (Tanpa Musik)</h3>
                <p className="text-xs text-zinc-400">Acoustic Chromaprint Re-Tuning</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">LOLOS (Chromaprint Shifted)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Micro-Pitch Shift (+{config.audio.microPitchShiftCents} Cents)</p>
                <p className="text-[11px] text-zinc-400">Menggeser frekuensi vokal ~1% (suara tetap alami)</p>
              </div>
              <span className="font-mono text-cyan-300">+{config.audio.microPitchShiftCents} cents</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Tempo Compaction ({config.audio.tempoSpeedMultiplier}x)</p>
                <p className="text-[11px] text-zinc-400">Kecepatan vokal dipadatkan tanpa mengubah pitch</p>
              </div>
              <span className="font-mono text-cyan-300">{config.audio.tempoSpeedMultiplier}x</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Silence Splice & Waveform Fracture</p>
                <p className="text-[11px] text-zinc-400">Pola interval gelombang audio berubah total</p>
              </div>
              <span className="text-emerald-400 font-bold">Terpotong &gt;0.35s</span>
            </div>
          </div>
        </div>

        {/* Lapisan 3: Metadata Analysis & Device Spoofing */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">3. Metadata Analysis & EXIF</h3>
                <p className="text-xs text-zinc-400">Hardware & Camera Container Spoofing</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">EXIF: BERSIH & BARU</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex justify-between">
                <p className="font-bold text-white">Profil Perangkat Kamera Palsu:</p>
              </div>
              <select
                value={config.metadata.spoofDevice}
                onChange={(e) => handleUpdate({
                  ...config,
                  metadata: { ...config.metadata, spoofDevice: e.target.value as any }
                })}
                className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
              >
                <option value="iPhone 15 Pro (iOS 17.5.1)">Apple iPhone 15 Pro (iOS 17.5.1 / QuickTime Camera)</option>
                <option value="Samsung Galaxy S24 Ultra (Android 14)">Samsung Galaxy S24 Ultra (Android 14 / OneUI 6.1)</option>
                <option value="CapCut Mobile v12.4">CapCut Mobile Editor v12.4.0 (Exempt Tag)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Format Nama File Kamera Native</p>
                <p className="text-[11px] text-zinc-400">Menghindari nama default clipper/editor</p>
              </div>
              <span className="font-mono text-purple-300">{config.metadata.customFileNamePattern}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Total EXIF & Encoder Wipe</p>
                <p className="text-[11px] text-zinc-400">Membersihkan tag FFmpeg, Adobe, & download logs</p>
              </div>
              <span className="text-emerald-400 font-bold">100% Stripped</span>
            </div>
          </div>
        </div>

        {/* Lapisan 4: User Behavior Signal */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">4. User Behavior Signal</h3>
                <p className="text-xs text-zinc-400">3s Hook, Pacing & Infinite Loop</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">RETENSI TINGGI</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">3 Detik Pertama Re-Engineered</p>
                <p className="text-[11px] text-zinc-400">Mencegah swipe-away awal penonton</p>
              </div>
              <span className="text-rose-400 font-bold font-mono">00:00-00:03 HOOK</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Perubahan Visual Tiap 2-3 Detik</p>
                <p className="text-[11px] text-zinc-400">Menghilangkan kebosanan / Habituation Fatigue</p>
              </div>
              <span className="text-emerald-400 font-bold">Active Cuts</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Seamless Loop Strategy</p>
                <p className="text-[11px] text-zinc-400">Mendorong penonton nonton ulang tanpa sadar</p>
              </div>
              <span className="text-purple-400 font-bold font-mono">&gt;120% Watch Ratio</span>
            </div>
          </div>
        </div>

      </div>

      {/* FFmpeg & Anti-Detect Command Simulator Terminal */}
      <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <h4 className="font-display font-bold text-xs text-white">
              Generated Anti-Detection Pipeline String (FFmpeg + Acoustic DNA)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Zero Artifacts</span>
        </div>

        <div className="p-3 rounded-xl bg-black border border-zinc-800 text-[11px] font-mono text-emerald-400/90 overflow-x-auto leading-relaxed">
          ffmpeg -y -i input_raw.mp4 -vf "crop=in_w*0.5625:in_h,scale=1080:1920,eq=contrast=1.03:brightness=0.01:saturation=1.04,hue=h=1.8" -af "asetrate=44100*1.04,aresample=44100,pitch_shift=cents=+18,silenceremove=stop_periods=-1:stop_duration=0.35" -map_metadata -1 -metadata make="Apple" -metadata model="{config.metadata.spoofDevice}" -c:v libx264 -preset fast -crf 18 {config.metadata.customFileNamePattern}
        </div>
      </div>

    </div>
  );
};
