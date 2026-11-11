import type { OptionKey, Question, ValidationIssue, ValidationReport } from "../types/quiz";

const VALID_KEYS: OptionKey[] = ["A", "B", "C", "D"];

export function validateQuestionBank(questions: Question[]): ValidationReport {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNumbers = new Set<number>();
  const topicCounts: Record<string, number> = {};
  let flaggedForReview = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    if (!q.id || typeof q.id !== "string" || q.id.trim() === "") {
      issues.push({
        type: "malformed-options",
        originalNumber: q.originalNumber,
        message: `Question at index ${i} is missing a valid string ID.`,
      });
    } else if (seenIds.has(q.id)) {
      issues.push({
        type: "duplicate-id",
        questionId: q.id,
        originalNumber: q.originalNumber,
        message: `Duplicate question ID "${q.id}".`,
      });
    } else {
      seenIds.add(q.id);
    }

    if (typeof q.originalNumber !== "number" || !Number.isFinite(q.originalNumber)) {
      issues.push({
        type: "missing-question",
        questionId: q.id,
        message: `Question "${q.id}" is missing a valid originalNumber.`,
      });
    } else if (seenNumbers.has(q.originalNumber)) {
      issues.push({
        type: "duplicate-number",
        questionId: q.id,
        originalNumber: q.originalNumber,
        message: `Duplicate originalNumber Q${q.originalNumber}.`,
      });
    } else {
      seenNumbers.add(q.originalNumber);
    }

    if (!q.question || q.question.trim() === "") {
      issues.push({
        type: "missing-question",
        questionId: q.id,
        originalNumber: q.originalNumber,
        message: `Q${q.originalNumber ?? i + 1} has empty question text.`,
      });
    }

    if (!q.options || typeof q.options !== "object") {
      issues.push({
        type: "malformed-options",
        questionId: q.id,
        originalNumber: q.originalNumber,
        message: `Q${q.originalNumber ?? i + 1} is missing options object.`,
      });
    } else {
      for (const key of VALID_KEYS) {
        const val = q.options[key];
        if (typeof val !== "string" || val.trim() === "") {
          issues.push({
            type: "malformed-options",
            questionId: q.id,
            originalNumber: q.originalNumber,
            message: `Q${q.originalNumber ?? i + 1} has missing or empty option ${key}.`,
          });
        }
      }
    }

    if (!VALID_KEYS.includes(q.correctAnswer)) {
      issues.push({
        type: "invalid-answer",
        questionId: q.id,
        originalNumber: q.originalNumber,
        message: `Q${q.originalNumber ?? i + 1} has invalid correctAnswer "${String(q.correctAnswer)}".`,
      });
    }

    if (q.needsReview) {
      flaggedForReview++;
      issues.push({
        type: "needs-review",
        questionId: q.id,
        originalNumber: q.originalNumber,
        message: q.reviewNote ?? `Q${q.originalNumber ?? i + 1} is flagged for review.`,
      });
    }

    const topic = q.topic?.trim() || "General";
    topicCounts[topic] = (topicCounts[topic] ?? 0) + 1;
  }

  // Check sequential coverage 1..N when numbers look 1-based
  if (seenNumbers.size > 0) {
    const maxNum = Math.max(...seenNumbers);
    if (maxNum === questions.length) {
      for (let num = 1; num <= maxNum; num++) {
        if (!seenNumbers.has(num)) {
          issues.push({
            type: "missing-question",
            originalNumber: num,
            message: `Missing sequential source question Q${num}.`,
          });
        }
      }
    }
  }

  const criticalIssues = issues.filter((issue) => issue.type !== "needs-review");

  return {
    valid: criticalIssues.length === 0,
    totalQuestions: questions.length,
    topicCounts,
    flaggedForReview,
    issues,
  };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeAnswerKey(raw: string | undefined): { key: OptionKey; needsReview: boolean; note?: string } {
  const cleaned = (raw ?? "").trim().toUpperCase().replace(/[^A-D]/g, "");
  if (cleaned === "A" || cleaned === "B" || cleaned === "C" || cleaned === "D") {
    return { key: cleaned, needsReview: false };
  }
  return {
    key: "A",
    needsReview: true,
    note: `Ambiguous or missing answer key ("${raw ?? ""}") — flagged for review.`,
  };
}

/**
 * Parses imported JSON, CSV, TXT, or Markdown question banks without rewriting
 * source wording or fabricating missing answer keys.
 */
