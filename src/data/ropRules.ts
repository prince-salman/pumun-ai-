import { RopRule, RopPoint, RopMotion, QuickPhrase } from '../types';

export const ropRules: {
  generalRules: RopRule[];
  points: RopPoint[];
  motions: RopMotion[];
} = {
  generalRules: [
    {
      title: 'Roll Call (Presensi Sidang)',
      detail: 'Setiap awal sesi, Chair akan memanggil nama negara. Delegasi menjawab "Present" (boleh abstain saat voting resolusi final) atau "Present and Voting" (WAJIB memilih Yes/No saat voting resolusi final, tidak boleh abstain).',
      recommendationForKenya: 'Pilih "Present and Voting" jika ingin menunjukkan kepemimpinan aktif sebagai sponsor resolusi, atau "Present" jika ingin fleksibel saat lobi alot.'
    },
    {
      title: 'General Speakers List (GSL)',
      detail: 'Daftar pembicara umum yang berlangsung sepanjang sidang jika tidak ada kaukus yang aktif. Waktu bicara biasanya 90 detik. Kenya harus menyampaikan gambaran umum, komitmen nasional, dan ajakan kolaborasi.',
      durationDefault: '90s'
    },
    {
      title: 'Moderated Caucus',
      detail: 'Debat terstruktur dengan sub-topik tertentu. Setiap delegasi yang ingin mengajukan harus menyebutkan: Total Durasi (misal 9 menit), Waktu Bicara per delegasi (misal 45 atau 60 detik), dan Sub-Topik yang jelas.',
      exampleMotion: 'Kenya moves for a 9-minute moderated caucus with a 45-second individual speaking time on the topic of "Eliminating documentation barriers for survivor school re-entry".'
    },
    {
      title: 'Unmoderated Caucus',
      detail: 'Sesi lobi bebas tanpa mikrofon formal. Delegasi berdiri, berdiskusi dengan negara lain, membentuk aliansi blok, dan menulis working paper / draft resolution. Sangat krusial untuk solo delegate!',
      durationDefault: '10 to 20 minutes'
    }
  ],

  points: [
    {
      name: 'Point of Personal Privilege',
      indoName: 'Interupsi Kenyamanan Pribadi',
      description: 'Digunakan saat Anda mengalami kendala fisik atau pribadi, seperti suara pembicara kurang terdengar (audibility) atau suhu ruangan.',
      canInterruptSpeaker: true,
      officialPhrase: 'Point of Personal Privilege, Chair. The speaker is inaudible. Could the speaker please speak louder or adjust the microphone?',
      caraBaca: 'Poin of persenel priviledj, Cyer. Di spiker is inodibel. Kud di spiker plis spik lauder or edjast di maikrofon?'
    },
    {
      name: 'Point of Parliamentary Inquiry',
      indoName: 'Interupsi Pertanyaan Aturan Sidang',
      description: 'Digunakan untuk bertanya kepada Dais/Chair tentang aturan tata tertib (RoP), agenda selanjutnya, atau status mosi.',
      canInterruptSpeaker: false,
      officialPhrase: 'Point of Parliamentary Inquiry, Chair. Could the Dais please clarify the current voting threshold required for this motion?',
      caraBaca: 'Poin of parlamentri inkuairi, Cyer. Kud di Dais plis klerifai di karent foting tresyhold rikuayerd for dis mosyen?'
    },
    {
      name: 'Point of Order',
      indoName: 'Interupsi Pelanggaran Prosedur',
      description: 'Digunakan saat Chair atau delegasi lain melanggar aturan tata tertib persidangan (RoP).',
      canInterruptSpeaker: false,
      officialPhrase: 'Point of Order, Chair. The representative spoke beyond their allocated speaking time limit.',
      caraBaca: 'Poin of order, Cyer. Di reprezentatif spok biyond der elokeited spiking taim limit.'
    },
    {
      name: 'Right of Reply',
      indoName: 'Hak Jawab Diplomatik',
      description: 'Diajukan secara tertulis ke Dais jika negara Anda dihina secara pribadi atau integritas kedaulatan negara Anda dilecehkan secara terbuka oleh delegasi lain.',
      canInterruptSpeaker: false,
      officialPhrase: 'The Delegation of Kenya requests a Right of Reply regarding the defamatory remarks made against our national child protection integrity.',
      caraBaca: 'Di deleigesyen of kenya rikwes e Rait of Riplai rigarding di difemetori rimarks meid egeins aur nasyonal caild proteksyon integriti.'
    }
  ],

  motions: [
    {
      name: 'Motion for Moderated Caucus',
      indoName: 'Mosi Kaukus Terarah',
      template: 'The Delegation of Kenya moves for a [TOTAL_TIME] minute moderated caucus with a [SPEAKER_TIME] second speaking time on the topic of "[TOPIC]".',
      caraBaca: 'Di deleigesyen of kenya muvs for e [TOTAL_TIME] minit modereited kokus wid e [SPEAKER_TIME] sekon spiking taim on di topik of "[TOPIC]".'
    },
    {
      name: 'Motion for Unmoderated Caucus',
      indoName: 'Mosi Kaukus Bebas (Lobi)',
      template: 'The Delegation of Kenya moves for a [TOTAL_TIME] minute unmoderated caucus for the purpose of forming working blocs and consolidating working papers.',
      caraBaca: 'Di deleigesyen of kenya muvs for e [TOTAL_TIME] minit anmodereited kokus for di perpos of forming werking bloks end konsolideiting werking peipers.'
    },
    {
      name: 'Motion to Introduce Working Paper',
      indoName: 'Mosi Memperkenalkan Working Paper',
      template: 'The Delegation of Kenya moves to introduce Working Paper [NUMBER] onto the committee floor.',
      caraBaca: 'Di deleigesyen of kenya muvs tu introdus werking peiper [NUMBER] on-tu di komiti flor.'
    },
    {
      name: 'Motion to Move into Voting Procedure',
      indoName: 'Mosi Masuk ke Tahap Pemungutan Suara',
      template: 'The Delegation of Kenya moves to close the debate and move directly into voting procedure on Draft Resolution [NUMBER].',
      caraBaca: 'Di deleigesyen of kenya muvs tu klos di dibeit end muv dairekli intu foting prosijer on draft rezolusyen [NUMBER].'
    }
  ]
};

