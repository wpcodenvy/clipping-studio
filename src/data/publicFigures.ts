import { PublicFigureProfile, AuthorityHookFormula, MultimodalBiometrics } from '../types';

export const knownPublicFigures: PublicFigureProfile[] = [
  {
    id: 'deddy_corbuzier',
    name: 'Deddy Corbuzier',
    role: 'Host Close The Door, Mentalist & Investor',
    category: 'podcaster',
    authorityTitle: 'Host Podcast #1 Indonesia • 21M+ Subs',
    verifiedBadgeType: 'gold',
    credibilitySnippet: 'Pelopor podcast format panjang paling berpengaruh di Indonesia.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    confidenceScore: 0.99,
    authorityMultiplier: 3.6,
    generatedHooks: [
      {
        formula: 'tough_love_warning',
        title: 'Nasihat Keras Deddy Corbuzier: Jangan Mau Diperbudak Rasa Malas!',
        hookText: 'Kalo lo masih miskin di umur segini, stop nyalahin keadaan!',
        psychologicalTrigger: 'Ego Shock & Realita Keras',
        retentionScore: 99
      },
      {
        formula: 'celebrity_paradox',
        title: 'Punya Ratusan Miliar Tapi Tolak Gaya Hidup Pamer',
        hookText: 'Orang yang beneran kaya gak akan sibuk pamer flex di medsos!',
        psychologicalTrigger: 'Status Inversion & Curiosity',
        retentionScore: 96
      },
      {
        formula: 'insider_leak',
        title: 'Bocoran Rahasia Mental Juara dari Podcast Close The Door',
        hookText: 'Semua bintang tamu top yang sukses punya satu pola tersembunyi ini!',
        psychologicalTrigger: 'Insider Authority & Mystery',
        retentionScore: 97
      },
      {
        formula: 'golden_rule_shift',
        title: '1 Prinsip Disiplin Brutal yang Mengubah Nasib Deddy Corbuzier',
        hookText: 'Cuma satu aturan ini yang bikin lo konsisten seumur hidup!',
        psychologicalTrigger: 'Actionable Silver Bullet',
        retentionScore: 98
      }
    ]
  },
  {
    id: 'timothy_ronald',
    name: 'Timothy Ronald',
    role: 'Investor Crypto, Co-Founder Ternak Uang & Entrepreneur',
    category: 'investor',
    authorityTitle: 'Investor & Tokoh Edukasi Finansial Gen-Z',
    verifiedBadgeType: 'gold',
    credibilitySnippet: 'Portofolio aset digital multi-miliar & mentor finansial ratusan ribu anak muda.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    confidenceScore: 0.98,
    authorityMultiplier: 3.4,
    generatedHooks: [
      {
        formula: 'celebrity_paradox',
        title: 'Kaya di Usia 22 Tahun: Kebiasaan Aneh yang Ditolak Orang Miskin',
        hookText: 'Lo gak akan pernah kaya kalau masih mikir uang itu cuma buat ditabung!',
        psychologicalTrigger: 'Counter-Intuitive Financial Shock',
        retentionScore: 98
      },
      {
        formula: 'insider_leak',
        title: 'Bocoran Analisis Siklus Pasar 2026 yang Dirahasiakan Whale',
        hookText: 'Inilah kenapa 99% orang rungkad saat pasar mulai bullish!',
        psychologicalTrigger: 'FOMO & Information Asymmetry',
        retentionScore: 97
      },
      {
        formula: 'tough_love_warning',
        title: 'Peringatan Keras Buat Anak Muda yang Mau Cepat Kaya Tanpa Skill',
        hookText: 'Stop mimpi cuan instan kalau fundamental lo masih nol besar!',
        psychologicalTrigger: 'Tough Reality Check',
        retentionScore: 95
      },
      {
        formula: 'golden_rule_shift',
        title: 'Hukum Alokasi Modal 70/20/10 yang Mengubah Hidup Timothy',
        hookText: 'Terapkan rumus ini 6 bulan, dan liat apa yang terjadi sama saldo lo!',
        psychologicalTrigger: 'Transformational Blueprint',
        retentionScore: 96
      }
    ]
  },
  {
    id: 'tom_lembong',
    name: 'Tom Lembong',
    role: 'Mantan Menteri Perdagangan RI & Ekonom Senior Harvard',
    category: 'politics',
    authorityTitle: 'Mantan Menteri Perdagangan RI • Harvard Alumni',
    verifiedBadgeType: 'government',
    credibilitySnippet: 'Arsitek kebijakan ekonomi makro & perdagangan internasional terkemuka.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    confidenceScore: 0.97,
    authorityMultiplier: 3.8,
    generatedHooks: [
      {
        formula: 'insider_leak',
        title: 'Bocoran Dapur Kebijakan: Alasan Asli Kenapa Harga Barang Terus Naik',
        hookText: 'Ada fakta data ekonomi yang gak pernah dijelaskan di berita TV!',
        psychologicalTrigger: 'Institutional Insider Authority',
        retentionScore: 99
      },
      {
        formula: 'celebrity_paradox',
        title: 'Pandangan Kontroversial Tom Lembong Soal Lapangan Kerja Masa Depan',
        hookText: 'Gelar sarjana kamu gak akan berguna kalau AI sudah ambil alih industri ini!',
        psychologicalTrigger: 'High-Status Contrarian Warning',
        retentionScore: 98
      },
      {
        formula: 'golden_rule_shift',
        title: 'Formula Diplomasi & Negosiasi Kelas Dunia ala Tom Lembong',
        hookText: 'Cara meyakinkan siapa pun dalam 60 detik pertama percakapan!',
        psychologicalTrigger: 'Elite Skill Mastery',
        retentionScore: 96
      },
      {
        formula: 'tough_love_warning',
        title: 'Peringatan Mantan Menteri: Krisis Global yang Mengancam Tabungan Rakyat',
        hookText: 'Lindungi aset keluarga kamu sebelum gelombang inflasi baru menghantam!',
        psychologicalTrigger: 'Urgent Loss Aversion',
        retentionScore: 97
      }
    ]
  },
  {
    id: 'merry_riana',
    name: 'Merry Riana',
    role: 'Entrepreneur, Motivator No. 1 Indonesia & Investor',
    category: 'mindset',
    authorityTitle: 'Motivator Wanita No. 1 Indonesia • Entrepreneur',
    verifiedBadgeType: 'gold',
    credibilitySnippet: 'Peraih $1 Juta pertama di usia 26 tahun & inspirator jutaan wanita karir.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    confidenceScore: 0.98,
    authorityMultiplier: 3.3,
    generatedHooks: [
      {
        formula: 'golden_rule_shift',
        title: 'Rumus Sejuta Dolar Merry Riana: Mengubah Hutang Jadi Modal Sukses',
        hookText: 'Saat semua pintu tertutup, cuma strategi ini yang bisa selamatkan kamu!',
        psychologicalTrigger: 'Underdog Triumph & Formula',
        retentionScore: 97
      },
      {
        formula: 'tough_love_warning',
        title: 'Nasihat Merry Riana Buat yang Sering Merasa Gagal dan Insecure',
        hookText: 'Bukan kurang pintar, tapi kamu terlalu sering mendengarkan omongan orang!',
        psychologicalTrigger: 'Empathetic Wake-up Call',
        retentionScore: 96
      },
      {
        formula: 'celebrity_paradox',
        title: 'Dari Makan Mie Instan Tiap Hari Jadi Miliarder di Singapura',
        hookText: 'Perbedaan orang sukses bukan di modalnya, tapi cara merespons penolakan!',
        psychologicalTrigger: 'Hero Journey Contrast',
        retentionScore: 98
      },
      {
        formula: 'insider_leak',
        title: '3 Pertanyaan Mental yang Diajukan Merry Riana Sebelum Ambil Keputusan Besar',
        hookText: 'Gunakan filter ini agar kamu gak pernah salah memilih arah karir!',
        psychologicalTrigger: 'Decision Framework',
        retentionScore: 95
      }
    ]
  },
  {
    id: 'raditya_dika',
    name: 'Raditya Dika',
    role: 'Penulis, Komika, Sutradara & Konten Kreator Senior',
    category: 'creator',
    authorityTitle: 'Kreator Konten Senior & Maestro Storytelling',
    verifiedBadgeType: 'top_creator',
    credibilitySnippet: 'Pelopor stand-up comedy Indonesia, sutradara film box office & investor saham dividen.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    confidenceScore: 0.97,
    authorityMultiplier: 3.2,
    generatedHooks: [
      {
        formula: 'celebrity_paradox',
        title: 'Raditya Dika: Kenapa Hidup Minimalis Justru Bikin Rekening Makin Gemuk',
        hookText: 'Semakin kamu gak peduli validasi orang, semakin cepat kamu bebas finansial!',
        psychologicalTrigger: 'Counter-Intuitive Lifestyle',
        retentionScore: 97
      },
      {
        formula: 'golden_rule_shift',
        title: 'Rahasia Storytelling Raditya Dika: Bikin Penonton Nempel Sampe Detik Terakhir',
        hookText: 'Ini teknik Set-up & Punchline yang bikin video apa pun viral!',
        psychologicalTrigger: 'Mastery Technique',
        retentionScore: 98
      },
      {
        formula: 'insider_leak',
        title: 'Strategi Saham Dividen Raditya Dika untuk Pensiun Dini Tenang',
        hookText: 'Bukan trading harian, ini cara pasif income bekerja saat kamu tidur!',
        psychologicalTrigger: 'Financial Freedom Blueprint',
        retentionScore: 96
      },
      {
        formula: 'tough_love_warning',
        title: 'Pesan untuk Kreator Pemula: Jangan Berharap Cuan Kalau Belum Bikin 100 Video!',
        hookText: 'Algoritma gak kejam, karya lo aja yang emang belum cukup konsisten!',
        psychologicalTrigger: 'Creator Tough Love',
        retentionScore: 95
      }
    ]
  },
  {
    id: 'alex_hormozi',
    name: 'Alex Hormozi',
    role: 'Managing Partner Acquisition.com & Author $100M Offers',
    category: 'business',
    authorityTitle: 'Portfolio Value $150M+ • Author $100M Leads',
    verifiedBadgeType: 'billionaire',
    credibilitySnippet: 'Membangun portofolio bisnis dengan revenue ratusan juta dolar dari nol.',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    confidenceScore: 0.99,
    authorityMultiplier: 3.9,
    generatedHooks: [
      {
        formula: 'tough_love_warning',
        title: 'Alex Hormozi: You Are Not Poor, You Are Just Untrained!',
        hookText: 'If you want to be rich, you have to do boring work for 5 years straight!',
        psychologicalTrigger: 'Direct High-Status Provocation',
        retentionScore: 99
      },
      {
        formula: 'celebrity_paradox',
        title: 'The $100M Grand Slam Offer: Make Offers So Good People Feel Stupid Saying No',
        hookText: 'Stop charging low prices! Lowering your price attracts the worst customers!',
        psychologicalTrigger: 'Paradoxical Pricing Truth',
        retentionScore: 98
      },
      {
        formula: 'golden_rule_shift',
        title: 'The 1-Page Framework that Generates $10,000/Day with Zero Ads',
        hookText: 'Focus on volume until it hurts, then scale the winners!',
        psychologicalTrigger: 'Mathematical Scaling Law',
        retentionScore: 97
      },
      {
        formula: 'insider_leak',
        title: 'The Secret Value Equation that Multiplies Customer Lifetime Value by 10x',
        hookText: 'Dream outcome multiplied by perceived likelihood, divided by time delay!',
        psychologicalTrigger: 'Billionaire Playbook',
        retentionScore: 98
      }
    ]
  },
  {
    id: 'elon_musk',
    name: 'Elon Musk',
    role: 'CEO Tesla, SpaceX, Neuralink & xAI',
    category: 'tech',
    authorityTitle: 'World’s Richest Person • Founder SpaceX & Tesla',
    verifiedBadgeType: 'billionaire',
    credibilitySnippet: 'Visioner industri antariksa, mobil listrik, AI, dan satelit Starlink global.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    confidenceScore: 0.99,
    authorityMultiplier: 4.2,
    generatedHooks: [
      {
        formula: 'golden_rule_shift',
        title: 'Elon Musk’s First Principles Thinking: How to Solve Any Impossible Problem',
        hookText: 'Boil things down to their most fundamental truths and reason up from there!',
        psychologicalTrigger: 'Genius-Level Mental Model',
        retentionScore: 99
      },
      {
        formula: 'tough_love_warning',
        title: 'Elon Musk Warning: Work 80 to 100 Hours a Week or Settle for Mediocrity',
        hookText: 'If other people put in 40 hours and you put in 100, you achieve in 4 months what takes them a year!',
        psychologicalTrigger: 'Extreme Work Ethic Challenge',
        retentionScore: 98
      },
      {
        formula: 'celebrity_paradox',
        title: 'Why Elon Musk Risked His Last $40 Million Instead of Retiring Rich',
        hookText: 'When something is important enough, you do it even if the odds are not in your favor!',
        psychologicalTrigger: 'Heroic Risk Contrast',
        retentionScore: 97
      },
      {
        formula: 'insider_leak',
        title: 'The Secret 5-Step Algorithm Elon Musk Uses to Delete Unnecessary Bottlenecks',
        hookText: 'Step 1: Make your requirements less dumb. Everyone’s wrong to some degree!',
        psychologicalTrigger: 'Silicon Valley Secret Weapon',
        retentionScore: 98
      }
    ]
  },
  {
    id: 'sandiaga_uno',
    name: 'Sandiaga Uno',
    role: 'Wirausahawan Nasional & Praktisi Bisnis',
    category: 'business',
    authorityTitle: 'Wirausahawan Nasional • Founder Saratoga',
    verifiedBadgeType: 'gold',
    credibilitySnippet: 'Membangun kerajaan bisnis dari korban PHK krisis 1998 hingga membuka ribuan lapangan kerja.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    confidenceScore: 0.96,
    authorityMultiplier: 3.3,
    generatedHooks: [
      {
        formula: 'celebrity_paradox',
        title: 'Pernah Di-PHK Saat Krisis: Kunci Sandiaga Uno Bangkit Hingga Punya Holding Raksasa',
        hookText: 'Kegagalan itu bukan akhir, tapi awal dari pivot terbesar dalam hidupmu!',
        psychologicalTrigger: 'Resilience Contrast',
        retentionScore: 96
      },
      {
        formula: 'golden_rule_shift',
        title: 'Konsep 3G Sandiaga Uno: Gercep, Geber, Gaspol untuk UMKM Naik Kelas',
        hookText: 'Kecepatan eksekusi mengalahkan rencana bisnis 100 halaman!',
        psychologicalTrigger: 'Execution Acceleration',
        retentionScore: 97
      },
      {
        formula: 'insider_leak',
        title: 'Rahasia Mencari Investor & Pitching Modal Bisnis Ala Sandiaga Uno',
        hookText: 'Investor tidak mendanai ide kamu, investor mendanai siapa orang di balik kemudinya!',
        psychologicalTrigger: 'Investor Psychology',
        retentionScore: 98
      },
      {
        formula: 'tough_love_warning',
        title: 'Pesan Tegas Buat Pebisnis Pemula: Jangan Campur Uang Pribadi dan Uang Usaha!',
        hookText: '90% bisnis mati di tahun pertama karena manajemen cash flow yang berantakan!',
        psychologicalTrigger: 'Financial Survival Truth',
        retentionScore: 95
      }
    ]
  }
];

