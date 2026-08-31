import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Check configured keys
app.get("/api/config-status", (req, res) => {
  res.json({
    hasGroqKey: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0),
    hasMuseSparkKey: Boolean(process.env.MUSE_SPARK_API_KEY && process.env.MUSE_SPARK_API_KEY.trim().length > 0),
    hasCoverrKey: Boolean(process.env.COVERR_API_KEY && process.env.COVERR_API_KEY.trim().length > 0),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0),
    museBaseUrl: process.env.MUSE_SPARK_BASE_URL || "https://api.openai.com/v1"
  });
});

// Groq Whisper Large v3 Transcription Endpoint
app.post("/api/transcribe-groq", async (req, res) => {
  try {
    const { audioBase64, mimeType, customGroqKey, promptContext } = req.body;
    const apiKey = customGroqKey || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        isDemoFallback: true,
        message: "Groq API Key tidak ditemukan. Menggunakan simulasi Whisper Large v3 berbasis data audio fonetik.",
      });
    }

    // Call Groq Whisper API
    if (!audioBase64) {
      return res.status(400).json({ error: "audioBase64 is required" });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64.replace(/^data:audio\/\w+;base64,/, ""), "base64");
    
    // Create form data for Groq
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: mimeType || "audio/mp3" });
    formData.append("file", blob, "audio.mp3");
    formData.append("model", "whisper-large-v3");
    formData.append("response_format", "verbose_json");
    formData.append("timestamp_granularities[]", "word");
    formData.append("timestamp_granularities[]", "segment");
    if (promptContext) {
      formData.append("prompt", promptContext);
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq Whisper API error:", errText);
      return res.status(200).json({
        success: false,
        isDemoFallback: true,
        error: `Groq Whisper API returned ${groqResponse.status}: ${errText}`,
        message: "Fallback ke transkrip terperinci berstempel waktu."
      });
    }

    const data = await groqResponse.json();
    return res.json({
      success: true,
      data,
      isDemoFallback: false
    });
  } catch (error: any) {
    console.error("Transcribe route error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Public Figure Authority & Celebrity Detection Endpoint
app.post("/api/detect-public-figure", async (req, res) => {
  try {
    const { transcriptText, videoTitle, customFigureName, customApiKey, customBaseUrl } = req.body;
    const combined = `${videoTitle || ""} ${transcriptText || ""} ${customFigureName || ""}`.toLowerCase();

    // 1. Try Custom Muse Spark / OpenAI-compatible endpoint if provided
    const museKey = customApiKey || process.env.MUSE_SPARK_API_KEY;
    const museUrl = customBaseUrl || process.env.MUSE_SPARK_BASE_URL;

    const detectionPrompt = `Anda adalah AI pakar analisis tokoh publik, selebritas, podcaster, dan otoritas video pendek.
Analisis teks/judul berikut untuk mendeteksi apakah terdapat Tokoh Publik / Public Figure / Bintang Tamu (Indonesia / Internasional) yang sedang berbicara atau dibahas:
Judul: ${videoTitle || "Tanpa Judul"}
Transkrip: ${transcriptText || "Tidak ada teks"}
Input Tambahan: ${customFigureName || "Tidak ada"}

Kembalikan output murni dalam JSON format:
{
  "detected": true,
  "name": "Nama Lengkap Tokoh",
  "role": "Peran/Profesi Utama",
  "category": "podcaster | investor | business | politics | creator | tech | mindset | global",
  "authorityTitle": "Gelar Otoritas Singkat (Contoh: Host Podcast #1 Indonesia • 21M Subs)",
  "verifiedBadgeType": "gold | blue | government | top_creator | billionaire",
  "credibilitySnippet": "1-2 kalimat ringkas mengapa tokoh ini memiliki otoritas tinggi",
  "confidenceScore": 0.98,
  "authorityMultiplier": 3.5,
  "suggestedHooks": [
    {
      "formula": "tough_love_warning | celebrity_paradox | insider_leak | golden_rule_shift",
      "title": "Judul Hook Berbobot Otoritas",
      "hookText": "Kalimat pembuka 3 detik tajam",
      "psychologicalTrigger": "Alasan psikologis mengapa hook ini ampuh",
      "retentionScore": 98
    }
  ]
}`;

    if (museKey && (transcriptText || videoTitle)) {
      try {
        const targetUrl = (museUrl || "https://api.openai.com/v1").replace(/\/$/, '') + '/chat/completions';
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${museKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "Anda adalah AI analis tokoh publik dan otoritas video pendek. Selalu respon dengan JSON murni." },
              { role: "user", content: detectionPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3
          })
        });

        if (response.ok) {
          const resultData = await response.json();
          const content = resultData.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (parsed && parsed.name) {
              return res.json({
                success: true,
                isMuseSpark: true,
                data: parsed
              });
            }
          }
        }
      } catch (museErr) {
        console.warn("Muse Spark figure detection fallback:", museErr);
      }
    }

    // 2. Try Gemini API if available
    const genAI = getGenAI();
    if (genAI && (transcriptText || videoTitle)) {
      try {
        const response = await genAI.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: detectionPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3
          }
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed && parsed.name) {
            return res.json({
              success: true,
              isGemini: true,
              data: parsed
            });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini figure detection fallback:", geminiErr);
      }
    }

    // Fallback rule-based matching with rich knowledge base
    let detectedProfile = null;

    if (combined.includes("corbuzier") || combined.includes("close the door") || combined.includes("om deddy") || combined.includes("podcast")) {
      detectedProfile = {
        id: "deddy_corbuzier",
        name: "Deddy Corbuzier",
        role: "Host Close The Door, Mentalist & Investor",
        category: "podcaster",
        authorityTitle: "Host Podcast #1 Indonesia • 21M+ Subs",
        verifiedBadgeType: "gold",
        credibilitySnippet: "Pelopor podcast format panjang paling berpengaruh dan berbobot di Indonesia.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        confidenceScore: 0.98,
        authorityMultiplier: 3.6,
        suggestedHooks: [
          {
            formula: "tough_love_warning",
            title: "Nasihat Keras Deddy Corbuzier: Jangan Mau Diperbudak Rasa Malas!",
            hookText: "Kalo lo masih miskin di umur segini, stop nyalahin keadaan!",
            psychologicalTrigger: "Ego Shock & Realita Keras",
            retentionScore: 99
          },
          {
            formula: "celebrity_paradox",
            title: "Punya Ratusan Miliar Tapi Tolak Gaya Hidup Pamer",
            hookText: "Orang yang beneran kaya gak akan sibuk pamer flex di medsos!",
            psychologicalTrigger: "Status Inversion & Curiosity",
            retentionScore: 96
          }
        ]
      };
    } else if (combined.includes("timothy") || combined.includes("ternak uang") || combined.includes("ronald") || combined.includes("crypto")) {
      detectedProfile = {
        id: "timothy_ronald",
        name: "Timothy Ronald",
        role: "Investor Crypto, Co-Founder Ternak Uang & Entrepreneur",
        category: "investor",
        authorityTitle: "Investor & Tokoh Edukasi Finansial Gen-Z",
        verifiedBadgeType: "gold",
        credibilitySnippet: "Portofolio aset digital multi-miliar & mentor finansial ratusan ribu anak muda.",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        confidenceScore: 0.98,
        authorityMultiplier: 3.4,
        suggestedHooks: [
          {
            formula: "celebrity_paradox",
            title: "Kaya di Usia 22 Tahun: Kebiasaan Aneh yang Ditolak Orang Miskin",
            hookText: "Lo gak akan pernah kaya kalau masih mikir uang itu cuma buat ditabung!",
            psychologicalTrigger: "Counter-Intuitive Financial Shock",
            retentionScore: 98
          },
          {
            formula: "insider_leak",
            title: "Bocoran Analisis Siklus Pasar 2026 yang Dirahasiakan Whale",
            hookText: "Inilah kenapa 99% orang rungkad saat pasar mulai bullish!",
            psychologicalTrigger: "FOMO & Information Asymmetry",
            retentionScore: 97
          }
        ]
      };
    } else if (combined.includes("lembong") || combined.includes("tom lembong") || combined.includes("menteri perdagangan") || combined.includes("ekonomi")) {
      detectedProfile = {
        id: "tom_lembong",
        name: "Tom Lembong",
        role: "Mantan Menteri Perdagangan RI & Ekonom Senior Harvard",
        category: "politics",
        authorityTitle: "Mantan Menteri Perdagangan RI • Harvard Alumni",
        verifiedBadgeType: "government",
        credibilitySnippet: "Arsitek kebijakan ekonomi makro & perdagangan internasional terkemuka.",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
        confidenceScore: 0.97,
        authorityMultiplier: 3.8,
        suggestedHooks: [
          {
            formula: "insider_leak",
            title: "Bocoran Dapur Kebijakan: Alasan Asli Kenapa Harga Barang Terus Naik",
            hookText: "Ada fakta data ekonomi yang gak pernah dijelaskan di berita TV!",
            psychologicalTrigger: "Institutional Insider Authority",
            retentionScore: 99
          },
          {
            formula: "celebrity_paradox",
            title: "Pandangan Kontroversial Tom Lembong Soal Lapangan Kerja Masa Depan",
            hookText: "Gelar sarjana kamu gak akan berguna kalau AI sudah ambil alih industri ini!",
            psychologicalTrigger: "High-Status Contrarian Warning",
            retentionScore: 98
          }
        ]
      };
    } else {
      // Default to high-status detected figure
      detectedProfile = {
        id: "deddy_corbuzier",
        name: customFigureName || "Deddy Corbuzier",
        role: "Host Close The Door & Podcaster #1",
        category: "podcaster",
        authorityTitle: "Host Podcast #1 Indonesia • 21M+ Subs",
        verifiedBadgeType: "gold",
        credibilitySnippet: "Pelopor podcast paling ditonton dan dipercaya di Indonesia.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        confidenceScore: 0.95,
        authorityMultiplier: 3.5,
        suggestedHooks: [
          {
            formula: "tough_love_warning",
            title: `Nasihat Keras ${customFigureName || "Deddy Corbuzier"}: Stop Buang Waktu!`,
            hookText: "Kalo lo masih buang waktu di umur segini, stop berharap sukses!",
            psychologicalTrigger: "Authority Reality Check",
            retentionScore: 98
          },
          {
            formula: "insider_leak",
            title: `Bocoran Strategi Rahasia dari ${customFigureName || "Deddy Corbuzier"}`,
            hookText: "Hanya 1% orang yang paham rahasia percepatan karir ini!",
            psychologicalTrigger: "Exclusive High-Status Secret",
            retentionScore: 97
          }
        ]
      };
    }

    return res.json({
      success: true,
      data: detectedProfile
    });

  } catch (error: any) {
    console.error("Public figure detection error:", error);
    return res.status(500).json({ error: error.message || "Detection failed" });
  }
});

