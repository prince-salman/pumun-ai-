import { describe, it, expect, vi } from 'vitest';
import { parseTriLayerResponse, generateDiplomaticSpeech } from './aiService';

describe('aiService parser and generator (TypeScript)', () => {
  const sampleRawResponse = `
### 1. English Speech (Official Diplomatic Text)
Honorable Chair, distinguished delegates,
The Republic of Kenya firmly believes that every child survivor deserves unhindered access to quality education. We call upon all nations to eliminate bureaucratic barriers. Kenya yields its time to the Dais.

### 2. Cara Baca (Panduan Lafal Suku Kata Indonesia)
O-no-re-bel Cyer, dis-ting-guis-yed de-le-geits,
De Re-pab-lik of Ken-ya ferm-li bi-livs det ev-ri caild ser-vai-vor di-serfs an-hin-derd ek-ses tu kwa-li-ti e-dyu-kei-syon. Wi kol a-pon ol nei-syens tu i-li-mi-neit byu-ro-kre-tik be-ri-ers. Ken-ya yilds its taim tu de Dais.

### 3. Makna Bahasa Indonesia (Terjemahan & Penjelasan)
Ketua yang terhormat dan delegasi yang mulia,
Republik Kenya sangat meyakini bahwa setiap anak korban berhak mendapatkan akses tak terbatas ke pendidikan berkualitas. Kami menyerukan semua negara menghapus hambatan birokrasi kependudukan. Kenya mengembalikan sisa waktu ke pimpinan sidang.
`;

  it('correctly parses 3-layer response into structured fields', () => {
    const parsed = parseTriLayerResponse(sampleRawResponse);
    expect(parsed.english).toContain('Honorable Chair');
    expect(parsed.caraBaca).toContain('O-no-re-bel Cyer');
    expect(parsed.indoMeaning).toContain('Ketua yang terhormat');
    expect(parsed.wordCount).toBeGreaterThan(20);
    expect(parsed.estimatedSeconds).toBeGreaterThan(10);
  });

  it('falls back to pre-compiled speech when API request fails or is offline', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));
    const result = await generateDiplomaticSpeech({
      indonesianIdea: 'Butuh dana untuk sekolah korban trafficking',
      mode: 'GSL',
      durationSeconds: 90,
      subtopic: 'Education Funding',
      model: 'nemotron-3-ultra',
      apiKey: 'test-key',
      baseUrl: 'https://api.gutsai.id/v1'
    });

    expect(result).toBeDefined();
    expect(result.english.length).toBeGreaterThan(50);
    expect(result.caraBaca.length).toBeGreaterThan(50);
    expect(result.isFallback).toBe(true);
  });
});