// Helper to match text / transcript / keywords against known figures
export function detectPublicFigureFromText(text: string, title?: string): PublicFigureProfile | null {
  const combined = `${title || ''} ${text || ''}`.toLowerCase();

  // Search by exact name or known keywords
  for (const figure of knownPublicFigures) {
    const nameLower = figure.name.toLowerCase();
    const parts = nameLower.split(' ');
    
    // Check full name or key surname
    if (combined.includes(nameLower)) {
      return figure;
    }
    
    if (parts.length > 1 && parts.every(p => combined.includes(p))) {
      return figure;
    }

    if (figure.id === 'deddy_corbuzier' && (combined.includes('corbuzier') || combined.includes('close the door') || combined.includes('om deddy'))) {
      return figure;
    }
    if (figure.id === 'timothy_ronald' && (combined.includes('timothy') || combined.includes('ternak uang') || combined.includes('ronald'))) {
      return figure;
    }
    if (figure.id === 'tom_lembong' && (combined.includes('lembong') || combined.includes('tom lembong') || combined.includes('menteri perdagangan'))) {
      return figure;
    }
    if (figure.id === 'merry_riana' && (combined.includes('merry riana') || combined.includes('sejuta dolar') || combined.includes('miss merry'))) {
      return figure;
    }
    if (figure.id === 'raditya_dika' && (combined.includes('raditya dika') || combined.includes('radit') || combined.includes('stand up dika'))) {
      return figure;
    }
    if (figure.id === 'alex_hormozi' && (combined.includes('hormozi') || combined.includes('acquisition.com') || combined.includes('100m offers'))) {
      return figure;
    }
    if (figure.id === 'elon_musk' && (combined.includes('elon') || combined.includes('musk') || combined.includes('spacex') || combined.includes('tesla'))) {
      return figure;
    }
    if (figure.id === 'sandiaga_uno' && (combined.includes('sandiaga') || combined.includes('sandiaga uno') || combined.includes('saratoga') || combined.includes('menparekraf'))) {
      return figure;
    }
  }

  // Fallback to top public figure if keywords like "podcast", "miliarder", "menteri", "investasi"
  if (combined.includes('podcast') || combined.includes('debat')) {
    return knownPublicFigures[0]; // Deddy
  }
  if (combined.includes('investor') || combined.includes('crypto') || combined.includes('uang')) {
    return knownPublicFigures[1]; // Timothy
  }
  if (combined.includes('ekonomi') || combined.includes('kebijakan') || combined.includes('pemerintah')) {
    return knownPublicFigures[2]; // Tom Lembong
  }

  return null;
}

