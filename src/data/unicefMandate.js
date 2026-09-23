export const unicefMandate = {
  committeeName: 'United Nations Children\'s Fund (UNICEF)',
  description: 'Badan PBB yang didedikasikan untuk melindungi hak dan kesejahteraan anak di seluruh dunia. Bekerja berdasarkan mandat kerjasama dan bantuan kemanusiaan/pembangunan, bukan penegakan hukum pidana.',
  
  mayDo: [
    {
      action: 'Mendukung Pemerintah Anggota (Support Governments in their efforts)',
      detail: 'Membantu pemerintah menyusun program reintegrasi, pelatihan tenaga pendidik, dan penyediaan fasilitas pemulihan anak.'
    },
    {
      action: 'Bantuan Teknis & Pengembangan Kapasitas (Assistance & Capacity-Building)',
      detail: 'Memberikan pedoman teknis, kurikulum pemulihan trauma, dan pelatihan untuk pekerja sosial dan guru.'
    },
    {
      action: 'Mendukung Program Pendidikan (Support Educational Programs)',
      detail: 'Mendanai sekolah ramah anak, beasiswa, program kejar paket (*accelerated learning*), dan modul vokasi.'
    },
    {
      action: 'Memfasilitasi Kerja Sama Antar-Negara & LSM (Facilitate Cooperation)',
      detail: 'Menghubungkan negara anggota, badan PBB lain (ILO, IOM, UNODC), dan masyarakat sipil untuk pertukaran praktik terbaik.'
    }
  ],

  mayNotDo: [
    {
      action: 'DILARANG: Menangkap atau Menuntut Pelaku (Arrest or Prosecute Traffickers)',
      reason: 'UNICEF BUKAN kepolisian atau pengadilan kriminal internasional. Urusan penegakan hukum pidana adalah wewenang UNODC, INTERPOL, dan hukum domestik negara berdaulat.'
    },
    {
      action: 'DILARANG: Memaksa atau Mengubah Hukum Domestik (Impose Domestic Legislation)',
      reason: 'UNICEF menghormati kedaulatan negara anggota (*State Sovereignty*). UNICEF hanya bisa merekomendasikan atau menghimbau, tidak boleh mendikte undang-undang suatu negara.'
    },
    {
      action: 'DILARANG: Menggantikan Sistem Pendidikan Nasional (Replace National Systems)',
      reason: 'UNICEF bertindak sebagai mitra pelengkap (*complementary partner*), bukan menggantikan kementerian pendidikan nasional.'
    },
    {
      action: 'DILARANG: Menetapkan Hukuman Pidana (Determine Criminal Penalties)',
      reason: 'Batas pidana, vonis penjara, atau hukuman bagi pelaku perdagangan manusia berada di luar mandat UNICEF.'
    }
  ],

  validateClause: (clauseText) => {
    const text = clauseText.toLowerCase();
    const violations = [];

    if (text.includes('arrest') || text.includes('penjara') || text.includes('tangkap') || text.includes('menangkap') || text.includes('prosecute') || text.includes('penuntutan')) {
      violations.push('Klausa mengandung unsur penegakan hukum pidana/penangkapan yang dilarang dalam mandat UNICEF.');
    }
    if (text.includes('punish') || text.includes('hukuman mati') || text.includes('criminal penalty') || text.includes('sanksi pidana')) {
      violations.push('UNICEF tidak berwenang menentukan sanksi pidana terhadap pelaku.');
    }
    if (text.includes('mandates member states to pass law') || text.includes('wajibkan negara mengubah undang-undang')) {
      violations.push('UNICEF tidak boleh melanggar kedaulatan nasional dengan memaksakan legislasi domestik.');
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }
};
