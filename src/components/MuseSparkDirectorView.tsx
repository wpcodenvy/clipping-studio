import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Repeat, 
  Hash, 
  Clock, 
  Film, 
  Copy, 
  Check, 
  RefreshCw, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Layers,
  Sliders,
  Crown
} from 'lucide-react';
import { VideoProject, MuseDirectorPlan } from '../types';
import { requestMuseDirectorPlan } from '../services/api';
import { PublicFigureAuthorityPanel } from './PublicFigureAuthorityPanel';

interface MuseSparkDirectorViewProps {
  project: VideoProject;
  onUpdateProject: (updated: VideoProject) => void;
  onNextStep: () => void;
  customApiKey?: string;
  customBaseUrl?: string;
}

export const MuseSparkDirectorView: React.FC<MuseSparkDirectorViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
  customApiKey,
  customBaseUrl
}) => {
  const [nicheInput, setNicheInput] = useState('Afiliasi & Bisnis Digital');
  const [targetDuration, setTargetDuration] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedAllTags, setCopiedAllTags] = useState(false);

  const director = project.directorPlan;

  const handleRegenerateDirector = async () => {
    setIsLoading(true);
    try {
      const res = await requestMuseDirectorPlan(
        project.whisperTranscript,
        nicheInput,
        targetDuration,
        customApiKey,
        customBaseUrl,
        project.publicFigureConfig?.activeFigure
      );

      if (res && res.data) {
        onUpdateProject({
          ...project,
          directorPlan: res.data
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTag(text);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const copyAllHashtags = () => {
    if (!director?.nicheHashtags) return;
    const joined = director.nicheHashtags.join(' ');
    navigator.clipboard.writeText(joined);
    setCopiedAllTags(true);
    setTimeout(() => setCopiedAllTags(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner: Muse Spark Director Reasoning */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-xl text-white">Muse Spark: Sutradara Viral & Rekayasa Loop</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Director Intelligence
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Merekonstruksi alur cerita, menempatkan Hook dramatis di detik 0-3, dan membangun korelasi loop tak terputus.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleRegenerateDirector}
            disabled={isLoading}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isLoading ? 'Sutradara Berpikir...' : 'Re-Direct Storyboard'}</span>
          </button>

          <button
            id="btn-proceed-coverr"
            onClick={onNextStep}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <span>Lanjut ke Coverr Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Director Parameter Controls Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 shrink-0">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            Kategori Niche:
          </span>
          <input
            type="text"
            value={nicheInput}
            onChange={(e) => setNicheInput(e.target.value)}
            placeholder="Contoh: Afiliasi Shopee, Edukasi Finansial, Diet Sehat"
            className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-300 shrink-0">Target Durasi:</span>
          <div className="flex items-center gap-1">
            {[15, 20, 25, 30].map((d) => (
              <button
                key={d}
                onClick={() => setTargetDuration(d)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                  targetDuration === d
                    ? 'bg-amber-400 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Public Figure Authority & Celebrity Hook Generator Panel */}
      <PublicFigureAuthorityPanel
        project={project}
        onUpdateProject={onUpdateProject}
        customApiKey={customApiKey}
        customBaseUrl={customBaseUrl}
      />

      {director && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 3-Second Hook & Seamless Loop Strategy */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. 3-Detik Pertama Adalah Segalanya (Hook Re-ordering) */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-amber-500/30 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h3 className="font-display font-bold text-base text-white">
                    3 Detik Pertama Adalah Segalanya
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {director.viralHookType}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Momen klimaks di video asli ditarik secara cerdas ke detik <strong>00:00 - 00:03</strong> untuk menghentikan refleks scrolling jempol penonton.
              </p>

              {/* Hook Re-ordering Comparison Box */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    Asal: {director.hookStartSec.toFixed(1)}s - {director.hookEndSec.toFixed(1)}s (Bagian Tengah)
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    Dipindahkan &rarr; 00:00 - 00:03
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-bold text-sm">
                  "{director.hookTitle}"
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    Efek Psikologis: Memicu rasa penasaran instan & menurunkan rasio drop-off 3 detik awal hingga 65%.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Seamless Loop Strategy (06) */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-purple-500/30 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-purple-400" />
                  <h3 className="font-display font-bold text-base text-white">
                    Seamless Loop Strategy (Infinite Playback)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Skor Loop: {director.loopBridge.seamlessLoopScore}%
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Kalimat akhir klip dirancang berkesinambungan menjawab pertanyaan atau kalimat pembuka di detik 0:00. Penonton memutar video lebih dari satu kali secara natural.
              </p>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                <div className="text-xs text-zinc-400">
                  <span className="font-bold text-purple-300">Kalimat Penutup Klip:</span>
                  <div className="mt-1 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs italic">
                    "{director.loopBridge.closingSentence}"
                  </div>
                </div>

                <div className="text-xs text-zinc-400">
                  <span className="font-bold text-emerald-400">Menyatu Balik ke Pembuka:</span>
                  <div className="mt-1 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                    {director.loopBridge.connectionToHook}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Multiplikasi Retensi Platform:
                </span>
                <span className="font-mono font-bold text-purple-300">&gt; 120% Watch Completion</span>
              </div>
            </div>

            {/* 3. Hashtags Niche Spesifik (Zero Spam Tags) */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-display font-bold text-base text-white">
                    Hashtags Niche Spesifik
                  </h3>
                </div>
                <button
                  id="btn-copy-all-hashtags"
                  onClick={copyAllHashtags}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                >
                  {copiedAllTags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAllTags ? 'Tersalin Semua!' : 'Salin Semua'}</span>
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Bebas dari hashtag sampah seperti <span className="line-through text-rose-400">#fyp</span> atau <span className="line-through text-rose-400">#viral</span>. Menghasilkan tag niche spesifik yang memperjelas kategorisasi klip ke audiens tertarget & SEO pencarian TikTok/Shopee.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {director.nicheHashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => copyToClipboard(tag)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-300 text-xs font-mono transition-all group"
                  >
                    <span>{tag}</span>
                    {copiedTag === tag ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-600 group-hover:text-cyan-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Visual Pacing Timeline (Events every 2-2.5 seconds) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Pacing Storyboard (Perubahan Visual Tiap 2-3 Detik)</span>
              </h3>
              <span className="text-xs text-zinc-500 font-mono">
                {director.pacingEvents.length} Sequence Events
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Prinsip 2-3 detik: Visual tidak boleh statis agar mata penonton tidak mengalami kejenuhan visual (Habituation Fatigue).
            </p>

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {director.pacingEvents.map((evt, idx) => {
                const isHook = evt.action === 'HOOK_PUNCH_ZOOM';
                const isBRoll = evt.action === 'B_ROLL_OVERLAY';

                return (
                  <div
                    key={`${evt.timeSec}_${idx}`}
                    className={`p-4 rounded-2xl border transition-all ${
                      isHook
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                        : isBRoll
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-zinc-950 text-white border border-zinc-800">
                          {evt.timeSec.toFixed(1)}s - {(evt.timeSec + evt.durationSec).toFixed(1)}s
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {evt.action.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-zinc-400">
                        {evt.zoomScale > 1.0 ? `Zoom ${evt.zoomScale}x` : 'Full Frame'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {evt.captionEmphasis && (
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Text Pop: "{evt.captionEmphasis}"
                        </div>
                      )}

                      {evt.bRollQuery && (
                        <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] bg-zinc-950/80 p-2 rounded-lg border border-zinc-800">
                          <Film className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                          <span className="truncate">Coverr Query: "{evt.bRollQuery}"</span>
                        </div>
                      )}

                      <p className="text-zinc-400 text-[11px] italic">
                        {evt.directorNote}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
