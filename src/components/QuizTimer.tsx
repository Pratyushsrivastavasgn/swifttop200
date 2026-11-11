import { Clock, AlertTriangle } from "lucide-react";

interface QuizTimerProps {
  formatted: string;
  isWarning: boolean;
  isCritical: boolean;
}

export function QuizTimer({ formatted, isWarning, isCritical }: QuizTimerProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs font-semibold tabular-nums transition-colors ${
        isCritical
          ? "animate-pulse border-[#E5484D]/40 bg-[#FEF2F2] text-[#E5484D]"
          : isWarning
            ? "border-[#FF6B00]/40 bg-[#FFF1E8] text-[#F05138]"
            : "border-[#E8E8ED] bg-white text-[#1D1D1F]"
      }`}
      aria-live="off"
      aria-label={`Time remaining: ${formatted}`}
    >
      {isCritical ? (
        <AlertTriangle className="h-3.5 w-3.5 text-[#E5484D]" />
      ) : (
        <Clock
          className={`h-3.5 w-3.5 ${
            isWarning ? "text-[#F05138]" : "text-[#86868B]"
          }`}
        />
      )}
      <span>{formatted}</span>
    </div>
  );
}

