export type FlowLevel = "spotting" | "light" | "medium" | "heavy";

export type Mood =
  | "happy"
  | "calm"
  | "sad"
  | "anxious"
  | "irritable"
  | "energetic"
  | "tired";

export type Symptom =
  | "cramps"
  | "headache"
  | "bloating"
  | "backache"
  | "acne"
  | "tender_breasts"
  | "nausea"
  | "fatigue"
  | "insomnia"
  | "cravings";

export interface DayLog {
  date: string; // yyyy-MM-dd
  isPeriodDay: boolean;
  flow?: FlowLevel;
  moods: Mood[];
  symptoms: Symptom[];
  notes?: string;
}

export type TrackingMode = "cycle" | "pregnancy";

export interface PartnerSharing {
  enabled: boolean;
  shareCode: string;
}

export interface Settings {
  lastPeriodStart: string; // yyyy-MM-dd; also doubles as LMP when trackingMode is "pregnancy"
  averageCycleLength: number; // days
  averagePeriodLength: number; // days
  onboardingComplete: boolean;
  trackingMode?: TrackingMode; // defaults to "cycle" when absent (pre-existing saved data)
  partnerSharing?: PartnerSharing; // absent/disabled means nothing is broadcast
}

export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal";

export interface AppData {
  settings: Settings | null;
  logs: Record<string, DayLog>; // keyed by yyyy-MM-dd
}

export const SYMPTOM_LABELS: Record<Symptom, string> = {
  cramps: "Cramps",
  headache: "Headache",
  bloating: "Bloating",
  backache: "Backache",
  acne: "Acne",
  tender_breasts: "Tender breasts",
  nausea: "Nausea",
  fatigue: "Fatigue",
  insomnia: "Insomnia",
  cravings: "Cravings",
};

export const MOOD_LABELS: Record<Mood, string> = {
  happy: "Happy",
  calm: "Calm",
  sad: "Sad",
  anxious: "Anxious",
  irritable: "Irritable",
  energetic: "Energetic",
  tired: "Tired",
};

export const MOOD_EMOJI: Record<Mood, string> = {
  happy: "😊",
  calm: "😌",
  sad: "😢",
  anxious: "😰",
  irritable: "😠",
  energetic: "⚡",
  tired: "😴",
};

export const FLOW_LABELS: Record<FlowLevel, string> = {
  spotting: "Spotting",
  light: "Light",
  medium: "Medium",
  heavy: "Heavy",
};
