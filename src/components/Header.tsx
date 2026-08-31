import React from 'react';
import { 
  Sparkles, 
  Ear, 
  BrainCircuit, 
  Film, 
  ShieldCheck, 
  Settings2, 
  Layers, 
  Maximize2,
  Share2
} from 'lucide-react';
import { PipelineStep, ApiConfigState } from '../types';

interface HeaderProps {
  currentStep: PipelineStep;
  setStep: (step: PipelineStep) => void;
  apiConfig: ApiConfigState;
  onOpenSettings: () => void;
  hasActiveProject: boolean;
  onExportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  setStep,
  apiConfig,
  onOpenSettings,
  hasActiveProject,
  onExportClick
}) => {
  const steps: { id: PipelineStep; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'intake', label: '1. Input & Wave', icon: <Layers className="w-4 h-4" /> },
    { id: 'whisper_ear', label: '2. Groq Whisper', icon: <Ear className="w-4 h-4 text-emerald-400" />, badge: 'Word Timestamps' },
    { id: 'muse_director', label: '3. Muse Sutradara', icon: <BrainCircuit className="w-4 h-4 text-amber-400" />, badge: '3s Hook & Loop' },
    { id: 'coverr_vault', label: '4. Coverr B-Roll', icon: <Film className="w-4 h-4 text-cyan-400" /> },
    { id: 'face_track_canvas', label: '5. Auto-Frame 9:16', icon: <Maximize2 className="w-4 h-4 text-purple-400" />, badge: 'Face Track' },
    { id: 'anti_detect_inspector', label: '6. DNA 4-Lapisan', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> }
  ];

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-max">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 p-[1px] shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg tracking-tight text-white">
                  CLIPPER<span className="text-amber-400 font-normal">DNA</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                  Anti-Detect v2.6
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Pabrik Penyamaran Video & Rekayasa Viral
              </p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isDisabled = !hasActiveProject && step.id !== 'intake';

              return (
                <button
                  key={step.id}
                  id={`nav-step-${step.id}`}
                  onClick={() => !isDisabled && setStep(step.id)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80 font-semibold'
                      : isDisabled
                      ? 'text-zinc-600 cursor-not-allowed opacity-50'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  {step.icon}
                  <span>{step.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Settings */}
          <div className="flex items-center gap-2.5">
            {/* Status Pills */}
            <div className="hidden xl:flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                <span className={`w-2 h-2 rounded-full ${apiConfig.hasGroqKey ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'}`} />
                Groq v3
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                <span className={`w-2 h-2 rounded-full ${apiConfig.hasMuseSparkKey ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'}`} />
                Muse Sutradara
              </span>
            </div>

            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              title="API Keys & Konfigurasi Server"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {hasActiveProject && (
              <button
                id="btn-export-header"
                onClick={onExportClick}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Export DNA</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Stepper Bar */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-zinc-900/60 border-t border-zinc-800/60 no-scrollbar">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isDisabled = !hasActiveProject && step.id !== 'intake';
          return (
            <button
              key={step.id}
              onClick={() => !isDisabled && setStep(step.id)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold' 
                  : isDisabled
                  ? 'text-zinc-600 opacity-40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {step.icon}
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
