import { ModelOption, SpeechData, SpeechAnalysisResult } from '../types';


export function getEffectiveBaseUrl(baseUrl?: string): string {
  const url = baseUrl || 'https://api.gutsai.id/v1';
  // If running in browser and URL points to api.gutsai.id, use Vite proxy /api-guts to eliminate CORS blockage
  if (typeof window !== 'undefined' && url.includes('api.gutsai.id')) {
    const origin = (window.location && window.location.origin && window.location.origin !== 'null' && window.location.origin !== '')
      ? window.location.origin
      : 'http://localhost:5173';
    return `${origin}/api-guts/v1`;
  }
  return url;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'nemotron-3-ultra', name: 'Nemotron 3 Ultra (Sangat Cerdas & Rapi - Rekomendasi)', speed: 'Normal', intelligence: 'Tertinggi' },
  { id: 'nemotron-3.5-lightning', name: 'Nemotron 3.5 Lightning (Deep Reasoning)', speed: 'Cukup', intelligence: 'Tinggi' },
  { id: 'nemotron-3-super', name: 'Nemotron 3 Super', speed: 'Cepat', intelligence: 'Tinggi' },
  { id: 'nemotron-3-nano-omni', name: 'Nemotron 3 Nano Omni', speed: 'Sangat Cepat', intelligence: 'Standar' },
  { id: 'laguna-s2.1', name: 'Laguna S2.1 (Respon Kilat < 2 detik)', speed: 'Kilat', intelligence: 'Baik' },
  { id: 'laguna-xs2.1', name: 'Laguna XS2.1', speed: 'Kilat', intelligence: 'Baik' },
  { id: 'ling-3.0-flash-fin', name: 'Ling 3.0 Flash Fin', speed: 'Cepat', intelligence: 'Baik' },
];

