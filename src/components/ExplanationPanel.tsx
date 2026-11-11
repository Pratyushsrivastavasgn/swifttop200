import { motion } from "framer-motion";
import { CheckCircle2, Lightbulb, Sparkles, XCircle } from "lucide-react";
import { STUDY_NOTES } from "../data/studyNotes";
import type { OptionKey, Question } from "../types/quiz";
import { getDisplayOptionLetter } from "../utils/questionSelection";
import { FormattedQuestionText } from "./SwiftCodeBlock";

interface ExplanationPanelProps {
  question: Question;
  selectedOriginalKey?: OptionKey;
  optionOrder?: OptionKey[];
}

export function ExplanationPanel({
  question,
  selectedOriginalKey,
  optionOrder = ["A", "B", "C", "D"],
}: ExplanationPanelProps) {
  const isCorrect = selectedOriginalKey === question.correctAnswer;
  const studyNote = STUDY_NOTES[question.originalNumber];
  const optionExplanations =
    question.optionExplanations ?? studyNote?.optionExplanations;
  const examTip = question.examTip ?? studyNote?.examTip;

  const displayedSelectedLetter = selectedOriginalKey
    ? getDisplayOptionLetter(optionOrder, selectedOriginalKey)
    : undefined;
  const displayedCorrectLetter = getDisplayOptionLetter(
    optionOrder,
    question.correctAnswer
  );

  // Build ordered list of wrong-option rationales matching displayed option letters
  const distractorEntries = optionOrder
    .map((origKey, idx) => {
      const displayLetter = (["A", "B", "C", "D"] as OptionKey[])[idx];
      const text = optionExplanations?.[origKey];
      if (!text || origKey === question.correctAnswer) return null;
      return {
        origKey,
        displayLetter,
        optionText: question.options[origKey],
        rationale: text,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="mt-5 overflow-hidden rounded-3xl border border-[#E8E8ED] bg-white shadow-apple"
    >
      {/* Top Status Banner */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3.5 ${
          isCorrect
            ? "border-[#22A06B]/20 bg-[#ECFDF5]"
            : selectedOriginalKey
              ? "border-[#E5484D]/20 bg-[#FEF2F2]"
              : "border-[#E8E8ED] bg-[#FAFAFA]"
        }`}
      >
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-[#22A06B]" />
              <span className="text-sm font-semibold text-[#166534]">
                Correct Answer
              </span>
            </>
          ) : selectedOriginalKey ? (
            <>
              <XCircle className="h-5 w-5 text-[#E5484D]" />
              <span className="text-sm font-semibold text-[#991B1B]">
                Incorrect Selection
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#86868B]">
              Unanswered
            </span>
          )}
        </div>

        <span className="text-xs font-medium text-[#86868B]">
          Source Q#{question.originalNumber}
        </span>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {/* Answer Comparison */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E8E8ED] bg-[#FAFAFA] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
              Your Answer
            </div>
            <div
              className={`mt-1 text-sm font-semibold ${
                isCorrect
                  ? "text-[#22A06B]"
                  : selectedOriginalKey
                    ? "text-[#E5484D]"
                    : "text-[#86868B]"
              }`}
            >
              {selectedOriginalKey && displayedSelectedLetter ? (
                <>
                  {displayedSelectedLetter}.{" "}
                  {question.options[selectedOriginalKey]}
                </>
              ) : (
                "No option selected"
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#22A06B]/25 bg-[#ECFDF5]/70 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#22A06B]">
              Correct Answer
            </div>
            <div className="mt-1 text-sm font-semibold text-[#1D1D1F]">
              {displayedCorrectLetter}.{" "}
              {question.options[question.correctAnswer]}
            </div>
          </div>
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868B]">
              Explanation
            </h3>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#1D1D1F]">
              <FormattedQuestionText text={question.explanation} />
            </p>
          </div>
        )}

        {/* Why Other Options Are Wrong */}
        {distractorEntries.length > 0 && (
          <div className="border-t border-[#E8E8ED] pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868B]">
              Why Other Options Are Wrong
            </h3>
            <ul className="mt-2.5 space-y-2">
              {distractorEntries.map((entry) => (
                <li
                  key={entry.origKey}
                  className="rounded-xl bg-[#FAFAFA] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-[#515154]"
                >
                  <span className="font-semibold text-[#1D1D1F]">
                    {entry.displayLetter} ({entry.optionText}):
                  </span>{" "}
                  <FormattedQuestionText text={entry.rationale} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exam Tip */}
        {examTip && (
          <div className="flex items-start gap-3 rounded-2xl border border-[#F05138]/20 bg-[#FFF1E8] px-4 py-3.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#F05138] text-white">
              {isCorrect ? (
                <Sparkles className="h-3.5 w-3.5" />
              ) : (
                <Lightbulb className="h-3.5 w-3.5" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#F05138]">
                Exam Tip
              </div>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#1D1D1F]">
                <FormattedQuestionText text={examTip} />
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

