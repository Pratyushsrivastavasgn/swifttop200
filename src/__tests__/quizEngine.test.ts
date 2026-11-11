import { describe, expect, it } from "vitest";
import { buildQuestionMap, DEFAULT_QUESTIONS } from "../data/questions";
import {
  buildOptionOrders,
  getDisplayOptionLetter,
  selectQuestionsForQuiz,
} from "../utils/questionSelection";
import {
  parseImportedQuestionBank,
  validateQuestionBank,
} from "../utils/questionValidation";
import { computeAnalytics, evaluateSession } from "../utils/scoring";
import { loadPersistedState } from "../utils/persistence";
import type { OptionKey, QuizSession } from "../types/quiz";

describe("SwiftIQ Question Bank Integrity", () => {
  it("imports all 200 questions cleanly with zero validation issues", () => {
    const report = validateQuestionBank(DEFAULT_QUESTIONS);
    expect(report.totalQuestions).toBe(200);
    expect(report.valid).toBe(true);
    expect(report.flaggedForReview).toBe(0);
    expect(report.issues).toHaveLength(0);
    expect(Object.keys(report.topicCounts)).toHaveLength(11);
  });

  it("preserves exact Swift keypath backslashes in Q45, Q77, Q87, Q92, Q93, Q105", () => {
    const byNum = new Map(DEFAULT_QUESTIONS.map((q) => [q.originalNumber, q]));
    expect(byNum.get(45)?.options.A).toContain("\\.self");
    expect(byNum.get(77)?.options.A).toContain("\\.scenePhase");
    expect(byNum.get(87)?.options.A).toContain("\\.colorScheme");
    expect(byNum.get(92)?.question).toContain("\\.someKey");
    expect(byNum.get(93)?.question).toContain("\\.dismiss");
    expect(byNum.get(105)?.explanation).toContain("\\.dismiss");
  });

  it("verifies spot-checked answer keys from pages 2-5", () => {
    const byNum = new Map(DEFAULT_QUESTIONS.map((q) => [q.originalNumber, q]));
    expect(byNum.get(1)?.correctAnswer).toBe("A");
    expect(byNum.get(2)?.correctAnswer).toBe("B");
    expect(byNum.get(4)?.correctAnswer).toBe("B");
    expect(byNum.get(13)?.correctAnswer).toBe("B");
    expect(byNum.get(21)?.correctAnswer).toBe("B");
    expect(byNum.get(22)?.correctAnswer).toBe("A");
    expect(byNum.get(23)?.correctAnswer).toBe("C");
    expect(byNum.get(30)?.correctAnswer).toBe("B");
    expect(byNum.get(200)?.correctAnswer).toBe("A");
  });
});

describe("Question Selection & Option Order Integrity", () => {
  it("selects exact unique counts for 20, 50, and 100 with broad topic coverage", () => {
    for (const count of [20, 50, 100]) {
      const selected = selectQuestionsForQuiz(DEFAULT_QUESTIONS, count);
      expect(selected).toHaveLength(count);

      const ids = new Set(selected.map((q) => q.id));
      expect(ids.size).toBe(count);

      // Should cover all 11 topics
      const topics = new Set(selected.map((q) => q.topic));
      expect(topics.size).toBe(11);
    }
  });

  it("includes every question once in Complete Mastery (200) and preserves source order by default", () => {
    const ordered = selectQuestionsForQuiz(DEFAULT_QUESTIONS, 200, {
      shuffleAll: false,
    });
    expect(ordered).toHaveLength(200);
    expect(ordered.map((q) => q.originalNumber)).toEqual(
      Array.from({ length: 200 }, (_, i) => i + 1)
    );

    const shuffled = selectQuestionsForQuiz(DEFAULT_QUESTIONS, 200, {
      shuffleAll: true,
    });
    expect(shuffled).toHaveLength(200);
    expect(new Set(shuffled.map((q) => q.id)).size).toBe(200);
  });

  it("preserves original option order by default and maps shuffled letters accurately", () => {
    const sample = DEFAULT_QUESTIONS.slice(0, 10);
    const defaultOrders = buildOptionOrders(sample, false);
    for (const q of sample) {
      expect(defaultOrders[q.id]).toEqual(["A", "B", "C", "D"]);
    }

    const shuffledOrders = buildOptionOrders(sample, true);
    for (const q of sample) {
      const order = shuffledOrders[q.id];
      expect(new Set(order)).toEqual(new Set<OptionKey>(["A", "B", "C", "D"]));
      const displayedLetter = getDisplayOptionLetter(order, q.correctAnswer);
      const slotIdx = ["A", "B", "C", "D"].indexOf(displayedLetter);
      expect(order[slotIdx]).toBe(q.correctAnswer);
    }
  });
});

