import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  secondaryLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onSecondary?: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  secondaryLabel,
  destructive = false,
  onConfirm,
  onSecondary,
  onCancel,
  children,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onCancel}
            className="fixed inset-0 bg-[#1D1D1F]/35 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="confirm-modal-title"
                className="text-lg font-semibold tracking-tight text-[#1D1D1F]"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Close modal"
                className="rounded-full p-1 text-[#86868B] transition-colors hover:bg-[#F2F2F7] hover:text-[#1D1D1F]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#86868B]">
              {description}
            </p>
            {children && <div className="mt-4">{children}</div>}
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-[#E8E8ED] bg-white px-4 py-2.5 text-sm font-medium text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7]"
              >
                {cancelLabel}
              </button>
              {secondaryLabel && onSecondary && (
                <button
                  type="button"
                  onClick={onSecondary}
                  className="rounded-xl border border-[#E8E8ED] bg-[#FFF1E8] px-4 py-2.5 text-sm font-semibold text-[#F05138] transition-colors hover:bg-[#FFE3D1]"
                >
                  {secondaryLabel}
                </button>
              )}
              <button
                type="button"
                onClick={onConfirm}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all ${
                  destructive
                    ? "bg-[#E5484D] hover:bg-[#D1363B]"
                    : "bg-gradient-to-r from-[#F05138] to-[#FF6B00] hover:opacity-95"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

