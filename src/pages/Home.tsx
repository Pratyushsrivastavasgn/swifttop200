import { motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  Bookmark,
  CheckCircle2,
  PlayCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConfirmModal } from "../components/ConfirmModal";
import { ModeCard } from "../components/ModeCard";
import { QUIZ_MODES } from "../data/questions";
import { useProgress } from "../hooks/useProgress";
import type { ModeDefinition } from "../types/quiz";

export function Home() {
  const navigate = useNavigate();
  const {
    bank,
    bankName,
    isCustomBank,
    validationReport,
    activeSession,
    state,
    analytics,
    discardSession,
  } = useProgress();

  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const missedCount = Object.keys(state.incorrectHistory).length;
  const bookmarkCount = state.bookmarks.length;

  const handleSelectMode = (mode: ModeDefinition) => {
    navigate(`/setup/${mode.count}`);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
      {/* Compact Apple Hero */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E8ED] bg-white px-3 py-1 text-xs font-medium text-[#1D1D1F] shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#22A06B]" />
            <span>
              {validationReport.totalQuestions} Verified Questions Imported
              {isCustomBank ? ` • ${bankName}` : ""}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1D1D1F] sm:text-4xl">
            SwiftIQ Examination Platform
          </h1>
          <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[#86868B]">
            Choose a test length below, then select Practice Mode for immediate explanations or Exam Mode for a realistic timed simulation.
          </p>
        </div>

        {analytics.totalQuestionsAnswered > 0 && (
          <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-[#E8E8ED] bg-white px-4 py-3 shadow-apple">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
                Accuracy
              </div>
              <div className="text-lg font-bold text-[#1D1D1F]">
                {analytics.overallAccuracyPercent}%
              </div>
            </div>
            <div className="h-7 w-px bg-[#E8E8ED]" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
                Completed
              </div>
              <div className="text-lg font-bold text-[#1D1D1F]">
                {analytics.completedPracticeSessions + analytics.completedExamSessions}
              </div>
            </div>
          </div>
        )}
      </motion.section>

      {/* Active Unfinished Session Banner */}
      {activeSession && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 flex flex-col justify-between gap-4 rounded-3xl border border-[#F05138]/30 bg-[#FFF1E8] p-5 sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F05138] text-white">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#F05138]">
                Session In Progress
              </div>
              <h2 className="mt-0.5 text-base font-semibold text-[#1D1D1F]">
                {activeSession.title ?? `${activeSession.questionCount}-Question Quiz`} •{" "}
                {activeSession.mode === "exam" ? "Exam Mode" : "Practice Mode"}
              </h2>
              <p className="text-xs text-[#515154]">
                Currently at Question {activeSession.currentIndex + 1} of{" "}
                {activeSession.questionCount} (
                {Object.keys(activeSession.selectedAnswers).length} answered)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setConfirmDiscardOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#F05138]/25 bg-white px-3.5 py-2 text-xs font-semibold text-[#E5484D] transition-colors hover:bg-[#FEF2F2]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Discard</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/quiz/${activeSession.sessionId}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F05138] to-[#FF6B00] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Resume Quiz</span>
            </button>
          </div>
        </motion.section>
      )}

      {/* Bank Validation Warning (only if an imported file had warnings/mismatch) */}
      {(!validationReport.valid || validationReport.flaggedForReview > 0) && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#FF6B00]/30 bg-[#FFF1E8] px-4 py-3 text-sm text-[#9A3412]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#F05138]" />
          <div>
            <strong>Question Bank Notice:</strong>{" "}
            {validationReport.flaggedForReview > 0 &&
              `${validationReport.flaggedForReview} question(s) flagged for review. `}
            {!validationReport.valid &&
              `${validationReport.issues.length} validation issue(s) found. Check Analytics & Bank Inspector.`}
          </div>
        </div>
      )}

      {/* PRIMARY FOCUS: 4 Quiz Mode Cards in a 2x2 Grid */}
      <section aria-label="Quiz modes">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {QUIZ_MODES.map((mode, idx) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              index={idx}
              availableCount={bank.length}
              bestScore={analytics.bestByLength[mode.count]}
              onSelect={handleSelectMode}
            />
          ))}
        </div>
      </section>

      {/* Secondary Revision & Analytics Strip */}
      <section className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <Link
          to="/bookmarks?tab=incorrect"
          className="group flex items-center justify-between rounded-2xl border border-[#E8E8ED] bg-white px-5 py-4 shadow-apple transition-all hover:border-[#F05138]/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#E5484D]">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1D1D1F]">
                Missed Questions
              </div>
              <div className="text-xs text-[#86868B]">
                {missedCount > 0
                  ? `${missedCount} awaiting revision`
                  : "None missed yet"}
              </div>
            </div>
          </div>
          <span className="rounded-full bg-[#FAFAFA] px-2.5 py-1 text-xs font-semibold text-[#1D1D1F] ring-1 ring-[#E8E8ED] group-hover:text-[#F05138]">
            {missedCount}
          </span>
        </Link>

        <Link
          to="/bookmarks"
          className="group flex items-center justify-between rounded-2xl border border-[#E8E8ED] bg-white px-5 py-4 shadow-apple transition-all hover:border-[#F05138]/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#F05138]">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1D1D1F]">
                Saved Bookmarks
              </div>
              <div className="text-xs text-[#86868B]">
                {bookmarkCount > 0
                  ? `${bookmarkCount} saved for review`
                  : "Bookmark any question"}
              </div>
            </div>
          </div>
          <span className="rounded-full bg-[#FAFAFA] px-2.5 py-1 text-xs font-semibold text-[#1D1D1F] ring-1 ring-[#E8E8ED] group-hover:text-[#F05138]">
            {bookmarkCount}
          </span>
        </Link>

        <Link
          to="/dashboard"
          className="group flex items-center justify-between rounded-2xl border border-[#E8E8ED] bg-white px-5 py-4 shadow-apple transition-all hover:border-[#F05138]/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#22A06B]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1D1D1F]">
                Analytics & Bank
              </div>
              <div className="text-xs text-[#86868B]">
                Topic breakdown & import
              </div>
            </div>
          </div>
          <span className="rounded-full bg-[#FAFAFA] px-2.5 py-1 text-xs font-semibold text-[#1D1D1F] ring-1 ring-[#E8E8ED] group-hover:text-[#F05138]">
            View
          </span>
        </Link>
      </section>

      <ConfirmModal
        open={confirmDiscardOpen}
        title="Discard In-Progress Session?"
        description="Your current answers in this unsubmitted quiz will be cleared. Previously completed sessions and bookmarks remain saved."
        confirmLabel="Discard Session"
        destructive
        onConfirm={() => {
          if (activeSession) discardSession(activeSession.sessionId);
          setConfirmDiscardOpen(false);
        }}
        onCancel={() => setConfirmDiscardOpen(false)}
      />
    </main>
  );
}