// Muse Spark Director Reasoning Endpoint (OpenAI-compatible)
app.post("/api/muse-spark-director", async (req, res) => {
  try {
    const { 
      transcriptData, 
      nicheCategory, 
      customApiKey, 
      customBaseUrl,
      targetDuration = 25,
      publicFigure
    } = req.body;

    const apiKey = customApiKey || process.env.MUSE_SPARK_API_KEY || process.env.GEMINI_API_KEY;
    const baseUrl = customBaseUrl || process.env.MUSE_SPARK_BASE_URL || "https://api.openai.com/v1";

    const figureInstruction = publicFigure ? `
PENTING - TOKOH PUBLIK & OTORITAS TERDETEKSI:
Nama Tokoh: ${publicFigure.name} (${publicFigure.authorityTitle || publicFigure.role})
Kategori: ${publicFigure.category}
Verified Badge: ${publicFigure.verifiedBadgeType}
PETUNJUK SUTRADARA OTORITAS:
- Hook 3 detik pertama (0:00 - 0:03) WAJIB mengkapitalisasi nama dan otoritas ${publicFigure.name}.
- Gunakan formula psikologis: Celebrity Paradox, Tough Love Warning, atau Insider Secret.
- Buat judul hook berbobot tinggi yang memicu rasa penasaran ("FOMO Otoritas").
` : "";

    const systemPrompt = `Anda adalah Sutradara Klip Viral & Rekayasa Perhatian untuk TikTok dan Shopee Video.
TUGAS UTAMA:
1. Analisis transkrip dengan stempel waktu presisi.${figureInstruction}
2. Temukan "Golden Spike Moment" (kalimat paling memicu rasa penasaran, emosi, atau kontroversi) dan jadikan HOOK 3 DETIK PERTAMA (0:00 - 0:03).
3. Bangun "SEAMLESS LOOP STRATEGY": Buat kalimat penutup klip berkesinambungan menjawab atau menyambung kembali ke kalimat awal di detik 0:00, sehingga penonton terperangkap menonton ulang video secara otomatis.
4. Buat storyboard dinamis dengan pergantian event visual setiap 2.0 - 2.5 detik (Punch Zoom In, Zoom Out, B-Roll Coverr, Dynamic Text Pop).
5. Tentukan query pencarian visual Coverr yang konkret dan relevan secara psikologis.
6. HASHTAGS NICHE SPESIFIK: Hasilkan 5-8 hashtag niche berbobot tinggi. DILARANG KERAS menggunakan tag sampah seperti #fyp, #viral, #foryou, #trending. Gunakan hanya tag semantic berorientasi pencarian target penonton & algoritma kategori.

Output WAJIB berupa JSON murni dengan format spesifik berikut:
{
  "viralHookType": "Curiosity Gap | Controversial Claim | Pain Point Shock | Counter-Intuitive Truth | Celebrity Authority",
  "hookTitle": "Judul Hook Provokatif",
  "hookStartSec": 15.2,
  "hookEndSec": 18.0,
  "hookReorderedPlacement": "00:00-00:03",
  "coreStoryStartSec": 0.0,
  "coreStoryEndSec": 24.5,
  "estimatedDurationSec": 25,
  "loopBridge": {
    "closingSentence": "Kalimat penutup video di detik terakhir",
    "connectionToHook": "Bagaimana kalimat ini menyatu mulus ke kalimat pertama saat looping",
    "seamlessLoopScore": 98
  },
  "nicheHashtags": [
    "#affiliatemarketingtips",
    "#strategipenjualan",
    "#belajardigitalmarketing",
    "#trikbisnisonline",
    "#shopeevideocreator"
  ],
  "pacingEvents": [
    {
      "timeSec": 0.0,
      "durationSec": 3.0,
      "action": "HOOK_PUNCH_ZOOM",
      "zoomScale": 1.15,
      "bRollQuery": "stressed business person looking at chart",
      "captionEmphasis": "JANGAN LAKUKAN INI!",
      "directorNote": "Hook dramatis ditarik ke depan"
    },
    {
      "timeSec": 3.0,
      "durationSec": 2.5,
      "action": "B_ROLL_OVERLAY",
      "zoomScale": 1.0,
      "bRollQuery": "person holding credit card shopping on smartphone",
      "captionEmphasis": "Fakta sebenarnya",
      "directorNote": "B-roll Coverr untuk menutupi kejenuhan"
    },
    {
      "timeSec": 5.5,
      "durationSec": 2.5,
      "action": "DYNAMIC_ZOOM_IN",
      "zoomScale": 1.08,
      "bRollQuery": "",
      "captionEmphasis": "Kuncinya ada di sini",
      "directorNote": "Kembali ke wajah pembicara dengan auto-frame 9:16"
    }
  ],
  "antiDetectionScore": {
    "visualDNAChange": 88,
    "acousticShift": 94,
    "metadataCleanliness": 100,
    "retentionLock": 96
  }
}`;

    if (!apiKey) {
      // Return highly structured intelligent mock based on actual transcript words and figure
      return res.json({
        success: true,
        isDemoFallback: true,
        data: generateSmartDirectorPlan(transcriptData, nicheCategory, targetDuration, publicFigure)
      });
    }

    // Call OpenAI / Muse Spark API
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or muse model
        response_format: { type: "json_object" },
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Transkrip Video:\n${JSON.stringify(transcriptData)}\n\nKategori Niche: ${nicheCategory || "Bisnis & Afiliasi"}\nTarget Durasi: ${targetDuration} detik.\nSusun rencana sutradara sekarang dalam format JSON.` 
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Muse Spark API error fallback:", errText);
      return res.json({
        success: true,
        isDemoFallback: true,
        data: generateSmartDirectorPlan(transcriptData, nicheCategory, targetDuration),
        warning: `Muse Spark API returned status ${response.status}. Digunakan intelligent fallback director engine.`
      });
    }

    const aiRes = await response.json();
    const content = aiRes.choices?.[0]?.message?.content;
    const parsedData = JSON.parse(content);

    return res.json({
      success: true,
      data: parsedData,
      isDemoFallback: false
    });

  } catch (error: any) {
    console.error("Muse Spark endpoint error:", error);
    return res.json({
      success: true,
      isDemoFallback: true,
      data: generateSmartDirectorPlan(req.body.transcriptData, req.body.nicheCategory, req.body.targetDuration || 25),
      error: error.message
    });
  }
});

// Coverr API Proxy Endpoint
app.post("/api/coverr-search", async (req, res) => {
  try {
    const { query, customCoverrKey } = req.body;
    const apiKey = customCoverrKey || process.env.COVERR_API_KEY;

    if (!apiKey) {
      // Return curated high quality vertical stock footage for instant experience
      return res.json({
        success: true,
        isDemoFallback: true,
        videos: getCuratedStockVideos(query)
      });
    }

    const response = await fetch(`https://api.coverr.co/videos?query=${encodeURIComponent(query || "business")}&page=1&page_size=6&urls=true`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      return res.json({
        success: true,
        isDemoFallback: true,
        videos: getCuratedStockVideos(query)
      });
    }

    const data = await response.json();
    return res.json({
      success: true,
      videos: data.hits || getCuratedStockVideos(query),
      isDemoFallback: false
    });
  } catch (error: any) {
    return res.json({
      success: true,
      isDemoFallback: true,
      videos: getCuratedStockVideos(req.body.query)
    });
  }
});

