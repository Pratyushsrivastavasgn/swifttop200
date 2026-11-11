import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { buildQuestionMap, DEFAULT_QUESTIONS } from "../data/questions";
import type {
  OptionKey,
  PersistedState,
  Question,
  QuizMode,
  QuizSession,
  SessionSource,
  ValidationReport,
} from "../types/quiz";
import {
  clearPersistedState,
  loadPersistedState,
  savePersistedState,
} from "../utils/persistence";
import { buildOptionOrders, selectQuestionsForQuiz } from "../utils/questionSelection";
import { parseImportedQuestionBank, validateQuestionBank } from "../utils/questionValidation";
import { computeAnalytics, type AnalyticsOverview } from "../utils/scoring";

export interface StartSessionParams {
  count: number;
  mode: QuizMode;
  source: SessionSource;
  title?: string;
  timerMinutes?: number | null;
  shuffleAllQuestions?: boolean;
  shuffleOptions?: boolean;
  explicitQuestionIds?: string[];
}

interface ProgressContextValue {
  bank: Question[];
  bankName: string;
  isCustomBank: boolean;
  questionMap: Map<string, Question>;
  validationReport: ValidationReport;
  state: PersistedState;
  activeSession: QuizSession | null;
  allSessions: QuizSession[];
  analytics: AnalyticsOverview;
  createSession: (params: StartSessionParams) => string;
  selectAnswer: (sessionId: string, questionId: string, option: OptionKey) => void;
  clearAnswer: (sessionId: string, questionId: string) => void;
  setCurrentIndex: (sessionId: string, index: number) => void;
  toggleBookmark: (questionId: string, sessionId?: string) => void;
  submitSession: (sessionId: string) => void;
  discardSession: (sessionId: string) => void;
  clearMissedQuestion: (questionId: string) => void;
  importCustomBank: (rawText: string, fileName: string) => { ok: boolean; count: number; warnings: string[]; error?: string };
  restoreDefaultBank: () => void;
  resetAllProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadPersistedState());

  useEffect(() => {
    savePersistedState(state);
  }, [state]);

  const bank = useMemo<Question[]>(() => {
    if (state.customBank && state.customBank.length > 0) {
      return state.customBank;
    }
    return DEFAULT_QUESTIONS;
  }, [state.customBank]);

  const isCustomBank = Boolean(state.customBank && state.customBank.length > 0);
  const bankName = state.customBankName ?? "SwiftUI & Swift Concurrency (PDF)";

  const questionMap = useMemo(() => buildQuestionMap(bank), [bank]);
  const validationReport = useMemo(() => validateQuestionBank(bank), [bank]);

  const activeSession = useMemo(() => {
    if (!state.activeSessionId) return null;
    const s = state.sessions[state.activeSessionId];
    return s && !s.submitted ? s : null;
  }, [state.activeSessionId, state.sessions]);

  const allSessions = useMemo(
    () => Object.values(state.sessions),
    [state.sessions]
  );

  const analytics = useMemo(
    () => computeAnalytics(allSessions, questionMap, state.incorrectHistory),
    [allSessions, questionMap, state.incorrectHistory]
  );

  const createSession = useCallback(
    (params: StartSessionParams): string => {
      let chosenQuestions: Question[];

      if (params.explicitQuestionIds && params.explicitQuestionIds.length > 0) {
        const mapped = params.explicitQuestionIds
          .map((id) => questionMap.get(id))
          .filter((q): q is Question => Boolean(q));
        chosenQuestions = params.shuffleAllQuestions
          ? selectQuestionsForQuiz(mapped, mapped.length, { shuffleAll: true })
          : mapped;
      } else {
        chosenQuestions = selectQuestionsForQuiz(bank, params.count, {
          shuffleAll: params.shuffleAllQuestions,
        });
      }

      const sessionId = generateSessionId();
      const now = Date.now();
      const deadlineAt =
        params.timerMinutes && params.timerMinutes > 0
          ? now + params.timerMinutes * 60 * 1000
          : undefined;

      const optionOrders = buildOptionOrders(
        chosenQuestions,
        Boolean(params.shuffleOptions)
      );

      const newSession: QuizSession = {
        sessionId,
        title: params.title,
        source: params.source,
        questionCount: chosenQuestions.length,
        questionIds: chosenQuestions.map((q) => q.id),
        currentIndex: 0,
        mode: params.mode,
        selectedAnswers: {},
        bookmarkedIds: state.bookmarks.filter((id) =>
          chosenQuestions.some((q) => q.id === id)
        ),
        optionOrders,
        startedAt: now,
        deadlineAt,
        submitted: false,
      };

      setState((prev) => ({
        ...prev,
        activeSessionId: sessionId,
        sessions: {
          ...prev.sessions,
          [sessionId]: newSession,
        },
      }));

      return sessionId;
    },
    [bank, questionMap, state.bookmarks]
  );

  const selectAnswer = useCallback(
    (sessionId: string, questionId: string, option: OptionKey) => {
      setState((prev) => {
        const session = prev.sessions[sessionId];
        if (!session || session.submitted) return prev;
        if (session.mode === "practice" && session.selectedAnswers[questionId]) {
          // Locked in Practice Mode once selected
          return prev;
        }

        const q = questionMap.get(questionId);
        let nextIncorrect = prev.incorrectHistory;

        if (session.mode === "practice" && q) {
          if (option !== q.correctAnswer) {
            const existing = prev.incorrectHistory[questionId];
            nextIncorrect = {
              ...prev.incorrectHistory,
              [questionId]: {
                questionId,
                missCount: (existing?.missCount ?? 0) + 1,
                lastMissedAt: Date.now(),
                lastSelectedAnswer: option,
              },
            };
          } else if (
            (session.source === "incorrect" || session.source === "retry") &&
            prev.incorrectHistory[questionId]
          ) {
            const copy = { ...prev.incorrectHistory };
            delete copy[questionId];
            nextIncorrect = copy;
          }
        }

        return {
          ...prev,
          incorrectHistory: nextIncorrect,
          sessions: {
            ...prev.sessions,
            [sessionId]: {
              ...session,
              selectedAnswers: {
                ...session.selectedAnswers,
                [questionId]: option,
              },
            },
          },
        };
      });
    },
    [questionMap]
  );

  const clearAnswer = useCallback((sessionId: string, questionId: string) => {
    setState((prev) => {
      const session = prev.sessions[sessionId];
      if (!session || session.submitted || session.mode === "practice") {
        return prev;
      }
      const copy = { ...session.selectedAnswers };
      delete copy[questionId];
      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          [sessionId]: {
            ...session,
            selectedAnswers: copy,
          },
        },
      };
    });
  }, []);

  const setCurrentIndex = useCallback((sessionId: string, index: number) => {
    setState((prev) => {
      const session = prev.sessions[sessionId];
      if (!session) return prev;
      const bounded = Math.max(0, Math.min(index, session.questionIds.length - 1));
      if (bounded === session.currentIndex) return prev;
      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          [sessionId]: {
            ...session,
            currentIndex: bounded,
          },
        },
      };
    });
  }, []);

  const toggleBookmark = useCallback((questionId: string, sessionId?: string) => {
    setState((prev) => {
      const exists = prev.bookmarks.includes(questionId);
      const nextBookmarks = exists
        ? prev.bookmarks.filter((id) => id !== questionId)
        : [...prev.bookmarks, questionId];

      let nextSessions = prev.sessions;
      if (sessionId && prev.sessions[sessionId]) {
        const s = prev.sessions[sessionId];
        const sHas = s.bookmarkedIds.includes(questionId);
        const nextSessionBookmarks = exists
          ? s.bookmarkedIds.filter((id) => id !== questionId)
          : sHas
            ? s.bookmarkedIds
            : [...s.bookmarkedIds, questionId];
        nextSessions = {
          ...prev.sessions,
          [sessionId]: {
            ...s,
            bookmarkedIds: nextSessionBookmarks,
          },
        };
      }

      return {
        ...prev,
        bookmarks: nextBookmarks,
        sessions: nextSessions,
      };
    });
  }, []);

  const submitSession = useCallback(
    (sessionId: string) => {
      setState((prev) => {
        const session = prev.sessions[sessionId];
        if (!session || session.submitted) return prev;

        const now = Date.now();
        const nextIncorrect = { ...prev.incorrectHistory };

        // In Exam Mode (or for unanswered questions), record missed questions on submit
        for (const qId of session.questionIds) {
          const q = questionMap.get(qId);
          if (!q) continue;
          const chosen = session.selectedAnswers[qId] as OptionKey | undefined;
          if (session.mode === "exam") {
            if (!chosen || chosen !== q.correctAnswer) {
              const existing = nextIncorrect[qId];
              nextIncorrect[qId] = {
                questionId: qId,
                missCount: (existing?.missCount ?? 0) + 1,
                lastMissedAt: now,
                lastSelectedAnswer: chosen,
              };
            } else if (
              (session.source === "incorrect" || session.source === "retry") &&
              nextIncorrect[qId]
            ) {
              delete nextIncorrect[qId];
            }
          } else {
            // Practice mode: unanswered questions on finish also get flagged if skipped
            if (!chosen) {
              const existing = nextIncorrect[qId];
              nextIncorrect[qId] = {
                questionId: qId,
                missCount: (existing?.missCount ?? 0) + 1,
                lastMissedAt: now,
              };
            }
          }
        }

        return {
          ...prev,
          activeSessionId:
            prev.activeSessionId === sessionId ? null : prev.activeSessionId,
          incorrectHistory: nextIncorrect,
          sessions: {
            ...prev.sessions,
            [sessionId]: {
              ...session,
              completedAt: now,
              submitted: true,
            },
          },
        };
      });
    },
    [questionMap]
  );

  const discardSession = useCallback((sessionId: string) => {
    setState((prev) => {
      const nextSessions = { ...prev.sessions };
      delete nextSessions[sessionId];
      return {
        ...prev,
        activeSessionId:
          prev.activeSessionId === sessionId ? null : prev.activeSessionId,
        sessions: nextSessions,
      };
    });
  }, []);

  const clearMissedQuestion = useCallback((questionId: string) => {
    setState((prev) => {
      const next = { ...prev.incorrectHistory };
      delete next[questionId];
      return {
        ...prev,
        incorrectHistory: next,
      };
    });
  }, []);

  const importCustomBank = useCallback((rawText: string, fileName: string) => {
    try {
      const { questions, report, warnings } = parseImportedQuestionBank(
        rawText,
        fileName
      );
      if (questions.length === 0) {
        return {
          ok: false,
          count: 0,
          warnings,
          error: "Could not find valid MCQ entries in that file.",
        };
      }
      if (!report.valid) {
        return {
          ok: false,
          count: questions.length,
          warnings,
          error: report.issues.map((i) => i.message).slice(0, 3).join(" "),
        };
      }
      setState((prev) => ({
        ...prev,
        activeSessionId: null,
        customBank: questions,
        customBankName: fileName,
      }));
      return { ok: true, count: questions.length, warnings };
    } catch (err) {
      return {
        ok: false,
        count: 0,
        warnings: [],
        error: err instanceof Error ? err.message : "Failed to parse file.",
      };
    }
  }, []);

  const restoreDefaultBank = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeSessionId: null,
      customBank: null,
      customBankName: null,
    }));
  }, []);

  const resetAllProgress = useCallback(() => {
    const empty = clearPersistedState();
    setState(empty);
  }, []);

  const value: ProgressContextValue = {
    bank,
    bankName,
    isCustomBank,
    questionMap,
    validationReport,
    state,
    activeSession,
    allSessions,
    analytics,
    createSession,
    selectAnswer,
    clearAnswer,
    setCurrentIndex,
    toggleBookmark,
    submitSession,
    discardSession,
    clearMissedQuestion,
    importCustomBank,
    restoreDefaultBank,
    resetAllProgress,
  };

  return React.createElement(ProgressContext.Provider, { value }, children);
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return ctx;
}

