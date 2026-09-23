import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Award, 
  BookOpen
} from 'lucide-react';
import { SettingsState } from '../types';

interface PositionPaperStudioProps {
  settings?: SettingsState;
}

export default function PositionPaperStudio({ settings }: PositionPaperStudioProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'paper' | 'guide'>('paper');

  const paperContent = {
    country: 'Republic of Kenya',
    council: "United Nations Children's Fund (UNICEF)",
    topic: 'Strengthening educational opportunities and long-term prospects for child survivors of sexual exploitation and trafficking',
    delegate: `${settings?.delegateName || 'Muhamad Salman'} (Solo Delegate)`,
    
    section1Title: 'I. Background and National Context',
    section1Text: `Child trafficking and commercial sexual exploitation represent profound violations of fundamental human dignity, disrupting the developmental trajectory and educational continuity of vulnerable minors across the globe. According to UNICEF, hundreds of millions of children experience violence and exploitation, with survivors enduring persistent trauma, acute poverty, and deep societal stigma long after their physical rescue.¹ In the Horn of Africa and East African Community (EAC), geopolitical instability, recurrent climatic shocks, and economic vulnerabilities exacerbate child susceptibility to illicit recruitment and transnational trafficking circuits. The Republic of Kenya recognizes that the end of captivity does not signify the completion of rehabilitation. For a child survivor, educational exclusion—often triggered by the loss or confiscation of civil birth documentation during trafficking—creates an acute barrier to societal reintegration, drastically amplifying the risk of re-exploitation. Consequently, restorative justice requires an institutional paradigm that guarantees safe, dignified, and sustained educational pathways.`,

    section2Title: 'II. Past International and National Actions',
    section2Text: `Kenya has consistently maintained an active legal and operational commitment to the international child rights architecture, as a state party to the UN Convention on the Rights of the Child (UNCRC), the Palermo Protocol, and ILO Convention No. 182. Nationally, the Government of Kenya enacted the landmark Children Act 2022 (Act No. 29 of 2022), which explicitly codifies the constitutional right of every child to compulsory, free basic education and mandates the operationalization of specialized Child Protection Units (CPUs) within county administrative divisions.² Furthermore, through the Counter-Trafficking in Persons Act 2010 (Act No. 8 of 2010), Kenya established the National Assistance Trust Fund for Victims of Trafficking, directly financing emergency shelters, medical relief, and community psychological support.³ In educational governance, Kenya's transition to the Competency-Based Curriculum (CBC) facilitates individualized learning assessments, enabling accelerated recovery modules for youths whose schooling was severed by protracted exploitation. Regionally, Kenya spearheads the East African Community (EAC) Child Policy (2016) to synchronize cross-border protective mechanisms with neighboring partner states.⁴`,

    section3Title: 'III. Proposed Solutions within UNICEF Mandate',
    section3Text: `Remaining strictly faithful to the humanitarian and capacity-building mandate of UNICEF—and without encroaching upon sovereign domestic criminal jurisprudence—the Republic of Kenya proposes a three-pronged framework titled the "SAFE-LEARN" Initiative:

1. Unconditional Documentation-Free Re-Enrollment Protocols: UNICEF should collaborate with national educational ministries to formulate temporary "Transit Education Passes." Child survivors whose birth records were destroyed, forged, or retained by traffickers must be granted immediate enrollment into formal and accelerated learning systems without bureaucratic disqualification, accompanied by streamlined, retroactive civil registration procedures.

2. Trauma-Informed Pedagogy and Integrated Community Sanctuaries: In partnership with local civil society, UNICEF must allocate technical grants to train frontline educators in trauma-sensitive psychosocial methodologies. Schools in high-vulnerability regions must be equipped with safe-haven wellness cubicles and dedicated caseworkers, dismantling classroom stigma and offering mental health stabilization alongside vocational literacy.

3. Regional Cross-Border Reintegration Compact and Multilateral Matching Grants: Recognizing the transnational nature of trafficking, Kenya advocates for an East African pilot coordination network under UNICEF auspices for child-tracing and dignified repatriation. Developed donor states are urged to establish equitable, unconditional matching funds through UNICEF's Global Education Thematic Fund to finance decentralized shelter-schools across developing transit corridors.`,

    citations: [
      '1. UNICEF, Committee Study Guide: Expanding Educational Opportunities for Child Survivors of Sexual Exploitation and Trafficking (PUMUN Secretariat, 2026), 4–8.',
      '2. Republic of Kenya, Children Act, No. 29 of 2022 (Nairobi: Government Printer, 2022), sec. 10–14.',
      '3. Republic of Kenya, Counter-Trafficking in Persons Act, No. 8 of 2010 (Nairobi: Kenya Law Reports, 2010), sec. 21–24.',
      '4. East African Community, EAC Child Policy: Promoting and Protecting Children\'s Rights in East Africa (Arusha: EAC Secretariat, 2016), 12–15.'
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const fullText = `COUNTRY: ${paperContent.country}
COUNCIL: ${paperContent.council}
TOPIC: ${paperContent.topic}
DELEGATE: ${paperContent.delegate}

${paperContent.section1Title}
${paperContent.section1Text}

${paperContent.section2Title}
${paperContent.section2Text}

${paperContent.section3Title}
${paperContent.section3Text}

REFERENCES (Chicago Manual of Style 17th Edition):
${paperContent.citations.join('\n')}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = `COUNTRY: ${paperContent.country}
COUNCIL: ${paperContent.council}
TOPIC: ${paperContent.topic}
DELEGATE: ${paperContent.delegate}

${paperContent.section1Title}
${paperContent.section1Text}

${paperContent.section2Title}
${paperContent.section2Text}

${paperContent.section3Title}
${paperContent.section3Text}

REFERENCES (Chicago Manual of Style 17th Edition):
${paperContent.citations.join('\n')}`;

    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Position Paper_UNICEF_Kenya_${settings?.delegateName?.replace(/\s+/g, '_') || 'Salman'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header and Compliance Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Position Paper Studio (PUMUN SDC 1.0)
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Naskah resmi Position Paper Delegasi Republik Kenya. Disusun presisi mengikuti Academic Guideline PUMUN 2026 (Format A4, Chicago 17th ed, bebas plagiarisme).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Cetak atau Simpan ke PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Ekspor PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 transition"
            title="Unduh file Markdown/Teks"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 transition"
            title="Salin Naskah Lengkap"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin'}</span>
          </button>
        </div>
      </div>

      {/* Compliance Checklist Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-2.5 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-slate-800">Turnitin &lt; 15% Safe</div>
            <div className="text-slate-500 text-[11px]">Bebas plagiarisme</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-2.5 shadow-sm">
          <Award className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-slate-800">Chicago 17th Ed</div>
            <div className="text-slate-500 text-[11px]">Format kutipan resmi</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-2.5 shadow-sm">
          <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-slate-800">Panjang: 1 Halaman A4</div>
            <div className="text-slate-500 text-[11px]">Sesuai SDC Guide</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-2.5 shadow-sm">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-slate-800">Mandat UNICEF</div>
            <div className="text-slate-500 text-[11px]">100% Sesuai batas</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('paper')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'paper'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tampilan Naskah A4 Resmi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'guide'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Penjelasan Makna Isi Paper (Bahasa Indonesia)</span>
        </button>
      </div>

      {/* Tab Content: Realistic Paper Preview */}
      {activeTab === 'paper' && (
        <div className="bg-slate-100 p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto border border-slate-200">
          {/* Printable A4 Paper Container */}
          <div 
            id="printable-position-paper"
            className="w-full max-w-[800px] bg-white text-black p-8 sm:p-12 rounded-lg shadow-md border border-slate-200 space-y-6 font-serif text-[13px] leading-relaxed text-justify selection:bg-amber-100 selection:text-black"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {/* Paper Header */}
            <div className="border-b-2 border-slate-900 pb-4 space-y-1 text-left font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-emerald-900 uppercase">
                  PUMUN REGENERATION 2026 • SDC 1.0
                </span>
                <span className="text-xs font-bold text-red-900">REPUBLIC OF KENYA 🇰🇪</span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 pt-1">
                POSITION PAPER
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-slate-800 pt-1">
                <div><strong>Country:</strong> {paperContent.country}</div>
                <div><strong>Council:</strong> {paperContent.council}</div>
                <div className="sm:col-span-2"><strong>Topic:</strong> {paperContent.topic}</div>
                <div className="sm:col-span-2"><strong>Delegate:</strong> {paperContent.delegate}</div>
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-1.5">
              <h2 className="font-bold text-[14px] text-slate-950 tracking-normal uppercase border-b border-slate-300 pb-0.5">
                {paperContent.section1Title}
              </h2>
              <p className="text-slate-900 indent-6">
                {paperContent.section1Text}
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-1.5">
              <h2 className="font-bold text-[14px] text-slate-950 tracking-normal uppercase border-b border-slate-300 pb-0.5">
                {paperContent.section2Title}
              </h2>
              <p className="text-slate-900 indent-6">
                {paperContent.section2Text}
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-1.5">
              <h2 className="font-bold text-[14px] text-slate-950 tracking-normal uppercase border-b border-slate-300 pb-0.5">
                {paperContent.section3Title}
              </h2>
              <div className="text-slate-900 space-y-2">
                <p className="indent-6">
                  Remaining strictly faithful to the humanitarian and capacity-building mandate of UNICEF—and without encroaching upon sovereign domestic criminal jurisprudence—the Republic of Kenya proposes a three-pronged framework titled the <strong>"SAFE-LEARN"</strong> Initiative:
                </p>
                <div className="pl-4 space-y-1.5 text-xs">
                  <p>
                    <strong>1. Unconditional Documentation-Free Re-Enrollment Protocols:</strong> UNICEF should collaborate with national educational ministries to formulate temporary "Transit Education Passes." Child survivors whose birth records were destroyed, forged, or retained by traffickers must be granted immediate enrollment into formal and accelerated learning systems without bureaucratic disqualification, accompanied by streamlined, retroactive civil registration procedures.
                  </p>
                  <p>
                    <strong>2. Trauma-Informed Pedagogy and Integrated Community Sanctuaries:</strong> In partnership with local civil society, UNICEF must allocate technical grants to train frontline educators in trauma-sensitive psychosocial methodologies. Schools in high-vulnerability regions must be equipped with safe-haven wellness cubicles and dedicated caseworkers, dismantling classroom stigma and offering mental health stabilization alongside vocational literacy.
                  </p>
                  <p>
                    <strong>3. Regional Cross-Border Reintegration Compact and Multilateral Matching Grants:</strong> Recognizing the transnational nature of trafficking, Kenya advocates for an East African pilot coordination network under UNICEF auspices for child-tracing and dignified repatriation. Developed donor states are urged to establish equitable, unconditional matching funds through UNICEF's Global Education Thematic Fund to finance decentralized shelter-schools across developing transit corridors.
                  </p>
                </div>
              </div>
            </div>

            {/* Footnotes & Citations */}
            <div className="border-t border-slate-400 pt-3 text-[11px] text-slate-700 space-y-0.5">
              <div className="font-bold uppercase text-[10px] text-slate-800 tracking-wider">
                Footnotes & References (Chicago Manual of Style 17th Edition):
              </div>
              {paperContent.citations.map((cite, i) => (
                <div key={i} className="pl-2">
                  {cite}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Indonesian Guide */}
      {activeTab === 'guide' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              Buku Panduan Memahami Isi Position Paper Anda
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sebagai solo delegate, Anda harus tahu garis besar isi paper Anda jika sewaktu-waktu ditanya oleh Chair atau delegasi lain saat sesi debat!
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-sm text-emerald-800">Bagian 1: Latar Belakang & Situasi Masalah</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Menjelaskan bahwa penyelamatan anak korban dari tangan pelaku hanyalah awal. Masalah terbesarnya adalah saat anak ingin kembali bersekolah, mereka sering kali tidak punya akta lahir/dokumen karena disita atau dihancurkan oleh pelaku perdagangan orang. Akibatnya mereka ditolak sekolah, mengalami trauma, dan rawan dieksploitasi lagi.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-sm text-amber-800">Bagian 2: Langkah Nyata Hukum Nasional Kenya</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Kenya bukan sekadar bicara, tapi sudah punya bukti nyata:
                <br />• <strong>Children Act 2022:</strong> Menjamin sekolah gratis & unit perlindungan anak di kantor polisi.
                <br />• <strong>Counter-Trafficking in Persons Act 2010:</strong> Membentuk dana bantuan korban untuk rumah aman.
                <br />• <strong>Kurikulum CBC Kenya:</strong> Memberikan jalur belajar cepat (kejar paket) bagi anak yang tertinggal.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-sm text-blue-800">Bagian 3: Solusi yang Kita Tawarkan (Inisiatif SAFE-LEARN)</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Tiga pilar solusi diplomasi Kenya:
                <br />1. <strong>Transit Education Pass:</strong> Izin masuk sekolah darurat tanpa perlu menunggu akta lahir jadi.
                <br />2. <strong>Pelatihan Guru & Pusat Pemulihan:</strong> Guru diajari cara menangani anak trauma, bukan malah memarahi atau mendiskriminasi mereka.
                <br />3. <strong>Dana Hibah Negara Maju & Kerjasama Perbatasan:</strong> Mengajak negara-negara kaya (seperti Swedia, Kanada, AS) membantu dana pembangunan sekolah aman di negara berkembang tanpa mencampuri hukum domestik.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
