import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseTriLayerResponse, generateDiplomaticSpeech } from './aiService.js';

describe('aiService parser and generator', () => {
  const sampleRawResponse = `
### 1. English Speech (Official Diplomatic Text)
Honorable Chair, distinguished delegates,
The Republic of Kenya firmly believes that every child survivor deserves unhindered access to quality education. We call upon all nations to eliminate bureaucratic barriers. Kenya yields its time to the Dais.

### 2. Cara Baca (Panduan Lafal Fonetik Indonesia)
Onorebel Cyeer, distingsy-d deligets,
Di Repablik of Kenya fermli bilivs det efri caild servaivor diserfs anhinderd ekses tu kualiti edyukeisyen. Wi kol apon ol neisyens tu ilimineit byurokretik beriyers. Kenya yilds its taim tu di Dais.

### 3. Makna Bahasa Indonesia (Terjemahan & Penjelasan)
Ketua yang terhormat dan delegasi yang mulia,
Republik Kenya sangat meyakini bahwa setiap anak korban berhak mendapatkan akses tak terbatas ke pendidikan berkualitas. Kami menyerukan semua negara menghapus hambatan birokrasi kependudukan. Kenya mengembalikan sisa waktu ke pimpinan sidang.
`;

  it('correctly parses 3-layer response into structured fields', () => {
    const parsed = parseTriLayerResponse(sampleRawResponse);
    expect(parsed.english).toContain('Honorable Chair');
    expect(parsed.caraBaca).toContain('Onorebel Cyeer');
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
