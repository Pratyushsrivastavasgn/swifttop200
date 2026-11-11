import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Play,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormattedQuestionText, SwiftCodeBlock } from "../components/SwiftCodeBlock";
import { getUniqueTopics } from "../data/questions";
import { useProgress } from "../hooks/useProgress";
import type { OptionKey, Question } from "../types/quiz";

export function Bookmarks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { bank, questionMap, state, toggleBookmark, clearMissedQuestion } =
    useProgress();

  const initialTab =
    searchParams.get("tab") === "incorrect" ? "incorrect" : "bookmarks";
  const [activeTab, setActiveTab] = useState<"bookmarks" | "incorrect">(
    initialTab
  );
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const topics = useMemo(() => getUniqueTopics(bank), [bank]);

  const bookmarkedQuestions = useMemo<Question[]>(() => {
    return state.bookmarks
      .map((id) => questionMap.get(id))
      .filter((q): q is Question => Boolean(q));
  }, [state.bookmarks, questionMap]);

  const missedQuestions = useMemo(() => {
    return Object.values(state.incorrectHistory)
      .sort((a, b) => b.lastMissedAt - a.lastMissedAt)
      .map((rec) => {
        const q = questionMap.get(rec.questionId);
        return q ? { question: q, record: rec } : null;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [state.incorrectHistory, questionMap]);

  const filteredItems = useMemo(() => {
    const qLower = query.trim().toLowerCase();
    const list =
      activeTab === "bookmarks"
        ? bookmarkedQuestions.map((q) => ({ question: q, missCount: 0 }))
        : missedQuestions.map((m) => ({
            question: m.question,
            missCount: m.record.missCount,
          }));

    return list.filter(({ question }) => {
      if (topicFilter !== "all" && question.topic !== topicFilter) return false;
      if (!qLower) return true;
      return (
        question.question.toLowerCase().includes(qLower) ||
        (question.topic?.toLowerCase().includes(qLower) ?? false) ||
        `q${question.originalNumber}`.includes(qLower) ||
        String(question.originalNumber) === qLower
      );
    });
  }, [activeTab, bookmarkedQuestions, missedQuestions, query, topicFilter]);

  const switchTab = (tab: "bookmarks" | "incorrect") => {
    setActiveTab(tab);
    setSearchParams(tab === "incorrect" ? { tab: "incorrect" } : {});
  };

  const handleStartPractice = () => {
    const source = activeTab === "bookmarks" ? "bookmarks" : "incorrect";
    navigate(`/setup/custom?source=${source}`);
  };

  const currentCount =
    activeTab === "bookmarks"
      ? bookmarkedQuestions.length
      : missedQuestions.length;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F] sm:text-3xl">
            Bookmarks & Revision Library
          </h1>
          <p className="mt-1 text-sm text-[#86868B]">
            Review saved questions, inspect explanations, and launch focused revision sessions.
          </p>
        </div>

        {currentCount > 0 && (
          <button
            type="button"
            onClick={handleStartPractice}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#F05138] to-[#FF6B00] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>
              {activeTab === "bookmarks"
                ? `Practice Bookmarked (${bookmarkedQuestions.length})`
                : `Revise Missed (${missedQuestions.length})`}
            </span>
          </button>
        )}
      </div>

      {/* Tabs + Search + Topic Filter */}
      <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-[#E8E8ED] bg-white p-4 shadow-apple sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchTab("bookmarks")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "bookmarks"
                ? "bg-[#FFF1E8] text-[#F05138]"
                : "text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Bookmarks ({bookmarkedQuestions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab("incorrect")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "incorrect"
                ? "bg-[#FEF2F2] text-[#E5484D]"
                : "text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Incorrect History ({missedQuestions.length})</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:max-w-md sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions or #number..."
              aria-label="Search saved questions"
              className="w-full rounded-xl border border-[#E8E8ED] bg-[#FAFAFA] py-2 pl-9 pr-3 text-sm text-[#1D1D1F] placeholder-[#86868B] focus:border-[#F05138] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            aria-label="Filter by topic"
            className="rounded-xl border border-[#E8E8ED] bg-[#FAFAFA] px-3 py-2 text-xs font-medium text-[#1D1D1F] focus:border-[#F05138] focus:bg-white focus:outline-none sm:max-w-[180px]"
          >
            <option value="all">All Topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="mt-6 space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-[#E8E8ED] bg-white p-12 text-center shadow-apple">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E8] text-[#F05138]">
              {activeTab === "bookmarks" ? (
                <Bookmark className="h-6 w-6" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-[#22A06B]" />
              )}
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#1D1D1F]">
              {query || topicFilter !== "all"
                ? "No results found"
                : activeTab === "bookmarks"
                  ? "No Bookmarked Questions Yet"
                  : "No Missed Questions Pending"}
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#86868B]">
              {query || topicFilter !== "all"
                ? "Try clearing your search filter or choosing another SwiftUI topic."
                : activeTab === "bookmarks"
                  ? "Tap Bookmark (or press B) during any quiz to save tricky questions here."
                  : "Questions you answer incorrectly in Practice or Exam mode automatically appear here for targeted revision."}
            </p>
          </div>
        ) : (
          filteredItems.map(({ question, missCount }) => {
            const expanded = expandedId === question.id;
            const isBookmarked = state.bookmarks.includes(question.id);

            return (
              <article
                key={question.id}
                className="overflow-hidden rounded-3xl border border-[#E8E8ED] bg-white shadow-apple transition-colors"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#FAFAFA] px-2 py-0.5 font-mono text-xs font-semibold text-[#1D1D1F] ring-1 ring-[#E8E8ED]">
                        Q{question.originalNumber}
                      </span>
                      {question.topic && (
                        <span className="rounded-full bg-[#FFF1E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#F05138]">
                          {question.topic}
                        </span>
                      )}
                      {missCount > 0 && (
                        <span className="rounded-full bg-[#FEF2F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#E5484D]">
                          Missed {missCount}×
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(question.id)}
                        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                        className={`rounded-xl p-2 transition-colors ${
                          isBookmarked
                            ? "bg-[#FFF1E8] text-[#F05138]"
                            : "bg-[#FAFAFA] text-[#86868B] hover:text-[#1D1D1F]"
                        }`}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isBookmarked ? "fill-[#F05138]" : ""}`}
                        />
                      </button>

                      {activeTab === "incorrect" && (
                        <button
                          type="button"
                          onClick={() => clearMissedQuestion(question.id)}
                          title="Mark as mastered and remove from missed list"
                          aria-label="Remove from missed questions"
                          className="rounded-xl bg-[#FAFAFA] p-2 text-[#86868B] transition-colors hover:bg-[#ECFDF5] hover:text-[#22A06B]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expanded ? null : question.id)
                        }
                        aria-expanded={expanded}
                        className="inline-flex items-center gap-1 rounded-xl border border-[#E8E8ED] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D1D1F] hover:bg-[#FAFAFA]"
                      >
                        <span>{expanded ? "Hide Answer" : "Reveal Answer"}</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <h2 className="mt-3 text-base font-semibold leading-snug text-[#1D1D1F]">
                    <FormattedQuestionText text={question.question} />
                  </h2>

                  {question.code && <SwiftCodeBlock code={question.code} />}

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 border-t border-[#E8E8ED] pt-4">
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {(["A", "B", "C", "D"] as OptionKey[]).map((key) => {
                              const isCorrect = key === question.correctAnswer;
                              return (
                                <div
                                  key={key}
                                  className={`rounded-xl border px-3.5 py-2.5 text-xs ${
                                    isCorrect
                                      ? "border-[#22A06B] bg-[#ECFDF5] font-semibold text-[#166534]"
                                      : "border-[#E8E8ED] bg-[#FAFAFA] text-[#515154]"
                                  }`}
                                >
                                  <span className="font-bold">{key}.</span>{" "}
                                  {question.options[key]}
                                </div>
                              );
                            })}
                          </div>

                          {question.explanation && (
                            <div className="rounded-2xl bg-[#FAFAFA] p-4 text-xs leading-relaxed text-[#1D1D1F]">
                              <span className="font-bold uppercase tracking-wider text-[#86868B]">
                                Explanation:{" "}
                              </span>
                              <FormattedQuestionText text={question.explanation} />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}

