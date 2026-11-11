import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  Home,
  RefreshCw,
  RotateCcw,
  Shuffle,
  XCircle,
} from "lucide-react";
import { formatDuration, type SessionScoreSummary } from "../utils/scoring";

interface ResultSummaryProps {
  summary: SessionScoreSummary;
  modeTitle: string;
  quizMode: "practice" | "exam";
  onReviewToggle: () => void;
  reviewOpen: boolean;
  onRetryIncorrect: () => void;
  onRetrySame: () => void;
  onStartNewRandom: () => void;
  onReturnHome: () => void;
}

export function ResultSummary({
  summary,
  modeTitle,
  quizMode,
  onReviewToggle,
  reviewOpen,
  onRetryIncorrect,
  onRetrySame,
  onStartNewRandom,
  onReturnHome,
}: ResultSummaryProps) {
  const highScore = summary.accuracyPercent >= 80;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Hero Score Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-apple sm:p-9">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FFF1E8] opacity-80 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1E8] px-3 py-1 text-xs font-semibold text-[#F05138]">
              <Award className="h-3.5 w-3.5" />
              <span>
                {modeTitle} • {quizMode === "exam" ? "Exam Mode" : "Practice Mode"}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1D1D1F] sm:text-3xl">
              Your SwiftUI Score
            </h1>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight text-[#1D1D1F] sm:text-5xl">
                {summary.correct} / {summary.total}
              </span>
              <span className="text-lg font-semibold text-[#F05138]">
                {summary.accuracyPercent}% Accuracy
              </span>
            </div>
            <p
              className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold ${
                highScore ? "text-[#22A06B]" : "text-[#F05138]"
              }`}
            >
              {summary.performanceLabel}
            </p>
          </div>

          {/* Minimal Accuracy Ring */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#F2F2F7"
                strokeWidth="9"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={highScore ? "#22A06B" : "#F05138"}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 42 * (1 - summary.accuracyPercent / 100),
                }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute text-center">
              <span className="block text-xl font-bold text-[#1D1D1F]">
                {summary.accuracyPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Key Stats */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#86868B]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#22A06B]" />
              <span>Correct</span>
            </div>
            <div className="mt-1 text-xl font-bold text-[#1D1D1F]">
              {summary.correct}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#86868B]">
              <XCircle className="h-3.5 w-3.5 text-[#E5484D]" />
              <span>Incorrect</span>
            </div>
            <div className="mt-1 text-xl font-bold text-[#1D1D1F]">
              {summary.incorrect}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#86868B]">
              <HelpCircle className="h-3.5 w-3.5 text-[#86868B]" />
              <span>Unanswered</span>
            </div>
            <div className="mt-1 text-xl font-bold text-[#1D1D1F]">
              {summary.unanswered}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#86868B]">
              <Clock className="h-3.5 w-3.5 text-[#F05138]" />
              <span>Time Taken</span>
            </div>
            <div className="mt-1 text-xl font-bold text-[#1D1D1F]">
              {formatDuration(summary.durationMs)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onReviewToggle}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#F05138] to-[#FF6B00] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
          >
            <span>{reviewOpen ? "Hide Answer Review" : "Review All Answers"}</span>
          </button>

          {summary.incorrectIds.length > 0 && (
            <button
              type="button"
              onClick={onRetryIncorrect}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#F05138]/30 bg-[#FFF1E8] px-4 py-3 text-sm font-semibold text-[#F05138] transition-colors hover:bg-[#FFE3D1]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>
                Retry Incorrect ({summary.incorrectIds.length})
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onRetrySame}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E8E8ED] bg-white px-4 py-3 text-sm font-medium text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7]"
          >
            <RefreshCw className="h-4 w-4 text-[#86868B]" />
            <span>Retry Same Questions</span>
          </button>

          <button
            type="button"
            onClick={onStartNewRandom}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E8E8ED] bg-white px-4 py-3 text-sm font-medium text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7]"
          >
            <Shuffle className="h-4 w-4 text-[#86868B]" />
            <span>Start New Random Quiz</span>
          </button>

          <button
            type="button"
            onClick={onReturnHome}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E8E8ED] bg-white px-4 py-3 text-sm font-medium text-[#86868B] transition-colors hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
          >
            <Home className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Topic-Wise Accuracy */}
      {summary.topicBreakdown.length > 0 && (
        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-apple">
          <h2 className="text-base font-semibold tracking-tight text-[#1D1D1F]">
            Topic-Wise Accuracy
          </h2>
          <p className="mt-0.5 text-xs text-[#86868B]">
            Computed from your recorded answers in this session
          </p>

          <div className="mt-5 space-y-4">
            {summary.topicBreakdown.map((t) => (
              <div key={t.topic}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-[#1D1D1F]">{t.topic}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-[#1D1D1F]">
                    {t.correct}/{t.total}{" "}
                    <span className="text-[#86868B]">({t.accuracyPercent}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2F2F7]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      t.accuracyPercent >= 80
                        ? "bg-[#22A06B]"
                        : t.accuracyPercent >= 50
                          ? "bg-[#F05138]"
                          : "bg-[#E5484D]"
                    }`}
                    style={{ width: `${t.accuracyPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficulty Breakdown (only if difficulty labels exist on questions) */}
      {summary.difficultyBreakdown.length > 0 && (
        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-apple">
          <h2 className="text-base font-semibold tracking-tight text-[#1D1D1F]">
            Difficulty Breakdown
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {summary.difficultyBreakdown.map((d) => (
              <div
                key={d.difficulty}
                className="rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-4"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                  {d.difficulty}
                </div>
                <div className="mt-1 text-lg font-bold text-[#1D1D1F]">
                  {d.correct}/{d.total} ({d.accuracyPercent}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

