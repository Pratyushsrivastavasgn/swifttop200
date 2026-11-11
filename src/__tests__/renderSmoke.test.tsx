import { renderToString } from "react-dom/server";
import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { describe, expect, it } from "vitest";
import { Header } from "../components/Header";
import { DEFAULT_QUESTIONS } from "../data/questions";
import { ProgressProvider } from "../hooks/useProgress";
import { Bookmarks } from "../pages/Bookmarks";
import { Dashboard } from "../pages/Dashboard";
import { Home } from "../pages/Home";
import { Quiz } from "../pages/Quiz";
import { QuizSetup } from "../pages/QuizSetup";
import { Results } from "../pages/Results";
import type { PersistedState } from "../types/quiz";

function renderRoute(initialPath: string): string {
  const html = renderToString(
    <ProgressProvider>
      <StaticRouter location={initialPath}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup/:countParam" element={<QuizSetup />} />
          <Route path="/quiz/:sessionId" element={<Quiz />} />
          <Route path="/results/:sessionId" element={<Results />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </StaticRouter>
    </ProgressProvider>
  );
  return html.replace(/<!--\s*-->/g, "");
}

describe("SwiftIQ Pages SSR Smoke Tests", () => {
  it("renders Homepage with all four quiz modes", () => {
    const html = renderRoute("/");
    expect(html).toContain("Quick Test");
    expect(html).toContain("Practice Test");
    expect(html).toContain("Intensive Test");
    expect(html).toContain("Complete Mastery");
    expect(html).toContain("Start 20 Questions");
    expect(html).toContain("Start 50 Questions");
    expect(html).toContain("Start 100 Questions");
    expect(html).toContain("Start All 200 Questions");
    expect(html).toContain("200 Verified Questions Imported");
  });

  it("renders QuizSetup for Practice and Exam modes", () => {
    const html20 = renderRoute("/setup/20");
    expect(html20).toContain("Practice Mode");
    expect(html20).toContain("Exam Mode");

    const html200 = renderRoute("/setup/200");
    expect(html200).toContain("Complete Mastery");
    expect(html200).toContain("Shuffle Question Order");
  });

  it("renders Bookmarks and Dashboard pages cleanly", () => {
    const bookmarksHtml = renderRoute("/bookmarks");
    expect(bookmarksHtml).toContain("Bookmarks &amp; Revision Library");

    const dashboardHtml = renderRoute("/dashboard");
    expect(dashboardHtml).toContain("Analytics &amp; Question Bank");
    expect(dashboardHtml).toContain("200 questions validated");
  });

  it("renders Quiz (one question at a time) and Results pages cleanly from persisted state", () => {
    const sampleIds = DEFAULT_QUESTIONS.slice(0, 20).map((q) => q.id);
    const mockState: PersistedState = {
      version: 1,
      activeSessionId: "active-20",
      bookmarks: [sampleIds[0]],
      incorrectHistory: {},
      customBank: null,
      customBankName: null,
      sessions: {
        "active-20": {
          sessionId: "active-20",
          title: "Quick Test",
          source: "mode-20",
          questionCount: 20,
          questionIds: sampleIds,
          currentIndex: 0,
          mode: "practice",
          selectedAnswers: {},
          bookmarkedIds: [],
          startedAt: Date.now(),
          submitted: false,
        },
        "done-20": {
          sessionId: "done-20",
          title: "Quick Test",
          source: "mode-20",
          questionCount: 20,
          questionIds: sampleIds,
          currentIndex: 19,
          mode: "exam",
          selectedAnswers: {
            [sampleIds[0]]: "A",
            [sampleIds[1]]: "B",
          },
          bookmarkedIds: [],
          startedAt: Date.now() - 120000,
          completedAt: Date.now(),
          submitted: true,
        },
      },
    };

    const prevWindow = globalThis.window;
    Object.defineProperty(globalThis, "window", {
      value: {
        localStorage: {
          getItem: (k: string) =>
            k === "swiftiq_platform_state_v1" ? JSON.stringify(mockState) : null,
          setItem: () => {},
          removeItem: () => {},
        },
      },
      configurable: true,
    });

    try {
      const quizHtml = renderRoute("/quiz/active-20");
      expect(quizHtml).toContain("Question 1 of 20");
      expect(quizHtml).toContain(DEFAULT_QUESTIONS[0].question);
      expect(quizHtml).not.toContain(DEFAULT_QUESTIONS[1].question);

      const resultsHtml = renderRoute("/results/done-20");
      expect(resultsHtml).toContain("Your SwiftUI Score");
      expect(resultsHtml).toContain("2 / 20");
      expect(resultsHtml).toContain("10% Accuracy");
    } finally {
      Object.defineProperty(globalThis, "window", {
        value: prevWindow,
        configurable: true,
      });
    }
  });
});
