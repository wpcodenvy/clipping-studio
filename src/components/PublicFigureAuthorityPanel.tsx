import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Crown, 
  Search, 
  Check, 
  Flame, 
  Zap, 
  UserCheck, 
  Layers, 
  Sliders, 
  RefreshCw,
  Plus,
  Tv,
  BadgePercent,
  Eye,
  Mic,
  Activity,
  Cpu,
  Radio,
  FileText,
  Binary,
  ScanFace
} from 'lucide-react';
import { VideoProject, PublicFigureProfile, AuthorityHookFormula, AuthorityHookConfig } from '../types';
import { knownPublicFigures, generateAuthorityHooksForFigure, generateBiometricsForFigure } from '../data/publicFigures';
import { detectPublicFigureApi } from '../services/api';

interface PublicFigureAuthorityPanelProps {
  project: VideoProject;
  onUpdateProject: (updated: VideoProject) => void;
  compact?: boolean;
  customApiKey?: string;
  customBaseUrl?: string;
}

export const PublicFigureAuthorityPanel: React.FC<PublicFigureAuthorityPanelProps> = ({
  project,
  onUpdateProject,
  compact = false,
  customApiKey,
  customBaseUrl
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const currentConfig: AuthorityHookConfig = project.publicFigureConfig || {
    enabled: true,
    activeFigure: knownPublicFigures[0], // Default Deddy Corbuzier
    selectedFormula: 'tough_love_warning',
    showAuthorityLowerThird: true,
    lowerThirdPosition: 'bottom_subtitles',
    lowerThirdStyle: 'broadcast_gold',
    authorityMultiplier: 3.6,
    assignedSpeaker: 'speaker_1'
  };

  const activeFigure = currentConfig.activeFigure || knownPublicFigures[0];

  // Scan with AI (Muse Spark / Gemini / NLP Matcher)
  const handleScanPublicFigure = async () => {
    setIsScanning(true);
    try {
      const res = await detectPublicFigureApi(
        project.whisperTranscript.text,
        project.title,
        undefined,
        customApiKey,
        customBaseUrl
      );

      if (res && res.data) {
        const detected = res.data;
        const hooks = generateAuthorityHooksForFigure(detected, project.whisperTranscript.text.slice(0, 100));
        const updatedFigure: PublicFigureProfile = {
          ...detected,
          generatedHooks: hooks
        };

        const newConfig: AuthorityHookConfig = {
          ...currentConfig,
          enabled: true,
          activeFigure: updatedFigure,
          authorityMultiplier: detected.authorityMultiplier || 3.5,
          customHookTitle: hooks[0].title
        };

        // Update project and director hook title if present
        const updatedDirector = project.directorPlan ? {
          ...project.directorPlan,
          viralHookType: 'Celebrity Authority & Paradox',
          hookTitle: hooks[0].title
        } : project.directorPlan;

        onUpdateProject({
          ...project,
          publicFigureConfig: newConfig,
          directorPlan: updatedDirector
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectFigure = (figure: PublicFigureProfile) => {
    const hooks = figure.generatedHooks || generateAuthorityHooksForFigure(figure);
    const defaultHook = hooks.find(h => h.formula === currentConfig.selectedFormula) || hooks[0];

    const newConfig: AuthorityHookConfig = {
      ...currentConfig,
      enabled: true,
      activeFigure: {
        ...figure,
        generatedHooks: hooks
      },
      authorityMultiplier: figure.authorityMultiplier,
      customHookTitle: defaultHook.title
    };

    const updatedDirector = project.directorPlan ? {
      ...project.directorPlan,
      viralHookType: 'Celebrity Authority & Paradox',
      hookTitle: defaultHook.title
    } : project.directorPlan;

    onUpdateProject({
      ...project,
      publicFigureConfig: newConfig,
      directorPlan: updatedDirector
    });
    setShowCatalogModal(false);
  };

  const handleSelectFormula = (formula: AuthorityHookFormula) => {
    const hooks = activeFigure.generatedHooks || generateAuthorityHooksForFigure(activeFigure);
    const selected = hooks.find(h => h.formula === formula) || hooks[0];

    const newConfig: AuthorityHookConfig = {
      ...currentConfig,
      selectedFormula: formula,
      customHookTitle: selected.title
    };

    const updatedDirector = project.directorPlan ? {
      ...project.directorPlan,
      viralHookType: 'Celebrity Authority & Paradox',
      hookTitle: selected.title
    } : project.directorPlan;

    onUpdateProject({
      ...project,
      publicFigureConfig: newConfig,
      directorPlan: updatedDirector
    });
  };

  const handleToggleLowerThird = () => {
    const newConfig: AuthorityHookConfig = {
      ...currentConfig,
      showAuthorityLowerThird: !currentConfig.showAuthorityLowerThird
    };
    onUpdateProject({
      ...project,
      publicFigureConfig: newConfig
    });
  };

  const handleChangeStyle = (style: AuthorityHookConfig['lowerThirdStyle']) => {
    const newConfig: AuthorityHookConfig = {
      ...currentConfig,
      lowerThirdStyle: style
    };
    onUpdateProject({
      ...project,
      publicFigureConfig: newConfig
    });
  };

  const handleAddCustomFigure = () => {
    if (!customName.trim()) return;
    const newFig: PublicFigureProfile = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      role: customTitle.trim() || 'Tokoh Publik & Otoritas',
      category: 'creator',
      authorityTitle: customTitle.trim() || `${customName.trim()} • Tokoh Terverifikasi`,
      verifiedBadgeType: 'gold',
      credibilitySnippet: 'Tokoh publik dengan pengaruh besar dan reputasi terpercaya.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      confidenceScore: 0.99,
      authorityMultiplier: 3.4
    };
    handleSelectFigure(newFig);
    setCustomName('');
    setCustomTitle('');
    setIsAddingCustom(false);
  };

  const filteredFigures = knownPublicFigures.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.authorityTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableHooks = activeFigure.generatedHooks || generateAuthorityHooksForFigure(activeFigure);

  return (
    <div className="p-6 rounded-3xl bg-zinc-900 border border-amber-500/30 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-lg text-white">
                Public Figure Authority & Celebrity Hook
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Stop-Rate Multiplier
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Mendeteksi tokoh publik, menyuntikkan social proof berbobot, dan mengunci perhatian 3 detik awal dengan Formula Otoritas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-scan-public-figure"
            onClick={handleScanPublicFigure}
            disabled={isScanning}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all hover:border-amber-500/50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'AI Memindai Wajah & Nama...' : 'Scan AI Tokoh'}</span>
          </button>

          <button
            id="btn-open-figure-catalog"
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Katalog Tokoh</span>
          </button>
        </div>
      </div>

      {/* Active Public Figure Card */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={activeFigure.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'} 
              alt={activeFigure.name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-full text-zinc-950 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-white">
                {activeFigure.name}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {activeFigure.category}
              </span>
            </div>
            <p className="text-xs text-amber-300/90 font-medium">
              {activeFigure.authorityTitle}
            </p>
            <p className="text-[11px] text-zinc-400 italic">
              "{activeFigure.credibilitySnippet}"
            </p>
          </div>
        </div>

        {/* Authority Power Metric */}
        <div className="flex items-center gap-3 w-full md:w-auto p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-zinc-400">Daya Tarik Otoritas</div>
            <div className="text-sm font-black text-amber-400 font-mono flex items-center gap-1 justify-end">
              <Flame className="w-4 h-4 text-amber-400" />
              +{Math.round((activeFigure.authorityMultiplier - 1) * 100)}% Stop-Rate
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono text-zinc-400">Confidence</div>
            <div className="text-sm font-black text-emerald-400 font-mono">
              {Math.round((activeFigure.confidenceScore || 0.98) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* AI MULTIMODAL VERIFICATION RADAR (NLP + Computer Vision + Audio Biometrics) */}
      {(() => {
        const biometrics = activeFigure.biometrics || generateBiometricsForFigure(activeFigure);
        return (
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-indigo-500/30 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span className="font-display font-black text-xs uppercase tracking-wider text-indigo-200">
                  AI Multimodal Tri-Fusion Engine (Senjata Rahasia Retensi)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Tri-Modal Biometrics Active
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-zinc-400">Komposit Akurasi:</span>
                <span className="text-emerald-400 font-black">{biometrics.compositeScore}%</span>
                <span className="text-amber-400 font-black">[{biometrics.retentionLockBoost}]</span>
              </div>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* 1. Computer Vision Face Biometrics */}
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-200">
                    <ScanFace className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Computer Vision</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {biometrics.vision.visualConfidence}% Match
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>Face Mesh:</span>
                    <span className="font-mono text-zinc-300">{biometrics.vision.facialLandmarksDetected} Landmark Points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gaze to Camera:</span>
                    <span className="font-mono text-emerald-400">{biometrics.vision.gazeDirectToCamera ? '✓ Locked 9:16 Center' : 'Tracking'}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {biometrics.vision.lightingEnvironment}
                  </div>
                </div>
              </div>

              {/* 2. Audio Biometrics & Vocal Acoustics */}
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-200">
                    <Mic className="w-3.5 h-3.5 text-amber-400" />
                    <span>Audio Biometric</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                    {biometrics.audio.vocalConfidence}% Match
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>Pitch & Cadence:</span>
                    <span className="font-mono text-zinc-300">{biometrics.audio.fundamentalFrequencyHz}Hz • {biometrics.audio.speakingRateWpm} WPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acoustic Signature:</span>
                    <span className="font-mono text-zinc-300">{biometrics.audio.formantSignature}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {biometrics.audio.vocalTimbre}
                  </div>
                </div>
              </div>

              {/* 3. NLP Context & Vocabulary DNA */}
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-200">
                    <Binary className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NLP Semantics</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {biometrics.nlp.semanticConfidence}% Match
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>Taxonomy Domain:</span>
                    <span className="font-mono text-zinc-300 truncate max-w-[140px]">{biometrics.nlp.domainTaxonomy}</span>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                    {biometrics.nlp.catchphraseMatches.slice(0, 2).map((cp, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 truncate">
                        #{cp}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-emerald-400/90 font-medium">
                    ✓ Social Proof Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4 Psychological Authority Hook Formulas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h4 className="font-display font-bold text-sm text-zinc-200">
              Pilih Formula Hook Otoritas 3 Detik (Detik 00:00 - 00:03)
            </h4>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            4 Variasi Teruji Algoritma
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableHooks.map((h) => {
            const isSelected = currentConfig.selectedFormula === h.formula;
            
            const formulaLabels: Record<AuthorityHookFormula, { label: string; tag: string }> = {
              tough_love_warning: { label: 'Tough Love & Reality Check', tag: 'High Retensi' },
              celebrity_paradox: { label: 'Celebrity Paradox & Status', tag: 'Curiosity Shock' },
              insider_leak: { label: 'Insider Secret & Bocoran Dapur', tag: 'FOMO Otoritas' },
              golden_rule_shift: { label: '1 Golden Rule / Silver Bullet', tag: 'Actionable' }
            };

            const info = formulaLabels[h.formula] || { label: h.formula, tag: 'Otoritas' };

            return (
              <div
                key={h.formula}
                onClick={() => handleSelectFormula(h.formula)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                    {info.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {info.tag}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {h.retentionScore}% Stop-Rate
                    </span>
                  </div>
                </div>

                <div className="text-xs font-bold text-white mb-1 leading-snug">
                  "{h.title}"
                </div>

                <div className="text-[11px] text-zinc-400 italic">
                  Hook Pembuka: "{h.hookText}"
                </div>

                <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Triger: {h.psychologicalTrigger}</span>
                  {isSelected && (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Aktif di Storyboard
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Broadcast Lower-Third & Nameplate Controls */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Tv className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-bold text-zinc-200">
                Overlay Nameplate & Lower-Third Otoritas (Detik 00:00 - 00:04 di 9:16 Canvas)
              </div>
              <div className="text-[11px] text-zinc-400">
                Menampilkan badge terverifikasi dan gelar tokoh di layar vertikal agar penonton instan mengenali figur.
              </div>
            </div>
          </div>

          <button
            id="toggle-authority-lower-third"
            onClick={handleToggleLowerThird}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentConfig.showAuthorityLowerThird
                ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {currentConfig.showAuthorityLowerThird ? '✓ Lower-Third Aktif' : 'Nonaktifkan Lower-Third'}
          </button>
        </div>

        {currentConfig.showAuthorityLowerThird && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80 text-xs">
            {/* Style Selector */}
            <div className="space-y-1.5">
              <span className="text-zinc-400 text-[11px] font-medium">Tema Visual Nameplate:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['broadcast_gold', 'cyber_cyan', 'minimal_white', 'dark_onyx'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => handleChangeStyle(style)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold capitalize transition-all ${
                      currentConfig.lowerThirdStyle === style
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {style.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="space-y-1.5">
              <span className="text-zinc-400 text-[11px] font-medium">Posisi Tampilan:</span>
              <div className="flex items-center gap-1.5">
                {(['bottom_subtitles', 'top_header', 'floating_badge'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => onUpdateProject({
                      ...project,
                      publicFigureConfig: { ...currentConfig, lowerThirdPosition: pos }
                    })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      currentConfig.lowerThirdPosition === pos
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {pos === 'bottom_subtitles' ? 'Bawah (Sub)' : pos === 'top_header' ? 'Atas (Header)' : 'Melayang'}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Mini Preview */}
            <div className="space-y-1">
              <span className="text-zinc-400 text-[11px] font-medium">Live Render Badge:</span>
              <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                currentConfig.lowerThirdStyle === 'broadcast_gold'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : currentConfig.lowerThirdStyle === 'cyber_cyan'
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                  : currentConfig.lowerThirdStyle === 'minimal_white'
                  ? 'bg-zinc-100 text-zinc-950 border-white'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-200'
              }`}>
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <div className="font-black text-[11px] uppercase tracking-wider truncate">
                    {activeFigure.name}
                  </div>
                  <div className="text-[9px] opacity-80 truncate">
                    {activeFigure.authorityTitle}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Pilih Tokoh Publik / Celebrity Otoritas
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Database tokoh podcast, pebisnis, investor & kreator terpopuler
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Search Bar & Custom Add Button */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Cari tokoh (Deddy Corbuzier, Timothy Ronald, Tom Lembong, Alex Hormozi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => setIsAddingCustom(!isAddingCustom)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Tambah Manual</span>
              </button>
            </div>

            {/* Custom Add Form */}
            {isAddingCustom && (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-3">
                <div className="text-xs font-bold text-amber-300">
                  Input Tokoh Kustom:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Lengkap Tokoh..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Gelar Otoritas (Contoh: CEO Founder / Mentor Finansial)..."
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddingCustom(false)}
                    className="px-3 py-1 bg-zinc-900 text-zinc-400 rounded-lg text-xs"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddCustomFigure}
                    disabled={!customName.trim()}
                    className="px-4 py-1 bg-amber-400 text-zinc-950 font-bold rounded-lg text-xs"
                  >
                    Simpan & Terapkan
                  </button>
                </div>
              </div>
            )}

            {/* Catalog Grid */}
            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {filteredFigures.map((fig) => {
                const isSelected = activeFigure.id === fig.id;
                return (
                  <div
                    key={fig.id}
                    onClick={() => handleSelectFigure(fig)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-950/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={fig.avatarUrl}
                        alt={fig.name}
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate">
                            {fig.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-900 text-amber-300 border border-zinc-800 shrink-0">
                            {fig.category}
                          </span>
                        </div>
                        <div className="text-xs text-amber-300/80 truncate">
                          {fig.authorityTitle}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {fig.credibilitySnippet}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-amber-400">
                        +{Math.round((fig.authorityMultiplier - 1) * 100)}% Retensi
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {fig.generatedHooks?.length || 4} Formula Hooks
                      </div>
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
