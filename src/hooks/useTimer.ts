import { useEffect, useRef, useState } from "react";
import { formatCountdown } from "../utils/scoring";

interface UseTimerOptions {
  deadlineAt?: number;
  totalDurationMs?: number;
  paused?: boolean;
  onExpire: () => void;
}

export function useTimer({
  deadlineAt,
  totalDurationMs,
  paused = false,
  onExpire,
}: UseTimerOptions) {
  const [now, setNow] = useState(() => Date.now());
  const firedRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    firedRef.current = false;
  }, [deadlineAt]);

  useEffect(() => {
    if (!deadlineAt || paused) return;

    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= deadlineAt && !firedRef.current) {
        firedRef.current = true;
        onExpireRef.current();
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [deadlineAt, paused]);

  if (!deadlineAt) {
    return {
      enabled: false,
      remainingMs: 0,
      isWarning: false,
      isCritical: false,
      formatted: "",
    };
  }

  const remainingMs = Math.max(0, deadlineAt - now);
  const warningThreshold = totalDurationMs ? Math.min(120_000, totalDurationMs * 0.15) : 120_000;
  const isCritical = remainingMs <= 60_000;
  const isWarning = remainingMs <= warningThreshold;

  return {
    enabled: true,
    remainingMs,
    isWarning,
    isCritical,
    formatted: formatCountdown(remainingMs),
  };
}

