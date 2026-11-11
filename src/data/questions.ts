import { QUESTIONS_PART_1 } from "./questionsPart1";
import { QUESTIONS_PART_2 } from "./questionsPart2";
import type { ModeDefinition, Question } from "../types/quiz";

export const DEFAULT_QUESTIONS: Question[] = [
  ...QUESTIONS_PART_1,
  ...QUESTIONS_PART_2,
];

export const QUIZ_MODES: ModeDefinition[] = [
  {
    count: 20,
    id: "mode-20",
    title: "Quick Test",
    subtitle: "Perfect for a quick exam simulation.",
    buttonLabel: "Start 20 Questions",
    defaultMinutes: 20,
    features: [
      "20 randomly selected unique questions",
      "Optional 20-minute timer",
      "Randomized order & instant analytics",
    ],
  },
  {
    count: 50,
    id: "mode-50",
    title: "Practice Test",
    subtitle: "Strengthen your SwiftUI concepts.",
    buttonLabel: "Start 50 Questions",
    defaultMinutes: 50,
    features: [
      "50 randomly selected unique questions",
      "Broad coverage across all 11 topics",
      "Detailed explanations, bookmarks & resume",
    ],
  },
  {
    count: 100,
    id: "mode-100",
    title: "Intensive Test",
    subtitle: "Push your knowledge further.",
    buttonLabel: "Start 100 Questions",
    defaultMinutes: 100,
    features: [
      "100 randomly selected unique questions",
      "Comprehensive multi-topic revision",
      "Auto-save & incorrect-answer tracking",
    ],
  },
  {
    count: 200,
    id: "mode-200",
    title: "Complete Mastery",
    subtitle: "Conquer the entire question bank.",
    buttonLabel: "Start All 200 Questions",
    defaultMinutes: 200,
    features: [
      "All 200 questions, each exactly once",
      "Complete syllabus revision",
      "Resume across sessions & full analysis",
    ],
  },
];

export function getUniqueTopics(questions: Question[]): string[] {
  const seen = new Set<string>();
  const topics: string[] = [];
  for (const q of questions) {
    if (q.topic && !seen.has(q.topic)) {
      seen.add(q.topic);
      topics.push(q.topic);
    }
  }
  return topics;
}

export function buildQuestionMap(questions: Question[]): Map<string, Question> {
  return new Map(questions.map((q) => [q.id, q]));
}

