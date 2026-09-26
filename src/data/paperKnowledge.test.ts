import { describe, it, expect } from 'vitest';
import { getPaperBasedSpeech, getPaperCoDelegateReply, PAPER_PILLARS } from './paperKnowledge';

describe('paperKnowledge module', () => {
  it('contains all 5 core Position Paper pillars (HARAMBEE-WAYS)', () => {
    expect(PAPER_PILLARS.all).toBeDefined();
    expect(PAPER_PILLARS.action1).toBeDefined();
    expect(PAPER_PILLARS.action2).toBeDefined();
    expect(PAPER_PILLARS.action3).toBeDefined();
    expect(PAPER_PILLARS.action4).toBeDefined();
  });

  it('generates accurate 90s, 60s, and 30s speeches strictly from position paper', () => {
    const gslSpeech = getPaperBasedSpeech({ pillarId: 'all', mode: 'GSL', durationSeconds: 90 });
    expect(gslSpeech.english).toContain('HARAMBEE-WAYS');
    expect(gslSpeech.english).toContain('UNODC Global Report on Trafficking in Persons 2024');
    expect(gslSpeech.caraBaca).toContain('HA-RAM-BI WEIS');
    expect(gslSpeech.indoMeaning).toContain('Tanduk Afrika');

    const modSpeech = getPaperBasedSpeech({ pillarId: 'action2', mode: 'MOD', durationSeconds: 60 });
    expect(modSpeech.english).toContain('LOC-ID Fast-Track');
    expect(modSpeech.english).toContain('Children Act 2022');
    expect(modSpeech.caraBaca).toBeDefined();

    const poiSpeech = getPaperBasedSpeech({ pillarId: 'action1', mode: 'POI', durationSeconds: 30 });
    expect(poiSpeech.english).toContain('debt-for-education swaps');
  });

  it('answers co-delegate questions based on Position Paper', () => {
    const danaReply = getPaperCoDelegateReply('gimana soal dana dan anggaran');
    expect(danaReply.reply).toContain('RE-FIN Compact');
    expect(danaReply.speechCard?.english).toContain('debt-for-education swaps');

    const aktaReply = getPaperCoDelegateReply('bagaimana kalau anak tidak punya akta kelahiran');
    expect(aktaReply.reply).toContain('LOC-ID Fast-Track');
    expect(aktaReply.speechCard?.english).toContain('Transit Education Pass');

    const guruReply = getPaperCoDelegateReply('apa solusi untuk guru dan pelatihan trauma');
    expect(guruReply.reply).toContain('TEACH-SHIELD');
    expect(guruReply.speechCard?.english).toContain('5,000');

    const radioReply = getPaperCoDelegateReply('bagaimana teknologi radio surya dan uganda tanzania');
    expect(radioReply.reply).toContain('In-Tech Pathway');
    expect(radioReply.speechCard?.english).toContain('EAC');
  });
});
