import { Bookmark, CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExplanationPanel } from "../components/ExplanationPanel";
import { ResultSummary } from "../components/ResultSummary";
import { FormattedQuestionText, SwiftCodeBlock } from "../components/SwiftCodeBlock";
import { useProgress } from "../hooks/useProgress";
import type { OptionKey, Question } from "../types/quiz";
import { getDisplayOptionLetter } from "../utils/questionSelection";
import { evaluateSession } from "../utils/scoring";

type ReviewFilter = "all" | "incorrect" | "unanswered" | "correct" | "bookmarked";

export function Results() {
  const { sessionId = "" } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { state, questionMap, createSession, toggleBookmark } = useProgress();

  const [reviewOpen, setReviewOpen] = useState(false);
  const [filter, setFilter] = useState<ReviewFilter>("all");

  const session = state.sessions[sessionId];

  const questions = useMemo<Question[]>(() => {
    if (!session) return [];
    return session.questionIds
      .map((id) => questionMap.get(id))
      .filter((q): q is Question => Boolean(q));
  }, [session, questionMap]);

  const summary = useMemo(() => {
    if (!session) return null;
    return evaluateSession(session, questionMap);
  }, [session, questionMap]);

  if (!session || !summary) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-[#E8E8ED] bg-white p-8 shadow-apple">
          <h1 className="text-xl font-semibold text-[#1D1D1F]">
            Results Not Found
          </h1>
          <p className="mt-2 text-sm text-[#86868B]">
            This quiz record could not be located in your local history.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-[#F05138] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Return to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const reviewedItems = questions
    .map((q, index) => {
      const chosen = session.selectedAnswers[q.id] as OptionKey | undefined;
      const isCorrect = Boolean(chosen && chosen === q.correctAnswer);
      const isUnanswered = !chosen;
      const isBookmarked = state.bookmarks.includes(q.id);
      return { q, index, chosen, isCorrect, isUnanswered, isBookmarked };
    })
    .filter((item) => {
      if (filter === "incorrect") return !item.isUnanswered && !item.isCorrect;
      if (filter === "unanswered") return item.isUnanswered;
      if (filter === "correct") return item.isCorrect;
      if (filter === "bookmarked") return item.isBookmarked;
      return true;
    });

  const handleRetryIncorrect = () => {
    if (summary.incorrectIds.length === 0) return;
    const newId = createSession({
      count: summary.incorrectIds.length,
      mode: "practice",
      source: "retry",
      title: `Incorrect Revision (${summary.incorrectIds.length} Qs)`,
      timerMinutes: null,
      explicitQuestionIds: summary.incorrectIds,
      shuffleAllQuestions: false,
      shuffleOptions: false,
    });
    navigate(`/quiz/${newId}`);
  };

  const handleRetrySame = () => {
    const newId = createSession({
      count: session.questionCount,
      mode: session.mode,
      source: session.source ?? "retry",
      title: session.title,
      timerMinutes: session.deadlineAt ? session.questionCount : null,
      explicitQuestionIds: session.questionIds,
      shuffleAllQuestions: false,
      shuffleOptions: false,
    });
    navigate(`/quiz/${newId}`);
  };

  const handleStartNewRandom = () => {
    const count =
      session.questionCount === 20 ||
      session.questionCount === 50 ||
      session.questionCount === 100 ||
      session.questionCount === 200
        ? session.questionCount
        : 20;
    navigate(`/setup/${count}`);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6">
      <ResultSummary
        summary={summary}
        modeTitle={session.title ?? `${session.questionCount}-Question Quiz`}
        quizMode={session.mode}
        reviewOpen={reviewOpen}
        onReviewToggle={() => setReviewOpen((v) => !v)}
        onRetryIncorrect={handleRetryIncorrect}
        onRetrySame={handleRetrySame}
        onStartNewRandom={handleStartNewRandom}
        onReturnHome={() => navigate("/")}
      />

      {reviewOpen && (
        <section className="mt-8 space-y-5" aria-label="Answer review">
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E8E8ED] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <h2 className="text-base font-semibold text-[#1D1D1F]">
              Answer Review ({reviewedItems.length})
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: "all", label: `All (${questions.length})` },
                  { id: "incorrect", label: `Incorrect (${summary.incorrect})` },
                  { id: "unanswered", label: `Unanswered (${summary.unanswered})` },
                  { id: "correct", label: `Correct (${summary.correct})` },
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
                      : "bg-[#FAFAFA] text-[#86868B] ring-1 ring-[#E8E8ED] hover:text-[#1D1D1F]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {reviewedItems.length === 0 ? (
            <div className="rounded-3xl border border-[#E8E8ED] bg-white p-8 text-center text-sm text-[#86868B]">
              No questions match this filter.
            </div>
          ) : (
            <div className="space-y-5">
              {reviewedItems.map(({ q, index, chosen, isCorrect, isUnanswered, isBookmarked }) => {
                const optionOrder = session.optionOrders?.[q.id] ?? ["A", "B", "C", "D"];
                return (
                  <article
                    key={q.id}
                    className="rounded-3xl border border-[#E8E8ED] bg-white p-5 shadow-apple sm:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#F05138]">
                          Question {index + 1}
                        </span>
                        <span className="rounded-md bg-[#FAFAFA] px-2 py-0.5 font-mono text-[11px] text-[#86868B] ring-1 ring-[#E8E8ED]">
                          Source #{q.originalNumber}
                        </span>
                        {q.topic && (
                          <span className="rounded-full bg-[#FFF1E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#F05138]">
                            {q.topic}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#22A06B]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Correct
                          </span>
                        ) : isUnanswered ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F2F2F7] px-2.5 py-0.5 text-xs font-semibold text-[#86868B]">
                            <HelpCircle className="h-3.5 w-3.5" />
                            Unanswered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF2F2] px-2.5 py-0.5 text-xs font-semibold text-[#E5484D]">
                            <XCircle className="h-3.5 w-3.5" />
                            Incorrect
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleBookmark(q.id, session.sessionId)}
                          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                          className={`rounded-full p-1.5 transition-colors ${
                            isBookmarked
                              ? "bg-[#FFF1E8] text-[#F05138]"
                              : "bg-[#FAFAFA] text-[#86868B] hover:text-[#1D1D1F]"
                          }`}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${isBookmarked ? "fill-[#F05138]" : ""}`}
                          />
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-3 text-base font-semibold leading-snug text-[#1D1D1F]">
                      <FormattedQuestionText text={q.question} />
                    </h3>

                    {q.code && <SwiftCodeBlock code={q.code} />}

                    <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {optionOrder.map((origKey, slotIdx) => {
                        const letter = (["A", "B", "C", "D"] as OptionKey[])[slotIdx];
                        const isAns = origKey === q.correctAnswer;
                        const isUserChoice = origKey === chosen;
                        let cls = "border-[#E8E8ED] bg-[#FAFAFA] text-[#515154]";
                        if (isAns) {
                          cls = "border-[#22A06B] bg-[#ECFDF5] text-[#166534] font-semibold";
                        } else if (isUserChoice) {
                          cls = "border-[#E5484D] bg-[#FEF2F2] text-[#991B1B] font-semibold";
                        }

                        return (
                          <div
                            key={origKey}
                            className={`rounded-xl border px-3 py-2 text-xs ${cls}`}
                          >
                            <span className="font-bold">
                              {getDisplayOptionLetter(optionOrder, origKey) || letter}.
                            </span>{" "}
                            {q.options[origKey]}
                          </div>
                        );
                      })}
                    </div>

                    <ExplanationPanel
                      question={q}
                      selectedOriginalKey={chosen}
                      optionOrder={optionOrder}
                    />
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

