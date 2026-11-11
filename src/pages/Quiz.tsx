import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Grid,
  LogOut,
  Send,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnswerOption, type AnswerVisualState } from "../components/AnswerOption";
import { ConfirmModal } from "../components/ConfirmModal";
import { ExplanationPanel } from "../components/ExplanationPanel";
import { ProgressBar } from "../components/ProgressBar";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigator } from "../components/QuestionNavigator";
import { QuizTimer } from "../components/QuizTimer";
import { SwiftLogo } from "../components/SwiftLogo";
import { useProgress } from "../hooks/useProgress";
import { useQuiz } from "../hooks/useQuiz";
import { useTimer } from "../hooks/useTimer";
import type { OptionKey } from "../types/quiz";

const SLOT_LABELS: OptionKey[] = ["A", "B", "C", "D"];

export function Quiz() {
  const { sessionId = "" } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { discardSession } = useProgress();

  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const closeAllModals = useCallback(() => {
    setNavigatorOpen(false);
    setExitModalOpen(false);
    setSubmitModalOpen(false);
  }, []);

  const {
    session,
    questions,
    currentQuestion,
    currentIndex,
    optionOrder,
    selectedOriginalKey,
    isLocked,
    isBookmarked,
    answeredCount,
    bookmarks,
    selectOption,
    clearOption,
    goTo,
    goNext,
    goPrev,
    toggleBookmark,
    submitQuiz,
  } = useQuiz({
    sessionId,
    navigatorOpen,
    onCloseModals: closeAllModals,
  });

  // Redirect to results if session is already submitted
  useEffect(() => {
    if (session?.submitted) {
      navigate(`/results/${session.sessionId}`, { replace: true });
    }
  }, [session?.submitted, session?.sessionId, navigate]);

  const handleTimerExpire = useCallback(() => {
    submitQuiz();
  }, [submitQuiz]);

  const totalTimerDurationMs =
    session?.deadlineAt && session?.startedAt
      ? Math.max(0, session.deadlineAt - session.startedAt)
      : undefined;

  const timer = useTimer({
    deadlineAt: session?.deadlineAt,
    totalDurationMs: totalTimerDurationMs,
    paused: !session || session.submitted,
    onExpire: handleTimerExpire,
  });

  if (!session || !currentQuestion) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-8 shadow-apple">
          <h1 className="text-xl font-semibold text-[#1D1D1F]">
            Quiz Session Not Found
          </h1>
          <p className="mt-2 text-sm text-[#86868B]">
            This session may have been discarded or cleared from local storage.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-[#F05138] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Return to Home
          </button>
        </div>
      </main>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const unansweredCount = questions.length - answeredCount;
  const showExplanation =
    session.mode === "practice" && Boolean(selectedOriginalKey);

  const getVisualState = (originalKey: OptionKey): AnswerVisualState => {
    if (session.mode === "exam" && !session.submitted) {
      return selectedOriginalKey === originalKey ? "selected" : "idle";
    }

    // Practice Mode (or submitted): reveal feedback when answered
    if (!selectedOriginalKey) return "idle";
    if (originalKey === currentQuestion.correctAnswer) return "correct";
    if (originalKey === selectedOriginalKey) return "incorrect";
    return "dimmed";
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 sm:pb-14">
      {/* Focused Quiz Header */}
      <header className="sticky top-0 z-40 border-b border-[#E8E8ED] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <SwiftLogo className="h-8 w-8" />
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-[#1D1D1F]">
                  SwiftIQ
                </span>
                <span className="rounded-full bg-[#FFF1E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#F05138]">
                  {session.mode === "exam" ? "Exam" : "Practice"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {timer.enabled && (
                <QuizTimer
                  formatted={timer.formatted}
                  isWarning={timer.isWarning}
                  isCritical={timer.isCritical}
                />
              )}

              <button
                type="button"
                onClick={() => setNavigatorOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E8ED] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7]"
                aria-label="Open question navigator"
              >
                <Grid className="h-3.5 w-3.5 text-[#F05138]" />
                <span className="hidden sm:inline">Navigator</span>
                <span className="tabular-nums text-[#86868B]">
                  {currentIndex + 1}/{questions.length}
                </span>
              </button>

              {session.mode === "exam" && (
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(true)}
                  className="hidden items-center gap-1 rounded-full bg-[#1D1D1F] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 sm:inline-flex"
                >
                  <Send className="h-3 w-3" />
                  <span>Submit</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setExitModalOpen(true)}
                aria-label="Exit quiz"
                className="inline-flex items-center gap-1 rounded-full border border-[#E8E8ED] bg-white px-2.5 py-1.5 text-xs font-medium text-[#86868B] transition-colors hover:border-[#E5484D]/30 hover:bg-[#FEF2F2] hover:text-[#E5484D]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          </div>

          <div className="mt-2.5">
            <ProgressBar
              current={currentIndex}
              total={questions.length}
              answeredCount={answeredCount}
            />
          </div>
        </div>
      </header>

      {/* Main Single-Question Stage */}
      <main className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuestionCard
              question={currentQuestion}
              displayNumber={currentIndex + 1}
              totalQuestions={questions.length}
            />

            {/* Answer Options */}
            <div
              className="mt-4 space-y-3"
              role="group"
              aria-label="Answer options"
            >
              {optionOrder.map((originalKey, slotIdx) => {
                const displayLetter = SLOT_LABELS[slotIdx];
                return (
                  <AnswerOption
                    key={`${currentQuestion.id}-${originalKey}`}
                    displayLetter={displayLetter}
                    shortcutNumber={slotIdx + 1}
                    text={currentQuestion.options[originalKey]}
                    visualState={getVisualState(originalKey)}
                    disabled={isLocked}
                    onSelect={() => selectOption(originalKey)}
                  />
                );
              })}
            </div>

            {/* Exam Mode Clear Selection Utility */}
            {session.mode === "exam" && selectedOriginalKey && (
              <div className="mt-2.5 flex justify-end">
                <button
                  type="button"
                  onClick={clearOption}
                  className="text-xs font-medium text-[#86868B] underline-offset-2 hover:text-[#1D1D1F] hover:underline"
                >
                  Clear selected answer
                </button>
              </div>
            )}

            {/* Practice Mode Immediate Explanation */}
            {showExplanation && (
              <ExplanationPanel
                question={currentQuestion}
                selectedOriginalKey={selectedOriginalKey}
                optionOrder={optionOrder}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Desktop Footer Navigation */}
        <div className="mt-7 hidden items-center justify-between gap-3 sm:flex">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#E8E8ED] bg-white px-4 py-3 text-sm font-semibold text-[#1D1D1F] shadow-sm transition-all hover:bg-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={toggleBookmark}
              aria-pressed={isBookmarked}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition-colors ${
                isBookmarked
                  ? "border-[#F05138]/40 bg-[#FFF1E8] text-[#F05138]"
                  : "border-[#E8E8ED] bg-white text-[#86868B] hover:text-[#1D1D1F]"
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-[#F05138] text-[#F05138]" : ""}`}
              />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-2.5">
            {!isLastQuestion ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#F05138] to-[#FF6B00] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105"
              >
                <span>Next Question</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#22A06B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {session.mode === "exam" ? "Submit Exam" : "Finish & View Results"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Keyboard Shortcut Hint Strip */}
        <div className="mt-6 hidden items-center justify-center gap-5 text-[11px] text-[#86868B] sm:flex">
          <span>
            <kbd className="rounded border border-[#E8E8ED] bg-white px-1.5 py-0.5 font-mono text-[#1D1D1F]">
              1–4
            </kbd>{" "}
            Select Option
          </span>
          <span>
            <kbd className="rounded border border-[#E8E8ED] bg-white px-1.5 py-0.5 font-mono text-[#1D1D1F]">
              ← / →
            </kbd>{" "}
            Navigate
          </span>
          <span>
            <kbd className="rounded border border-[#E8E8ED] bg-white px-1.5 py-0.5 font-mono text-[#1D1D1F]">
              B
            </kbd>{" "}
            Bookmark
          </span>
          <span>
            <kbd className="rounded border border-[#E8E8ED] bg-white px-1.5 py-0.5 font-mono text-[#1D1D1F]">
              Esc
            </kbd>{" "}
            Close Panels
          </span>
        </div>
      </main>

      {/* Sticky Mobile Footer Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E8E8ED] bg-white/95 px-3 py-2.5 backdrop-blur-xl sm:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous question"
            className="inline-flex items-center justify-center rounded-xl border border-[#E8E8ED] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1D1D1F] disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={toggleBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
            className={`inline-flex items-center justify-center rounded-xl border px-3.5 py-2.5 ${
              isBookmarked
                ? "border-[#F05138]/40 bg-[#FFF1E8] text-[#F05138]"
                : "border-[#E8E8ED] bg-white text-[#86868B]"
            }`}
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? "fill-[#F05138] text-[#F05138]" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setNavigatorOpen(true)}
            aria-label="Open question navigator"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8E8ED] bg-white px-3 py-2.5 text-xs font-semibold text-[#1D1D1F]"
          >
            <Grid className="h-4 w-4 text-[#F05138]" />
            <span>
              {currentIndex + 1}/{questions.length}
            </span>
          </button>

          {!isLastQuestion ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F05138] to-[#FF6B00] px-4 py-2.5 text-xs font-semibold text-white"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSubmitModalOpen(true)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#22A06B] px-4 py-2.5 text-xs font-semibold text-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{session.mode === "exam" ? "Submit" : "Finish"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Question Navigator */}
      <QuestionNavigator
        open={navigatorOpen}
        session={session}
        questions={questions}
        currentIndex={currentIndex}
        bookmarks={bookmarks}
        onSelectIndex={goTo}
        onClose={() => setNavigatorOpen(false)}
      />

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        open={submitModalOpen}
        title={session.mode === "exam" ? "Submit Exam?" : "Finish Practice Session?"}
        description={
          unansweredCount > 0
            ? `You still have ${unansweredCount} unanswered question${unansweredCount === 1 ? "" : "s"}. Submitting will finalize your score and unlock full answer review.`
            : "All questions have been answered. Ready to view your score and performance breakdown?"
        }
        confirmLabel={session.mode === "exam" ? "Submit Exam" : "View Results"}
        cancelLabel="Keep Reviewing"
        onConfirm={() => {
          setSubmitModalOpen(false);
          submitQuiz();
        }}
        onCancel={() => setSubmitModalOpen(false)}
      >
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-3 text-center">
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#86868B]">
              Answered
            </div>
            <div className="mt-0.5 text-base font-bold text-[#1D1D1F]">
              {answeredCount}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#86868B]">
              Unanswered
            </div>
            <div
              className={`mt-0.5 text-base font-bold ${
                unansweredCount > 0 ? "text-[#F05138]" : "text-[#22A06B]"
              }`}
            >
              {unansweredCount}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#86868B]">
              Bookmarked
            </div>
            <div className="mt-0.5 text-base font-bold text-[#1D1D1F]">
              {session.questionIds.filter((id) => bookmarks.includes(id)).length}
            </div>
          </div>
        </div>
      </ConfirmModal>

      {/* Exit Confirmation Modal */}
      <ConfirmModal
        open={exitModalOpen}
        title="Leave Quiz Session?"
        description="Your progress is saved automatically. You can save and resume later from the homepage, or discard this session."
        confirmLabel="Save & Exit"
        secondaryLabel="Discard Session"
        cancelLabel="Continue Quiz"
        onConfirm={() => {
          setExitModalOpen(false);
          navigate("/");
        }}
        onSecondary={() => {
          setExitModalOpen(false);
          discardSession(session.sessionId);
          navigate("/");
        }}
        onCancel={() => setExitModalOpen(false)}
      />
    </div>
  );
}

