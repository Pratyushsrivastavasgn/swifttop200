import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { QUIZ_MODES } from "../data/questions";
import { useProgress } from "../hooks/useProgress";
import type { QuizMode, SessionSource } from "../types/quiz";

export function QuizSetup() {
  const { countParam } = useParams<{ countParam: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { bank, state, createSession } = useProgress();

  const sourceParam = searchParams.get("source");
  const isBookmarksSource = sourceParam === "bookmarks";
  const isIncorrectSource = sourceParam === "incorrect";

  const requestedCount = Number(countParam ?? 20);
  const matchedMode = QUIZ_MODES.find((m) => m.count === requestedCount);

  const explicitIds = useMemo(() => {
    if (isBookmarksSource) return state.bookmarks;
    if (isIncorrectSource) return Object.keys(state.incorrectHistory);
    return undefined;
  }, [isBookmarksSource, isIncorrectSource, state.bookmarks, state.incorrectHistory]);

  const effectiveCount = explicitIds
    ? explicitIds.length
    : Math.min(matchedMode ? matchedMode.count : 20, bank.length);

  const defaultMinutes = Math.max(1, effectiveCount);

  const [quizMode, setQuizMode] = useState<QuizMode>("practice");
  const [timerEnabled, setTimerEnabled] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(defaultMinutes);
  const [shuffleAll200, setShuffleAll200] = useState<boolean>(false);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);

  // Sync smart defaults when switching Practice <-> Exam
  const handleSelectQuizMode = (nextMode: QuizMode) => {
    setQuizMode(nextMode);
    if (nextMode === "exam") {
      setTimerEnabled(true);
      setTimerMinutes(defaultMinutes);
    } else {
      setTimerEnabled(false);
    }
  };

  useEffect(() => {
    setTimerMinutes(defaultMinutes);
  }, [defaultMinutes]);

  if (matchedMode && bank.length < matchedMode.count) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-8 text-center shadow-apple">
          <h1 className="text-xl font-semibold text-[#1D1D1F]">
            Insufficient Questions in Bank
          </h1>
          <p className="mt-2 text-sm text-[#86868B]">
            {matchedMode.title} requires {matchedMode.count} verified questions,
            but the current bank has {bank.length}.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-[#F05138] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  if (explicitIds && explicitIds.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-8 text-center shadow-apple">
          <h1 className="text-xl font-semibold text-[#1D1D1F]">
            No Questions Available
          </h1>
          <p className="mt-2 text-sm text-[#86868B]">
            {isBookmarksSource
              ? "You have not bookmarked any questions yet."
              : "You have no missed questions waiting for revision."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-[#F05138] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Return Home
          </button>
        </div>
      </main>
    );
  }

  const pageTitle = isBookmarksSource
    ? "Bookmarked Questions Revision"
    : isIncorrectSource
      ? "Incorrect Questions Revision"
      : matchedMode?.title ?? `${effectiveCount}-Question Quiz`;

  const sourceKey: SessionSource = isBookmarksSource
    ? "bookmarks"
    : isIncorrectSource
      ? "incorrect"
      : matchedMode?.id ?? "mode-20";

  const isFullBankMode = !explicitIds && effectiveCount === bank.length;

  const handleStart = () => {
    const safeMinutes = Math.max(1, Math.min(360, Number(timerMinutes) || defaultMinutes));
    const sessionId = createSession({
      count: effectiveCount,
      mode: quizMode,
      source: sourceKey,
      title: pageTitle,
      timerMinutes: timerEnabled ? safeMinutes : null,
      shuffleAllQuestions: isFullBankMode ? shuffleAll200 : true,
      shuffleOptions,
      explicitQuestionIds: explicitIds,
    });
    navigate(`/quiz/${sessionId}`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="space-y-6"
      >
        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-apple sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center rounded-full bg-[#FFF1E8] px-3 py-1 text-xs font-semibold text-[#F05138]">
                {effectiveCount} Questions Selected
              </span>
              <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-[#1D1D1F] sm:text-3xl">
                {pageTitle}
              </h1>
              <p className="mt-1 text-sm text-[#86868B]">
                {isFullBankMode
                  ? "Includes every single imported question exactly once."
                  : explicitIds
                    ? "Focused practice using your saved revision list."
                    : "Randomly sampled without replacement across all SwiftUI & Concurrency topics."}
              </p>
            </div>
          </div>

          {/* Step 1: Practice vs Exam Mode */}
          <div className="mt-7">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#86868B]">
              1. Choose Mode
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleSelectQuizMode("practice")}
                className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  quizMode === "practice"
                    ? "border-[#F05138] bg-[#FFF1E8]/60 ring-2 ring-[#F05138]/20"
                    : "border-[#E8E8ED] bg-white hover:border-[#F05138]/40"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#F05138]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      quizMode === "practice"
                        ? "bg-[#F05138] text-white"
                        : "bg-[#F2F2F7] text-[#86868B]"
                    }`}
                  >
                    Untimed Default
                  </span>
                </div>
                <h3 className="mt-3.5 text-base font-semibold text-[#1D1D1F]">
                  Practice Mode
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#86868B]">
                  Immediate green/red feedback after every answer, detailed explanations, distractor notes, and exam tips.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectQuizMode("exam")}
                className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  quizMode === "exam"
                    ? "border-[#F05138] bg-[#FFF1E8]/60 ring-2 ring-[#F05138]/20"
                    : "border-[#E8E8ED] bg-white hover:border-[#F05138]/40"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#F05138]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      quizMode === "exam"
                        ? "bg-[#F05138] text-white"
                        : "bg-[#F2F2F7] text-[#86868B]"
                    }`}
                  >
                    Timed Default
                  </span>
                </div>
                <h3 className="mt-3.5 text-base font-semibold text-[#1D1D1F]">
                  Exam Mode
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#86868B]">
                  No feedback until final submission. Change answers freely, skip & return, and get scored at the end.
                </p>
              </button>
            </div>
          </div>

          {/* Step 2: Timer & Randomization Options */}
          <div className="mt-7 border-t border-[#E8E8ED] pt-6">
            <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#86868B]">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>2. Session Settings</span>
            </h2>

            <div className="mt-3.5 space-y-3">
              {/* Timer Control */}
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#F05138]" />
                  <div>
                    <div className="text-sm font-semibold text-[#1D1D1F]">
                      Countdown Timer
                    </div>
                    <div className="text-xs text-[#86868B]">
                      Auto-submits when time runs out; persists across page refreshes.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {timerEnabled && (
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#E8E8ED] bg-white px-2.5 py-1.5">
                      <input
                        type="number"
                        min={1}
                        max={360}
                        value={timerMinutes}
                        onChange={(e) =>
                          setTimerMinutes(Math.max(1, Number(e.target.value)))
                        }
                        aria-label="Timer duration in minutes"
                        className="w-14 bg-transparent text-center text-sm font-semibold text-[#1D1D1F] focus:outline-none"
                      />
                      <span className="text-xs text-[#86868B]">min</span>
                    </div>
                  )}

                  <button
                    type="button"
                    role="switch"
                    aria-checked={timerEnabled}
                    aria-label="Toggle countdown timer"
                    onClick={() => setTimerEnabled((v) => !v)}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                      timerEnabled ? "bg-[#F05138]" : "bg-[#D2D2D7]"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        timerEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* All 200 Question Order Toggle */}
              {isFullBankMode && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-4">
                  <div className="flex items-start gap-3">
                    <Shuffle className="mt-0.5 h-5 w-5 shrink-0 text-[#F05138]" />
                    <div>
                      <div className="text-sm font-semibold text-[#1D1D1F]">
                        Shuffle Question Order
                      </div>
                      <div className="text-xs text-[#86868B]">
                        Default keeps source order (Q1–Q{bank.length}); enable to randomize sequence.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={shuffleAll200}
                    aria-label="Shuffle all questions order"
                    onClick={() => setShuffleAll200((v) => !v)}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                      shuffleAll200 ? "bg-[#F05138]" : "bg-[#D2D2D7]"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        shuffleAll200 ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* Option Order Toggle (Preserves original order by default per Section 17) */}
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-4">
                <div className="flex items-start gap-3">
                  <Shuffle className="mt-0.5 h-5 w-5 shrink-0 text-[#86868B]" />
                  <div>
                    <div className="text-sm font-semibold text-[#1D1D1F]">
                      Shuffle Answer Options (A–D)
                    </div>
                    <div className="text-xs text-[#86868B]">
                      Off by default to match source order. Enable to randomize A/B/C/D positions while preserving accurate scoring.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={shuffleOptions}
                  aria-label="Shuffle answer options"
                  onClick={() => setShuffleOptions((v) => !v)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    shuffleOptions ? "bg-[#F05138]" : "bg-[#D2D2D7]"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      shuffleOptions ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleStart}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F05138] to-[#FF6B00] px-6 py-4 text-base font-semibold text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.995]"
            >
              <span>
                Start {effectiveCount}-Question{" "}
                {quizMode === "exam" ? "Exam" : "Practice"}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

