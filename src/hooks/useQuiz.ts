import { useCallback, useEffect, useMemo } from "react";
import type { OptionKey, Question, QuizSession } from "../types/quiz";
import { useProgress } from "./useProgress";

const SLOT_KEYS: OptionKey[] = ["A", "B", "C", "D"];

interface UseQuizOptions {
  sessionId: string;
  navigatorOpen: boolean;
  onCloseModals: () => void;
}

export function useQuiz({ sessionId, navigatorOpen, onCloseModals }: UseQuizOptions) {
  const {
    state,
    questionMap,
    selectAnswer,
    clearAnswer,
    setCurrentIndex,
    toggleBookmark,
    submitSession,
  } = useProgress();

  const session: QuizSession | undefined = state.sessions[sessionId];

  const questions = useMemo<Question[]>(() => {
    if (!session) return [];
    return session.questionIds
      .map((id) => questionMap.get(id))
      .filter((q): q is Question => Boolean(q));
  }, [session, questionMap]);

  const currentIndex = session ? Math.min(session.currentIndex, Math.max(0, questions.length - 1)) : 0;
  const currentQuestion = questions[currentIndex];

  const optionOrder: OptionKey[] = useMemo(() => {
    if (!currentQuestion) return SLOT_KEYS;
    return session?.optionOrders?.[currentQuestion.id] ?? SLOT_KEYS;
  }, [currentQuestion, session?.optionOrders]);

  const selectedOriginalKey = currentQuestion
    ? (session?.selectedAnswers[currentQuestion.id] as OptionKey | undefined)
    : undefined;

  const isLocked = Boolean(
    session &&
      (session.submitted ||
        (session.mode === "practice" && Boolean(selectedOriginalKey)))
  );

  const isBookmarked = currentQuestion
    ? state.bookmarks.includes(currentQuestion.id)
    : false;

  const answeredCount = useMemo(() => {
    if (!session) return 0;
    return session.questionIds.filter((id) => Boolean(session.selectedAnswers[id])).length;
  }, [session]);

  const handleSelectOption = useCallback(
    (originalKey: OptionKey) => {
      if (!session || !currentQuestion) return;
      selectAnswer(session.sessionId, currentQuestion.id, originalKey);
    },
    [session, currentQuestion, selectAnswer]
  );

  const handleClearOption = useCallback(() => {
    if (!session || !currentQuestion) return;
    clearAnswer(session.sessionId, currentQuestion.id);
  }, [session, currentQuestion, clearAnswer]);

  const goTo = useCallback(
    (idx: number) => {
      if (!session) return;
      setCurrentIndex(session.sessionId, idx);
    },
    [session, setCurrentIndex]
  );

  const goNext = useCallback(() => {
    if (!session) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(session.sessionId, currentIndex + 1);
    }
  }, [session, currentIndex, questions.length, setCurrentIndex]);

  const goPrev = useCallback(() => {
    if (!session) return;
    if (currentIndex > 0) {
      setCurrentIndex(session.sessionId, currentIndex - 1);
    }
  }, [session, currentIndex, setCurrentIndex]);

  const handleToggleBookmark = useCallback(() => {
    if (!currentQuestion || !session) return;
    toggleBookmark(currentQuestion.id, session.sessionId);
  }, [currentQuestion, session, toggleBookmark]);

  const handleSubmit = useCallback(() => {
    if (!session) return;
    submitSession(session.sessionId);
  }, [session, submitSession]);

  // Keyboard shortcuts: 1-4, ArrowRight, ArrowLeft, B, Esc
  useEffect(() => {
    if (!session || !currentQuestion) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Escape") {
        onCloseModals();
        return;
      }

      if (navigatorOpen) return;

      if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4") {
        if (!isLocked) {
          const slotIdx = Number(e.key) - 1;
          const originalKey = optionOrder[slotIdx];
          if (originalKey) {
            e.preventDefault();
            handleSelectOption(originalKey);
          }
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        handleToggleBookmark();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    session,
    currentQuestion,
    navigatorOpen,
    isLocked,
    optionOrder,
    handleSelectOption,
    goNext,
    goPrev,
    handleToggleBookmark,
    onCloseModals,
  ]);

  return {
    session,
    questions,
    currentQuestion,
    currentIndex,
    optionOrder,
    selectedOriginalKey,
    isLocked,
    isBookmarked,
    answeredCount,
    bookmarks: state.bookmarks,
    selectOption: handleSelectOption,
    clearOption: handleClearOption,
    goTo,
    goNext,
    goPrev,
    toggleBookmark: handleToggleBookmark,
    submitQuiz: handleSubmit,
  };
}

