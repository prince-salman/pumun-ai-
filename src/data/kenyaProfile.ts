import { KenyaProfile } from '../types';

export const kenyaProfile: KenyaProfile = {
  countryName: 'Republic of Kenya',
  officialName: 'Republic of Kenya',
  capital: 'Nairobi',
  region: 'East Africa',
  committee: 'UNICEF (United Nations Children\'s Fund)',
  delegateName: 'Muhamad Salman',
  role: 'Solo Delegate (Delegasi Mandiri)',
  flagEmoji: '🇰🇪',
  agenda: 'Strengthening educational opportunities and long-term prospects for child survivors of sexual exploitation and trafficking',
  
  laws: [
    {
      name: 'Children Act 2022 (Act No. 29 of 2022)',
      code: 'Children Act 2022',
      summary: 'Menggantikan Children Act 2001, menjamin hak setiap anak atas pendidikan dasar gratis dan wajib, mendirikan Unit Perlindungan Anak (Child Protection Units/CPU) di kantor polisi, serta memperketat perlindungan bagi korban kekerasan seksual dan eksploitasi.',
      citation: 'Republic of Kenya. Children Act, No. 29 of 2022. Nairobi: Government Printer, 2022.'
    },
    {
      name: 'Counter-Trafficking in Persons Act 2010 (Act No. 8 of 2010)',
      code: 'CTIP Act 2010',
      summary: 'Landasan hukum utama pidana tindak perdagangan orang di Kenya, membentuk Dewan Penasihat Anti-Perdagangan Orang (Advisory Committee) dan Dana Bantuan Korban (National Assistance Trust Fund for Victims of Trafficking).',
      citation: 'Republic of Kenya. Counter-Trafficking in Persons Act, No. 8 of 2010. Nairobi: Kenya Law Reports, 2010.'
    },
    {
      name: 'Sexual Offences Act 2006 (Act No. 3 of 2006)',
      code: 'SOA 2006',
      summary: 'Mengatur sanksi tegas atas pelecehan seksual anak, pelacuran anak, dan eksploitasi seksual komersial anak (ESKA).',
      citation: 'Republic of Kenya. Sexual Offences Act, No. 3 of 2006. Nairobi: Kenya Law Reports, 2006.'
    },
    {
      name: 'East African Community (EAC) Child Policy (2016)',
      code: 'EAC Child Policy',
      summary: 'Kerangka kerja sama regional Kenya bersama Uganda, Tanzania, Rwanda, Burundi, dan Sudan Selatan untuk melindungi anak dari perdagangan lintas batas negara.',
      citation: 'East African Community. EAC Child Policy. Arusha: EAC Secretariat, 2016.'
    }
  ],

  nationalInitiatives: [
    {
      title: 'Competency-Based Curriculum (CBC) Transition Pathway',
      description: 'Kurikulum fleksibel berbasis kompetensi yang memungkinkan anak penyintas yang tertinggal pelajaran mengejar ketertinggalan tanpa harus mengulang dari kelas awal.'
    },
    {
      title: 'National Plan of Action for Children in Kenya (NPAC)',
      description: 'Rencana aksi nasional untuk perlindungan sosial, penyediaan rumah aman (safe shelters), dan integrasi layanan kesehatan mental bagi anak rentan.'
    },
    {
      title: 'Childline Kenya 116 Helpline',
      description: 'Layanan panggilan darurat bebas pulsa 24 jam untuk pelaporan kekerasan, penelantaran, dan perdagangan anak.'
    }
  ],

  pillars: [
    {
      number: 1,
      title: 'Penghapusan Hambatan Dokumentasi Sekolah (Documentation-Free Re-Enrollment)',
      description: 'Anak korban perdagangan manusia seringkali kehilangan akta lahir atau dokumen identitas. Kenya mengusulkan skema registrasi darurat dan sertifikasi transit agar anak bisa langsung bersekolah kembali tanpa terhambat birokrasi kependudukan.',
      keyPhrase: 'Unconditional immediate re-enrollment without bureaucratic identity barriers'
    },
    {
      number: 2,
      title: 'Pendidikan Terpadu Berbasis Trauma (Trauma-Informed Schooling & Safe Havens)',
      description: 'Korban eksploitasi seksual mengalami trauma psikologis mendalam. Dibutuhkan pelatihan bagi guru untuk memahami trauma (*trauma-informed pedagogy*) serta penyediaan konselor psikososial di sekolah atau pusat transit terpadu.',
      keyPhrase: 'Trauma-informed education integrated with specialized psychosocial rehabilitation'
    },
    {
      number: 3,
      title: 'Satuan Tugas Lintas Batas Regional (EAC Cross-Border Protection Taskforce)',
      description: 'Banyak anak Kenya diperdagangkan melintasi perbatasan (misalnya ke atau dari Uganda, Tanzania, dan kawasan Tanduk Afrika). Kerjasama pertukaran data pemulihan korban dan pemulangan yang aman (*safe repatriation*) sangat penting.',
      keyPhrase: 'Regional cross-border coordination for safe tracing, repatriation, and reintegration'
    },
    {
      number: 4,
      title: 'Kemitraan Pendanaan & Pembangunan Kapasitas (Capacity Building & Donor Matching)',
      description: 'Negara-negara berkembang tidak bisa menanggung beban pendanaan sendiri. Kenya mendesak negara donor (seperti Swedia, Kanada, Jerman, dan AS) untuk mendanai infrastruktur sekolah aman dan beasiswa pemulihan melalui mekanisme hibah UNICEF.',
      keyPhrase: 'Multilateral donor matching funds and technical capacity-building without imposing sovereign conditionalities'
    }
  ],

  openingHookQuote: '"Recovery does not conclude with rescue. An uneducated survivor is a future re-exploited child. Kenya stands resolute: education is the ultimate restorative justice."',
  openingHookIndo: '"Pemulihan tidak selesai saat anak diselamatkan. Penyintas yang tidak berpendidikan berisiko dieksploitasi kembali. Kenya berdiri teguh: pendidikan adalah keadilan pemulihan yang sejati."'
};
