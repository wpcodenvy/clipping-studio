import { VideoProject, AntiDetectSettings } from '../types';

export const defaultAntiDetectSettings: AntiDetectSettings = {
  visual: {
    enableMicroZoom: true,
    zoomRange: [1.04, 1.14],
    asymmetricShiftPx: 4,
    colorPerturbationHue: 1.8,
    colorPerturbationGamma: 1.025,
    vignetteLevel: 0.04,
    bRollInterleave: true,
  },
  audio: {
    microPitchShiftCents: 18, // ~1.05%
    tempoSpeedMultiplier: 1.04,
    silenceThresholdSec: 0.35,
    removeFillers: true,
    subHarmonicNoiseBed: true,
  },
  metadata: {
    spoofDevice: 'iPhone 15 Pro (iOS 17.5.1)',
    wipeExif: true,
    customFileNamePattern: 'IMG_9824.MOV',
    creationDateShiftSec: 0,
  },
  retention: {
    inject3SecHook: true,
    captionStyle: 'beast_kinetic',
    captionFontSize: 28,
    safeZonePlatform: 'both',
    seamlessLoopLock: true,
  }
};

// Dataset uji coba telah dibersihkan agar aplikasi siap digunakan untuk pengujian video asli secara manual
export const sampleProjects: VideoProject[] = [];