export function parseImportedQuestionBank(
  rawText: string,
  fileName: string
): { questions: Question[]; report: ValidationReport; warnings: string[] } {
  const warnings: string[] = [];
  const lower = fileName.toLowerCase();
  let questions: Question[] = [];

  if (lower.endsWith(".json") || rawText.trim().startsWith("[") || rawText.trim().startsWith("{")) {
    const parsed = JSON.parse(rawText);
    const arr: unknown[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.questions)
        ? parsed.questions
        : [];
    questions = arr.map((item, idx) => {
      const obj = item as Record<string, unknown>;
      const rawOptions = (obj.options ?? {}) as Record<string, unknown>;
      const ans = normalizeAnswerKey(String(obj.correctAnswer ?? obj.answer ?? ""));
      return {
        id: String(obj.id || `imported-q${String(idx + 1).padStart(3, "0")}`),
        originalNumber: Number(obj.originalNumber ?? obj.number ?? idx + 1),
        topic: typeof obj.topic === "string" ? obj.topic : undefined,
        difficulty:
          obj.difficulty === "easy" || obj.difficulty === "medium" || obj.difficulty === "hard"
            ? obj.difficulty
            : undefined,
        question: String(obj.question ?? ""),
        code: typeof obj.code === "string" ? obj.code : undefined,
        options: {
          A: String(rawOptions.A ?? obj.optionA ?? obj.A ?? ""),
          B: String(rawOptions.B ?? obj.optionB ?? obj.B ?? ""),
          C: String(rawOptions.C ?? obj.optionC ?? obj.C ?? ""),
          D: String(rawOptions.D ?? obj.optionD ?? obj.D ?? ""),
        },
        correctAnswer: ans.key,
        explanation: typeof obj.explanation === "string" ? obj.explanation : undefined,
        examTip: typeof obj.examTip === "string" ? obj.examTip : undefined,
        needsReview: ans.needsReview || Boolean(obj.needsReview),
        reviewNote: ans.note,
      };
    });
  } else if (lower.endsWith(".csv")) {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) {
      throw new Error("CSV file must contain a header row and at least one question row.");
    }
    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
    const col = (nameVariants: string[]) =>
      headers.findIndex((h) => nameVariants.includes(h));

    const idxNum = col(["originalnumber", "number", "no", "#"]);
    const idxTopic = col(["topic", "category", "section"]);
    const idxQ = col(["question", "prompt", "text"]);
    const idxCode = col(["code", "snippet"]);
    const idxA = col(["a", "optiona", "option_a"]);
    const idxB = col(["b", "optionb", "option_b"]);
    const idxC = col(["c", "optionc", "option_c"]);
    const idxD = col(["d", "optiond", "option_d"]);
    const idxAns = col(["correctanswer", "answer", "key"]);
    const idxExp = col(["explanation", "rationale"]);

    questions = lines.slice(1).map((line, i) => {
      const cells = parseCsvLine(line);
      const ans = normalizeAnswerKey(idxAns >= 0 ? cells[idxAns] : "");
      const num = idxNum >= 0 && Number(cells[idxNum]) ? Number(cells[idxNum]) : i + 1;
      return {
        id: `imported-q${String(num).padStart(3, "0")}`,
        originalNumber: num,
        topic: idxTopic >= 0 ? cells[idxTopic] || undefined : undefined,
        question: idxQ >= 0 ? cells[idxQ] ?? "" : "",
        code: idxCode >= 0 ? cells[idxCode] || undefined : undefined,
        options: {
          A: idxA >= 0 ? cells[idxA] ?? "" : "",
          B: idxB >= 0 ? cells[idxB] ?? "" : "",
          C: idxC >= 0 ? cells[idxC] ?? "" : "",
          D: idxD >= 0 ? cells[idxD] ?? "" : "",
        },
        correctAnswer: ans.key,
        explanation: idxExp >= 0 ? cells[idxExp] || undefined : undefined,
        needsReview: ans.needsReview,
        reviewNote: ans.note,
      };
    });
  } else {
    // TXT / Markdown structured parser (matches Q1. ... A. ... B. ... C. ... D. ... Answer: X ... Explanation: ...)
    const blocks = rawText.split(/(?=^#{0,3}\s*Q\d+[.:)])/m).filter((b) => /^\s*#{0,3}\s*Q\d+[.:)]/i.test(b));
    let currentTopic: string | undefined;

    for (const rawBlock of blocks) {
      const lines = rawBlock.split(/\r?\n/);
      const headerMatch = lines[0].match(/Q(\d+)[.:)]\s*(.+)/i);
      if (!headerMatch) continue;
      const num = Number(headerMatch[1]);
      let questionText = headerMatch[2].trim();
      const opts: Record<OptionKey, string> = { A: "", B: "", C: "", D: "" };
      let answerRaw = "";
      let explanation = "";
      let mode: "q" | "exp" = "q";

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const topicMatch = line.match(/^\d+\.\s+([A-Z].+)$/);
        if (topicMatch) {
          currentTopic = topicMatch[1].trim();
          continue;
        }
        const optMatch = line.match(/^([A-D])[.)]\s+(.+)$/);
        if (optMatch) {
          opts[optMatch[1] as OptionKey] = optMatch[2].trim();
          continue;
        }
        const ansMatch = line.match(/^Answer:\s*([A-D])\b/i);
        if (ansMatch) {
          answerRaw = ansMatch[1];
          continue;
        }
        const expMatch = line.match(/^Explanation:\s*(.+)$/i);
        if (expMatch) {
          explanation = expMatch[1].trim();
          mode = "exp";
          continue;
        }
        if (mode === "exp") {
          explanation += " " + line;
        } else if (!opts.A) {
          questionText += " " + line;
        }
      }

      const ans = normalizeAnswerKey(answerRaw);
      questions.push({
        id: `imported-q${String(num).padStart(3, "0")}`,
        originalNumber: num,
        topic: currentTopic,
        question: questionText,
        options: opts,
        correctAnswer: ans.key,
        explanation: explanation || undefined,
        needsReview: ans.needsReview,
        reviewNote: ans.note,
      });
    }
  }

  if (questions.length === 0) {
    warnings.push("No valid questions could be parsed from this file.");
  }

  const report = validateQuestionBank(questions);
  return { questions, report, warnings };
}

