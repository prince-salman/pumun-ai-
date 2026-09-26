import { SpeechData } from '../types';

export interface PaperPillarItem {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  speeches: {
    gsl90: SpeechData;
    mod60: SpeechData;
    poi30: SpeechData;
  };
}

export const PAPER_PILLARS: Record<string, PaperPillarItem> = {
  all: {
    id: 'all',
    name: 'Ringkasan Penuh HARAMBEE-WAYS (Position Paper Kenya)',
    shortLabel: 'Full Paper (HARAMBEE-WAYS)',
    description: 'Naskah diplomasi komprehensif merangkum 4 pilar aksi resmi Kenya untuk sesi General Speakers List (GSL).',
    speeches: {
      gsl90: {
        english: "Honorable Chair, distinguished delegates of the United Nations Children's Fund:\n\nAcross the Horn of Africa, armed conflicts disrupt basic schooling and create fertile ground for human trafficking networks. According to the UNODC Global Report on Trafficking in Persons 2024, children account for sixty-one percent of detected victims across Sub-Saharan Africa. Rescuing children from traffickers is merely the initial step; without immediate civil registration and trauma-informed schooling, long-term recovery fails.\n\nKenya anchors its national policy in Article 53 of the 2010 Constitution and the Children Act No. 29 of 2022, guaranteeing free compulsory basic education. To transition international commitments into concrete operations, Kenya proudly proposes the HARAMBEE-WAYS Framework, comprising four coordinated pillars: first, the RE-FIN Compact to pool bilateral grants and debt-for-education swaps for border learning centers in Busia, Garissa, and Namanga; second, the LOC-ID Fast-Track protocol providing 72-hour Transit Education Passes without birth certificate prerequisites; third, the TEACH-SHIELD Program empowering 5,000 educators in trauma-sensitive pedagogy; and fourth, the In-Tech Pathway deploying solar radios and East African Community student tracking with Uganda and Tanzania.\n\nLet us make ourselves the architects of the future. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer, dis-ting-guis-yed de-le-geits of de Yu-nai-ted Nei-syens Cil-drens Fand:\n\nE-kros de Horn of Ef-ri-ka, armd kon-fliks dis-rapt bei-sik sku-ling end kri-eit fer-tail grawnd for hyu-men tre-fi-king net-werks. E-kor-ding tu de Yu-en-o-di-si Glo-bal Ri-port on Tre-fi-king in Per-sons tu tau-sen twen-ti for, cil-dren e-kawnt for siks-ti wan per-sent of di-tek-ted vik-tims e-kros Sab Se-he-ran Ef-ri-ka. Res-kyu-ing cil-dren from tre-fi-kers is mir-li de i-ni-syal step; wid-awt i-mi-dyet si-vil re-jis-trei-syon end tro-ma in-formd sku-ling, long term ri-ka-ve-ri feils.\n\nKen-ya eng-kors its ne-syo-nal po-li-si in Ar-ti-kel fif-ti tri of de tu tau-sen ten Kon-sti-tyu-syon end de Cil-dren Ekt Nam-ber twen-ti nain of tu tau-sen twen-ti tu, ge-ren-ti-ing fri kom-pal-so-ri bei-sik e-dyu-kei-syon. Tu tren-si-syon in-ter-ne-syo-nal ko-mit-ments in-tu kon-krit o-pe-rei-syens, Ken-ya prawnd-li pro-po-ses de HA-RAM-BI WEIS Freim-werk, kom-prai-sing for ko-or-di-nei-ted pi-lars: ferst, de RI-FIN Kom-pekt tu pul bai-le-te-ral grents end det for e-dyu-kei-syon swaps for bor-der ler-ning sen-ters in Bu-si-a, Ga-ris-sa, end Na-man-ga; se-kond, de LOK-AI-DI Fest-Trek pro-to-kol pro-vai-ding se-ven-ti tu awer Tren-sit E-dyu-kei-syon Pe-ses wid-awt bert ser-ti-fi-ket pri-re-kwi-sits; terd, de TIC-SYILD Pro-grem em-pawer-ing faif tau-send e-dyu-kei-tors in tro-ma sen-si-tif pe-da-go-ji; end fort, de In-Tek Pat-wei di-ploy-ing so-lar rei-di-os end Ist Ef-ri-kan Kom-yu-ni-ti styu-dent tre-king wid Yu-gen-da end Ten-ze-ni-a.\n\nLet as meik awer-selvs de ar-ki-teks of de fyu-cer. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Ketua yang terhormat, para delegasi UNICEF yang mulia:\n\nDi seluruh kawasan Tanduk Afrika, konflik bersenjata memutus sekolah dasar dan menjadi ladang subur perdagangan manusia. Berdasarkan Laporan UNODC 2024, 61 persen korban perdagangan orang di Afrika Sub-Sahara adalah anak-anak. Menyelamatkan mereka hanyalah langkah awal; tanpa registrasi kependudukan darurat dan sekolah ramah-trauma, pemulihan jangka panjang akan gagal.\n\nKenya mendasarkan kebijakannya pada Pasal 53 Konstitusi 2010 dan Children Act No. 29 Tahun 2022 yang menjamin pendidikan dasar gratis dan wajib. Untuk mewujudkan komitmen internasional menjadi aksi nyata, Kenya mengajukan Kerangka Kerja HARAMBEE-WAYS yang mencakup empat pilar: pertama, RE-FIN Compact untuk menghimpun hibah donor dan pertukaran utang untuk pendidikan demi mendanai shelter perbatasan di Busia, Garissa, dan Namanga; kedua, protokol LOC-ID Fast-Track yang menerbitkan Kartu Pelajar Transit 72 jam tanpa syarat akta lahir; ketiga, Program TEACH-SHIELD yang melatih 5.000 guru dalam penanganan peka-trauma; dan keempat, In-Tech Pathway yang menyediakan radio bertenaga surya serta pelacakan rekam pendidikan bersama Uganda dan Tanzania di bawah Komunitas Afrika Timur (EAC).\n\nMari kita jadikan diri kita arsitek masa depan anak-anak. Kenya mengembalikan waktu ke Pimpinan Sidang.",
        wordCount: 198,
        estimatedSeconds: 90
      },
      mod60: {
        english: "Honorable Chair and distinguished delegates:\n\nThe Republic of Kenya underscores that child survivors of trafficking require structural rehabilitation through our HARAMBEE-WAYS framework. Guided by Kenya's Children Act 2022, we urge the UNICEF committee to adopt two immediate priorities: the LOC-ID Fast-Track to remove all birth certificate barriers within 72 hours, and the RE-FIN Compact to secure multilateral funding for border transit schools in Busia and Garissa. An uneducated survivor is a future re-exploited victim. Kenya stands ready to co-sponsor actionable resolutions. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer end dis-ting-guis-yed de-le-geits:\n\nDe Re-pab-lik of Ken-ya an-der-skors det caild ser-vai-vers of tre-fi-king ri-kwair strak-cyu-ral ri-ha-bi-li-tei-syon tru awer HA-RAM-BI WEIS freim-werk. Gai-ded bai Ken-yas Cil-dren Ekt tu tau-sen twen-ti tu, wi erj de Yu-ni-sef ko-mi-ti tu e-dopt tu i-mi-dyet prai-o-ri-tis: de LOK-AI-DI Fest-Trek tu ri-muv ol bert ser-ti-fi-ket be-ri-yers wid-in se-ven-ti tu awers, end de RI-FIN Kom-pekt tu si-kyur mal-ti-le-te-ral fan-ding for bor-der tren-sit skuls in Bu-si-a end Ga-ris-sa. En an-e-dyu-kei-ted ser-vai-ver is e fyu-cer ri-eks-ploi-ted vik-tim. Ken-ya stends re-di tu ko-spon-sor ek-syo-na-bel re-zo-lu-syens. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Pimpinan yang terhormat dan rekan-rekan delegasi:\n\nRepublik Kenya menegaskan bahwa anak-anak penyintas perdagangan manusia membutuhkan pemulihan struktural melalui kerangka kerja HARAMBEE-WAYS. Berpedoman pada Children Act Kenya 2022, kami mendesak komite UNICEF mengadopsi dua prioritas utama: LOC-ID Fast-Track untuk menghapus syarat akta kelahiran dalam 72 jam pertama, serta RE-FIN Compact untuk mengamankan pendanaan multilateral bagi sekolah transit perbatasan di Busia dan Garissa. Korban yang tidak bersekolah berisiko dieksploitasi kembali. Kenya siap menjadi co-sponsor resolusi. Kenya menyerahkan waktu ke Pimpinan Sidang.",
        wordCount: 88,
        estimatedSeconds: 42
      },
      poi30: {
        english: "Honorable Chair, the Delegation of Kenya asks the distinguished delegate: how does your resolution practically finance protective schooling for undocumented child survivors along cross-border corridors without placing sovereign debt on developing states? Kenya's HARAMBEE-WAYS framework provides the answer through debt-for-education swaps. Kenya yields to the Dais.",
        caraBaca: "O-no-re-bel Cyer, de De-le-gei-syon of Ken-ya esks de dis-ting-guis-yed de-le-geit: hau das yor re-zo-lu-syon prek-ti-ka-li fai-nens pro-tek-tif sku-ling for an-dok-yu-men-ted caild ser-vai-vers e-long kros bor-der ko-ri-dors wid-awt plei-sing sov-rin det on de-ve-lo-ping stets? Ken-yas HA-RAM-BI WEIS freim-werk pro-vaids di en-ser tru det for e-dyu-kei-syon swaps. Ken-ya yilds tu de Dais.",
        indoMeaning: "Ketua yang terhormat, Delegasi Kenya bertanya kepada delegasi: bagaimana resolusi Anda secara praktis mendanai sekolah perlindungan bagi anak penyintas tanpa dokumen di koridor perbatasan tanpa menambah beban utang negara berkembang? Kerangka kerja HARAMBEE-WAYS Kenya memberikan solusi nyata melalui skema pertukaran utang untuk pendidikan. Kenya kembalikan waktu ke Pimpinan Sidang.",
        wordCount: 52,
        estimatedSeconds: 24
      }
    }
  },

  action1: {
    id: 'action1',
    name: 'Aksi 1: RE-FIN Compact (Pendanaan & Pertukaran Utang)',
    shortLabel: 'Action 1: RE-FIN Compact',
    description: 'Solusi pendanaan multilateral via UNICEF Global Education Thematic Fund, hibah AfDB, dan debt-for-education swap untuk shelter Busia, Garissa, dan Namanga.',
    speeches: {
      gsl90: {
        english: "Honorable Chair and distinguished delegates:\n\nSustainable protection for child survivors cannot rely on volatile charity. The Republic of Kenya presents Action One of our Position Paper: the RE-FIN Compact, established within the UNICEF Global Education Thematic Fund alongside the African Development Bank.\n\nDeveloping nations cannot shoulder the costs of specialized border shelters alone. Under this compact, multilateral donors and creditor institutions establish debt-for-education swap mechanisms. The mobilized funds are directly channeled to establish protective boarding shelters and primary learning centers at critical border crossings, including Busia, Garissa, and Namanga. To guarantee strict financial transparency, disbursement is tied directly to verified school attendance data certified by the UNESCO Institute for Statistics.\n\nKenya calls upon development partners, including Sweden, Canada, and Germany, to co-finance this vital window. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer end dis-ting-guis-yed de-le-geits:\n\nSes-tei-ne-bel pro-tek-syon for caild ser-vai-vers ke-not ri-lai on vo-le-tail cye-ri-ti. De Re-pab-lik of Ken-ya pre-zents Ek-syon Wan of awer Po-zi-syon Peiper: de RI-FIN Kom-pekt, es-teb-lisyd wid-in de Yu-ni-sef Glo-bal E-dyu-kei-syon Ti-me-tik Fand e-long-said di Ef-ri-kan Di-ve-lop-ment Benk.\n\nDi-ve-lo-ping nei-syens ke-not syol-der de kosts of spe-sya-laizd bor-der syel-ters e-lon. An-der dis kom-pekt, mal-ti-le-te-ral do-nors end kre-di-tor in-sti-tyu-syens es-teb-lisy det for e-dyu-kei-syon swap me-ke-ni-zems. De mo-bi-laizd fands ar dai-rekt-li cye-neld tu es-teb-lisy pro-tek-tif bor-ding syel-ters end prai-me-ri ler-ning sen-ters et kri-ti-kal bor-der kro-sings, in-klu-ding Bu-si-a, Ga-ris-sa, end Na-man-ga. Tu ge-ren-ti strikt fai-nen-syal trens-pe-ren-si, dis-bers-ment is taid dai-rekt-li tu ve-ri-faid skul e-ten-dens dei-ta ser-ti-faid bai de Yu-nes-ko In-sti-tyut for Ste-tis-tiks.\n\nKen-ya kols e-pon di-ve-lop-ment part-ners, in-klu-ding Swi-den, Ke-ne-da, end Jer-me-ni, tu ko-fai-nens dis vai-tal win-dow. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Ketua yang terhormat dan rekan-rekan delegasi:\n\nPerlindungan berkelanjutan bagi anak korban tidak bisa bergantung pada belas kasihan sesaat. Republik Kenya mengajukan Aksi 1 dari Position Paper kami: RE-FIN Compact yang dibentuk di dalam UNICEF Global Education Thematic Fund bersama Bank Pembangunan Afrika (AfDB).\n\nNegara berkembang tidak sanggup membiayai pusat pemulihan perbatasan sendirian. Melalui compact ini, negara donor dan lembaga kreditur menjalankan mekanisme debt-for-education swap (pertukaran utang untuk pendidikan). Dana dialokasikan mendirikan asrama aman dan sekolah dasar di titik transit rawan: Busia, Garissa, dan Namanga. Transparansi keuangan dijamin melalui audit data kehadiran siswa resmi dari UNESCO Institute for Statistics.\n\nKenya mengajak mitra donor mendanai inisiatif vital ini. Kenya menyerahkan waktu ke Pimpinan Sidang.",
        wordCount: 142,
        estimatedSeconds: 65
      },
      mod60: {
        english: "Honorable Chair, the Delegation of Kenya highlights Action One of our HARAMBEE-WAYS framework: the RE-FIN Compact. Border communities like Busia and Garissa absorb vulnerable cross-border trafficking victims daily. We propose debt-for-education swaps via UNICEF and the African Development Bank, audited by UNESCO statistics. Kenya invites donor nations to invest in sustainable recovery rather than temporary relief. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer, de De-le-gei-syon of Ken-ya hai-laits Ek-syon Wan of awer HA-RAM-BI WEIS freim-werk: de RI-FIN Kom-pekt. Bor-der kom-yu-ni-tis laik Bu-si-a end Ga-ris-sa eb-zorb val-ne-re-bel kros bor-der tre-fi-king vik-tims dei-li. Wi pro-pos det for e-dyu-kei-syon swaps vai-a Yu-ni-sef end di Ef-ri-kan Di-ve-lop-ment Benk, o-di-ted bai Yu-nes-ko ste-tis-tiks. Ken-ya in-vaits do-nor nei-syens tu in-vest in ses-tei-ne-bel ri-ka-ve-ri ra-der den tem-po-re-ri ri-lif. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Ketua yang terhormat, Delegasi Kenya menyoroti Aksi 1 dari kerangka kerja kami: RE-FIN Compact. Komunitas perbatasan seperti Busia dan Garissa menampung korban perdagangan lintas batas setiap hari. Kami mengusulkan skema pertukaran utang untuk pendidikan melalui UNICEF dan Bank Pembangunan Afrika yang diaudit statistik UNESCO. Kenya mengajak negara donor berinvestasi pada pemulihan berkelanjutan. Kenya kembalikan waktu ke Pimpinan Sidang.",
        wordCount: 68,
        estimatedSeconds: 32
      },
      poi30: {
        english: "Honorable Chair, Kenya inquires: does the distinguished delegate support integrating debt-for-education swaps under UNICEF to finance frontline rehabilitation shelters without burdening recipient nations? Kenya yields its time.",
        caraBaca: "O-no-re-bel Cyer, Ken-ya in-kwairs: das de dis-ting-guis-yed de-le-geit se-port in-te-grei-ting det for e-dyu-kei-syon swaps an-der Yu-ni-sef tu fai-nens front-lain ri-ha-bi-li-tei-syon syel-ters wid-awt ber-de-ning ri-si-pyent nei-syens? Ken-ya yilds its taim.",
        indoMeaning: "Pimpinan Sidang, Kenya bertanya: apakah delegasi mendukung skema pertukaran utang untuk pendidikan di bawah UNICEF untuk mendanai shelter perbatasan tanpa membebani negara penerima? Kenya kembalikan waktu.",
        wordCount: 30,
        estimatedSeconds: 15
      }
    }
  },

  action2: {
    id: 'action2',
    name: 'Aksi 2: LOC-ID Fast-Track (Pendaftaran Sekolah Bebas Akta 72 Jam)',
    shortLabel: 'Action 2: LOC-ID Fast-Track',
    description: 'Protokol penerbitan Transit Education Pass dalam 72 jam agar anak korban bisa langsung masuk kelas reguler tanpa terhambat ketiadaan akta lahir.',
    speeches: {
      gsl90: {
        english: "Honorable Chair and esteemed colleagues:\n\nWhen child survivors escape trafficking rings, they rarely possess birth certificates or school transcripts. In many jurisdictions, bureaucratic rigidity bars their classroom entry, prolonging their trauma. In Kenya, Section 8(1) and Section 22 of our Children Act 2022 mandate that the best interests of the child supersede administrative paperwork.\n\nThrough Action Two of our Position Paper, Kenya introduces the LOC-ID Fast-Track framework. Rescued children receive an expedited Transit Education Pass within seventy-two hours of identification, granting immediate enrollment in public primary schools. Simultaneously, civil registration officers collaborate with UNICEF field teams to reconstruct family records and issue birth documentation retroactively.\n\nEducation cannot wait for civil registries. Kenya urges every member state to adopt the 72-hour waiver protocol to eliminate administrative exclusion. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer end es-timd ko-ligs:\n\nWen caild ser-vai-vers es-keip tre-fi-king rings, dei rer-li po-zes bert ser-ti-fi-kets or skul trens-krips. In me-ni ju-ris-dik-syens, byu-ro-kre-tik ri-ji-di-ti bars der kles-rum en-tri, pro-long-ing der tro-ma. In Ken-ya, Sek-syon eit wan end Sek-syon twen-ti tu of awer Cil-dren Ekt tu tau-sen twen-ti tu men-deit det de best in-trests of de caild su-per-sid ed-mi-nis-trei-tif pei-per-werk.\n\nTru Ek-syon Tu of awer Po-zi-syon Peiper, Ken-ya in-tro-dyu-ses de LOK-AI-DI Fest-Trek freim-werk. Res-kyud cil-dren ri-siv en eks-pe-dai-ted Tren-sit E-dyu-kei-syon Peis wid-in se-ven-ti tu awers of ai-den-ti-fi-kei-syon, gren-ting i-mi-dyet en-rol-ment in pab-lik prai-me-ri skuls. Sai-mel-tei-nyas-li, si-vil re-jis-trei-syon o-fi-sers ko-le-bo-reit wid Yu-ni-sef fild tims tu ri-kon-strak fe-mi-li re-kords end i-syu bert dok-yu-men-tei-syon ret-ro-ek-tif-li.\n\nE-dyu-kei-syon ke-not weit for si-vil re-jis-tris. Ken-ya erj ev-ri mem-ber steit tu e-dopt de se-ven-ti tu awer wei-ver pro-to-kol tu e-li-mi-neit ed-mi-nis-trei-tif eks-klu-syon. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Ketua yang terhormat dan rekan-rekan delegasi:\n\nKetika anak korban melarikan diri dari jeratan perdagangan manusia, mereka jarang memiliki akta lahir atau rapor sekolah. Hambatan birokrasi ini seringkali membuat pintu sekolah tertutup dan memperpanjang trauma. Di Kenya, Pasal 8(1) dan Pasal 22 Children Act 2022 menegaskan bahwa kepentingan terbaik anak harus mengalahkan persyaratan administrasi.\n\nMelalui Aksi 2 Position Paper kami, Kenya menghadirkan kerangka kerja LOC-ID Fast-Track. Anak yang diselamatkan diberikan Kartu Pelajar Transit dalam waktu 72 jam agar bisa langsung masuk kelas sekolah negeri. Bersamaan dengan itu, petugas catatan sipil bersama UNICEF menelusuri data keluarga dan menerbitkan akta lahir secara susulan.\n\nPendidikan tidak boleh menunggu birokrasi kependudukan. Kenya mendesak seluruh delegasi mengadopsi protokol bebas syarat 72 jam ini. Kenya menyerahkan waktu ke Pimpinan Sidang.",
        wordCount: 139,
        estimatedSeconds: 64
      },
      mod60: {
        english: "Honorable Chair, the Republic of Kenya champions Action Two: the LOC-ID Fast-Track. Under Kenya's Children Act 2022, no child should be locked out of school due to a missing birth certificate. We issue a 72-hour Transit Education Pass for immediate classroom placement while civil registration occurs retroactively. Administrative paperwork must never obstruct restorative education. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer, de Re-pab-lik of Ken-ya cyem-pyens Ek-syon Tu: de LOK-AI-DI Fest-Trek. An-der Ken-yas Cil-dren Ekt tu tau-sen twen-ti tu, no caild syud bi lokt awt of skul dyu tu e mi-sing bert ser-ti-fi-ket. Wi i-syu e se-ven-ti tu awer Tren-sit E-dyu-kei-syon Peis for i-mi-dyet kles-rum pleis-ment wail si-vil re-jis-trei-syon o-kers ret-ro-ek-tif-li. Ed-mi-nis-trei-tif pei-per-werk mast ne-ver ob-strakt res-to-re-tif e-dyu-kei-syon. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Pimpinan yang terhormat, Republik Kenya mengusung Aksi 2: LOC-ID Fast-Track. Sesuai Children Act 2022, tidak boleh ada anak yang ditolak sekolah hanya karena tidak punya akta lahir. Kami menerbitkan Kartu Pelajar Transit 72 jam untuk penempatan kelas instan selagi pengurusan akta diproses belakangan. Surat administrasi tidak boleh menghalangi hak belajar anak. Kenya kembalikan waktu ke Pimpinan Sidang.",
        wordCount: 66,
        estimatedSeconds: 31
      },
      poi30: {
        english: "Honorable Chair, does the distinguished delegate agree that requiring civil documentation before school admission violates the best interests of the child? Kenya's 72-hour transit pass solves this. Kenya yields back.",
        caraBaca: "O-no-re-bel Cyer, das de dis-ting-guis-yed de-le-geit e-gri det ri-kwair-ing si-vil dok-yu-men-tei-syon bi-for skul ed-mi-syon vai-o-leits de best in-trests of de caild? Ken-yas se-ven-ti tu awer tren-sit peis solvs dis. Ken-ya yilds bek.",
        indoMeaning: "Ketua yang terhormat, apakah delegasi setuju bahwa mensyaratkan dokumen kependudukan sebelum anak boleh masuk sekolah melanggar hak asasi anak? Protokol 72 jam Kenya menyelesaikan masalah ini. Kenya kembalikan waktu.",
        wordCount: 30,
        estimatedSeconds: 15
      }
    }
  },

  action3: {
    id: 'action3',
    name: 'Aksi 3: TEACH-SHIELD (Pelatihan 5.000 Guru Trauma-Informed)',
    shortLabel: 'Action 3: TEACH-SHIELD',
    description: 'Kemitraan TSC dan UNICEF Innocenti melatih 5.000 pendidik perbatasan memahami metode ajar peka-trauma dan ruang konseling ramah anak.',
    speeches: {
      gsl90: {
        english: "Honorable Chair and esteemed delegates:\n\nPlacing an abused child into an unprepared classroom often leads to stigmatization and secondary trauma. According to ECPAT and UNICEF Innocenti research in Kenya, sixty-seven percent of vulnerable children never received anti-exploitation safety education.\n\nTo address this critical deficit, Action Three of Kenya's Position Paper establishes the TEACH-SHIELD Program. In partnership with the Teachers Service Commission and UNICEF Innocenti, Kenya is training five thousand frontline educators across vulnerable border counties. The curriculum equips teachers with trauma-sensitive pedagogy, anti-bullying protocols, and psychosocial coping mechanisms. Furthermore, schools establish designated quiet counseling spaces where child survivors can safely decompress.\n\nOur empirical target is clear: reducing survivor dropout rates by forty percent across three academic terms. Kenya welcomes member states to replicate this teacher capacity framework. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer end es-timd de-le-geits:\n\nPlei-sing en e-byusd caild in-tu en an-pri-perd kles-rum of-ten lids tu stig-me-tai-zei-syon end se-kon-de-ri tro-ma. E-kor-ding tu EK-PET end Yu-ni-sef In-no-cen-ti ri-serc in Ken-ya, siks-ti se-ven per-sent of val-ne-re-bel cil-dren ne-ver ri-sivd en-ti eks-ploi-tei-syon seif-ti e-dyu-kei-syon.\n\nTu ed-res dis kri-ti-kal de-fi-sit, Ek-syon Tri of Ken-yas Po-zi-syon Peiper es-teb-li-syes de TIC-SYILD Pro-grem. In part-ner-syip wid de Ti-cers Ser-vis Ko-mi-syon end Yu-ni-sef In-no-cen-ti, Ken-ya is trei-ning faif tau-send front-lain e-dyu-kei-tors e-kros val-ne-re-bel bor-der kawn-tis. De ke-ri-kyu-lum e-kwips ti-cers wid tro-ma sen-si-tif pe-da-go-ji, en-ti bu-li-ing pro-to-kols, end sai-ko-so-syal kow-ping me-ke-ni-zems. Fer-der-mor, skuls es-teb-lisy de-zig-nei-ted kwai-et kawn-se-ling spei-ses wer caild ser-vai-vers ken seif-li di-kom-pres.\n\nAwer em-pi-ri-kal tar-get is klir: ri-dyu-sing ser-vai-ver drop-awt reits bai for-ti per-sent e-kros tri e-ke-de-mik terms. Ken-ya wel-kems mem-ber stets tu rep-li-keit dis ti-cer ke-pe-si-ti freim-werk. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Ketua yang terhormat dan rekan-rekan delegasi:\n\nMenempatkan anak korban ke dalam kelas tanpa guru yang terlatih seringkali berujung pada stigma dan trauma sekunder. Menurut riset ECPAT dan UNICEF Innocenti di Kenya, 67 persen anak rentan tidak pernah mendapatkan edukasi keselamatan dari eksploitasi.\n\nUntuk mengatasi hal ini, Aksi 3 Position Paper Kenya meluncurkan Program TEACH-SHIELD. Bekerja sama dengan Komisi Layanan Guru (TSC) dan UNICEF Innocenti, Kenya melatih 5.000 guru di wilayah perbatasan mengenai metode ajar peka-trauma, penanganan perundungan, dan bimbingan psikososial. Sekolah juga dilengkapi ruang konseling ramah anak.\n\nTarget kami terukur: menurunkan angka putus sekolah penyintas hingga 40 persen dalam 3 semester. Kenya mengajak negara anggota mereplikasi program ini. Kenya menyerahkan waktu ke Pimpinan Sidang.",
        wordCount: 139,
        estimatedSeconds: 64
      },
      mod60: {
        english: "Honorable Chair, Kenya emphasizes Action Three: the TEACH-SHIELD Program. Classrooms must heal, not harm. Collaborating with UNICEF Innocenti, Kenya trains 5,000 border educators in trauma-sensitive teaching and creates quiet counseling rooms. By equipping teachers rather than imposing punitive measures, we aim to reduce survivor dropout rates by 40%. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer, Ken-ya em-fe-sai-ses Ek-syon Tri: de TIC-SYILD Pro-grem. Kles-rums mast hil, not harm. Ko-le-bo-rei-ting wid Yu-ni-sef In-no-cen-ti, Ken-ya treins faif tau-send bor-der e-dyu-kei-tors in tro-ma sen-si-tif ti-cing end kri-eits kwai-et kawn-se-ling rums. Bai e-kwip-ping ti-cers ra-der den im-po-sing pyu-ni-tif me-syurs, wi eim tu ri-dyus ser-vai-ver drop-awt reits bai for-ti per-sent. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Ketua yang terhormat, Kenya menegaskan Aksi 3: Program TEACH-SHIELD. Kelas harus menjadi tempat memulihkan, bukan melukai. Bersama UNICEF Innocenti, Kenya melatih 5.000 guru perbatasan dalam pengajaran peka-trauma dan membangun ruang konseling. Melalui pembekalan guru, kami menargetkan penurunan putus sekolah 40%. Kenya kembalikan waktu ke Pimpinan Sidang.",
        wordCount: 59,
        estimatedSeconds: 28
      },
      poi30: {
        english: "Honorable Chair, does the delegate recognize that trauma-informed teacher training under UNICEF is the single most effective way to prevent recovered child survivors from dropping out? Kenya yields to the Dais.",
        caraBaca: "O-no-re-bel Cyer, das de de-le-geit re-kog-nais det tro-ma in-formd ti-cer trei-ning an-der Yu-ni-sef is de sing-gel most e-fek-tif wei tu pri-vent ri-ka-verd caild ser-vai-vers from drop-ping awt? Ken-ya yilds tu de Dais.",
        indoMeaning: "Pimpinan Sidang, apakah delegasi mengakui bahwa pelatihan guru peka-trauma melalui UNICEF adalah cara paling ampuh mencegah anak korban putus sekolah? Kenya kembalikan waktu ke Pimpinan Sidang.",
        wordCount: 32,
        estimatedSeconds: 15
      }
    }
  },

  action4: {
    id: 'action4',
    name: 'Aksi 4: In-Tech Pathway (Radio Bertenaga Surya & Tracking EAC)',
    shortLabel: 'Action 4: In-Tech Pathway',
    description: 'Solusi pendidikan off-grid dengan radio bertenaga surya, buku kerja cetak mandiri, dan rekonsiliasi data siswa lintas batas bersama Uganda & Tanzania.',
    speeches: {
      gsl90: {
        english: "Honorable Chair and distinguished delegates:\n\nTrafficking networks thrive in remote cross-border regions where high-tech digital platforms simply cannot reach. According to the UNESCO Institute for Statistics 2024, ninety-eight million children remain out of school across Sub-Saharan Africa, often exacerbated by recurring displacement.\n\nAction Four of Kenya's Position Paper introduces the In-Tech Pathway. For off-grid border areas, we deploy low-tech, resilient educational tools: solar-powered radio sets broadcasting structured curriculum lessons, paired with printed self-study workbooks. Simultaneously, Kenya calls upon East African Community partner states, specifically Uganda and Tanzania, to establish a secure cross-border student tracking mechanism. When a rescued child moves across borders, their academic credits follow them seamlessly, preventing learning disruption and eliminating vulnerability to re-trafficking.\n\nLow-tech inclusion saves lives where internet access fails. Kenya stands ready to bridge this regional divide. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer end dis-ting-guis-yed de-le-geits:\n\nTre-fi-king net-werks traiv in ri-mot kros bor-der ri-jyens wer hai tek di-ji-tal plet-forms sim-pli ke-not ric. E-kor-ding tu de Yu-nes-ko In-sti-tyut for Ste-tis-tiks tu tau-sen twen-ti for, nain-ti eit mil-yon cil-dren ri-mein awt of skul e-kros Sab Se-he-ran Ef-ri-ka, of-ten ek-ze-ser-bei-ted bai ri-ker-ring dis-pleis-ment.\n\nEk-syon For of Ken-yas Po-zi-syon Peiper in-tro-dyu-ses di In-Tek Pat-wei. For of-grid bor-der e-ri-as, wi di-ploy low-tek, ri-si-lyent e-dyu-kei-syo-nal tuls: so-lar pawerd rei-di-o sets brod-kes-ting strak-cyurd ke-ri-kyu-lum le-sens, peird wid prin-ted self sta-di werk-buks. Sai-mel-tei-nyas-li, Ken-ya kols e-pon Ist Ef-ri-kan Kom-yu-ni-ti part-ner stets, spe-si-fi-ke-li Yu-gen-da end Ten-ze-ni-a, tu es-teb-lisy e si-kyur kros bor-der styu-dent tre-king me-ke-ni-zem. Wen e res-kyud caild muvs e-kros bor-ders, der e-ke-de-mik kre-dits fo-low dem sim-les-li, pri-ven-ting ler-ning dis-rap-syon end e-li-mi-nei-ting val-ne-re-bi-li-ti tu ri-tre-fi-king.\n\nLow tek in-klu-syon seivs laivs wer in-ter-net ek-ses feils. Ken-ya stends re-di tu brij dis ri-jyo-nal di-vaid. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Ketua yang terhormat dan rekan-rekan delegasi:\n\nJaringan perdagangan manusia merajalela di perbatasan terpencil yang tidak terjangkau internet berkecepatan tinggi. Data UNESCO 2024 menunjukkan 98 juta anak putus sekolah di Afrika Sub-Sahara, diperparah oleh perpindahan paksa akibat konflik dan kekeringan.\n\nAksi 4 Position Paper Kenya menghadirkan In-Tech Pathway. Untuk daerah terpencil tanpa listrik, kami menyediakan alat belajar berteknologi tepat guna: radio bertenaga surya pemancar materi kurikulum dan buku modul cetak mandiri. Bersamaan dengan itu, Kenya mendesak negara anggota Komunitas Afrika Timur (EAC), khususnya Uganda dan Tanzania, menyepakati sistem transfer nilai dan data siswa lintas batas. Ketika anak berpindah negara, riwayat sekolahnya diakui sehingga mereka tidak putus sekolah atau dijual kembali.\n\nTeknologi sederhana menyelamatkan masa depan saat internet tidak tersedia. Kenya siap menjembatani kesenjangan ini. Kenya mengembalikan waktu ke Pimpinan Sidang.",
        wordCount: 141,
        estimatedSeconds: 65
      },
      mod60: {
        english: "Honorable Chair, the Republic of Kenya champions Action Four: the In-Tech Pathway. Many border zones lack internet connectivity. We distribute solar-powered radio lesson receivers and printed modules while coordinating cross-border student record tracking with Uganda and Tanzania under the EAC. Practical low-tech solutions protect children from slipping back into exploitation. Kenya yields its time to the Dais.",
        caraBaca: "O-no-re-bel Cyer, de Re-pab-lik of Ken-ya cyem-pyens Ek-syon For: di In-Tek Pat-wei. Me-ni bor-der zowns lek in-ter-net ko-nek-ti-vi-ti. Wi dis-tri-byut so-lar pawerd rei-di-o le-sen ri-si-vers end prin-ted mo-dyuls wail ko-or-di-nei-ting kros bor-der styu-dent re-kord tre-king wid Yu-gen-da end Ten-ze-ni-a an-der di I-Ei-Si. Prek-ti-kal low-tek so-lu-syens pro-tekt cil-dren from slip-ping bek in-tu eks-ploi-tei-syon. Ken-ya yilds its taim tu de Dais.",
        indoMeaning: "Pimpinan yang terhormat, Republik Kenya mengusung Aksi 4: In-Tech Pathway. Banyak daerah perbatasan tidak memiliki jaringan internet. Kami membagikan radio bertenaga surya untuk pelajaran dan modul cetak, serta mengoordinasikan pengakuan nilai siswa lintas batas bersama Uganda dan Tanzania di bawah EAC. Solusi praktis melindungi anak dari jeratan eksploitasi ulang. Kenya kembalikan waktu ke Pimpinan Sidang.",
        wordCount: 61,
        estimatedSeconds: 29
      },
      poi30: {
        english: "Honorable Chair, does the delegate agree that high-tech apps alone leave ninety-eight million offline children behind, and that low-tech solar radios and EAC student tracking are essential? Kenya yields back.",
        caraBaca: "O-no-re-bel Cyer, das de de-le-geit e-gri det hai tek eps e-lon lif nain-ti eit mil-yon of-lain cil-dren bi-haind, end det low tek so-lar rei-di-os end I-Ei-Si styu-dent tre-king ar i-sen-syal? Ken-ya yilds bek.",
        indoMeaning: "Ketua yang terhormat, apakah delegasi setuju bahwa aplikasi digital canggih meninggalkan 98 juta anak tanpa internet, dan radio surya serta pelacakan lintas batas EAC adalah mutlak diperlukan? Kenya kembalikan waktu.",
        wordCount: 32,
        estimatedSeconds: 15
      }
    }
  }
};

