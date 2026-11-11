import type { OptionKey } from "../types/quiz";

export interface QuestionStudyNote {
  examTip?: string;
  optionExplanations?: Partial<Record<OptionKey, string>>;
}

/**
 * Technically verified supplementary exam tips and distractor rationales
 * for high-trap SwiftUI & Swift Concurrency concepts.
 * Source questions, options, answer keys, and PDF explanations are never altered.
 */
export const STUDY_NOTES: Record<number, QuestionStudyNote> = {
  4: {
    examTip: "Remember: `some View` is an opaque type resolved at compile time to one concrete type, whereas `any View` would be an existential box.",
    optionExplanations: {
      A: "`some View` requires a single underlying concrete type per function/property; unrelated runtime types fail to compile unless wrapped (e.g., in `Group` or `@ViewBuilder` branches).",
      C: "`some View` is non-optional; an optional view would be `View?` (and isn't directly returned as `some View` without unwrapping).",
      D: "`Text` is only one concrete `View` type; `body` can return `VStack`, `Button`, custom views, etc.",
    },
  },
  7: {
    examTip: "Think inside-out: `.padding().background(.orange)` colors the padded area; `.background(.orange).padding()` pads outside the color.",
    optionExplanations: {
      B: "The Swift compiler never reorders view modifiers; order is strictly semantic.",
      C: "Changing modifier order frequently alters sizing, clipping, hit areas, and backgrounds.",
      D: "SwiftUI modifiers do not convert a view hierarchy into UIKit.",
    },
  },
  10: {
    examTip: "In SwiftUI, `.lineLimit(nil)` allows unlimited lines (it is the default on `Text`, though an ancestor may set a finite `.lineLimit(1)`).",
    optionExplanations: {
      A: "`lineLimit(1)` restricts the text to a single line and truncates overflow.",
      C: "`Image` renders graphics, not multi-line text layout.",
      D: "`opacity(0)` makes the text invisible without enabling wrapping.",
    },
  },
  13: {
    examTip: "Fit = entire image fits inside (may leave letterbox space). Fill = frame is completely filled (edges may crop).",
    optionExplanations: {
      A: "They behave differently whenever the image and container aspect ratios differ.",
      C: "This reverses their behavior: Fill crops excess; Fit shows the whole image.",
      D: "Layout modifiers never mutate the underlying image asset on disk.",
    },
  },
  26: {
    examTip: "Use `LazyVStack` inside a `ScrollView` when rendering hundreds or thousands of rows; use `VStack` for small fixed layouts.",
    optionExplanations: {
      B: "`VStack` accepts any `View` children, not just `Text`.",
      C: "`LazyVStack` is vertical (`V` = vertical); `LazyHStack` is horizontal.",
      D: "`VStack` works independently and does not require a `List`.",
    },
  },
  36: {
    examTip: "`Grid` (eager) aligns columns across all rows upfront; `LazyVGrid` (lazy) is designed for scrolling collections inside `ScrollView`.",
    optionExplanations: {
      B: "`Grid` is two-dimensional (both rows and columns), not horizontal-only.",
      C: "`LazyVGrid` specifically requires `columns:` (`GridItem` array).",
      D: "`Grid` can contain any SwiftUI views, not just images.",
    },
  },
  44: {
    examTip: "MCQ trap: Never use `indices` as `ForEach` IDs for arrays that insert, delete, or reorder — use `Identifiable` or a unique stable `id:` key path.",
    optionExplanations: {
      B: "`Text` rendering still works, though view identity/state tracking breaks on mutations.",
      C: "Array mutability is independent of how `ForEach` identifies rows.",
      D: "Index-based `ForEach` does not make a container lazy.",
    },
  },
  45: {
    examTip: "Integer ranges (`0..<5`) don't conform to `Identifiable`, so pass `id: \\.self` for constant ranges.",
    optionExplanations: {
      B: "Without `id:` on non-constant ranges or non-`Identifiable` elements, SwiftUI warns or fails to compile.",
      C: "`ForEach` expects a `RandomAccessCollection`, not a type `Int`.",
      D: "`ForEach(range:)` is not a valid SwiftUI initializer.",
    },
  },
  66: {
    examTip: "Rule of thumb: `@State` = source of truth (owner). `@Binding` = two-way borrowing link (`$value`).",
    optionExplanations: {
      B: "Neither wrapper creates persistent disk storage (`@AppStorage` handles `UserDefaults`), and `@State` is read-write.",
      C: "One owns storage (`@State`) while the other references storage owned elsewhere (`@Binding`).",
      D: "`@State` works with any value type (and owned `@Observable` objects), not just `String`.",
    },
  },
  67: {
    examTip: "Modern Observation pairing: `@State` owns an `@Observable` instance; `@Bindable` creates `$bindings` to a passed `@Observable` object.",
    optionExplanations: {
      B: "`@State` can store reference types (such as an owned `@Observable` class).",
      C: "The `Observation` framework is pure Swift and integrates directly with SwiftUI.",
      D: "Views commonly hold references to model objects via `@State`, plain properties, or `@Environment`.",
    },
  },
  79: {
    examTip: "In `NavigationStack` or `TabView`, switching away and back can fire `.onAppear` repeatedly — avoid placing one-time setup there without a guard.",
  },
  82: {
    examTip: "Reading properties from an `@Observable` model works automatically in `body`; only add `@Bindable` when you need `$model.property` bindings.",
  },
  96: {
    examTip: "Legacy Combine vs Modern Observation: `ObservableObject` + `@Published` + `@StateObject`/`@ObservedObject` vs `@Observable` + `@State`/`@Bindable`.",
  },
  104: {
    examTip: "Prefer `sheet(item:)` over `sheet(isPresented:)` whenever the sheet needs a non-optional payload — impossible states are eliminated.",
  },
  119: {
    examTip: "`NavigationLink(value:)` requires `Hashable` conformance so `NavigationPath` can store, diff, and restore destinations.",
  },
  146: {
    examTip: "Common misconception: `async` allows suspension, NOT automatic background-thread execution — actor/executor isolation decides where code runs.",
  },
  149: {
    examTip: "Suspension (`await`) frees the thread for other tasks; blocking calls (locks, `sleep()`, synchronous I/O) stall the thread.",
  },
  158: {
    examTip: "Use `async let` for a fixed small set of independent calls; sequential `try await` runs them one after another.",
  },
  161: {
    examTip: "`Task { ... }` inherits actor isolation & priority from the caller; `Task.detached { ... }` strips both.",
  },
  171: {
    examTip: "Classic concurrency trap: Actors are NOT mutually exclusive across an `await`! Always re-verify actor state after suspension (actor reentrancy).",
  },
  184: {
    examTip: "Concurrency = composition of independently executing tasks (structure); Parallelism = literal simultaneous execution on multiple cores.",
  },
  194: {
    examTip: "Changing a view's `.id(...)` resets its structural identity and destroys/recreates all `@State` inside it.",
  },
  197: {
    examTip: "`.task(id: query)` automatically cancels the previous async task and starts a fresh one whenever `query` changes.",
  },
};

