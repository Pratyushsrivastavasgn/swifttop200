import type {
  Difficulty,
  IncorrectRecord,
  OptionKey,
  Question,
  QuizSession,
} from "../types/quiz";

export interface TopicStat {
  topic: string;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracyPercent: number;
}

export interface DifficultyStat {
  difficulty: Difficulty;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracyPercent: number;
}

export interface SessionScoreSummary {
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  answered: number;
  accuracyPercent: number;
  durationMs: number;
  performanceLabel: string;
  topicBreakdown: TopicStat[];
  difficultyBreakdown: DifficultyStat[];
  incorrectIds: string[];
}

export function getPerformanceLabel(accuracyPercent: number): string {
  if (accuracyPercent >= 90) return "Excellent Performance";
  if (accuracyPercent >= 75) return "Strong Progress";
  if (accuracyPercent >= 50) return "Solid Foundation";
  return "Needs Focused Review";
}

export function evaluateSession(
  session: QuizSession,
  questionMap: Map<string, Question>
): SessionScoreSummary {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  const incorrectIds: string[] = [];

  const topicMap = new Map<
    string,
    { total: number; correct: number; incorrect: number; unanswered: number }
  >();
  const diffMap = new Map<
    Difficulty,
    { total: number; correct: number; incorrect: number; unanswered: number }
  >();

  for (const qId of session.questionIds) {
    const q = questionMap.get(qId);
    if (!q) continue;

    const chosen = session.selectedAnswers[qId] as OptionKey | undefined;
    const isAnswered = chosen === "A" || chosen === "B" || chosen === "C" || chosen === "D";
    const isCorrect = isAnswered && chosen === q.correctAnswer;

    if (!isAnswered) {
      unanswered++;
      incorrectIds.push(qId);
    } else if (isCorrect) {
      correct++;
    } else {
      incorrect++;
      incorrectIds.push(qId);
    }

    const topicName = q.topic ?? "General";
    const tEntry = topicMap.get(topicName) ?? {
      total: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0,
    };
    tEntry.total++;
    if (!isAnswered) tEntry.unanswered++;
    else if (isCorrect) tEntry.correct++;
    else tEntry.incorrect++;
    topicMap.set(topicName, tEntry);

    if (q.difficulty) {
      const dEntry = diffMap.get(q.difficulty) ?? {
        total: 0,
        correct: 0,
        incorrect: 0,
        unanswered: 0,
      };
      dEntry.total++;
      if (!isAnswered) dEntry.unanswered++;
      else if (isCorrect) dEntry.correct++;
      else dEntry.incorrect++;
      diffMap.set(q.difficulty, dEntry);
    }
  }

  const total = session.questionIds.length;
  const answered = correct + incorrect;
  const accuracyPercent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const endRef = session.completedAt ?? Date.now();
  const cappedEnd = session.deadlineAt ? Math.min(endRef, session.deadlineAt) : endRef;
  const durationMs = Math.max(0, cappedEnd - session.startedAt);

  const topicBreakdown: TopicStat[] = Array.from(topicMap.entries()).map(
    ([topic, s]) => ({
      topic,
      ...s,
      accuracyPercent: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    })
  );

  const difficultyBreakdown: DifficultyStat[] = Array.from(diffMap.entries()).map(
    ([difficulty, s]) => ({
      difficulty,
      ...s,
      accuracyPercent: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    })
  );

  return {
    total,
    correct,
    incorrect,
    unanswered,
    answered,
    accuracyPercent,
    durationMs,
    performanceLabel: getPerformanceLabel(accuracyPercent),
    topicBreakdown,
    difficultyBreakdown,
    incorrectIds,
  };
}

export interface AnalyticsOverview {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  overallAccuracyPercent: number;
  completedPracticeSessions: number;
  completedExamSessions: number;
  bestByLength: Record<number, { bestCorrect: number; total: number; bestPercent: number; attempts: number } | null>;
  topicStats: TopicStat[];
  mostMissedTopics: TopicStat[];
  submittedSessions: Array<{ session: QuizSession; summary: SessionScoreSummary }>;
}

export function computeAnalytics(
  sessions: QuizSession[],
  questionMap: Map<string, Question>,
  _incorrectHistory: Record<string, IncorrectRecord>
): AnalyticsOverview {
  const submitted = sessions
    .filter((s) => s.submitted)
    .sort((a, b) => (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt));

  let totalQuestionsAnswered = 0;
  let totalCorrect = 0;
  let completedPracticeSessions = 0;
  let completedExamSessions = 0;

  const bestByLength: AnalyticsOverview["bestByLength"] = {
    20: null,
    50: null,
    100: null,
    200: null,
  };

  const topicAgg = new Map<
    string,
    { total: number; correct: number; incorrect: number; unanswered: number }
  >();

  const submittedSessions: Array<{ session: QuizSession; summary: SessionScoreSummary }> = [];

  for (const session of submitted) {
    const summary = evaluateSession(session, questionMap);
    submittedSessions.push({ session, summary });

    totalQuestionsAnswered += summary.answered;
    totalCorrect += summary.correct;

    if (session.mode === "practice") completedPracticeSessions++;
    else completedExamSessions++;

    if (
      session.questionCount === 20 ||
      session.questionCount === 50 ||
      session.questionCount === 100 ||
      session.questionCount === 200
    ) {
      const existing = bestByLength[session.questionCount];
      if (!existing) {
        bestByLength[session.questionCount] = {
          bestCorrect: summary.correct,
          total: summary.total,
          bestPercent: summary.accuracyPercent,
          attempts: 1,
        };
      } else {
        existing.attempts++;
        if (summary.accuracyPercent > existing.bestPercent || (summary.accuracyPercent === existing.bestPercent && summary.correct > existing.bestCorrect)) {
          existing.bestPercent = summary.accuracyPercent;
          existing.bestCorrect = summary.correct;
        }
      }
    }

    for (const t of summary.topicBreakdown) {
      const prev = topicAgg.get(t.topic) ?? {
        total: 0,
        correct: 0,
        incorrect: 0,
        unanswered: 0,
      };
      prev.total += t.total;
      prev.correct += t.correct;
      prev.incorrect += t.incorrect;
      prev.unanswered += t.unanswered;
      topicAgg.set(t.topic, prev);
    }
  }

  const overallAccuracyPercent =
    totalQuestionsAnswered > 0
      ? Math.round((totalCorrect / totalQuestionsAnswered) * 100)
      : 0;

  const topicStats: TopicStat[] = Array.from(topicAgg.entries()).map(([topic, s]) => ({
    topic,
    ...s,
    accuracyPercent: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
  }));

  const mostMissedTopics = [...topicStats]
    .filter((t) => t.incorrect > 0)
    .sort((a, b) => b.incorrect - a.incorrect || a.accuracyPercent - b.accuracyPercent)
    .slice(0, 4);

  return {
    totalQuestionsAnswered,
    totalCorrect,
    overallAccuracyPercent,
    completedPracticeSessions,
    completedExamSessions,
    bestByLength,
    topicStats,
    mostMissedTopics,
    submittedSessions,
  };
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

