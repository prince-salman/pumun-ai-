export interface KenyaLaw {
  name: string;
  code: string;
  summary: string;
  citation: string;
}

export interface NationalInitiative {
  title: string;
  description: string;
}

export interface NationalPillar {
  number: number;
  title: string;
  description: string;
  keyPhrase: string;
}

export interface KenyaProfile {
  countryName: string;
  officialName: string;
  capital: string;
  region: string;
  committee: string;
  delegateName: string;
  role: string;
  flagEmoji: string;
  agenda: string;
  laws: KenyaLaw[];
  nationalInitiatives: NationalInitiative[];
  pillars: NationalPillar[];
  openingHookQuote: string;
  openingHookIndo: string;
}

export interface CountryDossier {
  id: string;
  name: string;
  flag: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  bloc: string;
  delegates: string[];
  stance: string;
  relationWithKenya: string;
  approachStrategy: string;
}

export interface RopRule {
  title: string;
  detail: string;
  recommendationForKenya?: string;
  durationDefault?: string;
  exampleMotion?: string;
}

export interface RopPoint {
  name: string;
  indoName: string;
  description: string;
  canInterruptSpeaker: boolean;
  officialPhrase: string;
  caraBaca: string;
}

export interface RopMotion {
  name: string;
  indoName: string;
  template: string;
  caraBaca: string;
}

export interface QuickPhrase {
  id: string;
  category: 'Roll Call' | 'Motions' | 'Points' | 'Yielding' | 'Diplomatic Phrases';
  title: string;
  trigger: string;
  english: string;
  caraBaca: string;
  indoMeaning: string;
}

export interface UnicefMandateAction {
  action: string;
  detail?: string;
  reason?: string;
}

export interface UnicefMandate {
  committeeName: string;
  description: string;
  mayDo: UnicefMandateAction[];
  mayNotDo: UnicefMandateAction[];
  validateClause: (clauseText: string) => { isValid: boolean; violations: string[] };
}

export interface SpeechMode {
  id: string;
  label: string;
  duration: number;
  desc: string;
}

export interface SpeechData {
  english: string;
  caraBaca: string;
  indoMeaning: string;
  wordCount?: number;
  estimatedSeconds?: number;
  isFallback?: boolean;
  modelUsed?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  speed: string;
  intelligence: string;
}

export interface SettingsState {
  apiKey: string;
  baseUrl: string;
  selectedModel: string;
  speechRate: number;
  delegateName: string;
  partnerName: string;
  isSolo: boolean;
  theme: 'dark' | 'light';
}
