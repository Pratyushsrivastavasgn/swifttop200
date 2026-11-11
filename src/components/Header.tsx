import { BarChart3, Bookmark, Home, PlayCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";
import { SwiftLogo } from "./SwiftLogo";

export function Header() {
  const location = useLocation();
  const { activeSession, state, bank } = useProgress();

  const isQuizRoute = location.pathname.startsWith("/quiz/");
  if (isQuizRoute) {
    // Quiz screen renders its own focused, distraction-free header
    return null;
  }

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    {
      to: "/bookmarks",
      label: "Revision",
      badge: state.bookmarks.length > 0 ? state.bookmarks.length : undefined,
      icon: Bookmark,
    },
    { to: "/dashboard", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E8ED] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-3 rounded-xl focus-visible:outline-none"
        >
          <SwiftLogo className="h-9 w-9 transition-transform duration-200 group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-semibold tracking-tight text-[#1D1D1F]">
                SwiftIQ
              </span>
              <span className="hidden rounded-full bg-[#FFF1E8] px-2 py-0.5 text-[11px] font-semibold text-[#F05138] sm:inline-block">
                {bank.length} MCQs
              </span>
            </div>
            <span className="hidden text-[11px] text-[#86868B] sm:block">
              SwiftUI & Swift Concurrency Prep
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
          {navItems.map(({ to, label, badge, icon: Icon }) => {
            const active =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#FFF1E8] text-[#F05138]"
                    : "text-[#86868B] hover:bg-[#F2F2F7] hover:text-[#1D1D1F]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {badge !== undefined && (
                  <span className="ml-0.5 rounded-full bg-[#F05138] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}

          {activeSession && (
            <Link
              to={`/quiz/${activeSession.sessionId}`}
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F05138] to-[#FF6B00] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Resume</span>
              <span>
                {activeSession.currentIndex + 1}/{activeSession.questionCount}
              </span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

