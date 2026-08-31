import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Eye, 
  Layers, 
  Maximize2, 
  Sparkles, 
  Crosshair, 
  Repeat, 
  ShieldCheck, 
  Zap,
  Users,
  Activity,
  Split,
  UserCheck,
  MoveHorizontal,
  Compass,
  Crown,
  Flame,
  Award
} from 'lucide-react';
import { VideoProject, WhisperWord, PacingEvent, FaceTrackingMode, TrackingVelocityConfig } from '../types';

interface FaceTrackingCanvasProps {
  project: VideoProject;
  onUpdateProject: (updated: VideoProject) => void;
  onNextStep: () => void;
}

export const FaceTrackingCanvas: React.FC<FaceTrackingCanvasProps> = ({
  project,
  onUpdateProject,
  onNextStep
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(project.durationSec || 25);
  const [isMuted, setIsMuted] = useState(true);
  
  // Multi-Speaker & Tracking Mode
  const isMultiSpeakerProject = (project.speakersCount && project.speakersCount > 1) || project.whisperTranscript.hasOverlappingSpeech;
  const [trackingMode, setTrackingMode] = useState<FaceTrackingMode>(
    project.activeTrackingMode || (isMultiSpeakerProject ? 'split_screen_vertical' : 'single_speaker')
  );

  // High Velocity & Motion Smoothing Engine State
  const [trackingConfig, setTrackingConfig] = useState<TrackingVelocityConfig>({
    adaptiveLerp: true,
    deadzoneThreshold: 0.03, // 3% deadband to ignore jitter
    upperBodyPoseFallback: true,
    kalmanPrediction: true,
    baseLerp: 0.07,
    fastVelocityLerp: 0.26
  });

  const [simulatedHighSpeedMotion, setSimulatedHighSpeedMotion] = useState(false);
  const [currentVelocity, setCurrentVelocity] = useState(0);
  const [isTorsoFallbackActive, setIsTorsoFallbackActive] = useState(false);
  const [currentEffectiveLerp, setCurrentEffectiveLerp] = useState(0.07);

  // Controls & Options
  const [showFaceTrackerBox, setShowFaceTrackerBox] = useState(true);
  const [safeZoneMode, setSafeZoneMode] = useState<'both' | 'tiktok' | 'shopee' | 'none'>('both');
  const [captionStyle, setCaptionStyle] = useState<'beast_kinetic' | 'hormozi_bold' | 'neon_glow'>('beast_kinetic');
  const [loopPlayback, setLoopPlayback] = useState(true);

  // Dynamic Camera Center (Interpolated Smoothly)
  const [cameraCenter, setCameraCenter] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [speaker1Center, setSpeaker1Center] = useState<{ x: number; y: number }>({ x: 30, y: 40 });
  const [speaker2Center, setSpeaker2Center] = useState<{ x: number; y: number }>({ x: 70, y: 40 });
  const [currentZoom, setCurrentZoom] = useState(1.08);

  // Active Word for Kinetic Subtitles
  const [activeWords, setActiveWords] = useState<WhisperWord[]>([]);
  const [currentPacingEvent, setCurrentPacingEvent] = useState<PacingEvent | null>(null);

  // Sync Video Time & Run Advanced Motion Tracking Loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastTargetX = 50;

    const handleTimeUpdate = () => {
      const t = video.currentTime;
      setCurrentTime(t);

      // Find active words in whisper transcript (support multiple active words during cross-talk)
      const foundWords = project.whisperTranscript.words.filter(
        (w) => t >= w.start && t <= w.end
      );
      setActiveWords(foundWords);

      // Find active pacing event in director plan
      if (project.directorPlan) {
        const foundEvent = project.directorPlan.pacingEvents.find(
          (e) => t >= e.timeSec && t <= (e.timeSec + e.durationSec)
        );
        setCurrentPacingEvent(foundEvent || null);

        // Apply zoom scale from director event
        if (foundEvent && foundEvent.zoomScale) {
          setCurrentZoom(foundEvent.zoomScale);
        } else {
          setCurrentZoom(trackingMode === 'group_wide_frame' ? 1.0 : 1.08);
        }
      }

      // 1. Calculate Target Speaker Positions
      // High speed motion simulation switch
      const speedMultiplier = simulatedHighSpeedMotion ? 3.2 : 0.8;
      const motionAmplitude = simulatedHighSpeedMotion ? 32 : 14;

      const rawSpeaker1X = 30 + Math.sin(t * speedMultiplier) * (motionAmplitude * 0.6);
      const rawSpeaker2X = 70 + Math.cos(t * speedMultiplier * 0.9) * (motionAmplitude * 0.6);
      
      // Determine active focus speaker if in auto_switch mode
      const activeSpeaker = foundWords.find(w => w.speaker)?.speaker || 'speaker_1';
      let targetX = 50;
      if (trackingMode === 'auto_switch') {
        targetX = activeSpeaker === 'speaker_2' ? rawSpeaker2X : rawSpeaker1X;
      } else if (trackingMode === 'single_speaker') {
        targetX = 50 + Math.sin(t * speedMultiplier) * motionAmplitude;
      } else if (trackingMode === 'group_wide_frame') {
        targetX = 50; // Centered
      }

      const targetY = 42 + Math.cos(t * 0.5) * 4;

      // 2. Velocity Calculation (Derivative)
      const instantaneousVelocity = Math.abs(targetX - lastTargetX) / 0.1;
      setCurrentVelocity(instantaneousVelocity);
      lastTargetX = targetX;

      // 3. Fallback Trigger: If high velocity or simulated head turn, trigger Upper-Body Torso Fallback
      const shouldTriggerTorso = (simulatedHighSpeedMotion && (t % 4 > 2.5)) || instantaneousVelocity > 18;
      setIsTorsoFallbackActive(trackingConfig.upperBodyPoseFallback && shouldTriggerTorso);

      // 4. Adaptive Lerp Factor: Speed up camera tracking when velocity spikes
      let effectiveLerp = trackingConfig.baseLerp;
      if (trackingConfig.adaptiveLerp) {
        if (instantaneousVelocity > 10) {
          effectiveLerp = Math.min(
            trackingConfig.fastVelocityLerp,
            trackingConfig.baseLerp + (instantaneousVelocity / 40) * (trackingConfig.fastVelocityLerp - trackingConfig.baseLerp)
          );
        }
      }
      setCurrentEffectiveLerp(effectiveLerp);

      // 5. Deadzone Filter (Ignore micro-movements < 3%)
      setCameraCenter((prev) => {
        const deltaX = targetX - prev.x;
        const deltaY = targetY - prev.y;
        
        const deadband = (trackingConfig.deadzoneThreshold * 100);
        const filteredDeltaX = Math.abs(deltaX) < deadband ? 0 : deltaX;
        const filteredDeltaY = Math.abs(deltaY) < deadband ? 0 : deltaY;

        return {
          x: prev.x + filteredDeltaX * effectiveLerp,
          y: prev.y + filteredDeltaY * effectiveLerp
        };
      });

      // Update Individual Speaker Coordinates for Split Screen
      setSpeaker1Center({ x: rawSpeaker1X, y: 42 });
      setSpeaker2Center({ x: rawSpeaker2X, y: 42 });
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration || project.durationSec || 25);
    };

    const handleEnded = () => {
      if (loopPlayback) {
        video.currentTime = 0;
        video.play();
      } else {
        setIsPlaying(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [project, trackingMode, trackingConfig, simulatedHighSpeedMotion, loopPlayback]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  // Determine if active frame is showing Coverr B-roll
  const isCoverrBRollActive = currentPacingEvent?.action === 'B_ROLL_OVERLAY' && currentPacingEvent.selectedStockVideoUrl;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Top Bar Banner */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Maximize2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-black text-xl text-white">Auto-Framing 9:16 & High-Velocity Tracking</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Adaptive Lerp ({currentEffectiveLerp.toFixed(2)})
              </span>
              {isTorsoFallbackActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 animate-pulse">
                  <UserCheck className="w-3 h-3" />
                  Torso Pose Fallback Active
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Melacak pergerakan dinamis, beralih ke torso saat wajah menoleh, dan mendukung split-screen multi-speaker.
            </p>
          </div>
        </div>

        <button
          id="btn-proceed-dna-inspector"
          onClick={onNextStep}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
        >
          <span>Periksa DNA 4-Lapisan</span>
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 9:16 Vertical Video Canvas Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-zinc-800 shadow-2xl group select-none">
            
            {/* Hidden Source Video Element used for Audio & Time Sync */}
            <video
              ref={videoRef}
              src={project.sourceUrl}
              playsInline
              muted={isMuted}
              className="hidden"
            />

            {/* SPLIT SCREEN VERTICAL MODE (For 2 Speakers) */}
            {trackingMode === 'split_screen_vertical' && isMultiSpeakerProject ? (
              <div className="absolute inset-0 flex flex-col w-full h-full">
                
                {/* Top Half: Speaker 1 (Host) */}
                <div className="relative flex-1 w-full overflow-hidden border-b-2 border-amber-500/50">
                  <div
                    className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
                    style={{
                      transform: `scale(1.22) translate(${(50 - speaker1Center.x) * 0.45}%, ${(40 - speaker1Center.y) * 0.2}%)`,
                      filter: 'hue-rotate(1.8deg) contrast(103%) brightness(101%)'
                    }}
                  >
                    <video
                      src={project.sourceUrl}
                      playsInline
                      muted
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Speaker 1 Label Badge */}
                  <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-amber-500/90 text-zinc-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <span>{project.speakerNames?.speaker_1 || 'HOST / S1'}</span>
                  </div>

                  {/* Speaker 1 Bounding Box Visualizer */}
                  {showFaceTrackerBox && (
                    <div
                      className="absolute border border-amber-400 rounded-xl pointer-events-none transition-all duration-150 ease-out flex items-start justify-between p-1"
                      style={{
                        left: `${speaker1Center.x - 12}%`,
                        top: `${speaker1Center.y - 14}%`,
                        width: '24%',
                        height: '28%'
                      }}
                    >
                      <span className="bg-amber-400 text-zinc-950 font-mono text-[7px] font-bold px-0.5 rounded">
                        HOST 98%
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Half: Speaker 2 (Guest / Tamu) */}
                <div className="relative flex-1 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
                    style={{
                      transform: `scale(1.22) translate(${(50 - speaker2Center.x) * 0.45}%, ${(40 - speaker2Center.y) * 0.2}%)`,
                      filter: 'hue-rotate(1.8deg) contrast(103%) brightness(101%)'
                    }}
                  >
                    <video
                      src={project.sourceUrl}
                      playsInline
                      muted
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Speaker 2 Label Badge */}
                  <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-cyan-500/90 text-zinc-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <span>{project.speakerNames?.speaker_2 || 'TAMU / S2'}</span>
                  </div>

                  {/* Speaker 2 Bounding Box Visualizer */}
                  {showFaceTrackerBox && (
                    <div
                      className="absolute border border-cyan-400 rounded-xl pointer-events-none transition-all duration-150 ease-out flex items-start justify-between p-1"
                      style={{
                        left: `${speaker2Center.x - 12}%`,
                        top: `${speaker2Center.y - 14}%`,
                        width: '24%',
                        height: '28%'
                      }}
                    >
                      <span className="bg-cyan-400 text-zinc-950 font-mono text-[7px] font-bold px-0.5 rounded">
                        GUEST 97%
                      </span>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* SINGLE / AUTO-SWITCH / GROUP WIDE VIEW */
              <div
                className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-100 ease-out"
                style={{
                  transform: `scale(${currentZoom}) translate(${(50 - cameraCenter.x) * 0.4}%, ${(50 - cameraCenter.y) * 0.2}%)`,
                  filter: 'hue-rotate(1.8deg) contrast(103%) brightness(101%)'
                }}
              >
                {isCoverrBRollActive ? (
                  <video
                    src={currentPacingEvent?.selectedStockVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={project.sourceUrl}
                    playsInline
                    muted
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            {/* Subtle Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.35)_100%)]" />

            {/* Single / Auto Switch Bounding Box & Anchor Visualizer */}
            {trackingMode !== 'split_screen_vertical' && showFaceTrackerBox && !isCoverrBRollActive && (
              <div
                className={`absolute border-2 rounded-2xl pointer-events-none shadow-lg transition-all duration-150 ease-out flex flex-col justify-between p-1.5 ${
                  isTorsoFallbackActive 
                    ? 'border-emerald-400/90 shadow-emerald-500/20' 
                    : 'border-purple-400/90 shadow-purple-500/20'
                }`}
                style={{
                  left: `${cameraCenter.x - 14}%`,
                  top: `${cameraCenter.y - (isTorsoFallbackActive ? 10 : 18)}%`,
                  width: '28%',
                  height: isTorsoFallbackActive ? '44%' : '36%'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[8px] font-bold px-1 rounded ${
                    isTorsoFallbackActive ? 'bg-emerald-400 text-zinc-950' : 'bg-purple-500 text-zinc-950'
                  }`}>
                    {isTorsoFallbackActive ? 'YOLO-POSE (TORSO)' : 'YUNET 98%'}
                  </span>
                  <Crosshair className={`w-3 h-3 animate-pulse ${
                    isTorsoFallbackActive ? 'text-emerald-300' : 'text-purple-300'
                  }`} />
                </div>
                <div className="text-center">
                  <span className="text-[8px] font-mono text-purple-200 bg-black/60 px-1 rounded backdrop-blur-sm">
                    Lerp ({currentEffectiveLerp.toFixed(2)})
                  </span>
                </div>
              </div>
            )}

            {/* Dynamic B-Roll Banner Indicator */}
            {isCoverrBRollActive && (
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 backdrop-blur-md animate-fade-in">
                <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Coverr B-Roll Aktif (Detik {currentTime.toFixed(1)}s)
                </span>
                <span className="text-[9px] font-mono text-cyan-400 uppercase">9:16 DNA Morph</span>
              </div>
            )}

            {/* BROADCAST AUTHORITY LOWER-THIRD / NAMEPLATE OVERLAY (Detik 00:00 - 00:04) */}
            {project.publicFigureConfig?.showAuthorityLowerThird !== false && 
             currentTime <= 4.0 && 
             project.publicFigureConfig?.activeFigure && (
              <div className={`absolute z-30 pointer-events-none transition-all duration-300 animate-slide-up ${
                project.publicFigureConfig.lowerThirdPosition === 'top_header'
                  ? 'top-12 left-4 right-4'
                  : project.publicFigureConfig.lowerThirdPosition === 'floating_badge'
                  ? 'top-20 left-4'
                  : 'bottom-44 left-4 right-4'
              }`}>
                <div className={`p-2.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 ${
                  project.publicFigureConfig.lowerThirdStyle === 'cyber_cyan'
                    ? 'bg-cyan-950/90 border-cyan-400/50 text-cyan-100 shadow-cyan-500/20'
                    : project.publicFigureConfig.lowerThirdStyle === 'minimal_white'
                    ? 'bg-zinc-100/95 border-white text-zinc-950 shadow-black/40'
                    : project.publicFigureConfig.lowerThirdStyle === 'dark_onyx'
                    ? 'bg-zinc-950/95 border-zinc-700 text-zinc-100 shadow-black/80'
                    : 'bg-gradient-to-r from-amber-950/95 via-zinc-950/95 to-amber-950/90 border-amber-400/50 text-amber-100 shadow-amber-500/20'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img 
                        src={project.publicFigureConfig.activeFigure.avatarUrl} 
                        alt={project.publicFigureConfig.activeFigure.name} 
                        className="w-9 h-9 rounded-xl object-cover border border-amber-400/40 shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-amber-400 text-zinc-950 rounded-full shadow">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-black text-xs uppercase tracking-wider truncate">
                          {project.publicFigureConfig.activeFigure.name}
                        </span>
                        <span className="px-1 py-0.2 rounded text-[8px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                          {project.publicFigureConfig.activeFigure.category}
                        </span>
                      </div>
                      <div className="text-[10px] opacity-85 font-medium truncate">
                        {project.publicFigureConfig.activeFigure.authorityTitle}
                      </div>
                      <div className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 opacity-90">
                        <span>● Multi-Modal: Vision 468p + Vocal Biometric + NLP</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-black/40 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-amber-400" />
                      +{Math.round((project.publicFigureConfig.activeFigure.authorityMultiplier - 1) * 100)}% Retensi
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* DUAL-COLOR STACKED KINETIC CAPTIONS */}
            <div className="absolute bottom-28 left-4 right-4 z-20 pointer-events-none text-center flex flex-col items-center justify-center gap-2">
              {activeWords.length > 0 ? (
                activeWords.map((word, idx) => {
                  const isSpeaker2 = word.speaker === 'speaker_2';
                  return (
                    <div 
                      key={`${word.word}_${idx}`}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl backdrop-blur-md border shadow-2xl animate-word-pop ${
                        isSpeaker2
                          ? 'bg-cyan-950/85 border-cyan-400/40 shadow-cyan-500/20'
                          : 'bg-zinc-950/85 border-amber-400/40 shadow-amber-500/20'
                      }`}
                    >
                      {word.speaker && (
                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isSpeaker2 ? 'bg-cyan-400 text-zinc-950' : 'bg-amber-400 text-zinc-950'
                        }`}>
                          {word.speaker === 'speaker_2' ? 'TOM' : 'DEDI'}
                        </span>
                      )}
                      <span className={`font-display font-black text-xl uppercase tracking-wide drop-shadow-md ${
                        isSpeaker2
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400'
                          : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400'
                      }`}>
                        {word.word}
                      </span>
                    </div>
                  );
                })
              ) : (
                project.directorPlan?.hookTitle && currentTime <= 3.0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-rose-600/90 text-white font-black text-sm uppercase tracking-tight shadow-xl animate-pulse">
                    🔥 {project.directorPlan.hookTitle}
                  </div>
                )
              )}
            </div>

            {/* Safe Zone Overlay: TikTok UI Simulation */}
            {(safeZoneMode === 'both' || safeZoneMode === 'tiktok') && (
              <div className="absolute inset-0 pointer-events-none z-10 safezone-tiktok-overlay">
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3 text-white/70">
                  <div className="w-8 h-8 rounded-full border border-white/50 bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                    +
                  </div>
                  <div className="text-center">
                    <div className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-xs">❤️</div>
                    <span className="text-[8px] font-mono">184K</span>
                  </div>
                  <div className="text-center">
                    <div className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-xs">💬</div>
                    <span className="text-[8px] font-mono">4.1K</span>
                  </div>
                  <div className="text-center">
                    <div className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-xs">🔗</div>
                    <span className="text-[8px] font-mono">22K</span>
                  </div>
                </div>

                <div className="absolute left-4 bottom-6 right-16 space-y-1">
                  <div className="text-[11px] font-bold text-white/90 drop-shadow">@affiliatekreator</div>
                  <div className="text-[9px] text-white/70 line-clamp-2 drop-shadow">
                    Rahasia riset hook 3 detik & format video anti-shadowban TikTok...
                  </div>
                </div>
              </div>
            )}

            {/* Safe Zone Overlay: Shopee Video Keranjang Kuning Simulation */}
            {(safeZoneMode === 'both' || safeZoneMode === 'shopee') && (
              <div className="absolute left-3 bottom-14 z-20 pointer-events-none">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400 text-zinc-950 font-bold text-[10px] shadow-lg border border-amber-300">
                  <span>🛍️</span>
                  <span>Keranjang Kuning (Safe Area)</span>
                </div>
              </div>
            )}

            {/* Top Info Pill */}
            <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-mono text-zinc-300 backdrop-blur-sm border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>9:16 VERTICAL • {trackingMode.toUpperCase()}</span>
            </div>

          </div>

          {/* Quick Play/Pause Control Bar underneath Viewport */}
          <div className="w-full max-w-[340px] mt-4 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
            <button
              id="btn-canvas-play-toggle"
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all shadow-md shadow-amber-500/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => handleSeek(0)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Putar dari Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Scrubber Bar */}
            <div className="flex-1 space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 25}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>{currentTime.toFixed(1)}s</span>
                <span>{duration.toFixed(1)}s</span>
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

        </div>

        {/* Right Column: Multi-Speaker Layouts & High-Velocity Tracker Suite */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Multi-Speaker Framing Engine Selector */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Format Framing Multi-Speaker (9:16 Auto-Layout)
                </h3>
              </div>
              {isMultiSpeakerProject && (
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                  2 Pembicara Terdeteksi
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Menyesuaikan komposisi video vertikal saat ada 2 pembicara (debat/podcast) atau ketika terjadi obrolan silang (*cross-talk*).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { 
                  id: 'split_screen_vertical', 
                  label: 'Split-Screen Vertikal', 
                  desc: 'Atas (Speaker 1) & Bawah (Speaker 2) serempak', 
                  icon: Split 
                },
                { 
                  id: 'auto_switch', 
                  label: 'Dynamic Auto-Switch', 
                  desc: 'Kamera otomatis fokus ke siapa yang sedang berbicara', 
                  icon: Compass 
                },
                { 
                  id: 'group_wide_frame', 
                  label: 'Group Wide 9:16', 
                  desc: 'Framing lebar mencakup kedua pembicara sekaligus', 
                  icon: MoveHorizontal 
                },
                { 
                  id: 'single_speaker', 
                  label: 'Solo Center Lock', 
                  desc: 'Fokus ke satu pembicara utama', 
                  icon: UserCheck 
                }
              ].map((mode) => {
                const Icon = mode.icon;
                const isSelected = trackingMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setTrackingMode(mode.id as FaceTrackingMode)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                      <p className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>{mode.label}</p>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-snug">{mode.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. High-Velocity Motion & Fallback Suite */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  High-Velocity Tracking & Torso Fallback (Pergerakan Ekstrem)
                </h3>
              </div>
              
              <button
                id="btn-simulate-speed-motion"
                onClick={() => setSimulatedHighSpeedMotion(!simulatedHighSpeedMotion)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  simulatedHighSpeedMotion
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-zinc-950 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>{simulatedHighSpeedMotion ? 'Stop Simulasi Cepat' : 'Uji Gerakan Cepat'}</span>
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Jika speaker berlari, berpindah panggung, atau menoleh 90° sehingga wajah hilang, kamera tidak akan tersentak berkat <strong>Adaptive Lerp</strong> & fallback ke <strong>Upper-Body/Torso Pose</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
              
              {/* Velocity Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Kecepatan Gerak (Velocity):</span>
                  <span className="font-mono text-purple-300 font-bold">{currentVelocity.toFixed(1)} px/s</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-150 ${
                      currentVelocity > 15 ? 'bg-rose-500' : 'bg-purple-400'
                    }`}
                    style={{ width: `${Math.min(100, (currentVelocity / 30) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Adaptive Lerp Monitor */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Respons Kamera (Dynamic Lerp):</span>
                  <span className="font-mono text-emerald-400 font-bold">{currentEffectiveLerp.toFixed(2)}</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-150"
                    style={{ width: `${((currentEffectiveLerp - 0.05) / 0.22) * 100}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Toggle Features Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={trackingConfig.adaptiveLerp}
                  onChange={(e) => setTrackingConfig(prev => ({ ...prev, adaptiveLerp: e.target.checked }))}
                  className="accent-purple-400 rounded"
                />
                <span>Adaptive Lerp (Akselerasi saat lari)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={trackingConfig.upperBodyPoseFallback}
                  onChange={(e) => setTrackingConfig(prev => ({ ...prev, upperBodyPoseFallback: e.target.checked }))}
                  className="accent-emerald-400 rounded"
                />
                <span>Torso Pose Fallback (Saat kepala menoleh)</span>
              </label>
            </div>
          </div>

          {/* 3. Safe-Zone Visual Grid Switcher */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-sm text-white">
                Safe-Zone Overlay (TikTok & Shopee Video)
              </h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Mencegah teks subtitle, hook, atau B-roll penting tertutup oleh tombol Like, Komentar, Keranjang Kuning Afiliasi, atau deskripsi caption aplikasi.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { id: 'both', label: 'TikTok + Shopee' },
                { id: 'tiktok', label: 'Hanya TikTok' },
                { id: 'shopee', label: 'Hanya Shopee' },
                { id: 'none', label: 'Matikan Guide' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSafeZoneMode(item.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    safeZoneMode === item.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Infinite Seamless Loop Enforcer */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-purple-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Repeat className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Seamless Loop Playback Enforcer</h4>
                <p className="text-[11px] text-zinc-400">
                  Otomatis memutar ulang dari akhir ke awal tanpa jeda hitam (*gapless loop*).
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={loopPlayback}
                onChange={(e) => setLoopPlayback(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500" />
            </label>
          </div>

        </div>

      </div>

    </div>
  );
};

