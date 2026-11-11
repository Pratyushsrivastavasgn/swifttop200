import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, X } from "lucide-react";
import { useState } from "react";
import type { Question, QuizSession } from "../types/quiz";

interface QuestionNavigatorProps {
  open: boolean;
  session: QuizSession;
  questions: Question[];
  currentIndex: number;
  bookmarks: string[];
  onSelectIndex: (index: number) => void;
  onClose: () => void;
}

type NavFilter = "all" | "unanswered" | "bookmarked";

export function QuestionNavigator({
  open,
  session,
  questions,
  currentIndex,
  bookmarks,
  onSelectIndex,
  onClose,
}: QuestionNavigatorProps) {
  const [filter, setFilter] = useState<NavFilter>("all");

  // Never reveal correctness in Exam Mode before submission
  const canShowCorrectness = session.mode === "practice" || session.submitted;

  const filteredItems = questions
    .map((q, index) => ({ q, index }))
    .filter(({ q }) => {
      if (filter === "unanswered") return !session.selectedAnswers[q.id];
      if (filter === "bookmarked") return bookmarks.includes(q.id);
      return true;
    });

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Question Navigator"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1D1D1F]/30 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#E8E8ED] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E8E8ED] px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-[#1D1D1F]">
                  Question Navigator
                </h2>
                <p className="text-xs text-[#86868B]">
                  Jump directly to any question ({questions.length} total)
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigator"
                className="rounded-full p-1.5 text-[#86868B] transition-colors hover:bg-[#F2F2F7] hover:text-[#1D1D1F]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 border-b border-[#E8E8ED] bg-[#FAFAFA] px-5 py-3">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "unanswered", label: "Unanswered" },
                  { id: "bookmarked", label: "Bookmarked" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    filter === tab.id
                      ? "bg-[#F05138] text-white"
                      : "bg-white text-[#86868B] ring-1 ring-[#E8E8ED] hover:text-[#1D1D1F]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#E8E8ED] px-5 py-2.5 text-[11px] font-medium text-[#86868B]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm ring-2 ring-[#F05138]" />
                Current
              </span>
              {canShowCorrectness ? (
                <>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#22A06B]" />
                    Correct
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#E5484D]" />
                    Incorrect
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#1D1D1F]" />
                  Answered
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm border border-[#D2D2D7] bg-white" />
                Unanswered
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bookmark className="h-3 w-3 fill-[#F05138] text-[#F05138]" />
                Bookmarked
              </span>
            </div>

            {/* Grid of Tiles */}
            <div className="swift-scroll flex-1 overflow-y-auto p-5">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#86868B]">
                  No questions match this filter.
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6">
                  {filteredItems.map(({ q, index }) => {
                    const isCurrent = index === currentIndex;
                    const chosen = session.selectedAnswers[q.id];
                    const isAnswered = Boolean(chosen);
                    const isBookmarked = bookmarks.includes(q.id);
                    const isCorrect = chosen === q.correctAnswer;

                    let tileClass =
                      "border-[#E8E8ED] bg-white text-[#1D1D1F] hover:border-[#F05138]/50";

                    if (isAnswered) {
                      if (canShowCorrectness) {
                        tileClass = isCorrect
                          ? "border-[#22A06B] bg-[#ECFDF5] text-[#166534]"
                          : "border-[#E5484D] bg-[#FEF2F2] text-[#991B1B]";
                      } else {
                        tileClass =
                          "border-[#1D1D1F] bg-[#1D1D1F] text-white";
                      }
                    }

                    if (isCurrent) {
                      tileClass += " ring-2 ring-[#F05138] ring-offset-2";
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          onSelectIndex(index);
                          onClose();
                        }}
                        aria-label={`Question ${index + 1}${isAnswered ? ", answered" : ", unanswered"}${isBookmarked ? ", bookmarked" : ""}`}
                        className={`relative flex h-11 items-center justify-center rounded-xl border text-xs font-semibold transition-all ${tileClass}`}
                      >
                        <span>{index + 1}</span>
                        {isBookmarked && (
                          <span
                            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#F05138] ring-2 ring-white"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

