import { MuseDirectorPlan, CoverrStockVideo, PublicFigureProfile } from '../types';

export async function fetchConfigStatus() {
  try {
    const res = await fetch('/api/config-status');
    if (!res.ok) throw new Error('Failed to fetch config status');
    return await res.json();
  } catch (err) {
    return {
      hasGroqKey: false,
      hasMuseSparkKey: false,
      hasCoverrKey: false,
      hasGeminiKey: false,
      museBaseUrl: 'https://api.openai.com/v1'
    };
  }
}

export async function transcribeWithGroq(
  audioBase64: string, 
  customGroqKey?: string,
  promptContext?: string
) {
  try {
    const res = await fetch('/api/transcribe-groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64,
        customGroqKey,
        promptContext
      })
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      isDemoFallback: true,
      error: err.message || 'Transcribe request failed'
    };
  }
}

export async function detectPublicFigureApi(
  transcriptText: string,
  videoTitle?: string,
  customFigureName?: string,
  customApiKey?: string,
  customBaseUrl?: string
): Promise<{ success: boolean; data: PublicFigureProfile; isGemini?: boolean; isMuseSpark?: boolean }> {
  try {
    const res = await fetch('/api/detect-public-figure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcriptText,
        videoTitle,
        customFigureName,
        customApiKey,
        customBaseUrl
      })
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      data: null as any
    };
  }
}

export async function requestMuseDirectorPlan(
  transcriptData: any,
  nicheCategory: string,
  targetDuration: number,
  customApiKey?: string,
  customBaseUrl?: string,
  publicFigure?: PublicFigureProfile | null
): Promise<{ success: boolean; data: MuseDirectorPlan; isDemoFallback?: boolean }> {
  try {
    const res = await fetch('/api/muse-spark-director', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcriptData,
        nicheCategory,
        targetDuration,
        customApiKey,
        customBaseUrl,
        publicFigure
      })
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      isDemoFallback: true,
      data: null as any
    };
  }
}

export async function searchCoverrStockVideos(
  query: string,
  customCoverrKey?: string
): Promise<{ success: boolean; videos: CoverrStockVideo[]; isDemoFallback?: boolean }> {
  try {
    const res = await fetch('/api/coverr-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        customCoverrKey
      })
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      videos: [],
      isDemoFallback: true
    };
  }
}
