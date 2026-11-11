import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  answeredCount?: number;
}

export function ProgressBar({ current, total, answeredCount }: ProgressBarProps) {
  const safeTotal = Math.max(1, total);
  const percent = Math.round(((current + 1) / safeTotal) * 100);

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#86868B]">
        <span>
          Question <strong className="text-[#1D1D1F]">{current + 1}</strong> of{" "}
          <strong className="text-[#1D1D1F]">{total}</strong>
          <span className="hidden sm:inline"> — {percent}% through the quiz</span>
        </span>
        {answeredCount !== undefined && (
          <span>
            <strong className="text-[#1D1D1F]">{answeredCount}</strong>/{total} answered
          </span>
        )}
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-[#E8E8ED]"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current + 1} of ${total}`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#F05138] to-[#FF6B00]"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

