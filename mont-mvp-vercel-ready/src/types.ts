export interface Scene {
  id: number;
  title: string;
  description: string;
  duration: string;
  purpose: string;
  framing: string;
  guide: string;
  script: string;
  moodImage?: string;
  moodImagePrompt?: string;
  moodImagePromptUsed?: string;
  translatedEnglishPrompt?: string;
  promptUsedForImage?: string;
  cameraRef?: string;
  compositionRef?: string;
  lightingRef?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  goals: string;
  target: string;
  duration: string;
  style: string;
  idea: string;
  scenes: Scene[];
  lastEdited: string;
  thumbnail: string;
  referenceImage?: string;
  referenceAnalysis?: {
    mood: string;
    lighting: string;
    composition: string;
    cameraAngle: string;
    colorTone: string;
    cinematographicSummary: string;
  };
}

export interface Template {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  thumbnail: string;
  sceneCount: number;
  difficulty: "쉬움" | "보통" | "어려움" | "Easy" | "Medium" | "Hard";
  duration: string;
  description: string;
  descriptionEn: string;
  scenes: Scene[];
  scenesEn: Scene[];
}