export function getPaperBasedSpeech({
  pillarId = 'all',
  mode = 'GSL',
  durationSeconds = 90
}: {
  pillarId?: string;
  mode?: string;
  durationSeconds?: number;
}): SpeechData {
  const pillar = PAPER_PILLARS[pillarId] || PAPER_PILLARS.all;
  
  if (mode === 'POI' || durationSeconds <= 30) {
    return {
      ...pillar.speeches.poi30,
      isFallback: false,
      modelUsed: 'Base on Paper (Position Paper Kenya)'
    };
  }
  
  if (mode === 'MOD' || durationSeconds <= 60) {
    return {
      ...pillar.speeches.mod60,
      isFallback: false,
      modelUsed: 'Base on Paper (Position Paper Kenya)'
    };
  }
  
  return {
    ...pillar.speeches.gsl90,
    isFallback: false,
    modelUsed: 'Base on Paper (Position Paper Kenya)'
  };
}

export function getPaperCoDelegateReply(userMessage: string): {
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
} {
  const msg = (userMessage || '').toLowerCase();

  // 1. Roll Call
  if (msg.includes('roll call') || msg.includes('dipanggil') || msg.includes('presen')) {
    return {
      reply: 'Saat nama Republic of Kenya dipanggil di awal sesi oleh Chair (Roll Call), kamu cukup angkat placard Kenya dan katakan:',
      speechCard: {
        english: 'Present and Voting.',
        caraBaca: 'Pre-sent end Fow-ting.',
        indoMeaning: 'Hadir dan siap memberikan suara pada setiap voting resolusi.'
      },
      shortcut: { label: 'Buka Contekan Darurat', tabId: 'cheatsheet' }
    };
  }

  // 1b. Toilet / Izin / Point of Personal Privilege
  if (msg.includes('toilet') || msg.includes('kencing') || msg.includes('izin') || msg.includes('keluar') || msg.includes('privilege') || msg.includes('interupsi')) {
    return {
      reply: 'Kalau kamu mau izin ke toilet atau mengajukan interupsi hak pribadi saat sidang berlangsung, jangan langsung keluar ruangan. Angkat placard Kenya dan ajukan Point of Personal Privilege:',
      speechCard: {
        english: 'Point of Personal Privilege, Chair. Permission to be excused to the restroom.',
        caraBaca: 'Poin of Per-so-nel Pri-fi-lij, Cyeer. Per-mi-syon tu bi eks-kyusd tu de rest-rum.',
        indoMeaning: 'Interupsi hak pribadi pimpinan, izin ke kamar mandi.'
      },
      shortcut: { label: 'Buka Contekan Darurat', tabId: 'cheatsheet' }
    };
  }

  // 2. Aksi 1 - Dana / Finansial / Debt Swaps
  if (msg.includes('dana') || msg.includes('uang') || msg.includes('anggaran') || msg.includes('biaya') || msg.includes('re-fin') || msg.includes('refin') || msg.includes('sponsor')) {
    return {
      reply: 'Berdasarkan Aksi 1 Position Paper kita (RE-FIN Compact), Kenya mengusulkan skema pertukaran utang untuk pendidikan (debt-for-education swap) melalui UNICEF Global Education Thematic Fund dan Bank Pembangunan Afrika (AfDB). Dana dialokasikan untuk asrama dan sekolah perbatasan di Busia, Garissa, dan Namanga dengan audit statistik UNESCO UIS. Gunakan argumen resmi ini:',
      speechCard: {
        english: 'Honorable Chair, under Action One of Kenya\'s Position Paper, the RE-FIN Compact mobilizes debt-for-education swaps via UNICEF and AfDB to finance border shelters in Busia and Garissa. Kenya yields to the Dais.',
        caraBaca: 'O-no-re-bel Cyer, an-der Ek-syon Wan of Ken-yas Po-zi-syon Peiper, de RI-FIN Kom-pekt mo-bi-lai-ses det for e-dyu-kei-syon swaps vai-a Yu-ni-sef end Ei-Ef-Di-Bi tu fai-nens bor-der syel-ters in Bu-si-a end Ga-ris-sa. Ken-ya yilds tu de Dais.',
        indoMeaning: 'Pimpinan yang terhormat, di bawah Aksi 1 Position Paper Kenya, RE-FIN Compact memobilisasi pertukaran utang untuk pendidikan lewat UNICEF dan AfDB demi mendanai shelter perbatasan di Busia dan Garissa. Kenya kembalikan waktu ke Pimpinan Sidang.'
      },
      shortcut: { label: 'Buka Position Paper', tabId: 'pospap' }
    };
  }

  // 3. Aksi 2 - Akta Kelahiran / Dokumen / Izin Sekolah
  if (msg.includes('akta') || msg.includes('lahir') || msg.includes('dokumen') || msg.includes('loc-id') || msg.includes('surat') || msg.includes('kependudukan')) {
    return {
      reply: 'Berdasarkan Aksi 2 Position Paper kita (LOC-ID Fast-Track) dan Children Act No. 29 Tahun 2022 Pasal 8(1) serta Pasal 22, anak korban perdagangan tidak boleh ditolak sekolah karena ketiadaan akta lahir. Kenya menerbitkan Kartu Pelajar Transit 72 jam, sementara akta diurus susulan. Ini naskah bicaranya:',
      speechCard: {
        english: 'Honorable Chair, under Kenya\'s Children Act 2022 and our LOC-ID Fast-Track, rescued child survivors receive a 72-hour Transit Education Pass for immediate school placement without civil registration barriers. Kenya yields to the Dais.',
        caraBaca: 'O-no-re-bel Cyer, an-der Ken-yas Cil-dren Ekt tu tau-sen twen-ti tu end awer LOK-AI-DI Fest-Trek, res-kyud caild ser-vai-vers ri-siv e se-ven-ti tu awer Tren-sit E-dyu-kei-syon Peis for i-mi-dyet skul pleis-ment wid-awt si-vil re-jis-trei-syon be-ri-yers. Ken-ya yilds tu de Dais.',
        indoMeaning: 'Pimpinan yang terhormat, sesuai Children Act Kenya 2022 dan LOC-ID Fast-Track kami, anak korban yang diselamatkan menerima Kartu Pelajar Transit 72 jam untuk penempatan sekolah langsung tanpa hambatan akta lahir. Kenya kembalikan waktu ke Pimpinan Sidang.'
      },
      shortcut: { label: 'Buka Position Paper', tabId: 'pospap' }
    };
  }

  // 4. Aksi 3 - Guru / Pengajar / Trauma / Mental / Konseling
  if (msg.includes('guru') || msg.includes('ajar') || msg.includes('trauma') || msg.includes('mental') || msg.includes('konseling') || msg.includes('shield')) {
    return {
      reply: 'Berdasarkan Aksi 3 Position Paper kita (TEACH-SHIELD Program), Kenya bekerja sama dengan Teachers Service Commission (TSC) dan UNICEF Innocenti untuk melatih 5.000 guru di perbatasan dalam pedagogi peka-trauma dan ruang konseling sekolah, dengan target menurunkan angka putus sekolah hingga 40%. Ini naskah bicaranya:',
      speechCard: {
        english: 'Honorable Chair, under the TEACH-SHIELD Program in Kenya\'s Position Paper, we train 5,000 frontline educators in trauma-sensitive teaching and establish quiet counseling spaces to reduce survivor dropout by 40%. Kenya yields to the Dais.',
        caraBaca: 'O-no-re-bel Cyer, an-der de TIC-SYILD Pro-grem in Ken-yas Po-zi-syon Peiper, wi trein faif tau-send front-lain e-dyu-kei-tors in tro-ma sen-si-tif ti-cing end es-teb-lisy kwai-et kawn-se-ling spei-ses tu ri-dyus ser-vai-ver drop-awt bai for-ti per-sent. Ken-ya yilds tu de Dais.',
        indoMeaning: 'Pimpinan yang terhormat, melalui Program TEACH-SHIELD di Position Paper Kenya, kami melatih 5.000 pendidik garis depan dalam pengajaran peka-trauma dan mendirikan ruang konseling demi menurunkan angka putus sekolah sebesar 40%. Kenya kembalikan waktu ke Pimpinan Sidang.'
      },
      shortcut: { label: 'Buka Position Paper', tabId: 'pospap' }
    };
  }

  // 5. Aksi 4 - Teknologi / Radio / Perbatasan / EAC / Uganda / Tanzania
  if (msg.includes('radio') || msg.includes('surya') || msg.includes('teknologi') || msg.includes('in-tech') || msg.includes('uganda') || msg.includes('tanzania') || msg.includes('eac') || msg.includes('lintas batas')) {
    return {
      reply: 'Berdasarkan Aksi 4 Position Paper kita (In-Tech Pathway), Kenya memanfaatkan radio bertenaga surya dan modul belajar cetak untuk wilayah terpencil tanpa listrik, serta koordinasi Komunitas Afrika Timur (EAC) bersama Uganda dan Tanzania untuk transfer nilai siswa lintas batas. Ini naskah bicaranya:',
      speechCard: {
        english: 'Honorable Chair, Action Four of Kenya\'s Position Paper deploys the In-Tech Pathway: distributing solar-powered radio lesson receivers and securing cross-border student credit tracking with Uganda and Tanzania under the EAC. Kenya yields to the Dais.',
        caraBaca: 'O-no-re-bel Cyer, Ek-syon For of Ken-yas Po-zi-syon Peiper di-ploys di In-Tek Pat-wei: dis-tri-byu-ting so-lar pawerd rei-di-o le-sen ri-si-vers end si-kyu-ring kros bor-der styu-dent kre-dit tre-king wid Yu-gen-da end Ten-ze-ni-a an-der di I-Ei-Si. Ken-ya yilds tu de Dais.',
        indoMeaning: 'Pimpinan yang terhormat, Aksi 4 Position Paper Kenya menghadirkan In-Tech Pathway: mendistribusikan radio surya penerima pelajaran dan mengamankan pelacakan rekam pendidikan lintas batas dengan Uganda dan Tanzania di bawah EAC. Kenya kembalikan waktu ke Pimpinan Sidang.'
      },
      shortcut: { label: 'Buka Position Paper', tabId: 'pospap' }
    };
  }

  // 6. Data Statistik / Sumber Paper
  if (msg.includes('data') || msg.includes('angka') || msg.includes('sumber') || msg.includes('unodc') || msg.includes('unesco') || msg.includes('persen') || msg.includes('jurnal')) {
    return {
      reply: 'Ini data resmi dan mutakhir (< 5 tahun) dari Position Paper Kenya yang siap kamu sebutkan di depan Chair:\n1. UNODC 2024: 61% korban perdagangan manusia di Afrika Sub-Sahara adalah anak-anak (42% perempuan, 19% laki-laki).\n2. UNESCO UIS 2024: 251 juta anak putus sekolah di dunia, 98 juta di Afrika Sub-Sahara.\n3. ECPAT & UNICEF Innocenti 2022: 12% anak internet di Kenya mengalami eksploitasi, 67% tidak pernah dapat edukasi keselamatan.\n4. Terre des Hommes 2022: 2.426 anak di Mombasa, Kilifi, dan Kwale dalam jeratan eksploitasi komersial.\n5. Jurnal Hukum Katungati 2025: Analisis penegakan hukum UU Anti-Trafficking 2010 dan Children Act 2022.',
      shortcut: { label: 'Lihat Daftar Pustaka Lengkap', tabId: 'pospap' }
    };
  }

  // 7. Pidato / Podium / GSL
  if (msg.includes('pidato') || msg.includes('podium') || msg.includes('bicara') || msg.includes('gsl') || msg.includes('ngomong')) {
    const speech = PAPER_PILLARS.all.speeches.mod60;
    return {
      reply: 'Ini pidato 60 detik resmi yang bersumber 100% dari Position Paper HARAMBEE-WAYS Kenya. Kamu cukup baca lafal suku kata fonetik Indonesia di bawah ini:',
      speechCard: {
        english: speech.english,
        caraBaca: speech.caraBaca,
        indoMeaning: speech.indoMeaning
      },
      shortcut: { label: 'Buka Layar Penuh Teleprompter', tabId: 'teleprompter' }
    };
  }

  // Default: Overview 4 Pilar Position Paper
  return {
    reply: 'Kamu sedang berada di Mode Base on Paper (Terkunci ke Position Paper Resmi Kenya).\n\nSeluruh taktik dan argumen didasarkan pada 4 pilar HARAMBEE-WAYS kita:\n1. Aksi 1 (RE-FIN Compact): Pendanaan debt swaps via UNICEF & AfDB untuk shelter Busia, Garissa, Namanga.\n2. Aksi 2 (LOC-ID Fast-Track): Kartu Pelajar Transit 72 jam tanpa syarat akta lahir sesuai Children Act 2022.\n3. Aksi 3 (TEACH-SHIELD): Latih 5.000 guru perbatasan kurikulum peka-trauma bersama UNICEF Innocenti.\n4. Aksi 4 (In-Tech Pathway): Radio bertenaga surya dan pelacakan siswa lintas batas EAC dengan Uganda & Tanzania.\n\nKetik kata kunci apa yang ingin kamu bahas (misal: dana, akta, guru, radio, atau pidato):',
    shortcut: { label: 'Buka Position Paper Studio', tabId: 'pospap' }
  };
}
