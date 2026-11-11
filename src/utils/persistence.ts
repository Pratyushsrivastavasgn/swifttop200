import type { IncorrectRecord, PersistedState, Question, QuizSession } from "../types/quiz";

const STORAGE_KEY = "swiftiq_platform_state_v1";
const CURRENT_VERSION = 1;

export function createInitialPersistedState(): PersistedState {
  return {
    version: CURRENT_VERSION,
    activeSessionId: null,
    sessions: {},
    bookmarks: [],
    incorrectHistory: {},
    customBank: null,
    customBankName: null,
  };
}

function isValidSession(obj: unknown): obj is QuizSession {
  if (!obj || typeof obj !== "object") return false;
  const s = obj as Record<string, unknown>;
  return (
    typeof s.sessionId === "string" &&
    typeof s.questionCount === "number" &&
    Array.isArray(s.questionIds) &&
    typeof s.currentIndex === "number" &&
    (s.mode === "practice" || s.mode === "exam") &&
    typeof s.selectedAnswers === "object" &&
    s.selectedAnswers !== null &&
    Array.isArray(s.bookmarkedIds) &&
    typeof s.startedAt === "number" &&
    typeof s.submitted === "boolean"
  );
}

export function loadPersistedState(): PersistedState {
  const fallback = createInitialPersistedState();
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return fallback;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return fallback;

    const sessions: Record<string, QuizSession> = {};
    if (parsed.sessions && typeof parsed.sessions === "object") {
      for (const [id, val] of Object.entries(parsed.sessions as Record<string, unknown>)) {
        if (isValidSession(val)) {
          sessions[id] = val;
        }
      }
    }

    const bookmarks = Array.isArray(parsed.bookmarks)
      ? parsed.bookmarks.filter((item): item is string => typeof item === "string")
      : [];

    const incorrectHistory: Record<string, IncorrectRecord> = {};
    if (parsed.incorrectHistory && typeof parsed.incorrectHistory === "object") {
      for (const [qId, rec] of Object.entries(parsed.incorrectHistory as Record<string, unknown>)) {
        if (
          rec &&
          typeof rec === "object" &&
          typeof (rec as IncorrectRecord).missCount === "number" &&
          typeof (rec as IncorrectRecord).lastMissedAt === "number"
        ) {
          incorrectHistory[qId] = rec as IncorrectRecord;
        }
      }
    }

    const activeSessionId =
      typeof parsed.activeSessionId === "string" && sessions[parsed.activeSessionId]
        ? parsed.activeSessionId
        : null;

    const customBank = Array.isArray(parsed.customBank)
      ? (parsed.customBank as Question[])
      : null;

    const customBankName =
      typeof parsed.customBankName === "string" ? parsed.customBankName : null;

    return {
      version: CURRENT_VERSION,
      activeSessionId,
      sessions,
      bookmarks: Array.from(new Set(bookmarks)),
      incorrectHistory,
      customBank,
      customBankName,
    };
  } catch {
    // Recover safely from malformed stored JSON
    return fallback;
  }
}

export function savePersistedState(state: PersistedState): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota / privacy mode errors gracefully
  }
}

export function clearPersistedState(): PersistedState {
  const empty = createInitialPersistedState();
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
  return empty;
}

