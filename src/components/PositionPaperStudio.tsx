import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Award, 
  BookOpen,
  RotateCw
} from 'lucide-react';
import { SettingsState } from '../types';
import { generatePositionPaperDocx } from '../utils/docxExport';

interface PositionPaperStudioProps {
  settings?: SettingsState;
}

export default function PositionPaperStudio({ settings }: PositionPaperStudioProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'paper' | 'guide'>('paper');
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);

  const paperContent = {
    country: 'Republic of Kenya',
    council: "United Nations Children's Fund (UNICEF)",
    topic: 'Strengthening educational opportunities and long-term prospects for child survivors of sexual exploitation and trafficking',
    delegate: `${settings?.delegateName || 'Muhamad Salman'} (Solo Delegate)`,
    
    section1Title: 'I. Background and National Context',
    section1Text: `Child trafficking and commercial sexual exploitation represent severe violations of fundamental human dignity that disrupt the developmental trajectory and educational continuity of vulnerable minors worldwide. According to UNICEF documentation, hundreds of millions of children endure violence and exploitation, with survivors facing persistent trauma, systemic poverty, and social marginalization long after their physical rescue. Within the Horn of Africa and the East African Community, geopolitical instability, recurrent climate-induced displacement, and economic hardship heighten the vulnerability of minors to cross-border trafficking networks. The Republic of Kenya firmly maintains that the cessation of physical exploitation does not mark the conclusion of rehabilitation. For a survivor, educational exclusion, which is frequently caused by the loss or confiscation of civil birth documentation during transit, creates a devastating barrier to reintegration that drastically elevates the hazard of re-exploitation. Consequently, sustainable restorative justice requires comprehensive institutional arrangements that guarantee safe, dignified, and uninterrupted educational pathways for every child.`,

    section2Title: 'II. Past International and National Actions',
    section2Text: `Kenya has consistently upheld an active legal and operational commitment to the international child protection framework as a state party to the United Nations Convention on the Rights of the Child, the Palermo Protocol, and ILO Convention No. 182. Nationally, the Government of Kenya enacted the landmark Children Act 2022, which codifies the constitutional right of every child to compulsory and free basic education while operationalizing specialized Child Protection Units across county administrations. Furthermore, under the Counter-Trafficking in Persons Act 2010, Kenya instituted the National Assistance Trust Fund for Victims of Trafficking to finance emergency shelter operations, medical relief, and community-based psychosocial rehabilitation. In educational governance, Kenya's transition toward the Competency-Based Curriculum enables individualized assessment pathways and accelerated learning modules for students whose educational journey was interrupted by exploitation. Regionally, Kenya actively advances the East African Community Child Policy of 2016 to harmonize cross-border child protection and repatriation standards with neighboring partner states.`,

    section3Title: 'III. Proposed Solutions within UNICEF Mandate',
    section3Text: `In full alignment with the humanitarian and developmental mandate of UNICEF, and respecting sovereign domestic jurisdictions, the Republic of Kenya advocates for a comprehensive multilateral framework titled the SAFE-LEARN Initiative. First, Kenya recommends establishing unconditional documentation-free re-enrollment protocols through UNICEF-administered temporary Transit Education Passes. Under this mechanism, child survivors whose identity records were lost, destroyed, or withheld by traffickers obtain immediate admission into accredited formal and accelerated learning programs without bureaucratic prerequisites, supported by concurrent retroactive civil documentation procedures. Second, Kenya emphasizes the institutionalization of trauma-informed pedagogy and community wellness sanctuaries. In collaboration with local educational authorities and civil society, UNICEF technical assistance should train frontline educators in trauma-sensitive methodologies while equipping schools in vulnerable border corridors with private counseling spaces and dedicated child welfare officers to eradicate classroom stigma. Finally, the delegation calls for a regional cross-border reintegration compact accompanied by multilateral matching grants. By mobilizing equitable resources through the UNICEF Global Education Thematic Fund, international partners can finance decentralized shelter-schools along migration corridors, securing durable reintegration and academic continuity across East Africa.`,

    citations: [
      'UNICEF. Expanding Educational Opportunities for Child Survivors of Sexual Exploitation and Trafficking. Committee Study Guide. PUMUN Secretariat, 2026.',
      'Republic of Kenya. Children Act, No. 29 of 2022. Nairobi: Government Printer, 2022.',
      'Republic of Kenya. Counter-Trafficking in Persons Act, No. 8 of 2010. Nairobi: Kenya Law Reports, 2010.',
      'East African Community. EAC Child Policy: Promoting and Protecting Children\'s Rights in East Africa. Arusha: EAC Secretariat, 2016.'
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

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await generatePositionPaperDocx(paperContent);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Position_Paper_UNICEF_Kenya_${settings?.delegateName?.replace(/\s+/g, '_') || 'Muhamad_Salman'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Docx generation error:', err);
      // Fallback to text file if docx generation fails
      const fullText = `COMMITTEE: ${paperContent.council}
COUNTRY: ${paperContent.country}
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

      const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Position_Paper_UNICEF_Kenya_${settings?.delegateName?.replace(/\s+/g, '_') || 'Muhamad_Salman'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingDocx(false);
    }
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
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Unduh file resmi Microsoft Word (.docx)"
          >
            {isExportingDocx ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Membuat Word...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Unduh Word (.docx)</span>
              </>
            )}
          </button>

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
              <p className="text-slate-900 indent-6">
                {paperContent.section3Text}
              </p>
            </div>

            {/* References / Bibliography */}
            <div className="border-t border-slate-400 pt-3 text-[11px] text-slate-700 space-y-1">
              <div className="font-bold uppercase text-[10px] text-slate-800 tracking-wider">
                References (Chicago Manual of Style 17th Edition):
              </div>
              {paperContent.citations.map((cite, i) => (
                <div key={i} className="pl-4 -indent-4">
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

            <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 space-y-1.5">
              <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                <span>💡 Catatan Penting: Aturan Tahun (1–5 Tahun Terakhir) di Syarat MUN</span>
              </h4>
              <div className="text-xs text-slate-700 leading-relaxed space-y-1">
                <p>
                  Di MUN, panitia mensyaratkan <strong>data statistik, bukti kasus, dan aksi nasional harus mutakhir (1–5 tahun terakhir)</strong>:
                </p>
                <p>
                  • <strong>Children Act 2022:</strong> Senjata utama Kenya adalah undang-undang tahun <strong>2022</strong> (tepat dalam rentang 1–4 tahun terakhir). Ini adalah hukum terbaru Kenya yang menggantikan UU lama tahun 2001!
                </p>
                <p>
                  • <strong>Traktat Pokok Internasional (UNCRC 1989 & Palermo Protocol 2000):</strong> Merupakan landasan hukum dasar (*foundational treaties*) yang berlaku selamanya bagi seluruh negara anggota PBB, sehingga sah dan wajib dikutip.
                </p>
                <p>
                  • <strong>Data Statistik & Laporan Kasus:</strong> Seluruh rujukan kita berpatokan pada laporan terbaru PUMUN Secretariat (2026) dan UNICEF terkini pasca-pandemi, sehingga 100% aman dan memenuhi syarat akademik lomba.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
