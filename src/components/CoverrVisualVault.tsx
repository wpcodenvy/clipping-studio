import React, { useState } from 'react';
import { 
  Film, 
  Search, 
  Sparkles, 
  Check, 
  Play, 
  RefreshCw, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { VideoProject, CoverrStockVideo } from '../types';
import { searchCoverrStockVideos } from '../services/api';

interface CoverrVisualVaultProps {
  project: VideoProject;
  onUpdateProject: (updated: VideoProject) => void;
  onNextStep: () => void;
  customCoverrKey?: string;
}

export const CoverrVisualVault: React.FC<CoverrVisualVaultProps> = ({
  project,
  onUpdateProject,
  onNextStep,
  customCoverrKey
}) => {
  const [searchQuery, setSearchQuery] = useState('business smartphone money');
  const [isSearching, setIsSearching] = useState(false);
  const [stockList, setStockList] = useState<CoverrStockVideo[]>([
    {
      id: 'cov_1',
      title: 'Hands Working On Laptop & Analytics',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-42998-large.mp4',
      tags: ['business', 'analytics', 'chart', 'work']
    },
    {
      id: 'cov_2',
      title: 'Person Fast Scrolling Phone At Night',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-person-scrolling-on-a-smartphone-at-night-42289-large.mp4',
      tags: ['mobile', 'scrolling', 'shopping', 'app']
    },
    {
      id: 'cov_3',
      title: 'Woman Smiling & Working Focused',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-smiling-at-work-41718-large.mp4',
      tags: ['smile', 'reaction', 'office', 'focus']
    },
    {
      id: 'cov_4',
      title: 'Night Traffic City Timelapse',
      thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-in-the-city-at-night-42686-large.mp4',
      tags: ['city', 'traffic', 'speed', 'timelapse']
    },
    {
      id: 'cov_5',
      title: 'Money Cash Falling Down',
      thumbnail: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-money-falling-down-on-a-black-background-42999-large.mp4',
      tags: ['money', 'cash', 'dollars', 'finance']
    }
  ]);
  const [selectedPreview, setSelectedPreview] = useState<CoverrStockVideo | null>(stockList[0]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await searchCoverrStockVideos(query, customCoverrKey);
      if (res && res.videos && res.videos.length > 0) {
        setStockList(res.videos);
        setSelectedPreview(res.videos[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssignStockToEvent = (stock: CoverrStockVideo, eventIndex: number) => {
    if (!project.directorPlan) return;

    const updatedEvents = [...project.directorPlan.pacingEvents];
    if (updatedEvents[eventIndex]) {
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        selectedStockVideoUrl: stock.videoUrl
      };
    }

    onUpdateProject({
      ...project,
      selectedStockVideos: {
        ...project.selectedStockVideos,
        [stock.id]: stock
      },
      directorPlan: {
        ...project.directorPlan,
        pacingEvents: updatedEvents
      }
    });
  };

  const directorQueries = project.directorPlan?.pacingEvents
    .filter(e => e.bRollQuery)
    .map(e => e.bRollQuery) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-xl text-white">Coverr API: Gudang Visual B-Roll</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                9:16 Vertical Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Menyelipkan video stok vertikal setiap 2-3 detik untuk menutupi kejenuhan dan merombak fingerprint visual.
            </p>
          </div>
        </div>

        <button
          id="btn-proceed-autoframing"
          onClick={onNextStep}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
        >
          <span>Lanjut ke Auto-Framing 9:16</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Muse Spark Director Queries */}
      {directorQueries.length > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Rekomendasi Query Visual dari Muse Sutradara:
            </span>
            <span className="text-[11px] text-zinc-500">Klik untuk mencari otomatis</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {directorQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(q);
                  handleSearch(q);
                }}
                className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 text-xs font-mono transition-all"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            placeholder="Cari footage Coverr (misal: 'money cash', 'scrolling phone', 'shocked reaction')..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          onClick={() => handleSearch(searchQuery)}
          disabled={isSearching}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
          <span>{isSearching ? 'Mencari...' : 'Cari Coverr'}</span>
        </button>
      </div>

      {/* Main Grid: Gallery & Live Video Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gallery Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stockList.map((stock) => {
            const isSelected = selectedPreview?.id === stock.id;

            return (
              <div
                key={stock.id}
                onClick={() => setSelectedPreview(stock)}
                className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all bg-zinc-900 flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-lg shadow-cyan-500/10'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                  <img
                    src={stock.thumbnail}
                    alt={stock.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950/80 text-cyan-300 border border-zinc-800">
                      Coverr HD
                    </span>
                    <Play className="w-4 h-4 text-white drop-shadow" />
                  </div>
                </div>

                <div className="p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {stock.title}
                  </h4>
                  
                  <div className="flex flex-wrap gap-1">
                    {stock.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Assign to Pacing timeline */}
                  {project.directorPlan && (
                    <div className="pt-2 border-t border-zinc-800/80">
                      <p className="text-[10px] text-zinc-500 mb-1.5">Pasang ke Timeline Event:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.directorPlan.pacingEvents.map((evt, eIdx) => {
                          const isAssigned = evt.selectedStockVideoUrl === stock.videoUrl;
                          return (
                            <button
                              key={eIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignStockToEvent(stock, eIdx);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                                isAssigned
                                  ? 'bg-cyan-500 text-zinc-950 font-bold'
                                  : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                              }`}
                            >
                              {evt.timeSec.toFixed(1)}s {isAssigned ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Preview B-Roll Terpilih</span>
            </h3>

            {selectedPreview ? (
              <div className="space-y-3">
                <div className="relative aspect-[9/16] w-full max-w-[220px] mx-auto rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl">
                  <video
                    src={selectedPreview.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono backdrop-blur-sm">
                    9:16 B-Roll Interleaved
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h4 className="text-xs font-bold text-white">{selectedPreview.title}</h4>
                  <p className="text-[11px] text-zinc-400">
                    Otomatis di-crop dan di-render sebagai layer pengganti frame original.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-zinc-500">
                Pilih salah satu video stok di samping untuk melihat preview.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
