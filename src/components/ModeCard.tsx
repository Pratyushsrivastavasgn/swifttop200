import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Check,
  Flame,
  Layers,
  Target,
  Zap,
} from "lucide-react";
import type { ModeDefinition } from "../types/quiz";

interface ModeCardProps {
  mode: ModeDefinition;
  availableCount: number;
  bestScore?: { bestCorrect: number; total: number; bestPercent: number; attempts: number } | null;
  index: number;
  onSelect: (mode: ModeDefinition) => void;
}

const MODE_ICONS = {
  20: Zap,
  50: Layers,
  100: Flame,
  200: Award,
} as const;

export function ModeCard({
  mode,
  availableCount,
  bestScore,
  index,
  onSelect,
}: ModeCardProps) {
  const Icon = MODE_ICONS[mode.count] ?? Target;
  const isDisabled = availableCount < mode.count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={isDisabled ? undefined : { y: -4 }}
      className={`group relative flex flex-col justify-between rounded-[22px] border bg-white p-6 transition-all duration-200 sm:p-7 ${
        isDisabled
          ? "border-[#E8E8ED] opacity-60"
          : "border-[#E8E8ED] shadow-apple hover:border-[#F05138]/40 hover:shadow-apple-hover"
      }`}
    >
      <div>
        {/* Top Row: Orange Icon + Giant Question Count */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1E8] text-[#F05138] transition-colors duration-200 group-hover:bg-[#F05138] group-hover:text-white">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
                {mode.title}
              </h2>
              <p className="mt-0.5 text-sm text-[#86868B]">{mode.subtitle}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-3xl font-bold tracking-tight text-[#1D1D1F] sm:text-4xl">
              {mode.count}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
              Questions
            </span>
          </div>
        </div>

        {/* Best score pill if user has real recorded attempts */}
        {bestScore && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FAFAFA] px-3 py-1 text-xs font-medium text-[#1D1D1F] ring-1 ring-[#E8E8ED]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22A06B]" />
            <span>
              Best: {bestScore.bestCorrect}/{bestScore.total} ({bestScore.bestPercent}%)
            </span>
            <span className="text-[#86868B]">•</span>
            <span className="text-[#86868B]">
              {bestScore.attempts} {bestScore.attempts === 1 ? "attempt" : "attempts"}
            </span>
          </div>
        )}

        {/* Feature list */}
        <ul className="mt-5 space-y-2">
          {mode.features.map((feat) => (
            <li
              key={feat}
              className="flex items-center gap-2.5 text-[13.5px] text-[#515154]"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FFF1E8] text-[#F05138]">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Prominent Swift Orange Start Button */}
      <div className="mt-6 pt-2">
        {isDisabled ? (
          <div className="rounded-2xl border border-dashed border-[#E8E8ED] bg-[#FAFAFA] px-4 py-3 text-center text-xs font-medium text-[#86868B]">
            Requires {mode.count} verified questions ({availableCount} available in current bank)
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSelect(mode)}
            className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#F05138] to-[#FF6B00] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:brightness-105 active:scale-[0.99]"
          >
            <span>{mode.buttonLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

