# SwiftIQ — SwiftUI & Swift Concurrency MCQ Examination Platform

SwiftIQ is a React + TypeScript interactive MCQ preparation platform built around an Apple Swift-inspired orange-and-white design system, featuring all **200 verified SwiftUI & Swift Concurrency MCQs** imported directly from your source PDF.

## Features

- **Four Homepage Quiz Modes** (2×2 responsive grid):
  - **Quick Test** (20 randomly selected unique questions, optional 20-min timer)
  - **Practice Test** (50 randomly selected unique questions across all 11 topics)
  - **Intensive Test** (100 randomly selected unique questions with auto-save & analytics)
  - **Complete Mastery** (All 200 questions, each exactly once, source order or shuffled)
- **Practice Mode vs Exam Mode**:
  - *Practice Mode*: Immediate green/red answer lock, verbatim PDF explanations, distractor rationales, and exam tips.
  - *Exam Mode*: Timed by default, changeable answers, unanswered questions allowed, feedback deferred until submission.
- **One Question at a Time**: Keyboard shortcuts (`1–4` options, `←`/`→` navigation, `B` bookmark, `Esc` close modals), collapsible Question Navigator, and persistent countdown timer across browser reloads.
- **Bookmarks & Missed-Questions Revision**: Save questions, search/filter by topic, and launch targeted Practice/Exam revision sessions on bookmarked or previously missed questions.
- **Analytics & Bank Inspector**: Real performance metrics computed strictly from completed sessions, plus JSON/CSV/TXT/Markdown question-bank import with automatic validation.

## Scripts

```bash
npm run dev       # Start local Vite dev server
npm run validate  # Verify all 200 imported questions, IDs, answer keys, and topics
npm test          # Run Vitest suite
npm run build     # Strict TypeScript check + Vite production bundle
```

## Vercel Deployment

The project includes `vercel.json` SPA rewrites so all React Router routes (`/setup/:count`, `/quiz/:id`, `/results/:id`, `/bookmarks`, `/dashboard`) resolve cleanly on Vercel.