// Generate dynamic multimodal biometrics for any public figure
export function generateBiometricsForFigure(figure: Partial<PublicFigureProfile>): MultimodalBiometrics {
  const isPodcaster = figure.category === 'podcaster' || figure.id === 'deddy_corbuzier';
  const isInvestor = figure.category === 'investor' || figure.id === 'timothy_ronald';
  const isPolitics = figure.category === 'politics' || figure.id === 'tom_lembong';

  const fundamentalHz = isPodcaster ? 94 : isInvestor ? 138 : isPolitics ? 112 : 124;
  const timbre = isPodcaster 
    ? 'Deep Baritone Chest Resonance (Microphone Close-Proximity)' 
    : isInvestor 
    ? 'Dynamic Analytical Tenor (Rapid Cadence)' 
    : isPolitics 
    ? 'Measured Diplomatic Baritone (Articulate Pauses)' 
    : 'Clear Broadcast Resonant Pitch';

  const wpm = isInvestor ? 162 : isPodcaster ? 142 : isPolitics ? 128 : 145;

  return {
    vision: {
      facialLandmarksDetected: 468,
      faceContourMatchScore: 0.985,
      visualConfidence: 98.6,
      lightingEnvironment: '3-Point Studio Keylight + Rim Highlight',
      gazeDirectToCamera: true,
      faceBBoxCenterNorm: [0.5, 0.42]
    },
    audio: {
      fundamentalFrequencyHz: fundamentalHz,
      vocalTimbre: timbre,
      speakingRateWpm: wpm,
      formantSignature: `F1: ${Math.round(fundamentalHz * 4.2)}Hz | F2: ${Math.round(fundamentalHz * 18.5)}Hz`,
      vocalConfidence: 97.4,
      diarizationClusterId: 'Speaker_01_Dominant_Host'
    },
    nlp: {
      catchphraseMatches: [
        'Close The Door',
        'Smart People',
        'Mindset Juara',
        'Margin of Safety',
        'Formula Rahasia'
      ],
      domainTaxonomy: `${figure.role || 'High Authority'} • Public Figure Domain`,
      semanticConfidence: 99.2
    },
    compositeScore: 98.4,
    retentionLockBoost: `+${Math.round(((figure.authorityMultiplier || 3.4) - 1) * 100)}% First 3-Sec Stop Rate`
  };
}

