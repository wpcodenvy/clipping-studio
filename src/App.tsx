import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadWorkflow } from './components/UploadWorkflow';
import { WhisperTranscribeView } from './components/WhisperTranscribeView';
import { MuseSparkDirectorView } from './components/MuseSparkDirectorView';
import { CoverrVisualVault } from './components/CoverrVisualVault';
import { FaceTrackingCanvas } from './components/FaceTrackingCanvas';
import { AntiDetectInspector } from './components/AntiDetectInspector';
import { ApiKeysModal } from './components/ApiKeysModal';
import { ExportModal } from './components/ExportModal';
import { VideoProject, PipelineStep, ApiConfigState } from './types';
import { sampleProjects } from './data/sampleVideos';
import { fetchConfigStatus } from './services/api';

export default function App() {
  const [currentStep, setCurrentStep] = useState<PipelineStep>('intake');
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const [apiConfig, setApiConfig] = useState<ApiConfigState>({
    hasGroqKey: false,
    hasMuseSparkKey: false,
    hasCoverrKey: false,
    hasGeminiKey: false,
    museBaseUrl: 'https://api.openai.com/v1'
  });

  // Fetch API configuration status on mount
  useEffect(() => {
    fetchConfigStatus().then((cfg) => {
      if (cfg) {
        setApiConfig(prev => ({
          ...prev,
          ...cfg
        }));
      }
    });
  }, []);

  const handleUpdateProject = (updated: VideoProject) => {
    setCurrentProject(updated);
  };

  const handleSaveApiConfig = (updated: Partial<ApiConfigState>) => {
    setApiConfig(prev => ({
      ...prev,
      ...updated
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        setStep={setCurrentStep}
        apiConfig={apiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasActiveProject={Boolean(currentProject)}
        onExportClick={() => setIsExportOpen(true)}
      />

      {/* Main Studio Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentStep === 'intake' && (
          <UploadWorkflow
            currentProject={currentProject}
            onSelectProject={(proj) => {
              setCurrentProject(proj);
            }}
            onNextStep={() => setCurrentStep('whisper_ear')}
          />
        )}

        {currentStep === 'whisper_ear' && currentProject && (
          <WhisperTranscribeView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('muse_director')}
          />
        )}

        {currentStep === 'muse_director' && currentProject && (
          <MuseSparkDirectorView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('coverr_vault')}
            customApiKey={apiConfig.customMuseKey}
            customBaseUrl={apiConfig.customMuseBaseUrl || apiConfig.museBaseUrl}
          />
        )}

        {currentStep === 'coverr_vault' && currentProject && (
          <CoverrVisualVault
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('face_track_canvas')}
            customCoverrKey={apiConfig.customCoverrKey}
          />
        )}

        {currentStep === 'face_track_canvas' && currentProject && (
          <FaceTrackingCanvas
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('anti_detect_inspector')}
          />
        )}

        {currentStep === 'anti_detect_inspector' && currentProject && (
          <AntiDetectInspector
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onOpenExportModal={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <ApiKeysModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={apiConfig}
        onSaveConfig={handleSaveApiConfig}
      />

      {currentProject && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          project={currentProject}
        />
      )}

    </div>
  );
}
