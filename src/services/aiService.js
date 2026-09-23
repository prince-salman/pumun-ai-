import { kenyaProfile } from '../data/kenyaProfile';

export const AVAILABLE_MODELS = [
  { id: 'nemotron-3-ultra', name: 'Nemotron 3 Ultra (Sangat Cerdas & Rapi - Rekomendasi)', speed: 'Normal', intelligence: 'Tertinggi' },
  { id: 'nemotron-3.5-lightning', name: 'Nemotron 3.5 Lightning (Deep Reasoning)', speed: 'Cukup', intelligence: 'Tinggi' },
  { id: 'nemotron-3-super', name: 'Nemotron 3 Super', speed: 'Cepat', intelligence: 'Tinggi' },
  { id: 'nemotron-3-nano-omni', name: 'Nemotron 3 Nano Omni', speed: 'Sangat Cepat', intelligence: 'Standar' },
  { id: 'laguna-s2.1', name: 'Laguna S2.1 (Respon Kilat < 2 detik)', speed: 'Kilat', intelligence: 'Baik' },
  { id: 'laguna-xs2.1', name: 'Laguna XS2.1', speed: 'Kilat', intelligence: 'Baik' },
  { id: 'ling-3.0-flash-fin', name: 'Ling 3.0 Flash Fin', speed: 'Cepat', intelligence: 'Baik' },
];

export function parseTriLayerResponse(rawText) {
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

export function getOfflineFallbackSpeech({ mode = 'GSL', durationSeconds = 90, subtopic = 'General' }) {
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
}) {
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
    const response = await fetch(`${baseUrl}/chat/completions`, {
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
