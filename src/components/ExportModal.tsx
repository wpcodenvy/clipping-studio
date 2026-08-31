import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Copy, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  FileVideo, 
  Hash, 
  Repeat,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoProject } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [renderProgress, setRenderProgress] = useState(0);
  const [isRenderComplete, setIsRenderComplete] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('Menginisialisasi Engine DNA...');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setRenderProgress(0);
      setIsRenderComplete(false);
      return;
    }

    // Simulate render pipeline steps
    const steps = [
      { progress: 20, text: 'Merombak Audio: Pitch shift (+18 cents) & Silence Cut...' },
      { progress: 45, text: 'Auto-Framing 9:16: OpenCV Face Centering & Smooth Pan...' },
      { progress: 70, text: 'Interleaving Coverr B-Roll & Kinetic Captions Engine...' },
      { progress: 88, text: 'Wiping EXIF & Injecting iPhone 15 Pro Hardware Metadata...' },
      { progress: 100, text: 'DNA Baru Terlahir! Siap Didistribusikan.' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < steps.length) {
        setRenderProgress(steps[currentIdx].progress);
        setCurrentStepText(steps[currentIdx].text);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRenderComplete(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const director = project.directorPlan;
  const hashtags = director?.nicheHashtags?.join(' ') || '#edukasibisnis #tipsafiliasishopee #digitalmarketing';
  const readyCaption = `${director?.hookTitle || project.title}\n\n${director?.loopBridge?.closingSentence || ''}\n\n${hashtags}`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(readyCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 1500);
  };

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(hashtags);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 1500);
  };

  const handleDownloadVideo = () => {
    const a = document.createElement('a');
    a.href = project.sourceUrl;
    a.download = project.antiDetectConfig.metadata.customFileNamePattern || 'IMG_9824.MOV';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Pabrik Render & Distribusi Video DNA
              </h3>
              <p className="text-xs text-zinc-400">
                100% Siap Upload ke TikTok & Shopee Video
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Rendering Progress Bar */}
          {!isRenderComplete ? (
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-white">Mentransformasi DNA File...</h4>
                <p className="text-xs text-amber-400 font-mono">{currentStepText}</p>
              </div>

              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-300 rounded-full"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
              <p className="text-right text-xs font-mono text-zinc-500">{renderProgress}%</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              
              {/* Rebirth Certificate Summary */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-emerald-300">
                    Klip Terlahir Kembali Secara Digital!
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Fingerprint visual, gelombang suara, dan metadata file telah dirombak secara matematis. Video ini terdeteksi sebagai <strong>konten 100% orisinal</strong> oleh algoritma platform.
                  </p>
                </div>
              </div>

              {/* Output File Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-zinc-500">Nama File Export (Spoofed):</span>
                  <p className="font-mono font-bold text-amber-300">
                    {project.antiDetectConfig.metadata.customFileNamePattern}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-zinc-500">Hardware Profile Tag:</span>
                  <p className="font-mono font-bold text-purple-300">
                    {project.antiDetectConfig.metadata.spoofDevice}
                  </p>
                </div>
              </div>

              {/* Ready-to-Post Captions & Niche Hashtags */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-cyan-400" />
                    Hashtags Niche Tertarget & Caption Siap Upload:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyHashtags}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[11px] text-zinc-300 font-medium transition-colors"
                    >
                      {copiedHashtags ? 'Tag Tersalin!' : 'Salin Tag Saja'}
                    </button>
                    <button
                      onClick={handleCopyCaption}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors"
                    >
                      {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCaption ? 'Tersalin!' : 'Salin Semua'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 text-xs text-zinc-300 font-mono whitespace-pre-line max-h-32 overflow-y-auto">
                  {readyCaption}
                </div>
              </div>

              {/* Loop & Hook Strategy Check */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-purple-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-purple-400" />
                  <span className="text-zinc-300">Seamless Loop Bridge Active:</span>
                </div>
                <span className="font-mono text-purple-300 font-bold">
                  {director?.loopBridge?.seamlessLoopScore || 98}% Loop Retention
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Tutup
          </button>

          {isRenderComplete && (
            <button
              type="button"
              id="btn-download-final-video"
              onClick={handleDownloadVideo}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download Video Vertikal (9:16)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
