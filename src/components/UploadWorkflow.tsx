import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  FileVideo, 
  Play, 
  Volume2, 
  Clock, 
  Film,
  Zap,
  CheckCircle,
  FileCheck,
  Link,
  Terminal,
  Shield,
  Layers,
  Users
} from 'lucide-react';
import { VideoProject } from '../types';
import { sampleProjects, defaultAntiDetectSettings } from '../data/sampleVideos';

interface UploadWorkflowProps {
  currentProject: VideoProject | null;
  onSelectProject: (project: VideoProject) => void;
  onNextStep: () => void;
}

export const UploadWorkflow: React.FC<UploadWorkflowProps> = ({
  currentProject,
  onSelectProject,
  onNextStep
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputTab, setInputTab] = useState<'upload' | 'ytdlp'>('ytdlp');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  // yt-dlp Ingestion State
  const [ytUrl, setYtUrl] = useState('');
  const [ytdlpFormat, setYtdlpFormat] = useState<'audio_first' | 'best_1080p' | 'mobile_720p'>('audio_first');
  const [useAndroidBypass, setUseAndroidBypass] = useState(true);
  const [isYtdlpRunning, setIsYtdlpRunning] = useState(false);
  const [ytdlpLogs, setYtdlpLogs] = useState<string[]>([]);

  const handleFileUpload = (file: File) => {
    setIsProcessingFile(true);
    setProcessingStatus('Mengekstrak stream audio & menganalisis container metadata...');

    const videoUrl = URL.createObjectURL(file);
    const videoElem = document.createElement('video');
    videoElem.src = videoUrl;

    videoElem.onloadedmetadata = () => {
      setTimeout(() => {
        setProcessingStatus('Memetakan gelombang suara (Acoustic Waveform Matrix)...');
      }, 500);

      setTimeout(() => {
        const newProject: VideoProject = {
          id: `custom_${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
          sourceUrl: videoUrl,
          fileName: file.name,
          fileSizeBytes: file.size,
          durationSec: Math.round(videoElem.duration || 25),
          resolution: {
            width: videoElem.videoWidth || 1920,
            height: videoElem.videoHeight || 1080
          },
          audioExtracted: true,
          speakersCount: 1,
          whisperTranscript: {
            text: "Video lokal asli berhasil diunggah. Siap dianalisis oleh Groq Whisper v3 dan AI Sutradara untuk ekstraksi kalimat berbobot, pembuatan hook 3 detik, dan overlay nama tokoh.",
            detectedLanguage: "id",
            words: [
              { word: "Video", start: 0.0, end: 0.4, probability: 0.99, speaker: 'speaker_1' },
              { word: "lokal", start: 0.42, end: 0.8, probability: 0.98, speaker: 'speaker_1' },
              { word: "asli", start: 0.82, end: 1.2, probability: 0.99, speaker: 'speaker_1' },
              { word: "berhasil", start: 1.22, end: 1.7, probability: 0.99, speaker: 'speaker_1' },
              { word: "diunggah.", start: 1.72, end: 2.2, probability: 0.98, speaker: 'speaker_1' },
              { word: "Siap", start: 2.3, end: 2.6, probability: 0.99, speaker: 'speaker_1' },
              { word: "diproses", start: 2.62, end: 3.1, probability: 0.99, speaker: 'speaker_1' },
              { word: "ke", start: 3.12, end: 3.3, probability: 0.99, speaker: 'speaker_1' },
              { word: "tahap", start: 3.32, end: 3.6, probability: 0.99, speaker: 'speaker_1' },
              { word: "berikutnya.", start: 3.62, end: 4.2, probability: 0.99, speaker: 'speaker_1' }
            ],
            segments: [
              { id: 1, start: 0.0, end: 4.2, text: "Video lokal asli berhasil diunggah. Siap diproses ke tahap berikutnya.", speaker: 'speaker_1' }
            ]
          },
          silences: [
            { id: 'sil_cust1', start: 2.2, end: 2.3, duration: 0.1, isCut: true }
          ],
          fillers: [],
          directorPlan: null,
          selectedStockVideos: {},
          faceTrackingPoints: [
            { x: 0.5, y: 0.4, width: 0.28, height: 0.38, confidence: 0.98, timestamp: 0.0, speakerId: 'speaker_1' }
          ],
          antiDetectConfig: {
            ...defaultAntiDetectSettings,
            metadata: {
              ...defaultAntiDetectSettings.metadata,
              customFileNamePattern: `IMG_${Math.floor(1000 + Math.random() * 9000)}.MOV`
            }
          },
          trackingConfig: {
            adaptiveLerp: true,
            deadzoneThreshold: 0.03,
            upperBodyPoseFallback: true,
            kalmanPrediction: true,
            baseLerp: 0.07,
            fastVelocityLerp: 0.25
          },
          activeTrackingMode: 'single_speaker'
        };

        onSelectProject(newProject);
        setIsProcessingFile(false);
      }, 1200);
    };
  };

  const handleYtdlpIngest = (targetUrlInput?: string) => {
    const inputUrl = targetUrlInput || ytUrl || 'https://www.youtube.com/watch?v=podcast_stream';
    setIsYtdlpRunning(true);
    setYtdlpLogs([
      `[yt-dlp] Inisialisasi parser stream untuk: ${inputUrl}`,
      useAndroidBypass ? `[yt-dlp] Bypass Bot Protection: spoofing Android Client User-Agent...` : `[yt-dlp] Format: default web client...`,
    ]);

    setTimeout(() => {
      setYtdlpLogs(prev => [
        ...prev,
        `[yt-dlp] Menemukan formats: 1080p (24.3 MB), 720p (12.1 MB), audio/m4a (2.1 MB)`,
        `[yt-dlp] Mode Pipa: Audio-First Fast Stream Pipeline diaktifkan!`
      ]);
    }, 600);

    setTimeout(() => {
      setYtdlpLogs(prev => [
        ...prev,
        `[download] 100% of 2.14MiB in 00:01 at 3.82MiB/s (Audio Track)`,
        `[ffmpeg] Downmixing to 16,000 Hz Mono PCM chunk for Groq Whisper v3...`
      ]);
    }, 1200);

    setTimeout(() => {
      setYtdlpLogs(prev => [
        ...prev,
        `[pyannote] Speaker Diarization running: sinkronisasi audio stream...`,
        `[ready] Stream video & audio buffer siap di-route ke pipeline AI!`
      ]);

      const titleClean = inputUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      const newYtProject: VideoProject = {
        id: `ytdlp_${Date.now()}`,
        title: `Ingestion Stream (${titleClean || 'Online Stream'})`,
        sourceUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-42998-large.mp4',
        fileName: `stream_${Date.now()}.mp4`,
        fileSizeBytes: 28400000,
        durationSec: 28.5,
        resolution: { width: 1920, height: 1080 },
        audioExtracted: true,
        speakersCount: 1,
        whisperTranscript: {
          text: "Video stream online berhasil diambil melalui yt-dlp audio-first. Siap ditranskripsikan, dianalisis tokoh publiknya, dan dikonversi ke format vertikal 9:16.",
          detectedLanguage: "id",
          words: [
            { word: "Video", start: 0.0, end: 0.4, probability: 0.99, speaker: 'speaker_1' },
            { word: "stream", start: 0.42, end: 0.8, probability: 0.98, speaker: 'speaker_1' },
            { word: "online", start: 0.82, end: 1.2, probability: 0.99, speaker: 'speaker_1' },
            { word: "berhasil", start: 1.22, end: 1.6, probability: 0.99, speaker: 'speaker_1' },
            { word: "diambil.", start: 1.62, end: 2.1, probability: 0.98, speaker: 'speaker_1' },
            { word: "Siap", start: 2.2, end: 2.5, probability: 0.99, speaker: 'speaker_1' },
            { word: "dianalisis", start: 2.52, end: 3.1, probability: 0.99, speaker: 'speaker_1' },
            { word: "ke", start: 3.12, end: 3.3, probability: 0.99, speaker: 'speaker_1' },
            { word: "format", start: 3.32, end: 3.7, probability: 0.99, speaker: 'speaker_1' },
            { word: "9:16.", start: 3.72, end: 4.2, probability: 0.99, speaker: 'speaker_1' }
          ],
          segments: [
            { id: 1, start: 0.0, end: 4.2, text: "Video stream online berhasil diambil. Siap dianalisis ke format 9:16.", speaker: 'speaker_1' }
          ]
        },
        silences: [],
        fillers: [],
        directorPlan: null,
        selectedStockVideos: {},
        faceTrackingPoints: [
          { x: 0.5, y: 0.4, width: 0.28, height: 0.38, confidence: 0.98, timestamp: 0.0, speakerId: 'speaker_1' }
        ],
        antiDetectConfig: {
          ...defaultAntiDetectSettings,
          metadata: {
            ...defaultAntiDetectSettings.metadata,
            customFileNamePattern: `IMG_${Math.floor(1000 + Math.random() * 9000)}.MOV`
          }
        },
        trackingConfig: {
          adaptiveLerp: true,
          deadzoneThreshold: 0.03,
          upperBodyPoseFallback: true,
          kalmanPrediction: true,
          baseLerp: 0.07,
          fastVelocityLerp: 0.25
        },
        activeTrackingMode: 'single_speaker'
      };

      onSelectProject(newYtProject);
      setIsYtdlpRunning(false);
    }, 1800);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Title & Concept Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Pabrik Penyamaran Video & Rekayasa DNA Baru</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Ubah Video Mentah Menjadi Klip Viral <br className="hidden sm:inline"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
              100% Anti-Deteksi Duplikat
            </span>
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Sistem kami merombak 4 lapisan digital: <strong>Fingerprint Visual</strong>, <strong>Audio Waveform</strong>, <strong>EXIF Metadata</strong>, dan <strong>Perilaku Penonton</strong> (Multi-Speaker Diarization, Auto-Framing 9:16, & Seamless Loop).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Intake Engine (Tabs: yt-dlp URL vs File Upload) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Intake Switcher Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
              <button
                id="tab-btn-ytdlp"
                onClick={() => setInputTab('ytdlp')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  inputTab === 'ytdlp'
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>yt-dlp URL Ingestion (YouTube / TikTok / Pods)</span>
              </button>

              <button
                id="tab-btn-upload"
                onClick={() => setInputTab('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  inputTab === 'upload'
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload File Lokal</span>
              </button>
            </div>
            
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Audio-First 16kHz
            </span>
          </div>

          {/* Tab 1: yt-dlp Engine Interface */}
          {inputTab === 'ytdlp' ? (
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span>Pipa Ekstraksi yt-dlp Super Cepat</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Mengambil stream audio murni (16kHz mono) dalam ~2.5 detik tanpa membebani kuota bandwidth unduh video mentah.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 text-zinc-400 text-[10px] font-mono border border-zinc-800">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span>Android UA Bypass</span>
                </div>
              </div>

              {/* URL Input Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Target Video URL (YouTube, TikTok, Podcast):</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={ytUrl}
                      onChange={(e) => setYtUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <Link className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  </div>
                  
                  <button
                    id="btn-run-ytdlp"
                    onClick={() => handleYtdlpIngest()}
                    disabled={isYtdlpRunning}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] shrink-0"
                  >
                    {isYtdlpRunning ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        <span>Extracting Stream...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Ekstrak Stream (yt-dlp)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Presets Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-zinc-400 font-medium">Contoh Format URL Target:</span>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setYtUrl('https://www.youtube.com/watch?v=k9X8h9-Debate-Podcast')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-amber-300 transition-colors"
                  >
                    YouTube Podcast
                  </button>
                  <button
                    type="button"
                    onClick={() => setYtUrl('https://www.tiktok.com/@creator/video/7391823')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-cyan-300 transition-colors"
                  >
                    TikTok 9:16
                  </button>
                  <button
                    type="button"
                    onClick={() => setYtUrl('https://instagram.com/reel/C8jKl2x')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 transition-colors"
                  >
                    Instagram Reel
                  </button>
                </div>
              </div>

              {/* Advanced yt-dlp Settings */}
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="format" 
                      checked={ytdlpFormat === 'audio_first'}
                      onChange={() => setYtdlpFormat('audio_first')}
                      className="accent-amber-400"
                    />
                    <span className="font-bold text-amber-400">Audio-First Fast (~2.8s)</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                    <input 
                      type="radio" 
                      name="format" 
                      checked={ytdlpFormat === 'best_1080p'}
                      onChange={() => setYtdlpFormat('best_1080p')}
                      className="accent-amber-400"
                    />
                    <span>Full 1080p Stream</span>
                  </label>
                </div>

                <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={useAndroidBypass}
                    onChange={(e) => setUseAndroidBypass(e.target.checked)}
                    className="accent-emerald-400 rounded"
                  />
                  <span className="text-[11px] text-emerald-400">Bypass 403 (Android Client)</span>
                </label>
              </div>

              {/* Terminal Logs Simulation */}
              {ytdlpLogs.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 font-mono text-[11px] space-y-1 text-emerald-400/90 max-h-32 overflow-y-auto">
                  {ytdlpLogs.map((log, idx) => (
                    <div key={idx} className="leading-tight">{log}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Local File Upload Box */
            <div
              id="drop-zone-video-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 overflow-hidden ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 group-hover:bg-amber-500/20 border border-zinc-700 group-hover:border-amber-500/40 flex items-center justify-center text-zinc-300 group-hover:text-amber-400 transition-all shadow-inner">
                  <FileVideo className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">
                    Klik untuk pilih file atau seret video ke sini
                  </p>
                  <p className="text-xs text-zinc-400">
                    Podcast, webinar, tutorial produk, atau footage landscape 16:9 (MP4/MOV)
                  </p>
                </div>

                {isProcessingFile && (
                  <div className="w-full max-w-xs space-y-2 pt-2 animate-fade-in">
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-amber-500 animate-pulse rounded-full" />
                    </div>
                    <p className="text-xs font-mono text-amber-400">{processingStatus}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Loaded Project Card */}
          {currentProject && (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Video Aktif</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                        {currentProject.resolution.width}x{currentProject.resolution.height}
                      </span>
                      {currentProject.speakersCount && currentProject.speakersCount > 1 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          2 Pembicara (Diarization)
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white line-clamp-1">{currentProject.title}</h3>
                  </div>
                </div>

                <button
                  id="btn-proceed-whisper"
                  onClick={onNextStep}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
                >
                  <span>Lanjut ke Groq Whisper</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Waveform & Specs Preview */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    Acoustic Stream: 16kHz Mono Cleaned {currentProject.whisperTranscript.hasOverlappingSpeech && '• Cross-Talk Tagged'}
                  </span>
                  <span className="font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {currentProject.durationSec}s
                  </span>
                </div>

                {/* Simulated Audio Waveform Bar */}
                <div className="h-9 flex items-center gap-0.5 px-2 bg-zinc-900/80 rounded-lg overflow-hidden">
                  {Array.from({ length: 48 }).map((_, i) => {
                    const heightPct = Math.max(15, Math.sin(i * 0.4) * 50 + Math.random() * 40);
                    const isDualSpeakerSection = currentProject.speakersCount === 2 && i >= 18 && i <= 28;

                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          isDualSpeakerSection
                            ? 'bg-purple-400 h-full' // Cross-talk
                            : i % 7 === 0 
                            ? 'bg-red-500/80 h-1' // Silence marker
                            : i < 15 
                            ? 'bg-amber-400' 
                            : 'bg-emerald-400/80'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Video Monitor & Manual Test Pipeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Status Pipeline & Uji Manual</span>
            </h2>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Clean Testing Mode
            </span>
          </div>

          {currentProject ? (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/50 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Video Aktif Siap Diolah
                  </span>
                  <h3 className="font-display font-bold text-sm text-white mt-1.5 line-clamp-1">
                    {currentProject.title}
                  </h3>
                </div>
                <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Durasi:</span>
                  <span className="text-zinc-200 font-bold">{currentProject.durationSec}s</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Resolusi Asli:</span>
                  <span className="text-zinc-200 font-bold">{currentProject.resolution.width}x{currentProject.resolution.height}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <div className="text-zinc-300 font-semibold text-[11px]">Transkrip Audio Siap:</div>
                <p className="font-mono text-[11px] line-clamp-2 text-zinc-300">
                  "{currentProject.whisperTranscript.text}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={onNextStep}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Mulai Tahap 2: Groq Whisper</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-dashed border-zinc-800 space-y-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <FileVideo className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Belum Ada Video Terpilih</h4>
                <p className="text-[11px] text-zinc-400 mt-1 max-w-xs mx-auto">
                  Unggah file video lokal (.mp4, .mov, .webm) atau masukkan URL YouTube/TikTok pada tab di sebelah kiri untuk memulai pengujian.
                </p>
              </div>
            </div>
          )}

          {/* Docker & Container Test Instruction Card */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cara Test Manual via Docker:</span>
            </h4>
            <div className="p-2.5 rounded-xl bg-black border border-zinc-850 font-mono text-[10px] text-emerald-400 space-y-1 overflow-x-auto">
              <div># 1. Build Docker Image</div>
              <div className="text-zinc-300">docker build -t ai-clipper-studio .</div>
              <div className="mt-1"># 2. Run Container di Port 3000</div>
              <div className="text-zinc-300">docker run -p 3000:3000 ai-clipper-studio</div>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Semua API Key (Groq, Muse Spark, Coverr, Gemini) dapat dimasukkan langsung di GUI menu pengaturan atau via environment variable saat <code>docker run</code>.
            </p>
          </div>

          {/* Multi-Speaker & Speed Architecture Box */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Pipa DNA 4-Lapisan & Tri-Fusion Otoritas:</span>
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Video yang diproses otomatis melewati manipulasi piksel mikro, shift pitch audio 18 cents, pembersihan EXIF metadata, dan deteksi tokoh publik multimodal.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

