export type PipelineStep = 
  | 'intake'
  | 'whisper_ear'
  | 'muse_director'
  | 'coverr_vault'
  | 'face_track_canvas'
  | 'anti_detect_inspector'
  | 'export_distribution';

export type SpeakerId = 'speaker_1' | 'speaker_2' | 'both';

export type FaceTrackingMode = 'single_speaker' | 'split_screen_vertical' | 'group_wide_frame' | 'auto_switch';

export interface WhisperWord {
  word: string;
  start: number;
  end: number;
  probability: number;
  speaker?: SpeakerId;
  isOverlapping?: boolean;
}

export interface WhisperSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  words?: WhisperWord[];
  speaker?: SpeakerId;
}

export interface SilenceInterval {
  id: string;
  start: number;
  end: number;
  duration: number;
  isCut: boolean;
}

export interface FillerWord {
  id: string;
  word: string;
  start: number;
  end: number;
  isRemoved: boolean;
  speaker?: SpeakerId;
}

export interface LoopBridge {
  closingSentence: string;
  connectionToHook: string;
  seamlessLoopScore: number;
}

export interface PacingEvent {
  timeSec: number;
  durationSec: number;
  action: 'HOOK_PUNCH_ZOOM' | 'B_ROLL_OVERLAY' | 'DYNAMIC_ZOOM_IN' | 'DYNAMIC_ZOOM_OUT' | 'SPLIT_FRAME';
  zoomScale: number;
  bRollQuery: string;
  captionEmphasis: string;
  directorNote: string;
  selectedStockVideoUrl?: string;
  focusSpeaker?: SpeakerId;
}

export interface MuseDirectorPlan {
  viralHookType: string;
  hookTitle: string;
  hookStartSec: number;
  hookEndSec: number;
  hookReorderedPlacement: string;
  coreStoryStartSec: number;
  coreStoryEndSec: number;
  estimatedDurationSec: number;
  loopBridge: LoopBridge;
  nicheHashtags: string[];
  pacingEvents: PacingEvent[];
  antiDetectionScore: {
    visualDNAChange: number;
    acousticShift: number;
    metadataCleanliness: number;
    retentionLock: number;
  };
}

export interface CoverrStockVideo {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  tags: string[];
}

export interface FaceTrackPoint {
  x: number; // 0 to 1 percentage from left
  y: number; // 0 to 1 percentage from top
  width: number;
  height: number;
  confidence: number;
  timestamp: number;
  speakerId?: SpeakerId;
  isTorsoFallback?: boolean;
  velocity?: number;
}

export interface TrackingVelocityConfig {
  adaptiveLerp: boolean;
  deadzoneThreshold: number; // 0.01 to 0.08
  upperBodyPoseFallback: boolean;
  kalmanPrediction: boolean;
  baseLerp: number; // 0.07
  fastVelocityLerp: number; // 0.25
}

export interface AntiDetectSettings {
  visual: {
    enableMicroZoom: boolean;
    zoomRange: [number, number]; // e.g. [1.03, 1.15]
    asymmetricShiftPx: number; // 3 to 6 px
    colorPerturbationHue: number; // +1.5 deg
    colorPerturbationGamma: number; // 1.02
    vignetteLevel: number; // 0.05
    bRollInterleave: boolean;
  };
  audio: {
    microPitchShiftCents: number; // +18 cents (~1%)
    tempoSpeedMultiplier: number; // 1.04x
    silenceThresholdSec: number; // 0.3s
    removeFillers: boolean;
    subHarmonicNoiseBed: boolean; // low level noise floor distortion
  };
  metadata: {
    spoofDevice: 'iPhone 15 Pro (iOS 17.5.1)' | 'Samsung Galaxy S24 Ultra (Android 14)' | 'CapCut Mobile v12.4' | 'Clean Stripped Generic';
    wipeExif: boolean;
    customFileNamePattern: string; // e.g. IMG_8492.MOV
    creationDateShiftSec: number;
  };
  retention: {
    inject3SecHook: boolean;
    captionStyle: 'hormozi_bold' | 'beast_kinetic' | 'neon_glow' | 'editorial_clean';
    captionFontSize: number;
    safeZonePlatform: 'tiktok' | 'shopee' | 'both' | 'none';
    seamlessLoopLock: boolean;
  };
}

