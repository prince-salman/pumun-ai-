class SpeechSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    
    if (this.isSupported) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Prefer English voices (natural or standard)
    this.selectedVoice = 
      this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) ||
      this.voices.find(v => v.lang.startsWith('en')) ||
      this.voices[0] || null;
  }

  speak(text, { rate = 0.95, pitch = 1.0, onStart, onEnd, onError } = {}) {
    if (!this.isSupported || !this.synth) {
      if (onError) onError(new Error('Speech synthesis not supported in this browser.'));
      return;
    }

    this.stop(); // Stop any currently playing audio

    // Clean markdown symbols from spoken text
    const cleanText = text
      .replace(/[#*_\-\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechService = new SpeechSynthesisService();