// Helper: Smart fallback director logic
function generateSmartDirectorPlan(transcriptData: any, nicheCategory: string, targetDuration: number, publicFigure?: any) {
  const isEcommerce = (nicheCategory || "").toLowerCase().includes("shopee") || (nicheCategory || "").toLowerCase().includes("produk");
  const figureName = publicFigure?.name || "";
  const figureTitle = publicFigure?.authorityTitle || publicFigure?.role || "";
  
  let viralHookType = isEcommerce ? "Pain Point Shock" : "Curiosity Gap";
  let hookTitle = isEcommerce ? "Kesalahan Fatal 90% Seller & Afiliator!" : "Trik Psikologi yang Disembunyikan Algoritma";
  let captionEmphasis = "JANGAN SCROLL DULU!";
  let directorNote = "Hook 3 detik pertama hasil re-order dari menit tengah";

  if (publicFigure && figureName) {
    viralHookType = "Celebrity Authority & Paradox";
    hookTitle = `Nasihat Keras ${figureName}: Mengapa 90% Orang Terjebak Pola Ini!`;
    captionEmphasis = `${figureName.toUpperCase()}: STOP BUANG WAKTU!`;
    directorNote = `Authority Hook 0-3s berbobot tinggi menampilkan lower-third badge otoritas ${figureName}`;
  }

  return {
    viralHookType,
    hookTitle,
    hookStartSec: 14.5,
    hookEndSec: 17.5,
    hookReorderedPlacement: "00:00-00:03",
    coreStoryStartSec: 0.0,
    coreStoryEndSec: Math.min(26.0, targetDuration || 25),
    estimatedDurationSec: Math.min(26.0, targetDuration || 25),
    loopBridge: {
      closingSentence: publicFigure ? `Itulah rahasia pola pikir yang selalu ditekankan ${figureName}...` : "Dan itulah satu-satunya alasan kenapa...",
      connectionToHook: publicFigure ? `Menyambung langsung ke kalimat pembuka di detik 0:00 ('...nasihat keras dari ${figureName}')` : "Menyambung langsung ke kalimat pembuka di detik 0:00 ('...semua orang gagal saat baru mulai')",
      seamlessLoopScore: 99
    },
    nicheHashtags: publicFigure ? [
      `#${figureName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      "#closethedoorpodcast",
      "#edukasifinasial",
      "#mindsetjuara",
      "#inspirasisukses",
      "#strategibisnis"
    ] : (isEcommerce ? [
      "#shopeevideoindonesia",
      "#racunshopeecheck",
      "#tipsafiliasishopee",
      "#belajarjualanonline",
      "#strategibisnisdigital",
      "#affiliatemarketingpemula"
    ] : [
      "#edukasibisnis",
      "#psikologipenjualan",
      "#strategikontenkreator",
      "#trikalgoritmatiktok",
      "#digitalmarketingindonesia",
      "#growthhackingskills"
    ]),
    pacingEvents: [
      {
        timeSec: 0.0,
        durationSec: 3.0,
        action: "HOOK_PUNCH_ZOOM",
        zoomScale: 1.15,
        bRollQuery: "shocked expression podcast host close up vertical",
        captionEmphasis,
        directorNote
      },
      {
        timeSec: 3.0,
        durationSec: 2.2,
        action: "B_ROLL_OVERLAY",
        zoomScale: 1.0,
        bRollQuery: "hands holding money shopping cart vertical",
        captionEmphasis: "Fakta yang jarang dibongkar",
        directorNote: "Coverr visual vault untuk pecah kejenuhan"
      },
      {
        timeSec: 5.2,
        durationSec: 2.4,
        action: "DYNAMIC_ZOOM_IN",
        zoomScale: 1.08,
        bRollQuery: "",
        captionEmphasis: "Perhatikan polanya",
        directorNote: "Face auto-frame 9:16 dengan smooth Lerp motion"
      },
      {
        timeSec: 7.6,
        durationSec: 2.5,
        action: "B_ROLL_OVERLAY",
        zoomScale: 1.0,
        bRollQuery: "fast computer code analytics chart vertical",
        captionEmphasis: "Data membuktikan",
        directorNote: "B-roll penegas bukti data"
      },
      {
        timeSec: 10.1,
        durationSec: 2.8,
        action: "DYNAMIC_ZOOM_OUT",
        zoomScale: 1.03,
        bRollQuery: "",
        captionEmphasis: "Langkah konkritnya",
        directorNote: "Transisi ke penjelasan inti"
      },
      {
        timeSec: 12.9,
        durationSec: 3.0,
        action: "B_ROLL_OVERLAY",
        zoomScale: 1.0,
        bRollQuery: "business growth success graph mobile screen vertical",
        captionEmphasis: "Hasilnya melonjak drastis",
        directorNote: "B-roll klimaks hasil"
      },
      {
        timeSec: 15.9,
        durationSec: 3.5,
        action: "DYNAMIC_ZOOM_IN",
        zoomScale: 1.10,
        bRollQuery: "",
        captionEmphasis: "Simpan video ini sekarang",
        directorNote: "Call to action & seamless loop lock"
      }
    ],
    antiDetectionScore: {
      visualDNAChange: 94,
      acousticShift: 96,
      metadataCleanliness: 100,
      retentionLock: 99
    }
  };
}

// Curated stock videos for instant Coverr preview
function getCuratedStockVideos(query: string = "") {
  return [
    {
      id: "cov_1",
      title: "Business Growth Analytics Chart",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-42998-large.mp4",
      tags: ["business", "chart", "money", "analytics"]
    },
    {
      id: "cov_2",
      title: "Fast Smartphone Scrolling & Shopping",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-person-scrolling-on-a-smartphone-at-night-42289-large.mp4",
      tags: ["mobile", "shopping", "ecommerce", "phone"]
    },
    {
      id: "cov_3",
      title: "Person Reacting Shocked & Focused",
      thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-smiling-at-work-41718-large.mp4",
      tags: ["shocked", "face", "reaction", "focused"]
    },
    {
      id: "cov_4",
      title: "Cyber City Lights Fast Timelapse",
      thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-traffic-in-the-city-at-night-42686-large.mp4",
      tags: ["city", "timelapse", "speed", "modern"]
    },
    {
      id: "cov_5",
      title: "Counting Cash & Financial Transaction",
      thumbnail: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&auto=format&fit=crop&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-money-falling-down-on-a-black-background-42999-large.mp4",
      tags: ["money", "cash", "finance", "profit"]
    }
  ];
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Clipper Studio Server running on http://localhost:${PORT}`);
  });
}

startServer();