export function parseTriLayerResponse(rawText: string): SpeechData {
  let english = '';
  let caraBaca = '';
  let indoMeaning = '';

  // Regex patterns to capture sections
  const engMatch = rawText.match(/###\s*1\.\s*English Speech[^\n]*\n([\s\S]*?)(?=###\s*2\.\s*Cara Baca|$)/i);
  const caraMatch = rawText.match(/###\s*2\.\s*Cara Baca[^\n]*\n([\s\S]*?)(?=###\s*3\.\s*Makna|$)/i);
  const indoMatch = rawText.match(/###\s*3\.\s*Makna[^\n]*\n([\s\S]*?)$/i);

  if (engMatch && engMatch[1]) {
    english = engMatch[1].trim();
  }
  if (caraMatch && caraMatch[1]) {
    caraBaca = caraMatch[1].trim();
  }
  if (indoMatch && indoMatch[1]) {
    indoMeaning = indoMatch[1].trim();
  }

  // Fallback parsing if markdown headers differ slightly
  if (!english && !caraBaca) {
    const sections = rawText.split(/###|\d+\.\s*(?:English|Cara Baca|Makna)/i).filter(s => s.trim().length > 0);
    if (sections.length >= 3) {
      english = sections[0].trim();
      caraBaca = sections[1].trim();
      indoMeaning = sections[2].trim();
    } else {
      english = rawText.trim();
      caraBaca = 'Panduan lafal tidak terurai otomatis. Klik dengar audio untuk mendengarkan lafal resmi.';
      indoMeaning = 'Terjemahan tidak terurai otomatis.';
    }
  }

  // Calculate word count and estimated speaking seconds (~130 words per minute)
  const words = english.replace(/[#*_\-\n]/g, ' ').split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const estimatedSeconds = Math.round((wordCount / 130) * 60);

  return {
    english,
    caraBaca,
    indoMeaning,
    wordCount,
    estimatedSeconds
  };
}

export function getOfflineFallbackSpeech({ mode = 'GSL', durationSeconds = 90, subtopic = 'General' }: { mode?: string; durationSeconds?: number; subtopic?: string } = {}): SpeechData {
  if (mode === 'POI' || durationSeconds <= 30) {
    return {
      english: "Honorable Chair, the Delegation of Kenya wishes to clarify that our national framework under the Children Act 2022 prioritizes unconditional school re-enrollment for child survivors. We ask the distinguished delegate: how does your proposal address cross-border victims who lack legal documentation? Kenya yields its time.",
      caraBaca: "Onorebel Cyeer, di Deleigesyen of Kenya wisyes tu klerifai det aur nasyonal freimwerk ander di Cildren Ekt tu tausen tuenti tu praiyoritaises ankondisyonal skul ri-enrolment for caild servaivors. Wi esk di distingsy-d deliget: hau das yor propozel edres kros-border viktims hu lek ligel dokyumenteisyen? Kenya yilds its taim.",
      indoMeaning: "Ketua yang terhormat, Delegasi Kenya ingin mengklarifikasi bahwa kerangka hukum nasional kami di bawah Children Act 2022 memprioritaskan pendaftaran ulang sekolah tanpa syarat bagi anak korban. Kami bertanya kepada delegasi terhormat: bagaimana usulan Anda menangani korban lintas batas yang tidak memiliki dokumen resmi? Kenya menyerahkan waktu kembali.",
      wordCount: 52,
      estimatedSeconds: 24,
      isFallback: true
    };
  }

  if (mode === 'MOD' || durationSeconds <= 60) {
    return {
      english: "Honorable Chair and esteemed colleagues, the Republic of Kenya emphasizes that child trafficking survivors suffer severe academic disruption and deep emotional trauma. In Kenya, our Competency-Based Curriculum and Child Protection Units demonstrate that recovery requires dual investment: trauma-informed teaching and accelerated bridge learning. We urge the committee to establish documentation-free school enrollment protocols. An uneducated child survivor is a future re-exploited victim. Kenya stands ready to co-sponsor actionable solutions.",
      caraBaca: "Onorebel Cyeer end estimd koligs, di Repablik of Kenya emfasaises det caild trefiking servaivors safer sefir akadmik disrapsyen end dip imosyonal troma. In Kenya, aur Kompetensi-Beisd Karikyulum end Caild Proteksyon Yunits demonstreit det rikaveri rikuayers duel infesmen: troma-informd ticing end ekselereited bridj lerning. Wi erdj di komiti tu isteblisy dokyumenteisyen-fri skul enrolmen protokol. En anedyukeited caild servaivor is e fyucer ri-eksploited fiktim. Kenya stens redi tu ko-sponsor eksyonebel solusyens.",
      indoMeaning: "Ketua yang terhormat dan rekan-rekan yang kami muliakan, Republik Kenya menegaskan bahwa anak korban perdagangan manusia mengalami putus sekolah parah dan trauma emosional yang mendalam. Di Kenya, kurikulum berbasis kompetensi dan Unit Perlindungan Anak kami membuktikan bahwa pemulihan membutuhkan investasi ganda: pelatihan guru berbasis trauma dan program kejar paket. Kami mendesak komite membuat protokol pendaftaran sekolah tanpa hambatan dokumen identitas. Anak korban yang tidak berpendidikan berisiko dieksploitasi kembali. Kenya siap menjadi co-sponsor solusi nyata.",
      wordCount: 75,
      estimatedSeconds: 35,
      isFallback: true
    };
  }

  // Default 90s GSL Speech
  return {
    english: "Honorable Chair, distinguished delegates of the United Nations Children's Fund:\n\nThe Republic of Kenya comes before this august body to address a global wound that demands our utmost moral and diplomatic clarity. Globally, millions of children have their futures shattered by sexual exploitation and trafficking. Yet, rescue from exploitation is not the finish line; it is merely the starting point. When a child survivor is rescued only to face closed school doors, severe stigma, and an absence of civil documentation, their vulnerability persists.\n\nKenya has taken decisive national steps. Under the Children Act 2022 and our Counter-Trafficking in Persons Act 2010, we have established specialized Child Protection Units and flexible educational pathways through our Competency-Based Curriculum. However, developing nations cannot shoulder this transnational catastrophe alone. Kenya proposes three fundamental pillars: first, universal waiver of birth certificates for immediate school enrollment; second, integrated psychosocial trauma centers in community hubs; and third, multilateral donor matching funds without burdensome conditionalities.\n\nLet us ensure that hope is not a luxury, but an unyielding right for every child. Kenya yields the remainder of its time to the Dais.",
    caraBaca: "Onorebel Cyeer, distingsy-d deligets of di Yunaited Neisyens Cildrens Fan:\n\nDi Repablik of Kenya kams bifor dis ogas bodi tu edres e globel wund det dimens aur atmost moral end diplomatik kleriti. Globeli, milyens of cildren hef der fyucers syeterd bai seksyuel eksploiteisyen end trefiking. Yet, reskyu from eksploiteisyen is not di finisy lain; it is mirli di starting poin. Wen e caild servaivor is reskyud onli tu feis klosd skul dors, sefir stigma, end en ebsens of sifil dokyumenteisyen, der falnerabiliti persists.\n\nKenya hes teiken disaisif nasyonal steps. Ander di Cildren Ekt tu tausen tuenti tu end aur Kaunter-Trefiking in Persons Ekt tu tausen ten, wi hef isteblisy-d spesyalaizd Caild Proteksyon Yunits end fleksibel edyukeisyonal petweis tru aur Kompetensi-Beisd Karikyulum. Hawefer, difeloping neisyens kenot syolder dis tresnasyonal ketestrofi elon. Kenya propozes tri fandementel pilars: ferst, yunifersel wei-fer of bert sertifikets for imidyet skul enrolmen; sekon, integreited saikosyosyel troma senters in komyuniti habs; end terd, maltileterel donor mecing fans widaut berdenseum kondisyonelitis.\n\nLet as insyur det hop is not e laksyuri, bat en anyilding rait for efri caild. Kenya yilds di rimeinder of its taim tu di Dais.",
    indoMeaning: "Ketua yang terhormat, delegasi UNICEF yang mulia:\n\nRepublik Kenya hadir di hadapan majelis terhormat ini untuk mengatasi luka kemanusiaan global yang menuntut kejelasan moral dan diplomatik kita. Di seluruh dunia, jutaan anak masa depannya hancur akibat eksploitasi seksual dan perdagangan manusia. Namun, penyelamatan bukanlah garis akhir; itu hanyalah titik awal. Ketika seorang anak korban diselamatkan hanya untuk menghadapi pintu sekolah yang tertutup, stigma sosial yang kejam, dan ketiadaan dokumen kependudukan, kerentanan mereka akan terus berlanjut.\n\nKenya telah mengambil langkah nasional yang tegas. Melalui Children Act 2022 dan UU Anti-Perdagangan Orang 2010, kami telah mendirikan Unit Perlindungan Anak dan kurikulum berbasis kompetensi yang fleksibel. Namun, negara-negara berkembang tidak dapat memikul bencana transnasional ini sendirian. Kenya mengusulkan tiga pilar fundamental: pertama, penghapusan syarat akta lahir untuk pendaftaran sekolah darurat; kedua, pusat trauma psikososial terpadu di sekolah; dan ketiga, dana kemitraan donor multilateral tanpa syarat yang memberatkan kedaulatan negara.\n\nMari kita pastikan bahwa harapan bukanlah sebuah kemewahan, melainkan hak mutlak bagi setiap anak di bumi. Kenya menyerahkan sisa waktunya kembali kepada pimpinan sidang.",
    wordCount: 198,
    estimatedSeconds: 91,
    isFallback: true
  };
}

export async function generateDiplomaticSpeech({
  indonesianIdea,
  mode = 'GSL',
  durationSeconds = 90,
  subtopic = 'General Debate',
  model = 'nemotron-3-ultra',
  apiKey = 'sk-guts-83d0dcdcfcf1dc76ae8aaf946815626cbf04ebd3',
  baseUrl = 'https://api.gutsai.id/v1'
}: {
  indonesianIdea: string;
  mode?: string;
  durationSeconds?: number;
  subtopic?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
}): Promise<SpeechData> {
  const targetWordCount = Math.round((durationSeconds / 60) * 125);

  const systemPrompt = `You are the Virtual Co-Delegate and Speechwriter for the Republic of Kenya at PUMUN Regeneration 2026 (UNICEF Committee).
Delegate Name: Muhamad Salman (Solo Delegate).
Committee Agenda: Strengthening educational opportunities and long-term prospects for child survivors of sexual exploitation and trafficking.
Difficulty: Intermediate.

Kenya's National Policy Reference:
- Children Act 2022 (compulsory free education, Child Protection Units).
- Counter-Trafficking in Persons Act 2010 (National Assistance Trust Fund).
- Competency-Based Curriculum (CBC) offering accelerated alternative learning.
- East African Community (EAC) cross-border coordination.
- UNICEF Mandate Boundaries: Support governments, educational programs, capacity building, technical aid. DO NOT advocate for arrest/prosecution of criminals, imposing national legislation, or determining criminal penalties.

The user is Muhamad Salman, who speaks Indonesian and has very limited English fluency.
You must transform Salman's input into an eloquent, highly persuasive diplomatic speech adhering strictly to parliamentary decorum.
Target speaking time: ${durationSeconds} seconds (approximately ${targetWordCount} words).
Speech Mode: ${mode} (General Speakers List = GSL, Moderated Caucus = MOD, Point of Information / Rebuttal = POI).

CRITICAL FORMATTING INSTRUCTION:
Your response MUST be strictly structured in three distinct sections with markdown headers:

### 1. English Speech (Official Diplomatic Text)
(Write the official English diplomatic speech. Address the Dais properly: "Honorable Chair, distinguished delegates...". Incorporate Kenya's stance, laws, and constructive solutions. Yield time at the end: "Kenya yields its time to the Dais.")

### 2. Cara Baca (Panduan Lafal Fonetik Indonesia)
(Write the exact phonetic pronunciation guide in Indonesian spelling for every single word so Salman can read it smoothly out loud without stumbling. E.g. write "Honorable Chair" as "Onorebel Cyeer", "distinguished delegates" as "distingsy-d deligets", "psychosocial" as "saikosyosyel", "survivors" as "servaivors".)

### 3. Makna Bahasa Indonesia (Terjemahan & Penjelasan)
(Provide a clear, sentence-by-sentence Indonesian translation and explanation of the strategic points so Salman understands 100% of what he is saying.)`;

  const userMessage = `Topik/Sub-isu: ${subtopic}
Waktu bicara: ${durationSeconds} detik (Mode: ${mode})
Ide/Pesan saya dari Kenya (dalam Bahasa Indonesia):
"${indonesianIdea}"

Tolong buatkan pidato diplomasi resmi untuk saya sekarang.`;

  try {
    const targetUrl = getEffectiveBaseUrl(baseUrl);
    const response = await fetch(`${targetUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'nemotron-3-ultra',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      throw new Error(`API error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('Empty response from AI model');
    }

    const parsed = parseTriLayerResponse(rawContent);
    return {
      ...parsed,
      isFallback: false,
      modelUsed: model
    };
  } catch (error) {
    console.warn('AI speech generation failed, using intelligent offline fallback:', error);
    return getOfflineFallbackSpeech({ mode, durationSeconds, subtopic });
  }
}

export function getOfflineAnalysisFallback(countryName: string, rawSpeechOrIdea: string): SpeechAnalysisResult {
  const c = countryName.toLowerCase();
  const text = rawSpeechOrIdea.toLowerCase();

  if (c.includes('united states') || c.includes('america') || text.includes('digital') || text.includes('siber')) {
    return {
      countryName,
      summaryIndo: `${countryName} menekankan pengetatan keamanan siber, akuntabilitas audit anggaran ketat, dan pelibatan platform teknologi raksasa, tetapi enggan menyetujui pendanaan tunai tanpa prasyarat.`,
      kenyaImpact: 'Mengancam / Perlu Direspon',
      kenyaStrategy: 'Jangan tolak teknologi mereka, tetapi ingatkan bahwa anak penyintas di garis depan perbatasan membutuhkan tempat penampungan aman, konseling trauma, dan sekolah fisik terlebih dahulu sebelum regulasi siber.',
      counterSpeech: {
        english: 'Honorable Chair, the Delegation of Kenya appreciates the focus on digital safety. However, Kenya reminds this committee that child survivors in transit corridors require immediate food, shelter, and trauma-informed basic schooling before they can benefit from cyber literacy. We urge donor states to fund holistic grassroots rehabilitation rather than conditional technological mandates. Kenya yields back.',
        caraBaca: 'Onorebel Cyeer, dhe Deligeisyen of Kenya eprisyieits dhe fokes on dijitel seifti. Hawefer, Kenya rimainds dhis komiti dhet cyaild servaifers in trensit koridors rikwair imidyet fud, syelter, end troma-informd beysik skuling bifor dhei ken benefit from sayber literesi. Wi erj doner stets tu fand holistik gresruts rihebiliteisyen radher dhen kondisyenel teknolojikel mandets. Kenya yilds bek.',
        indoMeaning: 'Pimpinan yang terhormat, Delegasi Kenya menghargai fokus pada keselamatan digital. Namun, Kenya mengingatkan komite ini bahwa anak-anak penyintas di koridor transit membutuhkan makanan, tempat aman, dan sekolah dasar peka-trauma terlebih dahulu sebelum mereka bisa memanfaatkan literasi siber. Kami mendesak negara donor mendanai pemulihan akar rumput yang menyeluruh ketimbang mandat teknologi bersyarat. Kenya kembalikan waktu.',
        wordCount: 58,
        estimatedSeconds: 30,
        isFallback: true
      }
    };
  }

  if (c.includes('sweden') || c.includes('swedia') || c.includes('canada') || text.includes('dana') || text.includes('gender')) {
    return {
      countryName,
      summaryIndo: `${countryName} mendukung penuh hak pemulihan anak, fokus pada kesetaraan gender korban pelecehan, dan bersedia mengalirkan bantuan dana multilateral melalui UNICEF.`,
      kenyaImpact: 'Menguntungkan',
      kenyaStrategy: 'Sekutu emas! Segera sambut baik pidato mereka di podium, dan ajak mereka mendanai inisiatif SAFE-LEARN Transit Pass yang dirintis oleh Kenya.',
      counterSpeech: {
        english: 'Distinguished Dais, Kenya wholeheartedly welcomes the progressive stance of the distinguished delegate. Cross-border child survivors desperately need unconditional multilateral funding that respects local dignity. Kenya warmly invites the delegate to join our coalition and co-sponsor our SAFE-LEARN framework to guarantee swift educational re-enrollment for all survivors. Kenya yields its time.',
        caraBaca: 'Distingsy-d Dais, Kenya houlhertedli welkems dhe progresif stens of dhe distingsy-d deliget. Kros-border cyaild servaifers desperetli nid enkondisyenel maltileterel fanding dhet rispeks lokel digniti. Kenya wormli infaits dhe deliget tu joyn awer koalisyen end ko-sponsor awer SEIF-LERN freimwerk tu gerenti swift edyukeyisyenel ri-enrolment for ol servaifers. Kenya yilds its taim.',
        indoMeaning: 'Pimpinan Sidang, Kenya menyambut hangat sikap progresif delegasi terhormat. Anak-anak korban lintas batas sangat membutuhkan pendanaan multilateral tanpa syarat yang menghormati martabat lokal. Kenya dengan hangat mengundang delegasi tersebut untuk bergabung dalam koalisi kami dan menjadi co-sponsor kerangka kerja SAFE-LEARN demi menjamin pendaftaran sekolah yang cepat bagi seluruh penyintas. Kenya kembalikan waktu.',
        wordCount: 52,
        estimatedSeconds: 28,
        isFallback: true
      }
    };
  }

  // Default regional/General peer fallback
  return {
    countryName,
    summaryIndo: `Delegasi ${countryName} membahas pentingnya koordinasi regional, pemulihan mental anak korban, serta mekanisme pendaftaran kembali ke sekolah.`,
    kenyaImpact: 'Netral',
    kenyaStrategy: 'Jaga hubungan diplomatik yang bersahabat. Tegaskan posisi Kenya di bawah Children Act 2022 bahwa anak korban tidak boleh dihambat oleh ketiadaan akta lahir.',
    counterSpeech: {
      english: `Honorable Chair, the Republic of Kenya notes the valuable points raised by the distinguished delegate of ${countryName}. Kenya underscores that real rehabilitation demands two immediate actions: removing birth certificate requirements for emergency school enrollment, and embedding trauma counselors in community shelters. Kenya stands ready to collaborate constructively. We yield our time.`,
      caraBaca: `Onorebel Cyeer, dhe Repablik of Kenya nowts dhe felyuebel poins reisd bai dhe distingsy-d deliget of ${countryName}. Kenya enderskors dhet riel rihebiliteisyen dimends tu imidyet eksyens: rimufing berth sertifiket rikwairmens for imerjensi skul enrolmen, end embeding troma kawnselors in komyuniti syelters. Kenya stends redi tu koleboreit konstruktifli. Wi yild awer taim.`,
      indoMeaning: `Pimpinan yang terhormat, Republik Kenya mencatat poin-poin berharga yang disampaikan oleh delegasi terhormat ${countryName}. Kenya menegaskan bahwa pemulihan nyata menuntut dua tindakan nyata: menghapus syarat akta lahir untuk pendaftaran sekolah darurat, dan menempatkan konselor trauma di tempat penampungan masyarakat. Kenya siap berkolaborasi secara konstruktif. Kami kembalikan waktu.`,
      wordCount: 55,
      estimatedSeconds: 30,
      isFallback: true
    }
  };
}

export async function analyzeDelegateSpeech({
  countryName,
  rawSpeechOrIdea,
  model = 'nemotron-3-ultra',
  apiKey = 'sk-guts-83d0dcdcfcf1dc76ae8aaf946815626cbf04ebd3',
  baseUrl = 'https://api.gutsai.id/v1'
}: {
  countryName: string;
  rawSpeechOrIdea: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
}): Promise<SpeechAnalysisResult> {
  const systemPrompt = `You are the Chief Diplomatic Intelligence Advisor for the Republic of Kenya at PUMUN 2026 (UNICEF Committee).
The delegate is Muhamad Salman, representing Kenya as a solo delegate.
Salman CANNOT speak English. He needs an instant Indonesian summary of what was said, strategic advice for Kenya, and an immediate 30-40s counter-speech with Indonesian phonetic pronunciation!

CRITICAL FORMATTING INSTRUCTIONS:
You MUST provide your response strictly structured in these 5 sections with markdown headers:

### 1. Rangkuman Inti
(1-2 kalimat Bahasa Indonesia yang jelas dan padat merangkum apa yang disampaikan atau diusulkan oleh negara ini.)

### 2. Sikap Kenya
(1-2 kalimat: Apakah omongan mereka menguntungkan, netral, atau mengancam Kenya? Apa tindakan diplomasi nyata yang harus Salman lakukan?)

### 3. Sanggahan Pidato Inggris
(Naskah pidato resmi bahasa Inggris 30-40 detik yang lugas. Wajib buka: "Honorable Chair..." dan tutup: "Kenya yields its time to the Dais.")

### 4. Cara Baca Sanggahan
(WAJIB tuliskan ejaan lafal fonetik suku kata Bahasa Indonesia santai untuk seluruh naskah Inggris di atas! JANGAN tulis bahasa Inggris lagi. Contoh: "O-nor-e-bel Cyeer, de de-le-ge-syon of Ken-ya nowts... Ken-ya yilds its taim tu de Dais.")

### 5. Makna Sanggahan
(Terjemahan bahasa Indonesia lengkap dari pidato sanggahan tersebut.)`;

  const userMessage = `Negara yang sedang bicara: ${countryName}
Apa yang mereka katakan / kata kunci yang terdengar:
"${rawSpeechOrIdea}"

Tolong rangkumkan intinya, beri tahu taktik untuk Kenya, dan buatkan pidato balasan/sanggahan 30 detik sekarang.`;

  try {
    const targetUrl = getEffectiveBaseUrl(baseUrl);
    const response = await fetch(`${targetUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'nemotron-3-ultra',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API error HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('Empty response');
    }

    const summaryMatch = rawContent.match(/(?:###|\*\*|#)?\s*1\.\s*Rangkuman[^\n]*\n([\s\S]*?)(?=(?:###|\*\*|#)?\s*2\.|$)/i);
    const strategyMatch = rawContent.match(/(?:###|\*\*|#)?\s*2\.\s*Sikap[^\n]*\n([\s\S]*?)(?=(?:###|\*\*|#)?\s*3\.|$)/i);
    const engMatch = rawContent.match(/(?:###|\*\*|#)?\s*3\.\s*(?:Sanggahan|Pidato|English)[^\n]*\n([\s\S]*?)(?=(?:###|\*\*|#)?\s*4\.|$)/i);
    const caraMatch = rawContent.match(/(?:###|\*\*|#)?\s*4\.\s*Cara Baca[^\n]*\n([\s\S]*?)(?=(?:###|\*\*|#)?\s*5\.|$)/i);
    const indoMatch = rawContent.match(/(?:###|\*\*|#)?\s*5\.\s*Makna[^\n]*\n([\s\S]*?)$/i);

    const summaryIndo = summaryMatch ? summaryMatch[1].trim() : `Delegasi ${countryName} menyampaikan poin terkait topik komite.`;
    const kenyaStrategy = strategyMatch ? strategyMatch[1].trim() : 'Tegaskan posisi Kenya dan usulkan kerja sama konstruktif.';
    let english = engMatch ? engMatch[1].trim() : '';
    let caraBaca = caraMatch ? caraMatch[1].trim() : '';
    let indoMeaning = indoMatch ? indoMatch[1].trim() : '';

    if (!english) {
      // Fallback splitting if headings differed
      const parts = rawContent.split(/###\s*\d+\.|\*\*\d+\.|\d+\.\s*(?:Rangkuman|Sikap|Sanggahan|Cara Baca|Makna)/i);
      if (parts.length >= 4) {
        english = parts[3].trim();
        caraBaca = parts[4] ? parts[4].trim() : english;
        indoMeaning = parts[5] ? parts[5].trim() : '';
      }
    }

    if (!english) {
      return getOfflineAnalysisFallback(countryName, rawSpeechOrIdea);
    }

    if (!caraBaca) {
      caraBaca = english;
    }

    const words = english.replace(/[#*_\-\n]/g, ' ').split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const estimatedSeconds = Math.round((wordCount / 130) * 60);

    let kenyaImpact: 'Menguntungkan' | 'Netral' | 'Mengancam / Perlu Direspon' = 'Netral';
    const lowerStrategy = kenyaStrategy.toLowerCase();
    if (lowerStrategy.includes('kawan') || lowerStrategy.includes('untung') || lowerStrategy.includes('sekutu') || lowerStrategy.includes('dukung') || lowerStrategy.includes('positif')) {
      kenyaImpact = 'Menguntungkan';
    } else if (lowerStrategy.includes('ancam') || lowerStrategy.includes('lawan') || lowerStrategy.includes('tolak') || lowerStrategy.includes('bahaya') || lowerStrategy.includes('hati-hati') || lowerStrategy.includes('waspada')) {
      kenyaImpact = 'Mengancam / Perlu Direspon';
    }

    return {
      countryName,
      summaryIndo,
      kenyaImpact,
      kenyaStrategy,
      counterSpeech: {
        english,
        caraBaca,
        indoMeaning: indoMeaning || 'Terjemahan sanggahan untuk posisi Kenya.',
        wordCount,
        estimatedSeconds,
        isFallback: false
      }
    };
  } catch (err) {
    console.warn('AI analysis failed, using fallback:', err);
    return getOfflineAnalysisFallback(countryName, rawSpeechOrIdea);
  }
}

export function getOfflineCoDelegateFallback(userMessage: string): {
  reply: string;
  speechCard?: { english: string; caraBaca: string; indoMeaning: string };
  shortcut?: { label: string; tabId: string };
} {
  const msg = userMessage.toLowerCase();

  if (msg.includes('roll call') || msg.includes('absen') || msg.includes('panggil')) {
    return {
      reply: `Tenang Salman! 🇰🇪 Saat nama **Republic of Kenya** dipanggil oleh Chair di awal sesi (Roll Call), kamu cukup angkat placard Kenya tinggi-tinggi dan ucapkan kalimat berikut:`,
      speechCard: {
        english: 'Present and Voting.',
        caraBaca: 'Pre-sent end Fow-ting.',
        indoMeaning: 'Hadir dan siap memberikan suara pada setiap voting.'
      },
      shortcut: { label: 'Buka Contekan Darurat ⚡', tabId: 'cheatsheet' }
    };
  }

  if (msg.includes('toilet') || msg.includes('kencing') || msg.includes('izin') || msg.includes('keluar')) {
    return {
      reply: `Kalau kamu mau izin ke toilet saat sidang berlangsung, jangan langsung nyelonong keluar ya! Angkat placard kamu dan ajukan **Point of Personal Privilege**:`,
      speechCard: {
        english: 'Point of Personal Privilege, Chair. Permission to be excused to the restroom.',
        caraBaca: 'Poin of Per-so-nel Pri-fi-lij, Cyeer. Per-mi-syon tu bi eks-kyusd tu de rest-rum.',
        indoMeaning: 'Interupsi hak pribadi pimpinan, izin ke kamar mandi.'
      },
      shortcut: { label: 'Lihat Semua Interupsi ⚡', tabId: 'cheatsheet' }
    };
  }

  if (msg.includes('pidato') || msg.includes('bicara') || msg.includes('podium') || msg.includes('gsl')) {
    return {
      reply: `Siap Salman! Ini naskah pidato resmi Kenya yang paling aman dan berbobot. Kamu tinggal baca lafal fonetik di bawah ini dengan tenang:`,
      speechCard: {
        english: 'Honorable Chair, the Delegation of Kenya affirms that survivor rehabilitation begins with guaranteed education. Under the Children Act 2022, Kenya mandates unconditional school access. Kenya yields its time to the Dais.',
        caraBaca: 'O-nor-e-bel Cyeer, de De-le-ge-syon of Ken-ya e-ferms det ser-vai-ver ri-he-bi-li-te-syon bi-gins wit ge-ren-tid e-dyu-key-syon. An-der de Cyil-dren Ekt tu tau-sen tu-wen-ti tu, Ken-ya men-dets an-kon-di-syo-nel skul ek-ses. Ken-ya yilds its taim tu de Dais.',
        indoMeaning: 'Pimpinan yang terhormat, Delegasi Kenya menegaskan bahwa pemulihan penyintas berawal dari jaminan pendidikan tanpa syarat akta lahir.'
      },
      shortcut: { label: 'Buka Layar Penuh Teleprompter 🎙️', tabId: 'teleprompter' }
    };
  }

  if (msg.includes('dengar') || msg.includes('lawan') || msg.includes('nyerang') || msg.includes('ngomong')) {
    return {
      reply: `Kalau ada delegasi lain yang lagi bicara di podium dan kamu bingung apa maksudnya:
1. Buka tab **Dengar Lawan & Tangkis**.
2. Pilih nama negara mereka.
3. Klik tombol topik cepat (misal: Bahas Dana atau Perbatasan).
4. AI langsung rangkumkan artinya dan siapkan naskah sanggahan siap baca!`,
      shortcut: { label: 'Buka Dengar Lawan Sekarang 🎧', tabId: 'listener' }
    };
  }

  // Default friendly advice
  return {
    reply: `Halo Salman! Nata di sini menemani kamu. 🇰🇪
Jangan panik ya, sebagai solo delegate kamu hebat banget sudah berani tampil!

Kamu mau aku bantu apa sekarang?
1. **Lagi Roll Call?** Ketik: *"aku harus ngomong apa pas dipanggil?"*
2. **Mau pidato di depan?** Ketik: *"bikinin pidato 45 detik"*
3. **Ada negara lain yang lagi pidato?** Ketik: *"negara X lagi ngomongin apa?"*
4. **Mau izin ke toilet?** Ketik: *"cara izin ke toilet"*`,
    shortcut: { label: 'Buka Dengar Lawan 🎧', tabId: 'listener' }
  };
}

export async function chatWithCoDelegate({
  history,
  userMessage,
  model = 'nemotron-3-ultra',
  apiKey = 'sk-guts-83d0dcdcfcf1dc76ae8aaf946815626cbf04ebd3',
  baseUrl = 'https://api.gutsai.id/v1'
}: {
  history: { role: 'user' | 'assistant'; content: string }[];
  userMessage: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
}): Promise<{
  reply: string;
  speechCard?: {
    english: string;
    caraBaca: string;
    indoMeaning: string;
  };
  shortcut?: {
    label: string;
    tabId: string;
  };
}> {
  const systemPrompt = `Kamu adalah Nata, Virtual Co-Delegate dari Republik Kenya di komite UNICEF pada simulasi sidang PBB (PUMUN Regeneration 2026 - SDC 1.0).
Rekan delegasimu adalah Muhamad Salman (seorang solo delegate pemula).
Salman SAMA SEKALI TIDAK BISA BAHASA INGGRIS (0 Inggris) dan belum mengerti alur sidang ataupun cara menggunakan fitur-fitur teknis.
Tugas utamamu adalah mendampingi Salman secara personal:
1. Bersikaplah seperti rekan tim yang hangat, tenang, solutif, dan suportif ("Tenang Salman, aku temenin kamu. Biar aku yang atur taktiknya").
2. Jawab pertanyaan Salman dalam Bahasa Indonesia sehari-hari yang mudah dipahami. Jangan pakai istilah rumit tanpa menjelaskannya.
3. Jika Salman bingung harus bertindak apa: Berikan instruksi langkah demi langkah yang sangat sederhana.
4. Jika Salman butuh berbicara (misal di podium, saat roll call, sanggahan, atau interupsi):
   - Tuliskan naskah resmi Bahasa Inggris.
   - WAJIB berikan "Cara Baca" dalam ejaan fonetik suku kata Bahasa Indonesia santai (contoh: "O-nor-e-bel Cyeer, Ken-ya yilds its taim...").
   - Jelaskan artinya dalam 1 kalimat.
5. Format naskah siap baca jika ada:
   Gunakan format jelas ini di akhir jawaban:
   ### Naskah Siap Baca
   **Inggris:** [Kalimat Inggris resmi]
   **Cara Baca:** [Lafal suku kata Indonesia]
   **Arti:** [Terjemahan Indonesia]`;

  try {
    const targetUrl = getEffectiveBaseUrl(baseUrl);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(`${targetUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'nemotron-3-ultra',
        messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`Chat API error HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('Empty response from model');
    }

    // Parse speechCard if model provided one
    let speechCard: { english: string; caraBaca: string; indoMeaning: string } | undefined;
    const cardMatch = rawContent.match(/###\s*Naskah Siap Baca[\s\S]*?\*\*Inggris:\*\*\s*([^\n]+)[\s\S]*?\*\*Cara Baca:\*\*\s*([^\n]+)[\s\S]*?\*\*Arti:\*\*\s*([^\n]+)/i);
    if (cardMatch) {
      speechCard = {
        english: cardMatch[1].trim(),
        caraBaca: cardMatch[2].trim(),
        indoMeaning: cardMatch[3].trim()
      };
    }

    // Detect contextual shortcut
    let shortcut: { label: string; tabId: string } | undefined;
    const lowerUser = userMessage.toLowerCase();
    if (lowerUser.includes('roll call') || lowerUser.includes('toilet') || lowerUser.includes('interupsi') || lowerUser.includes('izin')) {
      shortcut = { label: 'Buka Contekan Darurat ⚡', tabId: 'cheatsheet' };
    } else if (lowerUser.includes('dengar') || lowerUser.includes('lawan') || lowerUser.includes('omong') || lowerUser.includes('nyerang')) {
      shortcut = { label: 'Buka Dengar Lawan 🎧', tabId: 'listener' };
    } else if (lowerUser.includes('pidato') || lowerUser.includes('gsl') || lowerUser.includes('podium') || lowerUser.includes('bicara')) {
      shortcut = { label: 'Buka Teleprompter 🎙️', tabId: 'teleprompter' };
    } else if (lowerUser.includes('pospap') || lowerUser.includes('position paper') || lowerUser.includes('word') || lowerUser.includes('download')) {
      shortcut = { label: 'Buka Position Paper 📄', tabId: 'pospap' };
    } else if (lowerUser.includes('negara') || lowerUser.includes('sekutu') || lowerUser.includes('uganda') || lowerUser.includes('amerika')) {
      shortcut = { label: 'Buka 22 Negara Intel 🌍', tabId: 'countries' };
    }

    return {
      reply: rawContent,
      speechCard,
      shortcut
    };
  } catch (err) {
    console.warn('AI Co-Delegate chat fallback triggered:', err);
    return getOfflineCoDelegateFallback(userMessage);
  }
}


