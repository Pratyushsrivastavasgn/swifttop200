import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { OptionKey } from "../types/quiz";
import { FormattedQuestionText } from "./SwiftCodeBlock";

export type AnswerVisualState =
  | "idle"
  | "selected"
  | "correct"
  | "incorrect"
  | "dimmed";

interface AnswerOptionProps {
  displayLetter: OptionKey;
  shortcutNumber: number;
  text: string;
  visualState: AnswerVisualState;
  disabled: boolean;
  onSelect: () => void;
}

export function AnswerOption({
  displayLetter,
  shortcutNumber,
  text,
  visualState,
  disabled,
  onSelect,
}: AnswerOptionProps) {
  const containerStyles: Record<AnswerVisualState, string> = {
    idle: "border-[#E8E8ED] bg-white hover:border-[#F05138]/50 hover:bg-[#FFF9F5] text-[#1D1D1F]",
    selected:
      "border-[#F05138] bg-[#FFF1E8] text-[#1D1D1F] ring-1 ring-[#F05138]/30",
    correct:
      "border-[#22A06B] bg-[#ECFDF5] text-[#1D1D1F] ring-1 ring-[#22A06B]/30",
    incorrect:
      "border-[#E5484D] bg-[#FEF2F2] text-[#1D1D1F] ring-1 ring-[#E5484D]/30",
    dimmed: "border-[#E8E8ED] bg-white/70 text-[#86868B]",
  };

  const badgeStyles: Record<AnswerVisualState, string> = {
    idle: "border-[#E8E8ED] bg-[#FAFAFA] text-[#1D1D1F] group-hover:border-[#F05138]/40 group-hover:bg-[#FFF1E8] group-hover:text-[#F05138]",
    selected: "border-[#F05138] bg-[#F05138] text-white",
    correct: "border-[#22A06B] bg-[#22A06B] text-white",
    incorrect: "border-[#E5484D] bg-[#E5484D] text-white",
    dimmed: "border-[#E8E8ED] bg-[#FAFAFA] text-[#86868B]",
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      whileTap={disabled ? undefined : { scale: 0.992 }}
      animate={
        visualState === "incorrect"
          ? { x: [0, -4, 4, -3, 3, 0] }
          : visualState === "correct"
            ? { scale: [1, 1.01, 1] }
            : { x: 0, scale: 1 }
      }
      transition={{ duration: 0.28 }}
      aria-pressed={visualState === "selected" || visualState === "correct" || visualState === "incorrect"}
      className={`group flex w-full items-center justify-between gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all duration-150 sm:px-5 sm:py-4 ${
        containerStyles[visualState]
      } ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${badgeStyles[visualState]}`}
        >
          {displayLetter}
        </span>
        <span className="text-[15px] font-medium leading-snug sm:text-[15.5px]">
          <FormattedQuestionText text={text} />
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {visualState === "correct" && (
          <CheckCircle2 className="h-5 w-5 text-[#22A06B]" aria-label="Correct answer" />
        )}
        {visualState === "incorrect" && (
          <XCircle className="h-5 w-5 text-[#E5484D]" aria-label="Incorrect answer" />
        )}
        {visualState === "idle" && !disabled && (
          <kbd className="hidden rounded-md border border-[#E8E8ED] bg-[#FAFAFA] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#86868B] group-hover:border-[#F05138]/30 group-hover:text-[#F05138] sm:inline-block">
            {shortcutNumber}
          </kbd>
        )}
      </div>
    </motion.button>
  );
}

