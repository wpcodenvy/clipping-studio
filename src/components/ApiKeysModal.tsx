import React, { useState } from 'react';
import { X, Key, CheckCircle2, Shield, Info, ExternalLink } from 'lucide-react';
import { ApiConfigState } from '../types';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfigState;
  onSaveConfig: (updated: Partial<ApiConfigState>) => void;
}

export const ApiKeysModal: React.FC<ApiKeysModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [groqKey, setGroqKey] = useState(config.customGroqKey || '');
  const [museKey, setMuseKey] = useState(config.customMuseKey || '');
  const [museBaseUrl, setMuseBaseUrl] = useState(config.customMuseBaseUrl || config.museBaseUrl || 'https://api.openai.com/v1');
  const [coverrKey, setCoverrKey] = useState(config.customCoverrKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      customGroqKey: groqKey.trim() || undefined,
      customMuseKey: museKey.trim() || undefined,
      customMuseBaseUrl: museBaseUrl.trim() || undefined,
      customCoverrKey: coverrKey.trim() || undefined,
      hasGroqKey: Boolean(groqKey.trim() || config.hasGroqKey),
      hasMuseSparkKey: Boolean(museKey.trim() || config.hasMuseSparkKey),
      hasCoverrKey: Boolean(coverrKey.trim() || config.hasCoverrKey)
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Konfigurasi API & Model AI</h3>
              <p className="text-xs text-zinc-400">Hubungkan Groq Whisper, Muse Spark & Coverr</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Semua kunci disimpan secara aman di sesi browser Anda atau environment server. Tersedia mode simulator terintegrasi jika Anda ingin mencoba alur kerja secara instan tanpa API key.
            </p>
          </div>

          {/* 1. Groq Whisper API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Groq API Key (Whisper Large v3)
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                Dapatkan Gratis di Groq <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-all font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Digunakan sebagai "Telinga" untuk transkripsi kata mikro dan deteksi celah jeda/sunyi.
            </p>
          </div>

          {/* 2. Muse Spark / OpenAI Compatible API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Muse Spark / OpenAI Key (Otak Sutradara & Deteksi Tokoh)
              </label>
              <span className="text-[11px] text-amber-400/90 font-mono">OpenAI / Gemini / Custom LLM</span>
            </div>
            <input
              type="password"
              value={museKey}
              onChange={(e) => setMuseKey(e.target.value)}
              placeholder="sk-... atau Gemini / Muse Spark Key"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-all font-mono"
            />
            
            <div className="pt-1">
              <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
                Muse Base URL / Endpoint Kontributor:
              </label>
              <input
                type="text"
                value={museBaseUrl}
                onChange={(e) => setMuseBaseUrl(e.target.value)}
                placeholder="https://api.openai.com/v1 atau custom endpoint..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <div className="text-zinc-300 font-semibold flex items-center gap-1">
                <span>⚡ Cukup 1 Kunci Muse Spark untuk Semua Fitur:</span>
              </div>
              <p>
                Kunci ini otomatis menangani <strong>Deteksi Tokoh Publik</strong>, <strong>Formula Hook Otoritas 3 Detik</strong>, <strong>Pacing Storyboard</strong>, dan <strong>Seamless Looping</strong>.
              </p>
              <p className="text-zinc-500 italic">
                *Jika dikosongkan, sistem secara cerdas menggunakan server bawaan + mesin pencocok pola NLP instan.
              </p>
            </div>
          </div>

          {/* 3. Coverr API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Coverr API Key (Gudang Visual B-Roll)
              </label>
              <a
                href="https://coverr.co"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                Coverr API <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={coverrKey}
              onChange={(e) => setCoverrKey(e.target.value)}
              placeholder="coverr_api_key_..."
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-all font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Digunakan untuk mengunduh B-roll vertikal penutup kejenuhan visual (opsional, tersedia curated library bawaan).
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            id="btn-save-api-keys"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-zinc-950" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Simpan Konfigurasi</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
