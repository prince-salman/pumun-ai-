import { describe, it, expect } from 'vitest';
import { kenyaProfile } from './kenyaProfile';
import { countriesDossier } from './countriesDossier';
import { ropRules, quickPhrases } from './ropRules';
import { unicefMandate } from './unicefMandate';
import { DEBATE_SUBTOPICS, KEYWORD_ITEMS, CRISIS_SCENARIOS } from './debateSubtopics';

describe('Knowledge Base Integrity (TypeScript)', () => {
  it('loads Kenya profile with key laws and core pillars', () => {
    expect(kenyaProfile.countryName).toBe('Republic of Kenya');
    expect(kenyaProfile.laws).toContainEqual(
      expect.objectContaining({ name: expect.stringMatching(/Children Act/i) })
    );
    expect(kenyaProfile.pillars.length).toBeGreaterThan(0);
  });

  it('maps all 22 other delegations with stances and blocs', () => {
    expect(countriesDossier.length).toBe(22);
    const countryNames = countriesDossier.map(c => c.name);
    expect(countryNames).toContain('United States of America');
    expect(countryNames).toContain('Democratic republic of the Congo');
    expect(countryNames).toContain('Kingdom of Sweden');
    expect(countryNames).toContain('Republic of Indonesia');
  });

  it('contains PUMUN RoP motions and quick phrases with Indonesian phonetics', () => {
    expect(ropRules.motions.length).toBeGreaterThan(0);
    expect(quickPhrases.length).toBeGreaterThan(0);
    const rollCall = quickPhrases.find(p => p.id === 'roll-call');
    expect(rollCall).toBeDefined();
    expect(rollCall?.caraBaca).toBeDefined();
  });

  it('defines UNICEF mandate boundaries', () => {
    expect(unicefMandate.mayDo.length).toBeGreaterThan(0);
    expect(unicefMandate.mayNotDo.length).toBeGreaterThan(0);
  });

  it('loads 8 debate subtopics, keywords, and crisis scenarios', () => {
    expect(DEBATE_SUBTOPICS.length).toBe(8);
    DEBATE_SUBTOPICS.forEach((sub) => {
      expect(sub.motionText).toBeDefined();
      expect(sub.motionCaraBaca).toBeDefined();
      expect(sub.readySpeech.english).toBeDefined();
      expect(sub.readySpeech.caraBaca).toBeDefined();
    });

    expect(KEYWORD_ITEMS.length).toBeGreaterThanOrEqual(10);
    expect(CRISIS_SCENARIOS.length).toBeGreaterThanOrEqual(4);
  });
});