export const quickPhrases: QuickPhrase[] = [
  {
    id: 'roll-call',
    category: 'Roll Call',
    title: 'Jawaban Presensi (Hadir & Memilih)',
    trigger: 'Saat Chair memanggil: "Republic of Kenya"',
    english: 'Present and voting, Chair.',
    caraBaca: 'Prezen end foting, Cyer.',
    indoMeaning: 'Hadir dan memilih (berkomitmen memberikan suara Yes/No pada voting akhir, tidak boleh abstain).'
  },
  {
    id: 'roll-call-present',
    category: 'Roll Call',
    title: 'Jawaban Presensi (Hadir Biasa)',
    trigger: 'Saat Chair memanggil: "Republic of Kenya" (opsi jika ingin fleksibel)',
    english: 'Present, Chair.',
    caraBaca: 'Prezen, Cyer.',
    indoMeaning: 'Hadir (boleh memilih abstain jika draf resolusi kurang menguntungkan).'
  },
  {
    id: 'motion-mod-caucus',
    category: 'Motions',
    title: 'Mengajukan Moderated Caucus (9 Menit / 45 Detik)',
    trigger: 'Saat Chair membuka lantai: "Are there any motions on the floor?"',
    english: 'The Delegation of Kenya moves for a 9-minute moderated caucus with a 45-second individual speaking time on the topic of "Accelerated learning pathways and trauma recovery for child survivors".',
    caraBaca: 'Di deleigesyen of kenya muvs for e nain minit modereited kokus wid e forti-faiv sekon indivijuel spiking taim on di topik of "ekselereited lerning petweis end trauma rikaveri for caild servaivors".',
    indoMeaning: 'Kenya mengusulkan kaukus terarah 9 menit (45 detik per pembicara) membahas program kejar paket & pemulihan trauma bagi anak korban.'
  },
  {
    id: 'motion-unmod-caucus',
    category: 'Motions',
    title: 'Mengajukan Unmoderated Caucus (15 Menit Lobi)',
    trigger: 'Saat ingin beranjak dari kursi untuk kumpul blok dan nulis resolusi',
    english: 'The Delegation of Kenya moves for a 15-minute unmoderated caucus for the purpose of bloc consolidation and resolution drafting.',
    caraBaca: 'Di deleigesyen of kenya muvs for e fiftin minit anmodereited kokus for di perpos of blok konsolideisyen end rezolusyen drafting.',
    indoMeaning: 'Kenya mengusulkan kaukus bebas 15 menit untuk menyatukan negara blok dan mulai menulis draf resolusi bersama.'
  },
  {
    id: 'yield-to-chair',
    category: 'Yielding',
    title: 'Menyerahkan Sisa Waktu ke Chair (Paling Aman)',
    trigger: 'Saat selesai pidato sebelum bel waktu habis',
    english: 'The Delegation of Kenya yields the remainder of its time back to the Dais.',
    caraBaca: 'Di deleigesyen of kenya yilds di rimeinder of its taim bek tu di Dais.',
    indoMeaning: 'Kenya menyerahkan sisa waktu berbicara kembali ke pimpinan sidang (Dais).'
  },
  {
    id: 'yield-to-poi',
    category: 'Yielding',
    title: 'Membuka Pertanyaan (Point of Information)',
    trigger: 'Saat pidato selesai dan Anda siap ditanya negara lain',
    english: 'The Delegation of Kenya yields the remainder of its time to Points of Information.',
    caraBaca: 'Di deleigesyen of kenya yilds di rimeinder of its taim tu Poin of Informesyen.',
    indoMeaning: 'Kenya bersedia menjawab pertanyaan dari delegasi negara lain menggunakan sisa waktu yang ada.'
  },
  {
    id: 'point-personal-audibility',
    category: 'Points',
    title: 'Interupsi Suara Kurang Terdengar',
    trigger: 'Saat suara delegasi lain atau mic di ruangan terlalu kecil',
    english: 'Point of Personal Privilege, Chair. The speaker is inaudible. Could the speaker please speak closer to the microphone?',
    caraBaca: 'Poin of persenel priviledj, Cyer. Di spiker is inodibel. Kud di spiker plis spik kloser tu di maikrofon?',
    indoMeaning: 'Interupsi pribadi: suara pembicara tidak terdengar, mohon berbicara lebih dekat ke mikrofon.'
  },
  {
    id: 'diplomatic-agreement',
    category: 'Diplomatic Phrases',
    title: 'Menyetujui Argumen Delegasi Lain',
    trigger: 'Saat ingin memuji dan merangkul calon rekan koalisi',
    english: 'The Delegation of Kenya strongly echoes the valuable insights shared by the distinguished representative.',
    caraBaca: 'Di deleigesyen of kenya strongli ekos di felyuebel insaits syerd bai di distingsy-d reprezentatif.',
    indoMeaning: 'Kenya sangat menyetujui pandangan berharga yang disampaikan oleh delegasi terhormat tersebut.'
  },
  {
    id: 'diplomatic-challenge',
    category: 'Diplomatic Phrases',
    title: 'Menyanggah Secara Santun tapi Tegas',
    trigger: 'Saat negara maju mengkritik atau memaksakan aturan tanpa memberi dana',
    english: 'While Kenya respects the delegate\'s perspective, we must emphasize that sustainable solutions require equitable resource mobilization, not unfunded mandates.',
    caraBaca: 'Wail kenya rispeks di deligets perspektif, wi mas emfasais det sasteinebel solusyens rikuayer ekuitebel risors mobilaizesyen, not anfanded mandeits.',
    indoMeaning: 'Meskipun menghargai pandangan delegasi tersebut, Kenya menegaskan bahwa solusi berkelanjutan butuh bantuan pendanaan nyata, bukan sekadar perintah tanpa dana.'
  }
];
