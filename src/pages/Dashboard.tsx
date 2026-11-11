import { motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Database,
  FileUp,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConfirmModal } from "../components/ConfirmModal";
import { useProgress } from "../hooks/useProgress";
import { formatDuration } from "../utils/scoring";

export function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    bank,
    bankName,
    isCustomBank,
    validationReport,
    state,
    analytics,
    importCustomBank,
    restoreDefaultBank,
    resetAllProgress,
  } = useProgress();

  const [resetOpen, setResetOpen] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = importCustomBank(text, file.name);
      if (res.ok) {
        setImportFeedback({
          type: "success",
          text: `Imported ${res.count} questions from "${file.name}".`,
        });
      } else {
        setImportFeedback({
          type: "error",
          text: res.error ?? "Failed to import question bank.",
        });
      }
    } catch {
      setImportFeedback({
        type: "error",
        text: "Could not read the selected file.",
      });
    } finally {
      e.target.value = "";
    }
  };

  const hasSessions = analytics.submittedSessions.length > 0;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F] sm:text-3xl">
            Analytics & Question Bank
          </h1>
          <p className="mt-1 text-sm text-[#86868B]">
            Real performance metrics calculated strictly from your completed quiz sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-2xl border border-[#E8E8ED] bg-white px-4 py-2.5 text-xs font-semibold text-[#E5484D] transition-colors hover:border-[#E5484D]/30 hover:bg-[#FEF2F2] sm:self-center"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      {/* Overview KPIs */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3.5 lg:grid-cols-4"
      >
        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-5 shadow-apple">
          <div className="flex items-center gap-2 text-xs font-medium text-[#86868B]">
            <BarChart3 className="h-4 w-4 text-[#F05138]" />
            <span>Questions Answered</span>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {analytics.totalQuestionsAnswered}
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-5 shadow-apple">
          <div className="flex items-center gap-2 text-xs font-medium text-[#86868B]">
            <Award className="h-4 w-4 text-[#22A06B]" />
            <span>Overall Accuracy</span>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {analytics.totalQuestionsAnswered > 0
              ? `${analytics.overallAccuracyPercent}%`
              : "—"}
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-5 shadow-apple">
          <div className="flex items-center gap-2 text-xs font-medium text-[#86868B]">
            <BookOpen className="h-4 w-4 text-[#F05138]" />
            <span>Practice Completed</span>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {analytics.completedPracticeSessions}
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-5 shadow-apple">
          <div className="flex items-center gap-2 text-xs font-medium text-[#86868B]">
            <ShieldCheck className="h-4 w-4 text-[#1D1D1F]" />
            <span>Exams Completed</span>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {analytics.completedExamSessions}
          </div>
        </div>
      </motion.section>

      {/* Best Scores by Length */}
      <section className="rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-apple">
        <h2 className="text-base font-semibold text-[#1D1D1F]">
          Best Score by Quiz Length
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([20, 50, 100, 200] as const).map((len) => {
            const best = analytics.bestByLength[len];
            return (
              <div
                key={len}
                className="rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] p-4"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                  {len === 200 ? "All 200" : `${len} Questions`}
                </div>
                {best ? (
                  <>
                    <div className="mt-1.5 text-xl font-bold text-[#1D1D1F]">
                      {best.bestCorrect}/{best.total}
                    </div>
                    <div className="text-xs font-semibold text-[#22A06B]">
                      {best.bestPercent}% • {best.attempts}{" "}
                      {best.attempts === 1 ? "run" : "runs"}
                    </div>
                  </>
                ) : (
                  <div className="mt-2 text-xs text-[#86868B]">
                    Not attempted yet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Topic-wise Performance + Missed Callouts */}
      {!hasSessions ? (
        <section className="rounded-3xl border border-[#E8E8ED] bg-white p-10 text-center shadow-apple">
          <h2 className="text-lg font-semibold text-[#1D1D1F]">
            No Completed Sessions Yet
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-[#86868B]">
            Complete a Practice or Exam quiz to see your real topic-by-topic accuracy, missed-topic insights, and score progression.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center rounded-2xl bg-gradient-to-r from-[#F05138] to-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Choose a Quiz Mode
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-apple lg:col-span-2">
            <h2 className="text-base font-semibold text-[#1D1D1F]">
              Topic-Wise Performance
            </h2>
            <div className="mt-4 space-y-3.5">
              {analytics.topicStats.map((t) => (
                <div key={t.topic}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-[#1D1D1F]">{t.topic}</span>
                    <span className="shrink-0 font-semibold tabular-nums text-[#1D1D1F]">
                      {t.correct}/{t.total}{" "}
                      <span className="text-[#86868B]">
                        ({t.accuracyPercent}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2F2F7]">
                    <div
                      className={`h-full rounded-full ${
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
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-apple">
              <h2 className="text-base font-semibold text-[#1D1D1F]">
                Most Frequently Missed
              </h2>
              {analytics.mostMissedTopics.length === 0 ? (
                <p className="mt-3 text-xs text-[#86868B]">
                  Zero incorrect answers recorded so far.
                </p>
              ) : (
                <div className="mt-3.5 space-y-2.5">
                  {analytics.mostMissedTopics.map((t) => (
                    <div
                      key={t.topic}
                      className="rounded-2xl border border-[#E5484D]/20 bg-[#FEF2F2]/60 p-3"
                    >
                      <div className="text-xs font-semibold text-[#1D1D1F]">
                        {t.topic}
                      </div>
                      <div className="mt-0.5 text-xs text-[#E5484D]">
                        {t.incorrect} incorrect • {t.accuracyPercent}% accuracy
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-[#E8E8ED] pt-3.5 text-xs">
                <span className="text-[#86868B]">
                  Pending missed questions: {Object.keys(state.incorrectHistory).length}
                </span>
                <Link
                  to="/bookmarks?tab=incorrect"
                  className="font-semibold text-[#F05138] hover:underline"
                >
                  Revise →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-apple">
              <h2 className="text-base font-semibold text-[#1D1D1F]">
                Recent Scores
              </h2>
              <div className="mt-3 space-y-2.5">
                {analytics.submittedSessions.slice(0, 6).map(({ session, summary }) => (
                  <button
                    key={session.sessionId}
                    type="button"
                    onClick={() => navigate(`/results/${session.sessionId}`)}
                    className="flex w-full items-center justify-between rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] px-3.5 py-2.5 text-left transition-colors hover:border-[#F05138]/40 hover:bg-white"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#1D1D1F]">
                        {session.title ?? `${session.questionCount}-Question Quiz`}
                      </div>
                      <div className="text-[11px] text-[#86868B]">
                        {session.mode === "exam" ? "Exam" : "Practice"} •{" "}
                        {formatDuration(summary.durationMs)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#1D1D1F]">
                        {summary.correct}/{summary.total}
                      </div>
                      <div className="text-[11px] font-semibold text-[#F05138]">
                        {summary.accuracyPercent}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Question Bank Integrity & Importer */}
      <section className="rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-apple">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1E8] text-[#F05138]">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1D1D1F]">
                Question Bank Inspector
              </h2>
              <p className="text-xs text-[#86868B]">
                Active source: <strong className="text-[#1D1D1F]">{bankName}</strong> ({bank.length} questions)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8E8ED] bg-white px-3.5 py-2 text-xs font-semibold text-[#1D1D1F] hover:bg-[#FAFAFA]"
            >
              <FileUp className="h-3.5 w-3.5 text-[#F05138]" />
              <span>Import JSON / CSV / TXT / MD</span>
            </button>

            {isCustomBank && (
              <button
                type="button"
                onClick={() => {
                  restoreDefaultBank();
                  setImportFeedback({
                    type: "success",
                    text: "Restored default 200 SwiftUI & Concurrency questions.",
                  });
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF1E8] px-3.5 py-2 text-xs font-semibold text-[#F05138] hover:bg-[#FFE3D1]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restore Default 200 Bank</span>
              </button>
            )}
          </div>
        </div>

        {importFeedback && (
          <div
            className={`mt-4 rounded-2xl px-4 py-3 text-xs font-medium ${
              importFeedback.type === "success"
                ? "bg-[#ECFDF5] text-[#166534]"
                : "bg-[#FEF2F2] text-[#991B1B]"
            }`}
          >
            {importFeedback.text}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] px-4 py-3">
            {validationReport.valid ? (
              <CheckCircle2 className="h-5 w-5 text-[#22A06B]" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-[#E5484D]" />
            )}
            <div>
              <div className="text-xs font-semibold text-[#1D1D1F]">
                {validationReport.valid ? "Integrity Verified" : "Issues Found"}
              </div>
              <div className="text-[11px] text-[#86868B]">
                {validationReport.totalQuestions} questions validated
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] px-4 py-3">
            <div className="text-xs font-semibold text-[#1D1D1F]">
              Topic Sections
            </div>
            <div className="text-[11px] text-[#86868B]">
              {Object.keys(validationReport.topicCounts).length} syllabus categories
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] px-4 py-3">
            <div className="text-xs font-semibold text-[#1D1D1F]">
              Flagged for Review
            </div>
            <div className="text-[11px] text-[#86868B]">
              {validationReport.flaggedForReview} ambiguous key(s)
            </div>
          </div>
        </div>

        {/* Topic Breakdown Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(validationReport.topicCounts).map(([topic, count]) => (
            <span
              key={topic}
              className="rounded-full border border-[#E8E8ED] bg-[#FAFAFA] px-3 py-1 text-xs text-[#515154]"
            >
              {topic}: <strong className="text-[#1D1D1F]">{count}</strong>
            </span>
          ))}
        </div>
      </section>

      <ConfirmModal
        open={resetOpen}
        title="Reset All Local Progress?"
        description="This permanently clears your completed session scores, bookmarks, missed-question history, and any active in-progress quiz."
        confirmLabel="Reset Everything"
        destructive
        onConfirm={() => {
          resetAllProgress();
          setResetOpen(false);
        }}
        onCancel={() => setResetOpen(false)}
      />
    </main>
  );
}

