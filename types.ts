export interface VocabWord {
  word: string;
  pronunciation: string;
  meaning: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export interface QuizResult {
  total: number;
  correct: number;
  incorrect: number;
  history: {
    word: string;
    isCorrect: boolean;
  }[];
}

export enum AppMode {
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  STATS = 'STATS'
}

export const TOPICS = [
  "School Life (학교 생활)",
  "Family & Friends (가족과 친구)",
  "Hobbies (취미)",
  "Food & Cooking (음식)",
  "Travel & Places (여행)",
  "Daily Routine (일상)",
  "Emotions (감정)",
  "Animals (동물)",
  "Weather (날씨)",
  "Jobs (직업)"
];