describe("Scoring, Analytics, and Persistence", () => {
  it("evaluates answers, unanswered counts, and topic accuracy accurately", () => {
    const qMap = buildQuestionMap(DEFAULT_QUESTIONS);
    const q1 = DEFAULT_QUESTIONS[0]; // A
    const q2 = DEFAULT_QUESTIONS[1]; // B
    const q3 = DEFAULT_QUESTIONS[20]; // Topic 2, B

    const session: QuizSession = {
      sessionId: "s-1",
      questionCount: 3,
      questionIds: [q1.id, q2.id, q3.id],
      currentIndex: 2,
      mode: "exam",
      selectedAnswers: {
        [q1.id]: "A", // correct
        [q2.id]: "C", // wrong
        // q3 unanswered
      },
      bookmarkedIds: [q2.id],
      startedAt: 1000,
      completedAt: 61000,
      submitted: true,
    };

    const summary = evaluateSession(session, qMap);
    expect(summary.total).toBe(3);
    expect(summary.correct).toBe(1);
    expect(summary.incorrect).toBe(1);
    expect(summary.unanswered).toBe(1);
    expect(summary.accuracyPercent).toBe(33);
    expect(summary.durationMs).toBe(60000);
    expect(summary.incorrectIds).toEqual([q2.id, q3.id]);
    expect(summary.difficultyBreakdown).toHaveLength(0);

    const overview = computeAnalytics([session], qMap, {});
    expect(overview.completedExamSessions).toBe(1);
    expect(overview.completedPracticeSessions).toBe(0);
    expect(overview.totalQuestionsAnswered).toBe(2);
    expect(overview.overallAccuracyPercent).toBe(50);
  });

  it("recovers safely from malformed persisted JSON in localStorage", () => {
    const prevWindow = globalThis.window;
    // Provide mock localStorage in Node test environment
    const store: Record<string, string> = {
      swiftiq_platform_state_v1: "{broken-json!!!",
    };
    Object.defineProperty(globalThis, "window", {
      value: {
        localStorage: {
          getItem: (k: string) => store[k] ?? null,
          setItem: (k: string, v: string) => {
            store[k] = v;
          },
          removeItem: (k: string) => {
            delete store[k];
          },
        },
      },
      configurable: true,
    });

    const recovered = loadPersistedState();
    expect(recovered.activeSessionId).toBeNull();
    expect(recovered.bookmarks).toEqual([]);
    expect(recovered.sessions).toEqual({});

    Object.defineProperty(globalThis, "window", {
      value: prevWindow,
      configurable: true,
    });
  });

  it("parses CSV/TXT/JSON banks and flags missing answer keys instead of fabricating", () => {
    const rawTxt = `1. Views
Q1. What is a View?
A. Protocol
B. Class
C. Struct only
D. Scene
Answer: A
Explanation: View is a protocol.

Q2. Ambiguous question?
A. Opt 1
B. Opt 2
C. Opt 3
D. Opt 4
Answer: Z
`;
    const parsed = parseImportedQuestionBank(rawTxt, "sample.txt");
    expect(parsed.questions).toHaveLength(2);
    expect(parsed.questions[0].needsReview).toBe(false);
    expect(parsed.questions[1].needsReview).toBe(true);
    expect(parsed.report.flaggedForReview).toBe(1);
  });
});

