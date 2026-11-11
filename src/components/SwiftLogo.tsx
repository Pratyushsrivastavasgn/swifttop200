export function SwiftLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#F05138] shadow-sm ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="w-[62%] h-[62%] text-white fill-current">
        <path d="M46.5 41.2c-4.9 5.7-12.5 7.6-20.4 4.6-6.1-2.3-11.1-6.9-14.8-12.7 3.8 2.7 8.2 4.3 12.4 4.1-5.4-4-9.6-9.2-12.4-15.1 4.2 3.1 9.3 5.6 14.2 6.4-3.8-4.1-6.3-8.6-7.6-13.2 5.8 5.2 12.7 9.3 20.3 11.8 1.1-5.4 0-11-3.3-15.9 8.7 4.9 15.3 13.3 16 22.9 2.7 1.8 4.6 4.2 5.4 7.1-2.4-1-5-1.2-7.7-.7l-.5.4c-.5.4-1 .8-1.6 1.3z" />
      </svg>
    </div>
  );
}