// Generate dynamic hook for any custom public figure
export function generateAuthorityHooksForFigure(figure: PublicFigureProfile, customContext?: string) {
  const name = figure.name;
  const title = figure.authorityTitle;

  return [
    {
      formula: 'tough_love_warning' as AuthorityHookFormula,
      title: `Nasihat Keras ${name}: Stop Buang Waktu & Buang Peluang!`,
      hookText: customContext ? `Pesan penting dari ${name}: "${customContext}"` : `Nasihat tanpa sensor dari ${name} yang wajib didengar sekarang!`,
      psychologicalTrigger: 'High Authority Reality Check',
      retentionScore: Math.round(95 + Math.random() * 4)
    },
    {
      formula: 'celebrity_paradox' as AuthorityHookFormula,
      title: `${title} Ini Tolak Cara Konvensional demi Satu Prinsip Ini`,
      hookText: `Rahasia di balik status ${name} yang berlawanan 180° dengan logika orang biasa!`,
      psychologicalTrigger: 'Status Inversion & Curiosity Gap',
      retentionScore: Math.round(96 + Math.random() * 4)
    },
    {
      formula: 'insider_leak' as AuthorityHookFormula,
      title: `Bocoran Dapur Strategi ${name} yang Tidak Pernah Dibuka ke Publik`,
      hookText: `Inilah strategi eksklusif ${name} yang cuma dibagikan ke lingkaran terdalam!`,
      psychologicalTrigger: 'Exclusive Insider Access',
      retentionScore: Math.round(97 + Math.random() * 3)
    },
    {
      formula: 'golden_rule_shift' as AuthorityHookFormula,
      title: `1 Formula Rahasia ${name} yang Mengubah Segala Hal`,
      hookText: `Cuma satu prinsip fundamental ini yang membawa ${name} ke puncak kesuksesan!`,
      psychologicalTrigger: 'Transformational Silver Bullet',
      retentionScore: Math.round(98 + Math.random() * 2)
    }
  ];
}
