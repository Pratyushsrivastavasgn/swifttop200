export type OptionKey = "A" | "B" | "C" | "D";
export type Difficulty = "easy" | "medium" | "hard";
export type QuizMode = "practice" | "exam";

export interface Question {
  id: string;
  originalNumber: number;
  topic?: string;
  difficulty?: Difficulty;
  question: string;
  code?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: OptionKey;
  explanation?: string;
  optionExplanations?: {
    A?: string;
    B?: string;
    C?: string;
    D?: string;
  };
  examTip?: string;
  needsReview?: boolean;
  reviewNote?: string;
}

export type SessionSource =
  | "mode-20"
  | "mode-50"
  | "mode-100"
  | "mode-200"
  | "bookmarks"
  | "incorrect"
  | "retry";

export interface QuizSession {
  sessionId: string;
  title?: string;
  source?: SessionSource;
  questionCount: number;
  questionIds: string[];
  currentIndex: number;
  mode: QuizMode;
  selectedAnswers: Record<string, string>;
  bookmarkedIds: string[];
  optionOrders?: Record<string, OptionKey[]>;
  startedAt: number;
  deadlineAt?: number;
  completedAt?: number;
  submitted: boolean;
}

export interface IncorrectRecord {
  questionId: string;
  missCount: number;
  lastMissedAt: number;
  lastSelectedAnswer?: OptionKey;
}

export interface PersistedState {
  version: number;
  activeSessionId: string | null;
  sessions: Record<string, QuizSession>;
  bookmarks: string[];
  incorrectHistory: Record<string, IncorrectRecord>;
  customBank: Question[] | null;
  customBankName: string | null;
}

export interface ModeDefinition {
  count: 20 | 50 | 100 | 200;
  id: SessionSource;
  title: string;
  subtitle: string;
  buttonLabel: string;
  features: string[];
  defaultMinutes: number;
}

export interface ValidationIssue {
  type: "duplicate-id" | "duplicate-number" | "invalid-answer" | "malformed-options" | "missing-question" | "needs-review";
  questionId?: string;
  originalNumber?: number;
  message: string;
}

export interface ValidationReport {
  valid: boolean;
  totalQuestions: number;
  topicCounts: Record<string, number>;
  flaggedForReview: number;
  issues: ValidationIssue[];
}

