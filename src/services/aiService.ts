import { ModelOption, SpeechData, SpeechAnalysisResult } from '../types';
import { getPaperBasedSpeech, getPaperCoDelegateReply, PAPER_PILLARS } from '../data/paperKnowledge';

export { getPaperBasedSpeech, getPaperCoDelegateReply, PAPER_PILLARS };

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
    english = engMatch[1].replace(/[*#]/g, '').trim();
  }
  if (caraMatch && caraMatch[1]) {
    caraBaca = caraMatch[1].replace(/[*#]/g, '').trim();
  }
  if (indoMatch && indoMatch[1]) {
    indoMeaning = indoMatch[1].replace(/[*#]/g, '').trim();
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
      english: "Honorable Chair, the Delegation of Kenya wishes to clarify that our national framework under the Children Act 2022 prioritizes unconditional school re-enrollment for child survivors. We ask the distinguished delegate: how does your proposal address cross-border victims who lack legal documentation? Kenya yields its time to the Dais.",
      caraBaca: "O-no-re-bel Cyer, de De-le-gei-syon of Ken-ya wi-syes tu kle-ri-fai det awer ne-syo-nal freim-werk an-der de Cil-dren Ekt tu tau-sen twen-ti tu prai-o-ri-tai-ses an-kon-di-syo-nal skul ri en-rol-ment for caild ser-vai-vors. Wi esk de dis-ting-guis-yed de-le-geit: hau das yor pro-po-sal ed-res kros bor-der vik-tims hu lek li-gal do-kyu-men-tei-syon? Ken-ya yilds its taim tu de Dais.",
      indoMeaning: "Ketua yang terhormat, Delegasi Kenya ingin mengklarifikasi bahwa kerangka hukum nasional kami di bawah Children Act 2022 memprioritaskan pendaftaran ulang sekolah tanpa syarat bagi anak korban. Kami bertanya kepada delegasi terhormat: bagaimana usulan Anda menangani korban lintas batas yang tidak memiliki dokumen resmi? Kenya menyerahkan waktu kembali ke Pimpinan Sidang.",
      wordCount: 52,
      estimatedSeconds: 24,
      isFallback: true
    };
  }

  if (mode === 'MOD' || durationSeconds <= 60) {
    return {
      english: "Honorable Chair and esteemed colleagues, the Republic of Kenya emphasizes that child trafficking survivors suffer severe academic disruption and deep emotional trauma. In Kenya, our Competency-Based Curriculum and Child Protection Units demonstrate that recovery requires dual investment: trauma-informed teaching and accelerated bridge learning. We urge the committee to establish documentation-free school enrollment protocols. An uneducated child survivor is a future re-exploited victim. Kenya stands ready to co-sponsor actionable solutions.",
      caraBaca: "O-no-re-bel Cyer end es-timd ko-ligs, de Re-pab-lik of Ken-ya em-fa-sai-ses det caild tre-fi-king ser-vai-vors sa-fer se-fir a-ka-de-mik dis-rap-syon end dip i-mo-syo-nal tro-ma. In Ken-ya, awer Kom-pe-ten-si Beisd Ke-ri-kyu-lum end Caild Pro-tek-syon Yu-nits de-mon-streit det ri-ka-ve-ri ri-kwairs du-el in-vest-ment: tro-ma in-formd ti-cing end ek-se-le-rei-ted bridj ler-ning. Wi erj de ko-mi-ti tu es-teb-lisy do-kyu-men-tei-syon fri skul en-rol-ment pro-to-kols. En an-e-dyu-kei-ted caild ser-vai-vor is e fyu-cer ri eks-ploi-ted vik-tim. Ken-ya stends re-di tu ko spon-sor ek-syo-na-bel so-lu-syens.",
      indoMeaning: "Ketua yang terhormat dan rekan-rekan yang kami muliakan, Republik Kenya menegaskan bahwa anak korban perdagangan manusia mengalami putus sekolah parah dan trauma emosional yang mendalam. Di Kenya, kurikulum berbasis kompetensi dan Unit Perlindungan Anak kami membuktikan bahwa pemulihan membutuhkan investasi ganda: pelatihan guru berbasis trauma dan program kejar paket. Kami mendesak komite membuat protokol pendaftaran sekolah tanpa hambatan dokumen identitas. Anak korban yang tidak berpendidikan berisiko dieksploitasi kembali. Kenya siap menjadi co-sponsor solusi nyata.",
      wordCount: 75,
      estimatedSeconds: 35,
      isFallback: true
    };
  }

  // Default 90s GSL Speech
  return {
    english: "Honorable Chair, distinguished delegates of the United Nations Children's Fund:\n\nThe Republic of Kenya comes before this august body to address a global wound that demands our utmost moral and diplomatic clarity. Globally, millions of children have their futures shattered by sexual exploitation and trafficking. Yet, rescue from exploitation is not the finish line; it is merely the starting point. When a child survivor is rescued only to face closed school doors, severe stigma, and an absence of civil documentation, their vulnerability persists.\n\nKenya has taken decisive national steps. Under the Children Act 2022 and our Counter-Trafficking in Persons Act 2010, we have established specialized Child Protection Units and flexible educational pathways through our Competency-Based Curriculum. However, developing nations cannot shoulder this transnational catastrophe alone. Kenya proposes three fundamental pillars: first, universal waiver of birth certificates for immediate school enrollment; second, integrated psychosocial trauma centers in community hubs; and third, multilateral donor matching funds without burdensome conditionalities.\n\nLet us ensure that hope is not a luxury, but an unyielding right for every child. Kenya yields the remainder of its time to the Dais.",
    caraBaca: "O-no-re-bel Cyer, dis-ting-guis-yed de-le-geits of de Yu-nai-ted Nei-syens Cil-drens Fand:\n\nDe Re-pab-lik of Ken-ya kams bi-for dis o-gast bo-di tu ed-res e glo-bal wund det di-mends awer at-moust mo-ral end dip-lo-ma-tik kle-ri-ti. Glo-ba-li, mil-yens of cil-dren hev der fyu-cers sye-terd bai sek-syu-al eks-ploi-tei-syon end tre-fi-king. Yet, res-kyu from eks-ploi-tei-syon is not de fi-nisy lain; it is mir-li de star-ting point. Wen e caild ser-vai-vor is res-kyud on-li tu feis klosd skul dors, se-fir stig-ma, end en eb-sens of si-vil do-kyu-men-tei-syon, der val-ne-ra-bi-li-ti per-sists.\n\nKen-ya hes tei-ken di-sai-sif ne-syo-nal steps. An-der de Cil-dren Ekt tu tau-sen twen-ti tu end awer Kawn-ter Tre-fi-king in Per-sons Ekt tu tau-sen ten, wi hev es-teb-lisyd spe-sya-laizd Caild Pro-tek-syon Yu-nits end flek-si-bel e-dyu-kei-syo-nal pat-weis tru awer Kom-pe-ten-si Beisd Ke-ri-kyu-lum. Hau-e-ver, de-ve-lo-ping nei-syens ke-not syol-der dis trens-ne-syo-nal ke-tas-tro-fi e-lon. Ken-ya pro-po-ses tri fan-da-men-tal pi-lars: ferst, yu-ni-ver-sal wei-ver of bert ser-ti-fi-kets for i-mi-dyet skul en-rol-ment; se-kond, in-te-grei-ted sai-ko-syo-syal tro-ma sen-ters in kom-yu-ni-ti habs; end terd, mal-ti-la-te-ral do-nor me-cing fands wid-awt ber-den-sam kon-di-syo-na-li-tis.\n\nLet as in-syur det houp is not e lak-syu-ri, bat en an-yil-ding rait for ev-ri caild. Ken-ya yilds de ri-mein-der of its taim tu de Dais.",
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
  baseUrl = 'https://api.gutsai.id/v1',
  aiMode = 'online',
  paperPillarId = 'all'
}: {
  indonesianIdea: string;
  mode?: string;
  durationSeconds?: number;
  subtopic?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  aiMode?: 'online' | 'paper';
  paperPillarId?: string;
}): Promise<SpeechData> {
  // If Mode is Base on Paper, return official verified Position Paper speech instantly with 0% hallucination
  if (aiMode === 'paper') {
    const paperSpeech = getPaperBasedSpeech({ pillarId: paperPillarId, mode, durationSeconds });
    return {
      ...paperSpeech,
      sourceMode: 'paper'
    };
  }

  const targetWordCount = Math.round((durationSeconds / 60) * 125);

  const systemPrompt = `You are the Virtual Co-Delegate and Speechwriter for the Republic of Kenya at PUMUN Regeneration 2026 (UNICEF Committee).
Delegate Names: Muhamad Salman & Jamael Nadeem Omero Setianegara (Dual Delegation representing the Republic of Kenya at UNICEF).
Committee Agenda: Strengthening educational opportunities and long-term prospects for child survivors of sexual exploitation and trafficking.
Difficulty: Intermediate.

Kenya's Official Position Paper Solutions (The HARAMBEE-WAYS Framework):
- Action 1 (RE-FIN Compact): Multilateral Reintegration Financing Compact pooling debt-for-education swaps & AfDB grants via UNICEF Global Education Thematic Fund for border shelters in Busia, Garissa, and Namanga.
- Action 2 (LOC-ID Fast-Track): 72-hour Transit Education Pass guaranteeing immediate classroom enrollment without birth certificate barriers, backed by Section 8(1) and Section 22 of Children Act 2022.
- Action 3 (TEACH-SHIELD Program): Training 5,000 frontline educators with Teachers Service Commission (TSC) and UNICEF Innocenti in trauma-sensitive pedagogy and quiet counseling hubs to cut dropouts by 40%.
- Action 4 (In-Tech Pathway): Deploying solar-powered radios and printed workbooks for off-grid border areas, plus East African Community (EAC) student credit tracking with Uganda and Tanzania.
- Official Verified Evidence: UNODC 2024 (61% Sub-Saharan Africa trafficking victims are children), UNESCO 2024 (251M out of school globally, 98M Sub-Saharan Africa), ECPAT/INTERPOL/UNICEF Innocenti 2022 (12% internet-using children exploited, 67% no safety education), Terre des Hommes 2022 (2,426 children in Mombasa, Kilifi, Kwale).
- UNICEF Mandate Boundaries: Support governments, educational programs, capacity building, technical aid. DO NOT advocate for arrest/prosecution of criminals, imposing national criminal legislation, or determining criminal penalties.

The user is Muhamad Salman, who speaks Indonesian and has very limited English fluency.
You must transform Salman's input into an eloquent, highly persuasive diplomatic speech adhering strictly to parliamentary decorum.
Target speaking time: ${durationSeconds} seconds (approximately ${targetWordCount} words).
Speech Mode: ${mode} (General Speakers List = GSL, Moderated Caucus = MOD, Point of Information / Rebuttal = POI).

CRITICAL FORMATTING INSTRUCTION:
Your response MUST be strictly structured in three distinct sections with markdown headers:

### 1. English Speech (Official Diplomatic Text)
(Write the official English diplomatic speech. Address the Dais properly: "Honorable Chair, distinguished delegates...". Incorporate Kenya's stance, laws, and constructive solutions. Yield time at the end: "Kenya yields its time to the Dais.")

### 2. Cara Baca (Panduan Lafal Suku Kata Indonesia)
(WAJIB tuliskan panduan lafal fonetik suku kata Bahasa Indonesia santai bertanda hubung (-) per kata atau suku kata yang sangat mudah dibaca orang Indonesia biasa tanpa keseleo lidah. DILARANG KERAS membuat ejaan aneh seperti 'dhe', 'cyaild', 'servaifers', 'eprisyieits', 'dhet', 'dhis'. Tuliskan ejaan wajar: 'O-no-re-bel Cyer, dis-ting-guis-yed de-le-geits of de Cil-drens Fand...'. Tuliskan lengkap untuk seluruh isi pidato tanpa terputus.)

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
        english: 'Honorable Chair, the Delegation of Kenya appreciates the focus on digital safety. However, Kenya reminds this committee that child survivors in transit corridors require immediate food, shelter, and trauma-informed basic schooling before they can benefit from cyber literacy. We urge donor states to fund holistic grassroots rehabilitation rather than conditional technological mandates. Kenya yields back its time to the Dais.',
        caraBaca: 'O-no-re-bel Cyer, de De-le-gei-syon of Ken-ya e-pre-si-yeits de fo-kes on di-ji-tal seif-ti. Hau-e-ver, Ken-ya ri-mainds dis ko-mi-ti det caild ser-vai-ver in tren-sit ko-ri-dor ri-kwair i-mi-dyet fud, syel-ter, end tro-ma in-formd bei-sik sku-ling bi-for dei ken be-ne-fit from sai-ber li-te-ra-si. Wi erj do-nor stets tu fand ho-lis-tik gres-ruts ri-ha-bi-li-tei-syon ra-der den kon-di-syo-nal tek-no-lo-ji-kal men-deits. Ken-ya yilds its taim tu de Dais.',
        indoMeaning: 'Pimpinan yang terhormat, Delegasi Kenya menghargai fokus pada keselamatan digital. Namun, Kenya mengingatkan komite ini bahwa anak-anak penyintas di koridor transit membutuhkan makanan, tempat aman, dan sekolah dasar peka-trauma terlebih dahulu sebelum mereka bisa memanfaatkan literasi siber. Kami mendesak negara donor mendanai pemulihan akar rumput yang menyeluruh ketimbang mandat teknologi bersyarat. Kenya kembalikan waktu ke Pimpinan Sidang.',
        wordCount: 59,
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
        english: 'Distinguished Dais, Kenya wholeheartedly welcomes the progressive stance of the distinguished delegate. Cross-border child survivors desperately need unconditional multilateral funding that respects local dignity. Kenya warmly invites the delegate to join our coalition and co-sponsor our SAFE-LEARN framework to guarantee swift educational re-enrollment for all survivors. Kenya yields its time to the Dais.',
        caraBaca: 'Dis-ting-guis-yed Dais, Ken-ya hol-har-ted-li wel-kems de pro-gre-sif stens of de dis-ting-guis-yed de-le-geit. Kros bor-der caild ser-vai-vor des-pe-ret-li nid an-kon-di-syo-nal mal-ti-la-te-ral fan-ding det ris-peks lo-kal dig-ni-ti. Ken-ya worm-li in-vaits de de-le-geit tu join awer ko-a-li-si end ko spon-sor awer SEIF-LERN freim-werk tu ge-ren-ti swift e-dyu-kei-syo-nal ri en-rol-ment for ol ser-vai-vors. Ken-ya yilds its taim tu de Dais.',
        indoMeaning: 'Pimpinan Sidang, Kenya menyambut hangat sikap progresif delegasi terhormat. Anak-anak korban lintas batas sangat membutuhkan pendanaan multilateral tanpa syarat yang menghormati martabat lokal. Kenya dengan hangat mengundang delegasi tersebut untuk bergabung dalam koalisi kami dan menjadi co-sponsor kerangka kerja SAFE-LEARN demi menjamin pendaftaran sekolah yang cepat bagi seluruh penyintas. Kenya kembalikan waktu ke Pimpinan Sidang.',
        wordCount: 53,
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
      english: `Honorable Chair, the Republic of Kenya notes the valuable points raised by the distinguished delegate of ${countryName}. Kenya underscores that real rehabilitation demands two immediate actions: removing birth certificate requirements for emergency school enrollment, and embedding trauma counselors in community shelters. Kenya stands ready to collaborate constructively. Kenya yields its time to the Dais.`,
      caraBaca: `O-no-re-bel Cyer, de Re-pab-lik of Ken-ya nowts de vel-yu-a-bel points reisd bai de dis-ting-guis-yed de-le-geit of ${countryName}. Ken-ya an-der-skors det ri-al ri-ha-bi-li-tei-syon di-mends tu i-mi-dyet ek-syens: ri-mu-ving bert ser-ti-fi-ket ri-kwair-ments for i-mer-jen-si skul en-rol-ment, end em-bed-ding tro-ma kawn-se-lor in kom-yu-ni-ti syel-ter. Ken-ya stends re-di tu ko-la-bo-reit kon-struk-tif-li. Ken-ya yilds its taim tu de Dais.`,
      indoMeaning: `Pimpinan yang terhormat, Republik Kenya mencatat poin-poin berharga yang disampaikan oleh delegasi terhormat ${countryName}. Kenya menegaskan bahwa pemulihan nyata menuntut dua tindakan nyata: menghapus syarat akta lahir untuk pendaftaran sekolah darurat, dan menempatkan konselor trauma di tempat penampungan masyarakat. Kenya siap berkolaborasi secara konstruktif. Kenya kembalikan waktu ke Pimpinan Sidang.`,
      wordCount: 56,
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
(WAJIB tuliskan panduan lafal fonetik suku kata Bahasa Indonesia santai bertanda hubung (-) per kata atau suku kata untuk seluruh naskah Inggris di atas! JANGAN tulis bahasa Inggris lagi. DILARANG KERAS membuat ejaan aneh seperti 'dhe', 'cyaild', 'servaifers', 'eprisyieits', 'dhet', 'dhis'. Tuliskan ejaan wajar: 'O-no-re-bel Cyer, de De-le-gei-syon of Ken-ya nowts... Ken-ya yilds its taim tu de Dais.')

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

    const summaryIndo = (summaryMatch ? summaryMatch[1] : `Delegasi ${countryName} menyampaikan poin terkait topik komite.`).replace(/[*#]/g, '').trim();
    const kenyaStrategy = (strategyMatch ? strategyMatch[1] : 'Tegaskan posisi Kenya dan usulkan kerja sama konstruktif.').replace(/[*#]/g, '').trim();
    let english = (engMatch ? engMatch[1] : '').replace(/[*#]/g, '').trim();
    let caraBaca = (caraMatch ? caraMatch[1] : '').replace(/[*#]/g, '').trim();
    let indoMeaning = (indoMatch ? indoMatch[1] : '').replace(/[*#]/g, '').trim();

    if (!english) {
      // Fallback splitting if headings differed
      const parts = rawContent.split(/###\s*\d+\.|\*\*\d+\.|\d+\.\s*(?:Rangkuman|Sikap|Sanggahan|Cara Baca|Makna)/i);
      if (parts.length >= 4) {
        english = parts[3].replace(/[*#]/g, '').trim();
        caraBaca = parts[4] ? parts[4].replace(/[*#]/g, '').trim() : english;
        indoMeaning = parts[5] ? parts[5].replace(/[*#]/g, '').trim() : '';
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
      reply: `Tenang Salman. Saat nama Republic of Kenya dipanggil oleh Chair di awal sesi (Roll Call), kamu cukup angkat placard Kenya tinggi-tinggi dan ucapkan kalimat berikut:`,
      speechCard: {
        english: 'Present and Voting.',
        caraBaca: 'Pre-sent end Fow-ting.',
        indoMeaning: 'Hadir dan siap memberikan suara pada setiap voting.'
      },
      shortcut: { label: 'Buka Contekan Darurat', tabId: 'cheatsheet' }
    };
  }

  if (msg.includes('toilet') || msg.includes('kencing') || msg.includes('izin') || msg.includes('keluar')) {
    return {
      reply: `Kalau kamu mau izin ke toilet saat sidang berlangsung, jangan langsung keluar ruangan. Angkat placard kamu dan ajukan Point of Personal Privilege:`,
      speechCard: {
        english: 'Point of Personal Privilege, Chair. Permission to be excused to the restroom.',
        caraBaca: 'Poin of Per-so-nel Pri-fi-lij, Cyeer. Per-mi-syon tu bi eks-kyusd tu de rest-rum.',
        indoMeaning: 'Interupsi hak pribadi pimpinan, izin ke kamar mandi.'
      },
      shortcut: { label: 'Lihat Semua Interupsi', tabId: 'cheatsheet' }
    };
  }

  if (msg.includes('pidato') || msg.includes('bicara') || msg.includes('podium') || msg.includes('gsl')) {
    return {
      reply: `Siap Salman. Ini naskah pidato resmi Kenya yang paling aman dan berbobot. Kamu tinggal baca lafal fonetik di bawah ini dengan tenang:`,
      speechCard: {
        english: 'Honorable Chair, the Delegation of Kenya affirms that survivor rehabilitation begins with guaranteed education. Under the Children Act 2022, Kenya mandates unconditional school access. Kenya yields its time to the Dais.',
        caraBaca: 'O-nor-e-bel Cyeer, de De-le-ge-syon of Ken-ya e-ferms det ser-vai-ver ri-he-bi-li-te-syon bi-gins wit ge-ren-tid e-dyu-key-syon. An-der de Cyil-dren Ekt tu tau-sen tu-wen-ti tu, Ken-ya men-dets an-kon-di-syo-nel skul ek-ses. Ken-ya yilds its taim tu de Dais.',
        indoMeaning: 'Pimpinan yang terhormat, Delegasi Kenya menegaskan bahwa pemulihan penyintas berawal dari jaminan pendidikan tanpa syarat akta lahir.'
      },
      shortcut: { label: 'Buka Layar Penuh Teleprompter', tabId: 'teleprompter' }
    };
  }

  if (msg.includes('dengar') || msg.includes('lawan') || msg.includes('nyerang') || msg.includes('ngomong')) {
    return {
      reply: `Kalau ada delegasi lain yang sedang bicara di podium dan kamu bingung apa maksudnya:
1. Buka tab Dengar Lawan & Tangkis.
2. Pilih nama negara mereka.
3. Klik tombol topik cepat (misalnya: Bahas Dana atau Perbatasan).
4. AI langsung merangkum artinya dan menyiapkan naskah sanggahan siap baca untukmu.`,
      shortcut: { label: 'Buka Dengar Lawan', tabId: 'listener' }
    };
  }

  // Default friendly advice
  return {
    reply: `Halo Salman. Nata di sini menemani kamu.
Jangan panik ya, sebagai solo delegate kamu hebat sudah berani tampil.

Kamu butuh bantuan apa sekarang?
1. Lagi Roll Call? Ketik: aku harus ngomong apa pas dipanggil.
2. Mau pidato di depan? Ketik: bikinin pidato 45 detik.
3. Ada negara lain yang lagi pidato? Ketik: negara X lagi ngomongin apa.
4. Mau izin ke toilet? Ketik: cara izin ke toilet.`,
    shortcut: { label: 'Buka Dengar Lawan', tabId: 'listener' }
  };
}

export async function chatWithCoDelegate({
  history,
  userMessage,
  model = 'nemotron-3-ultra',
  apiKey = 'sk-guts-83d0dcdcfcf1dc76ae8aaf946815626cbf04ebd3',
  baseUrl = 'https://api.gutsai.id/v1',
  aiMode = 'online'
}: {
  history: { role: 'user' | 'assistant'; content: string }[];
  userMessage: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  aiMode?: 'online' | 'paper';
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
  // If in Base on Paper mode, reply strictly from the verified Position Paper knowledge
  if (aiMode === 'paper') {
    return getPaperCoDelegateReply(userMessage);
  }

  const systemPrompt = `Kamu adalah Nata, Virtual Co-Delegate dari Republik Kenya di komite UNICEF pada simulasi sidang PBB (PUMUN Regeneration 2026 - SDC 1.0).
Rekan delegasimu adalah Muhamad Salman (seorang solo delegate pemula).
Salman SAMA SEKALI TIDAK BISA BAHASA INGGRIS (0 Inggris) dan belum mengerti alur sidang ataupun cara menggunakan fitur-fitur teknis.
Tugas utamamu adalah mendampingi Salman secara personal:
1. Bersikaplah seperti rekan tim yang hangat, tenang, solutif, dan suportif ("Tenang Salman, aku temani kamu. Biar aku yang atur taktiknya").
2. Jawab pertanyaan Salman dalam Bahasa Indonesia sehari-hari yang mudah dipahami. Jangan pakai istilah rumit tanpa menjelaskannya.
3. Seluruh argumen delegasi wajib berpedoman pada Position Paper resmi Kenya (HARAMBEE-WAYS Framework):
   - Aksi 1: RE-FIN Compact (debt swaps & hibah AfDB via UNICEF Global Education Fund untuk shelter Busia, Garissa, Namanga).
   - Aksi 2: LOC-ID Fast-Track (Kartu Pelajar Transit 72 jam tanpa syarat akta lahir sesuai Children Act 2022).
   - Aksi 3: TEACH-SHIELD (Latih 5.000 guru bersama TSC & UNICEF Innocenti untuk pedagogi peka-trauma).
   - Aksi 4: In-Tech Pathway (Radio tenaga surya, modul cetak, & tracking siswa EAC dengan Uganda & Tanzania).
4. ATURAN PENULISAN (SANGAT PENTING - DIWAJIBKAN):
   - JANGAN PERNAH gunakan emoji apapun.
   - JANGAN gunakan tanda bintang ganda (**) untuk bold atau huruf miring (*). Tulis kata biasa tanpa tanda bintang.
   - JANGAN gunakan simbol pagar (#), backtick (\`), atau simbol aneh lainnya.
   - Ketikan WAJIB rapi, bersih, berparagraf teratur seperti tulisan manusia profesional.
5. Jika Salman butuh berbicara (misal di podium, saat roll call, sanggahan, atau interupsi):
   - Tuliskan naskah resmi Bahasa Inggris.
   - WAJIB berikan "Cara Baca" dalam ejaan fonetik suku kata Bahasa Indonesia santai (contoh: "O-nor-e-bel Cyeer, Ken-ya yilds its taim...").
   - Jelaskan artinya dalam 1 kalimat.
6. Format naskah siap baca jika ada (letakkan di baris paling bawah jawaban):
   ### Naskah Siap Baca
   Inggris: [Kalimat Inggris resmi]
   Cara Baca: [Lafal suku kata Indonesia]
   Arti: [Terjemahan Indonesia]`;

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
    const cardMatch = rawContent.match(/(?:###\s*)?Naskah Siap Baca[\s\S]*?(?:\*\*|)?Inggris:(?:\*\*|)?\s*([^\n]+)[\s\S]*?(?:\*\*|)?Cara Baca:(?:\*\*|)?\s*([^\n]+)[\s\S]*?(?:\*\*|)?Arti:(?:\*\*|)?\s*([^\n]+)/i);
    if (cardMatch) {
      speechCard = {
        english: cardMatch[1].replace(/[*#]/g, '').trim(),
        caraBaca: cardMatch[2].replace(/[*#]/g, '').trim(),
        indoMeaning: cardMatch[3].replace(/[*#]/g, '').trim()
      };
    }

    // Detect contextual shortcut
    let shortcut: { label: string; tabId: string } | undefined;
    const lowerUser = userMessage.toLowerCase();
    if (lowerUser.includes('roll call') || lowerUser.includes('toilet') || lowerUser.includes('interupsi') || lowerUser.includes('izin')) {
      shortcut = { label: 'Buka Contekan Darurat', tabId: 'cheatsheet' };
    } else if (lowerUser.includes('dengar') || lowerUser.includes('lawan') || lowerUser.includes('omong') || lowerUser.includes('nyerang')) {
      shortcut = { label: 'Buka Dengar Lawan', tabId: 'listener' };
    } else if (lowerUser.includes('pidato') || lowerUser.includes('gsl') || lowerUser.includes('podium') || lowerUser.includes('bicara')) {
      shortcut = { label: 'Buka Teleprompter', tabId: 'teleprompter' };
    } else if (lowerUser.includes('pospap') || lowerUser.includes('position paper') || lowerUser.includes('word') || lowerUser.includes('download')) {
      shortcut = { label: 'Buka Position Paper', tabId: 'pospap' };
    } else if (lowerUser.includes('negara') || lowerUser.includes('sekutu') || lowerUser.includes('uganda') || lowerUser.includes('amerika')) {
      shortcut = { label: 'Buka 22 Negara Intel', tabId: 'countries' };
    }

    // Clean rawContent of markdown symbols, asterisks, hashtags, and emojis
    let cleanReply = rawContent;
    if (speechCard) {
      // Remove the raw speech block from the chat text since it will be displayed in the dedicated speech card
      cleanReply = cleanReply.replace(/(?:###\s*)?Naskah Siap Baca[\s\S]*$/i, '').trim();
    }
    cleanReply = cleanReply
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/[`~]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    return {
      reply: cleanReply,
      speechCard,
      shortcut
    };
  } catch (err) {
    console.warn('AI Co-Delegate chat fallback triggered:', err);
    return getOfflineCoDelegateFallback(userMessage);
  }
}


