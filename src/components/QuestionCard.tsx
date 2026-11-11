import { AlertCircle } from "lucide-react";
import type { Question } from "../types/quiz";
import { FormattedQuestionText, SwiftCodeBlock } from "./SwiftCodeBlock";

interface QuestionCardProps {
  question: Question;
  displayNumber: number;
  totalQuestions: number;
}

const DIFFICULTY_STYLES = {
  easy: "bg-[#ECFDF5] text-[#22A06B] border-[#22A06B]/20",
  medium: "bg-[#FFF1E8] text-[#F05138] border-[#F05138]/20",
  hard: "bg-[#FEF2F2] text-[#E5484D] border-[#E5484D]/20",
} as const;

export function QuestionCard({
  question,
  displayNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="rounded-3xl border border-[#E8E8ED] bg-white p-5 shadow-apple sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F05138]">
            Question {displayNumber}
          </span>
          <span className="text-xs text-[#86868B]">of {totalQuestions}</span>
          <span className="rounded-md bg-[#FAFAFA] px-2 py-0.5 font-mono text-[11px] font-medium text-[#86868B] ring-1 ring-[#E8E8ED]">
            Source #{question.originalNumber}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {question.difficulty && (
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                DIFFICULTY_STYLES[question.difficulty]
              }`}
            >
              {question.difficulty}
            </span>
          )}
          {question.topic && (
            <span className="rounded-full bg-[#FFF1E8] px-3 py-1 text-[11.5px] font-semibold text-[#F05138]">
              {question.topic}
            </span>
          )}
        </div>
      </div>

      {question.needsReview && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-[#FF6B00]/30 bg-[#FFF1E8] px-3.5 py-2.5 text-xs text-[#9A3412]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F05138]" />
          <span>
            {question.reviewNote ??
              "This imported question was flagged for answer-key review."}
          </span>
        </div>
      )}

      <h1 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-[#1D1D1F] sm:text-[21px]">
        <FormattedQuestionText text={question.question} />
      </h1>

      {question.code && <SwiftCodeBlock code={question.code} />}
    </div>
  );
}

