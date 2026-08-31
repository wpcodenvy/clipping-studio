import React, { useState } from 'react';
import { 
  Ear, 
  Scissors, 
  VolumeX, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Users,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { VideoProject, WhisperWord, SpeakerId } from '../types';

interface WhisperTranscribeViewProps {
  project: VideoProject;
  onUpdateProject: (updated: VideoProject) => void;
  onNextStep: () => void;
}

export const WhisperTranscribeView: React.FC<WhisperTranscribeViewProps> = ({
  project,
  onUpdateProject,
  onNextStep
}) => {
  const [selectedWord, setSelectedWord] = useState<WhisperWord | null>(null);
  const [speakerFilter, setSpeakerFilter] = useState<SpeakerId | 'all'>('all');
  const [autoCutSilence, setAutoCutSilence] = useState(true);
  const [removeFillers, setRemoveFillers] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const isMultiSpeaker = (project.speakersCount && project.speakersCount > 1) || project.whisperTranscript.hasOverlappingSpeech;
  const totalWords = project.whisperTranscript.words.length;
  const totalSilenceSeconds = project.silences
    .filter(s => s.isCut)
    .reduce((acc, curr) => acc + curr.duration, 0);

  const estimatedNewDuration = Math.max(12, project.durationSec - totalSilenceSeconds);
  const timeSavedPercent = Math.round((totalSilenceSeconds / (project.durationSec || 1)) * 100);

  const filteredWords = project.whisperTranscript.words.filter(w => {
    if (speakerFilter === 'all') return true;
    if (speakerFilter === 'both') return w.isOverlapping;
    return w.speaker === speakerFilter;
  });

  const toggleSilenceCut = (silenceId: string) => {
    const updatedSilences = project.silences.map(s => 
      s.id === silenceId ? { ...s, isCut: !s.isCut } : s
    );
    onUpdateProject({
      ...project,
      silences: updatedSilences
    });
  };

  const toggleFillerWord = (fillerId: string) => {
    const updatedFillers = project.fillers.map(f => 
      f.id === fillerId ? { ...f, isRemoved: !f.isRemoved } : f
    );
    onUpdateProject({
      ...project,
      fillers: updatedFillers
    });
  };

  const handleSimulateGroqReprocess = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setIsTranscribing(false);
    }, 900);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner: Groq Whisper Large v3 + PyAnnote Diarization Stats */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Ear className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-black text-xl text-white">Groq Whisper v3 + PyAnnote Diarization</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Word-Level Precision
              </span>
              {isMultiSpeaker && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Dual-Speaker Isolated
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Mendeteksi mikro-stempel kata, memisahkan identitas pembicara (Host vs Tamu), dan menangani cross-talk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateGroqReprocess}
            disabled={isTranscribing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTranscribing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isTranscribing ? 'Memproses Ulang...' : 'Re-sync Groq v3'}</span>
          </button>

          <button
            id="btn-proceed-muse"
            onClick={onNextStep}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <span>Kirim ke Muse Sutradara</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Total Kata Terdeteksi</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-display font-bold text-2xl text-white">{totalWords}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Akurasi rata-rata: 98.6%</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Jeda Sunyi Dipangkas</span>
            <VolumeX className="w-4 h-4 text-rose-400" />
          </div>
          <p className="font-display font-bold text-2xl text-rose-400">-{totalSilenceSeconds.toFixed(1)}s</p>
          <p className="text-[11px] text-zinc-500 mt-1">{project.silences.length} celah jeda &gt;0.3 detik</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Pemisahan Pembicara</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="font-display font-bold text-2xl text-purple-300">
            {isMultiSpeaker ? '2 Track (PyAnnote)' : '1 Track Solo'}
          </p>
          <p className="text-[11px] text-purple-400/90 mt-1 font-medium">
            {project.whisperTranscript.hasOverlappingSpeech ? 'Cross-talk isolasi aktif' : 'Single channel clean'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Efisiensi Quota Groq</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="font-display font-bold text-2xl text-cyan-400">75% Hemat</p>
          <p className="text-[11px] text-zinc-500 mt-1">Mono 16kHz chunking</p>
        </div>

      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Word Cloud & Timestamps */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Transkrip Mikro Berstempel Kata & Diarization</span>
            </h3>

            {/* Multi-Speaker Filter Tabs */}
            {isMultiSpeaker && (
              <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs">
                <button
                  onClick={() => setSpeakerFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    speakerFilter === 'all' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Semua ({project.whisperTranscript.words.length})
                </button>
                <button
                  onClick={() => setSpeakerFilter('speaker_1')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    speakerFilter === 'speaker_1' ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-zinc-400 hover:text-amber-300'
                  }`}
                >
                  {project.speakerNames?.speaker_1 || 'Speaker 1 (Host)'}
                </button>
                <button
                  onClick={() => setSpeakerFilter('speaker_2')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    speakerFilter === 'speaker_2' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-zinc-400 hover:text-cyan-300'
                  }`}
                >
                  {project.speakerNames?.speaker_2 || 'Speaker 2 (Tamu)'}
                </button>
                {project.whisperTranscript.hasOverlappingSpeech && (
                  <button
                    onClick={() => setSpeakerFilter('both')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      speakerFilter === 'both' ? 'bg-purple-500 text-white font-bold' : 'text-purple-400 hover:text-purple-300'
                    }`}
                  >
                    Cross-Talk
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Overlapping Cross-Talk Banner if detected */}
          {project.whisperTranscript.hasOverlappingSpeech && (
            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-purple-300">
                <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  <strong>Deteksi 2 Orang Berbicara Bersamaan (Cross-Talk):</strong> Algoritma PyAnnote mengisolasi gelombang frekuensi vokal dan menandai kata bertumpuk agar kinetic captions tetap terbaca dengan jelas (dual-color stacked).
                </span>
              </div>
            </div>
          )}

          {/* Interactive Word Pills Box */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 min-h-[260px] max-h-[420px] overflow-y-auto leading-relaxed flex flex-wrap gap-1.5 items-center content-start">
            {filteredWords.map((w, idx) => {
              const isSelected = selectedWord?.word === w.word && selectedWord?.start === w.start;
              const isHookCandidate = (w.start >= 6.8 && w.start <= 13.5) || (w.start >= 14.5 && w.start <= 22.3) || w.start <= 3.9;
              const isSpeaker2 = w.speaker === 'speaker_2';
              const isOverlapping = w.isOverlapping;

              return (
                <button
                  key={`${w.word}_${idx}_${w.start}`}
                  onClick={() => setSelectedWord(w)}
                  className={`group relative px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-zinc-950 font-bold scale-105 shadow-md shadow-amber-400/30'
                      : isOverlapping
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-500/50 hover:bg-purple-500/30'
                      : isSpeaker2
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25'
                      : isHookCandidate
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                      : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span>{w.word}</span>
                  <span className="ml-1 text-[9px] font-mono opacity-60">
                    {w.start.toFixed(1)}s
                  </span>
                  {w.speaker && (
                    <span className={`ml-1 text-[8px] font-mono px-1 rounded ${
                      w.speaker === 'speaker_1' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {w.speaker === 'speaker_1' ? 'S1' : 'S2'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Word Inspector Box */}
          {selectedWord && (
            <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/30 flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-zinc-950 font-black text-sm">
                  "{selectedWord.word}"
                </span>
                <div className="text-xs space-y-0.5">
                  <div className="text-zinc-300">
                    Stempel: <strong className="font-mono text-amber-300">{selectedWord.start.toFixed(2)}s - {selectedWord.end.toFixed(2)}s</strong>
                    {' '}(Durasi: {(selectedWord.end - selectedWord.start).toFixed(2)}s)
                  </div>
                  <div className="text-zinc-500">
                    Pembicara: {selectedWord.speaker === 'speaker_2' ? (project.speakerNames?.speaker_2 || 'Speaker 2 (Tamu)') : (project.speakerNames?.speaker_1 || 'Speaker 1 (Host)')}
                    {selectedWord.isOverlapping && ' • [CROSS-TALK OVERLAP DETECTED]'}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                Word-Aligned Ready
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-500/50" />
              Speaker 1 (Host)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyan-500/30 border border-cyan-500/50" />
              Speaker 2 (Tamu)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-purple-500/40 border border-purple-500/60" />
              Cross-Talk Overlap
            </span>
          </div>
        </div>

        {/* Right Column: Silence & Filler Pruner */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Silence Splicer Card */}
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-rose-400" />
                <h3 className="font-display font-bold text-sm text-white">Sunyi Adalah Musuh (Silence Cut)</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoCutSilence}
                  onChange={(e) => setAutoCutSilence(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
              </label>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Memangkas jeda hening di atas 0.35 detik secara otomatis untuk menjaga atensi penonton tetap tinggi.
            </p>

            <div className="space-y-2">
              {project.silences.map((sil) => (
                <div 
                  key={sil.id}
                  onClick={() => toggleSilenceCut(sil.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                    sil.isCut
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                  }`}
                >
                  <span className="font-mono">
                    {sil.start.toFixed(2)}s - {sil.end.toFixed(2)}s
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">+{sil.duration.toFixed(2)}s jeda</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-900 border border-zinc-800">
                      {sil.isCut ? 'DIPANGKAS' : 'DIBIARKAN'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filler Word Remover */}
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-sm text-white">Prune Basa-Basi Pembuka</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Auto-Prune
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Kata seperti "Halo gaes", "Kembali lagi", atau tarikan nafas panjang di 5 detik pertama langsung dieliminasi.
            </p>

            <div className="space-y-1.5">
              {project.fillers.length > 0 ? (
                project.fillers.map((fil) => (
                  <div
                    key={fil.id}
                    onClick={() => toggleFillerWord(fil.id)}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs cursor-pointer hover:border-zinc-700"
                  >
                    <span className="text-zinc-300 line-through italic">"{fil.word}"</span>
                    <span className="text-emerald-400 font-mono text-[10px]">Tereliminasi</span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-zinc-950 text-zinc-500 text-xs text-center border border-zinc-800">
                  Tidak ada filler basa-basi berlebih pada video ini.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