export interface MultimodalBiometrics {
  vision: {
    facialLandmarksDetected: number;
    faceContourMatchScore: number;
    visualConfidence: number;
    lightingEnvironment: string;
    gazeDirectToCamera: boolean;
    faceBBoxCenterNorm: [number, number];
  };
  audio: {
    fundamentalFrequencyHz: number;
    vocalTimbre: string;
    speakingRateWpm: number;
    formantSignature: string;
    vocalConfidence: number;
    diarizationClusterId: string;
  };
  nlp: {
    catchphraseMatches: string[];
    domainTaxonomy: string;
    semanticConfidence: number;
  };
  compositeScore: number;
  retentionLockBoost: string;
}

export type AuthorityBadgeType = 'gold' | 'blue' | 'government' | 'top_creator' | 'billionaire';

export interface PublicFigureProfile {
  id: string;
  name: string;
  role: string;
  category: 'business' | 'podcaster' | 'investor' | 'tech' | 'creator' | 'politics' | 'mindset' | 'global';
  authorityTitle: string; // e.g. "Host Podcast #1 Indonesia", "Mantan Menteri Perdagangan RI", "CEO Tesla & SpaceX"
  verifiedBadgeType: AuthorityBadgeType;
  credibilitySnippet: string; // "10+ Tahun Portofolio Finansial & Bisnis Skala Nasional"
  avatarUrl?: string;
  confidenceScore?: number; // e.g. 0.98 (98%)
  detectedContext?: string;
  authorityMultiplier: number; // e.g. 3.4 (+340% Hook Stop-Rate)
  customQuoteOrTopic?: string;
  biometrics?: MultimodalBiometrics;
  generatedHooks?: {
    formula: AuthorityHookFormula;
    title: string;
    hookText: string;
    psychologicalTrigger: string;
    retentionScore: number;
  }[];
}

export type AuthorityHookFormula = 
  | 'celebrity_paradox'      // "Punya 100 Miliar, tapi tokoh ini tolak beli barang mewah demi..."
  | 'tough_love_warning'     // "Nasihat Keras [Tokoh]: Stop buang waktu di umur 20-an!"
  | 'insider_leak'           // "Bocoran Strategi [Tokoh] yang tidak pernah dibuka di TV..."
  | 'golden_rule_shift';     // "Cuma butuh 1 prinsip ini dari [Tokoh] buat ubah nasib..."

export interface AuthorityHookConfig {
  enabled: boolean;
  activeFigure: PublicFigureProfile | null;
  selectedFormula: AuthorityHookFormula;
  customHookTitle?: string;
  showAuthorityLowerThird: boolean;
  lowerThirdPosition: 'bottom_subtitles' | 'top_header' | 'floating_badge';
  lowerThirdStyle: 'broadcast_gold' | 'cyber_cyan' | 'minimal_white' | 'dark_onyx';
  authorityMultiplier: number;
  assignedSpeaker?: SpeakerId;
}

export interface VideoProject {
  id: string;
  title: string;
  sourceUrl: string;
  fileName: string;
  fileSizeBytes: number;
  durationSec: number;
  resolution: { width: number; height: number };
  audioExtracted: boolean;
  speakersCount?: number;
  speakerNames?: { speaker_1: string; speaker_2?: string };
  whisperTranscript: {
    text: string;
    words: WhisperWord[];
    segments: WhisperSegment[];
    detectedLanguage: string;
    hasOverlappingSpeech?: boolean;
  };
  silences: SilenceInterval[];
  fillers: FillerWord[];
  directorPlan: MuseDirectorPlan | null;
  selectedStockVideos: Record<string, CoverrStockVideo>;
  faceTrackingPoints: FaceTrackPoint[];
  antiDetectConfig: AntiDetectSettings;
  trackingConfig?: TrackingVelocityConfig;
  activeTrackingMode?: FaceTrackingMode;
  publicFigureConfig?: AuthorityHookConfig;
}

export interface ApiConfigState {
  hasGroqKey: boolean;
  hasMuseSparkKey: boolean;
  hasCoverrKey: boolean;
  hasGeminiKey: boolean;
  museBaseUrl: string;
  customGroqKey?: string;
  customMuseKey?: string;
  customCoverrKey?: string;
  customMuseBaseUrl?: string;
}
