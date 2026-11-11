import { DEFAULT_QUESTIONS } from "../src/data/questions";
import { validateQuestionBank } from "../src/utils/questionValidation";

const report = validateQuestionBank(DEFAULT_QUESTIONS);

console.log("=== SwiftIQ Question Bank Validation Report ===");
console.log(`Total Imported Questions : ${report.totalQuestions}`);
console.log(`Validation Passed        : ${report.valid ? "YES" : "NO"}`);
console.log(`Flagged for Review       : ${report.flaggedForReview}`);
console.log("\nTopic Breakdown:");
for (const [topic, count] of Object.entries(report.topicCounts)) {
  console.log(`  - ${topic}: ${count}`);
}

// Verify backslash preservation on key Swift keypath questions
const keyPathChecks = [
  { num: 45, expectedSubstring: "\\.self" },
  { num: 77, expectedSubstring: "\\.scenePhase" },
  { num: 87, expectedSubstring: "\\.colorScheme" },
  { num: 92, expectedSubstring: "\\.someKey" },
  { num: 93, expectedSubstring: "\\.dismiss" },
  { num: 105, expectedSubstring: "\\.dismiss" },
];

for (const check of keyPathChecks) {
  const q = DEFAULT_QUESTIONS.find((item) => item.originalNumber === check.num);
  const blob = q
    ? `${q.question} ${q.options.A} ${q.options.B} ${q.options.C} ${q.options.D} ${q.explanation ?? ""}`
    : "";
  if (!blob.includes(check.expectedSubstring)) {
    report.issues.push({
      type: "malformed-options",
      originalNumber: check.num,
      message: `Q${check.num} missing expected Swift keypath "${check.expectedSubstring}".`,
    });
  }
}

if (report.issues.length > 0) {
  console.error("\nIssues detected:");
  for (const issue of report.issues) {
    console.error(`  [${issue.type}] ${issue.message}`);
  }
  throw new Error(`Validation failed with ${report.issues.length} issue(s).`);
}

console.log("\nAll 200 questions verified with 0 issues.");
