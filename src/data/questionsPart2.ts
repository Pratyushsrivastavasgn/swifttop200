import type { Question } from "../types/quiz";

const T6 = "Sheets, alerts and presentation";
const T7 = "Navigation, paths, tabs and page views";
const T8 = "Search and data presentation";
const T9 = "Swift concurrency: async/await, Task and structured concurrency";
const T10 = "Actors, isolation, correctness and applied concurrency";
const T11 = "Additional applied SwiftUI and concurrency concepts";

export const QUESTIONS_PART_2: Question[] = [
  {
    id: "swiftiq-q101",
    originalNumber: 101,
    topic: T6,
    question: "Which modifier presents a modal sheet from a view?",
    options: {
      A: "sheet(isPresented:)",
      B: "alertStyle()",
      C: "navigationDestination()",
      D: "popoverOnly()",
    },
    correctAnswer: "A",
    explanation:
      "sheet(isPresented:) presents a view modally when its Boolean binding becomes true.",
  },
  {
    id: "swiftiq-q102",
    originalNumber: 102,
    topic: T6,
    question: "What type of value commonly drives sheet(isPresented:)?",
    options: {
      A: "Binding<Bool>",
      B: "Binding<Int> only",
      C: "NavigationPath",
      D: "URLSession",
    },
    correctAnswer: "A",
    explanation:
      "A Boolean binding controls whether the sheet is presented or dismissed.",
  },
  {
    id: "swiftiq-q103",
    originalNumber: 103,
    topic: T6,
    question: "What does sheet(item:) use to control presentation?",
    options: {
      A: "An optional identifiable item",
      B: "A non-optional Color",
      C: "A TaskGroup",
      D: "A list index only",
    },
    correctAnswer: "A",
    explanation:
      "sheet(item:) presents when an optional Identifiable item is non-nil and passes the item to the content closure.",
  },
  {
    id: "swiftiq-q104",
    originalNumber: 104,
    topic: T6,
    question: "What is a benefit of sheet(item:) over a separate Boolean plus selected item?",
    options: {
      A: "The item itself represents both whether presentation exists and which data to show",
      B: "It automatically saves the item to disk",
      C: "It prevents dismissal",
      D: "It creates multiple windows",
    },
    correctAnswer: "A",
    explanation:
      "An optional selected model can encode presentation state and the content to display in one source of truth.",
  },
  {
    id: "swiftiq-q105",
    originalNumber: 105,
    topic: T6,
    question: "How can a sheet be dismissed from within its presented content?",
    options: {
      A: "Use the dismiss environment action",
      B: "Call exit(0)",
      C: "Set the root view to nil",
      D: "Use onDelete",
    },
    correctAnswer: "A",
    explanation:
      "The presented view can read @Environment(\\.dismiss) and invoke dismiss().",
  },
  {
    id: "swiftiq-q106",
    originalNumber: 106,
    topic: T6,
    question: "Which modifier is used to show an alert in SwiftUI?",
    options: {
      A: "alert",
      B: "sheet",
      C: "toolbar",
      D: "grid",
    },
    correctAnswer: "A",
    explanation:
      "The alert modifier presents a system alert, commonly controlled by a Boolean or optional item depending on the API overload.",
  },
  {
    id: "swiftiq-q107",
    originalNumber: 107,
    topic: T6,
    question: "What should an alert generally be used for?",
    options: {
      A: "Important information or a decision requiring user attention",
      B: "Displaying a large scrolling catalogue",
      C: "Replacing the entire app navigation",
      D: "Showing a full-screen game",
    },
    correctAnswer: "A",
    explanation:
      "Alerts are best reserved for concise, important messages or decisions rather than lengthy content.",
  },
  {
    id: "swiftiq-q108",
    originalNumber: 108,
    topic: T6,
    question: "What does a confirmation dialog provide?",
    options: {
      A: "A system-provided set of actions, often presented as a contextual choice list",
      B: "A permanent navigation destination",
      C: "A database migration screen",
      D: "A custom font",
    },
    correctAnswer: "A",
    explanation:
      "confirmationDialog presents choices related to a context, often for actions such as delete, share or duplicate.",
  },
  {
    id: "swiftiq-q109",
    originalNumber: 109,
    topic: T6,
    question: "What is the role of a Button inside an alert's actions?",
    options: {
      A: "It performs the selected alert action",
      B: "It creates another scene",
      C: "It changes the app lifecycle",
      D: "It modifies the source code",
    },
    correctAnswer: "A",
    explanation:
      "Alert action buttons let the user choose an action, such as confirming or cancelling.",
  },
  {
    id: "swiftiq-q110",
    originalNumber: 110,
    topic: T6,
    question: "Why is a destructive role useful for a delete button?",
    options: {
      A: "It communicates that the action is destructive and allows the system to style it appropriately",
      B: "It automatically restores deleted data",
      C: "It hides the alert",
      D: "It makes the button disabled",
    },
    correctAnswer: "A",
    explanation:
      "ButtonRole.destructive signals an action that may cause data loss, allowing platform-appropriate presentation.",
  },
  {
    id: "swiftiq-q111",
    originalNumber: 111,
    topic: T6,
    question: "What is the difference between a sheet and an alert?",
    options: {
      A: "A sheet presents richer content; an alert is for concise important messages or choices",
      B: "An alert supports navigation stacks but a sheet cannot show views",
      C: "A sheet is always non-modal",
      D: "They are exactly the same",
    },
    correctAnswer: "A",
    explanation:
      "Sheets can host more substantial interface content, while alerts are compact and interruptive.",
  },
  {
    id: "swiftiq-q112",
    originalNumber: 112,
    topic: T6,
    question: "What can presentationDetents control for a sheet?",
    options: {
      A: "The available sheet heights, such as medium and large",
      B: "The sheet's database ID",
      C: "The number of alert buttons",
      D: "The app icon",
    },
    correctAnswer: "A",
    explanation:
      "presentationDetents configures supported sheet sizes on platforms that provide detent-based sheet presentation.",
  },
  {
    id: "swiftiq-q113",
    originalNumber: 113,
    topic: T6,
    question: "What does interactiveDismissDisabled() do?",
    options: {
      A: "Prevents interactive dismissal of a presentation when enabled",
      B: "Prevents all buttons from working",
      C: "Hides the status bar",
      D: "Disables the entire app",
    },
    correctAnswer: "A",
    explanation:
      "It controls whether a user can dismiss a presentation interactively, such as by swiping down on a sheet.",
  },
  {
    id: "swiftiq-q114",
    originalNumber: 114,
    topic: T6,
    question: "Why should a confirmation be requested before an irreversible delete?",
    options: {
      A: "It reduces accidental destructive actions",
      B: "It makes deletion asynchronous",
      C: "It guarantees recovery",
      D: "It removes the need for data validation",
    },
    correctAnswer: "A",
    explanation:
      "A confirmation step gives users a chance to cancel a consequential action before it occurs.",
  },
  {
    id: "swiftiq-q115",
    originalNumber: 115,
    topic: T6,
    question: "What is a common way to trigger a sheet?",
    options: {
      A: "Set a @State Boolean to true from a Button action",
      B: "Call body() manually",
      C: "Change the app's bundle ID",
      D: "Create a GridItem",
    },
    correctAnswer: "A",
    explanation:
      "A button changes the state controlling sheet(isPresented:), and SwiftUI presents the sheet when the binding becomes true.",
  },
  {
    id: "swiftiq-q116",
    originalNumber: 116,
    topic: T7,
    question: "Which container is the modern SwiftUI navigation stack?",
    options: {
      A: "NavigationStack",
      B: "NavigationViewController",
      C: "TabView",
      D: "ScrollView",
    },
    correctAnswer: "A",
    explanation:
      "NavigationStack manages a stack of destinations and supports value-based navigation.",
  },
  {
    id: "swiftiq-q117",
    originalNumber: 117,
    topic: T7,
    question: "What does NavigationLink(value:) do?",
    options: {
      A: "Pushes a value onto a navigation stack when activated",
      B: "Presents an alert",
      C: "Creates a new tab automatically",
      D: "Loads an image from a URL",
    },
    correctAnswer: "A",
    explanation:
      "A value-based NavigationLink adds a Hashable value to the navigation stack; a matching destination maps that value to a view.",
  },
  {
    id: "swiftiq-q118",
    originalNumber: 118,
    topic: T7,
    question: "Which modifier maps a data type to a destination view?",
    options: {
      A: "navigationDestination(for:)",
      B: "sheet(item:)",
      C: "onDelete",
      D: "gridCellColumns",
    },
    correctAnswer: "A",
    explanation:
      "navigationDestination(for:destination:) declares the destination view for values of a specified type.",
  },
  {
    id: "swiftiq-q119",
    originalNumber: 119,
    topic: T7,
    question: "What conformance is generally required for a value used in value-based navigation?",
    options: {
      A: "Hashable",
      B: "ViewModifier",
      C: "Scene",
      D: "Sendable only",
    },
    correctAnswer: "A",
    explanation:
      "NavigationStack uses hashable values to identify and manage value-based destinations.",
  },
  {
    id: "swiftiq-q120",
    originalNumber: 120,
    topic: T7,
    question: "What is the purpose of NavigationPath?",
    options: {
      A: "Represent a type-erased collection of navigation values for a stack",
      B: "Store image pixels",
      C: "Define a grid column",
      D: "Control sheet height",
    },
    correctAnswer: "A",
    explanation:
      "NavigationPath can hold values of different Hashable types and is useful for programmatic or deep-link navigation.",
  },
  {
    id: "swiftiq-q121",
    originalNumber: 121,
    topic: T7,
    question: "How can a navigation stack be popped to its root programmatically?",
    options: {
      A: "Remove all values from its bound path",
      B: "Set the title to empty",
      C: "Call onDelete on the root",
      D: "Set opacity to zero",
    },
    correctAnswer: "A",
    explanation:
      "When NavigationStack is bound to a path, clearing the path removes pushed destinations and returns to the root.",
  },
  {
    id: "swiftiq-q122",
    originalNumber: 122,
    topic: T7,
    question: "What is a navigation bar title modifier?",
    options: {
      A: 'navigationTitle("Title")',
      B: 'titleBar("Title")',
      C: 'toolbarTitleOnly("Title")',
      D: 'labelTitle("Title")',
    },
    correctAnswer: "A",
    explanation:
      "navigationTitle sets the title displayed in the navigation bar or equivalent navigation UI.",
  },
  {
    id: "swiftiq-q123",
    originalNumber: 123,
    topic: T7,
    question: "Which modifier controls the display style of a navigation bar title?",
    options: {
      A: "toolbarTitleDisplayMode",
      B: "fontDisplayMode",
      C: "navigationStyleTitle",
      D: "titleFrame",
    },
    correctAnswer: "A",
    explanation:
      "toolbarTitleDisplayMode configures title presentation, such as inline or large, where supported.",
  },
  {
    id: "swiftiq-q124",
    originalNumber: 124,
    topic: T7,
    question: "What is the purpose of toolbar in a navigation interface?",
    options: {
      A: "Adds items such as buttons to navigation bars or toolbars",
      B: "Creates a new navigation stack",
      C: "Stores a navigation path",
      D: "Sets a list's data source",
    },
    correctAnswer: "A",
    explanation:
      "toolbar places controls in system toolbar placements such as navigation bar leading or trailing positions.",
  },
  {
    id: "swiftiq-q125",
    originalNumber: 125,
    topic: T7,
    question: "Which placement is commonly used for a trailing navigation bar button?",
    options: {
      A: ".topBarTrailing",
      B: ".bottomGrid",
      C: ".listHeaderOnly",
      D: ".navigationPath",
    },
    correctAnswer: "A",
    explanation:
      "ToolbarItem(placement: .topBarTrailing) places an item at the trailing side of the top bar on supported platforms.",
  },
  {
    id: "swiftiq-q126",
    originalNumber: 126,
    topic: T7,
    question: "What does TabView provide?",
    options: {
      A: "A container for switching between separate top-level views",
      B: "A stack of modal alerts",
      C: "A two-dimensional grid",
      D: "A background task scheduler",
    },
    correctAnswer: "A",
    explanation:
      "TabView presents a set of tabs, each representing a distinct area or root of an app.",
  },
  {
    id: "swiftiq-q127",
    originalNumber: 127,
    topic: T7,
    question: "How is a tab commonly labelled in SwiftUI?",
    options: {
      A: "Using the tabItem modifier in older patterns or the modern Tab API, depending on deployment target",
      B: "Using onDelete",
      C: "Using taskGroup",
      D: "Using navigationDestination only",
    },
    correctAnswer: "A",
    explanation:
      "Tab configuration APIs vary by SwiftUI version. Traditional TabView(selection:) content commonly uses tabItem; newer SDKs also provide the Tab API.",
  },
  {
    id: "swiftiq-q128",
    originalNumber: 128,
    topic: T7,
    question: "What does TabView(selection:) enable?",
    options: {
      A: "Programmatic reading and changing of the selected tab through a binding",
      B: "Automatic deletion of tabs",
      C: "A page turn animation only",
      D: "Sharing a model with the environment",
    },
    correctAnswer: "A",
    explanation:
      "The selection binding tracks the selected tab value; each tab supplies a matching tag.",
  },
  {
    id: "swiftiq-q129",
    originalNumber: 129,
    topic: T7,
    question: "Why should tab selection tags have consistent types?",
    options: {
      A: "The selection binding and tags must represent the same selection value type",
      B: "Tags control image resolution",
      C: "Tags determine concurrency priority",
      D: "SwiftUI requires String tags only",
    },
    correctAnswer: "A",
    explanation:
      "A TabView selection binding must match the type of the values used by tab tags.",
  },
  {
    id: "swiftiq-q130",
    originalNumber: 130,
    topic: T7,
    question: "What is a PageTabViewStyle commonly used for?",
    options: {
      A: "Swipeable page-style content such as onboarding screens",
      B: "A standard database table",
      C: "A navigation bar title",
      D: "A destructive confirmation",
    },
    correctAnswer: "A",
    explanation:
      "TabView with PageTabViewStyle presents pages that users can swipe between, often with page indicators.",
  },
  {
    id: "swiftiq-q131",
    originalNumber: 131,
    topic: T7,
    question: "How can a developer hide the page indicator in a page-style TabView?",
    options: {
      A: "Use the page indicator visibility configuration where supported",
      B: "Set the tab's ID to nil",
      C: "Use onDelete",
      D: "Remove the TabView selection",
    },
    correctAnswer: "A",
    explanation:
      "Page-style TabView supports index display mode configuration, for example .indexViewStyle(.page(backgroundDisplayMode: .never)).",
  },
  {
    id: "swiftiq-q132",
    originalNumber: 132,
    topic: T7,
    question: "What is a custom tab bar?",
    options: {
      A: "A developer-built tab selection interface that controls which content is shown",
      B: "A built-in SQL table",
      C: "A system alert style",
      D: "A navigation destination type",
    },
    correctAnswer: "A",
    explanation:
      "A custom tab bar is a custom-designed control, often built with HStack and state, to switch among app sections.",
  },
  {
    id: "swiftiq-q133",
    originalNumber: 133,
    topic: T7,
    question: "What should a custom tab bar provide for accessibility?",
    options: {
      A: "Meaningful labels, selection state and usable hit targets",
      B: "Only decorative icons",
      C: "No accessibility labels",
      D: "A hidden button for every tab",
    },
    correctAnswer: "A",
    explanation:
      "Custom controls should expose clear labels and selected state and offer sufficiently large interactive areas.",
  },
  {
    id: "swiftiq-q134",
    originalNumber: 134,
    topic: T7,
    question: "Why might iPadOS use a different navigation or tab presentation than iPhone?",
    options: {
      A: "Larger screens support richer sidebar or split-view patterns",
      B: "iPadOS cannot use SwiftUI",
      C: "iPad apps cannot have tabs",
      D: "NavigationStack is iPhone-only",
    },
    correctAnswer: "A",
    explanation:
      "The larger iPad layout can benefit from NavigationSplitView, sidebars and adaptive navigation patterns.",
  },
  {
    id: "swiftiq-q135",
    originalNumber: 135,
    topic: T7,
    question: "What is a deep link in the context of navigation?",
    options: {
      A: "A link that opens a specific location or content within the app",
      B: "A link that always opens Safari",
      C: "A link to a source-code file",
      D: "A link that disables navigation",
    },
    correctAnswer: "A",
    explanation:
      "Deep links route users directly to particular app content, often by constructing or restoring navigation state.",
  },
  {
    id: "swiftiq-q136",
    originalNumber: 136,
    topic: T8,
    question: "Which modifier adds a searchable interface to a supported navigation or list container?",
    options: {
      A: "searchable(text:)",
      B: "searchTextFieldOnly()",
      C: "filterListNow()",
      D: "queryView()",
    },
    correctAnswer: "A",
    explanation:
      "searchable(text:) connects a search field to a String binding and displays search UI in supported containers.",
  },
  {
    id: "swiftiq-q137",
    originalNumber: 137,
    topic: T8,
    question: "What type does the searchable text binding normally use?",
    options: {
      A: "String",
      B: "Int",
      C: "NavigationPath",
      D: "Image",
    },
    correctAnswer: "A",
    explanation:
      "The search text is normally a Binding<String>, which updates as the user types.",
  },
  {
    id: "swiftiq-q138",
    originalNumber: 138,
    topic: T8,
    question: "How should a basic in-memory search filter usually be applied?",
    options: {
      A: "Filter the source collection using the search text and display the result",
      B: "Delete nonmatching items from the original data",
      C: "Change the app's root scene",
      D: "Use opacity on every row",
    },
    correctAnswer: "A",
    explanation:
      "Keep the original data intact and derive a filtered collection from the current query.",
  },
  {
    id: "swiftiq-q139",
    originalNumber: 139,
    topic: T8,
    question: "Why should search generally be case-insensitive for ordinary names?",
    options: {
      A: "It matches user expectations when capitalization differs",
      B: "SwiftUI requires it",
      C: "It makes the search asynchronous",
      D: "It prevents empty results",
    },
    correctAnswer: "A",
    explanation:
      "Case-insensitive matching is usually friendlier for names and labels unless case is semantically important.",
  },
  {
    id: "swiftiq-q140",
    originalNumber: 140,
    topic: T8,
    question: "What does .onSubmit(of: .search) allow a view to do?",
    options: {
      A: "Respond when the user submits the search field",
      B: "Respond to every scroll event",
      C: "Dismiss every sheet",
      D: "Change the selected tab",
    },
    correctAnswer: "A",
    explanation:
      "onSubmit can handle the search submission action, such as starting a remote query.",
  },
  {
    id: "swiftiq-q141",
    originalNumber: 141,
    topic: T8,
    question: "What is a useful empty-state message for a search with no matches?",
    options: {
      A: "A clear message such as 'No results found'",
      B: "A blank screen with no explanation",
      C: "A destructive alert",
      D: "A random list of unrelated items",
    },
    correctAnswer: "A",
    explanation:
      "An explicit empty state tells users that the query returned no matches and can guide them to change it.",
  },
  {
    id: "swiftiq-q142",
    originalNumber: 142,
    topic: T8,
    question: "When is debouncing useful for search?",
    options: {
      A: "When frequent keystrokes would otherwise trigger too many expensive requests",
      B: "When rendering a static title",
      C: "When changing a tab icon",
      D: "When showing a local alert",
    },
    correctAnswer: "A",
    explanation:
      "Debouncing waits for a short pause in input before starting work, reducing redundant network or computation requests.",
  },
  {
    id: "swiftiq-q143",
    originalNumber: 143,
    topic: T8,
    question: "What should happen when the search query becomes empty?",
    options: {
      A: "Typically show the unfiltered collection or default content",
      B: "Delete all data",
      C: "Dismiss the app",
      D: "Keep the previous query results forever",
    },
    correctAnswer: "A",
    explanation:
      "An empty query usually means no filter should be applied, unless the product design specifies otherwise.",
  },
  {
    id: "swiftiq-q144",
    originalNumber: 144,
    topic: T8,
    question: "Why is a model type useful for list data?",
    options: {
      A: "It groups related fields into a meaningful, typed representation",
      B: "It automatically builds every screen",
      C: "It replaces all layout containers",
      D: "It removes the need for identity",
    },
    correctAnswer: "A",
    explanation:
      "A model captures the domain data and separates it from the view's presentation code.",
  },
  {
    id: "swiftiq-q145",
    originalNumber: 145,
    topic: T8,
    question: "What is the benefit of separating model, view and business logic?",
    options: {
      A: "It improves clarity, testability and maintainability",
      B: "It makes all code run on the main thread",
      C: "It prevents state updates",
      D: "It removes the need for types",
    },
    correctAnswer: "A",
    explanation:
      "Separation of concerns keeps data rules distinct from rendering and makes each part easier to change and test.",
  },
  {
    id: "swiftiq-q146",
    originalNumber: 146,
    topic: T9,
    question: "What does async mark on a Swift function?",
    options: {
      A: "The function can suspend while performing asynchronous work",
      B: "The function always runs on a background thread",
      C: "The function is synchronous",
      D: "The function cannot throw",
    },
    correctAnswer: "A",
    explanation:
      "async means the function may suspend and resume later. It does not by itself promise a background thread.",
  },
  {
    id: "swiftiq-q147",
    originalNumber: 147,
    topic: T9,
    question: "How is an asynchronous function normally called from synchronous code?",
    options: {
      A: "From an asynchronous context or inside a Task",
      B: "By adding @State",
      C: "By using ForEach",
      D: "By calling body()",
    },
    correctAnswer: "A",
    explanation:
      "An async function must be called with await from an async context; a Task can create an asynchronous context from synchronous code.",
  },
  {
    id: "swiftiq-q148",
    originalNumber: 148,
    topic: T9,
    question: "What does await indicate?",
    options: {
      A: "A potential suspension point while waiting for an asynchronous operation",
      B: "A command to create a new thread",
      C: "A guarantee that the function runs on a background queue",
      D: "A way to ignore errors",
    },
    correctAnswer: "A",
    explanation:
      "await marks a point where execution may suspend until the asynchronous operation produces a result.",
  },
  {
    id: "swiftiq-q149",
    originalNumber: 149,
    topic: T9,
    question: "Does await necessarily block the current thread?",
    options: {
      A: "No; it suspends the async task and allows the thread to do other work",
      B: "Yes, it always blocks the main thread",
      C: "Only if the function returns Void",
      D: "It terminates the thread",
    },
    correctAnswer: "A",
    explanation:
      "Swift concurrency suspension is cooperative: the task can pause without blocking the underlying thread.",
  },
  {
    id: "swiftiq-q150",
    originalNumber: 150,
    topic: T9,
    question: "What is a Task in Swift concurrency?",
    options: {
      A: "A unit of asynchronous work managed by the Swift concurrency runtime",
      B: "A SwiftUI view container",
      C: "A database table",
      D: "A navigation destination",
    },
    correctAnswer: "A",
    explanation:
      "Task represents asynchronous work and provides a context for running async operations.",
  },
  {
    id: "swiftiq-q151",
    originalNumber: 151,
    topic: T9,
    question: "Why might a SwiftUI view use .task { }?",
    options: {
      A: "To start asynchronous work associated with the view's lifecycle",
      B: "To create a tab bar",
      C: "To set the font",
      D: "To persist state automatically",
    },
    correctAnswer: "A",
    explanation:
      "The task modifier starts asynchronous work when the view appears and can cancel it when the view disappears or its task identity changes.",
  },
  {
    id: "swiftiq-q152",
    originalNumber: 152,
    topic: T9,
    question: "What is task cancellation in Swift?",
    options: {
      A: "A cooperative signal that work should stop when practical",
      B: "An automatic forced thread kill",
      C: "A guarantee that all side effects are undone",
      D: "A way to restart the app",
    },
    correctAnswer: "A",
    explanation:
      "Cancellation is cooperative. Code should check cancellation or call cancellation-aware APIs and exit appropriately.",
  },
  {
    id: "swiftiq-q153",
    originalNumber: 153,
    topic: T9,
    question: "Which property can be checked to determine whether the current task was cancelled?",
    options: {
      A: "Task.isCancelled",
      B: "Thread.isDead",
      C: "View.isHidden",
      D: "Async.isStopped",
    },
    correctAnswer: "A",
    explanation:
      "Task.isCancelled reports whether the current task has received a cancellation request.",
  },
  {
    id: "swiftiq-q154",
    originalNumber: 154,
    topic: T9,
    question: "What is structured concurrency?",
    options: {
      A: "A model where child tasks are scoped to a parent task's lifetime",
      B: "A model where every task is detached and unrelated",
      C: "A way to lay out views in a Grid",
      D: "A synchronous-only programming style",
    },
    correctAnswer: "A",
    explanation:
      "Structured concurrency makes task relationships explicit and helps ensure child work is awaited and cancellation is propagated.",
  },
  {
    id: "swiftiq-q155",
    originalNumber: 155,
    topic: T9,
    question: "What is a key property of child tasks in a task group?",
    options: {
      A: "They are managed within the group's scope and the group waits for them to finish",
      B: "They outlive the group by default",
      C: "They cannot return values",
      D: "They always run serially",
    },
    correctAnswer: "A",
    explanation:
      "A task group scopes child tasks; leaving the group waits for its children to complete, subject to cancellation and error behavior.",
  },
  {
    id: "swiftiq-q156",
    originalNumber: 156,
    topic: T9,
    question: "What does async let do?",
    options: {
      A: "Starts a child asynchronous operation that can be awaited later",
      B: "Creates a global detached task",
      C: "Declares a view state variable",
      D: "Makes a function synchronous",
    },
    correctAnswer: "A",
    explanation:
      "async let starts child work concurrently with the current task; its result is awaited when needed.",
  },
  {
    id: "swiftiq-q157",
    originalNumber: 157,
    topic: T9,
    question: "When is async let useful?",
    options: {
      A: "When a small, known number of independent async operations can run concurrently",
      B: "When operations depend on each other's results in sequence",
      C: "When creating a SwiftUI button",
      D: "When persisting a model",
    },
    correctAnswer: "A",
    explanation:
      "Independent operations can overlap, reducing total waiting time compared with awaiting each one sequentially.",
  },
  {
    id: "swiftiq-q158",
    originalNumber: 158,
    topic: T9,
    question: "What is the difference between sequential awaits and async let for independent calls?",
    options: {
      A: "Sequential awaits wait one after another; async let can overlap the operations",
      B: "Sequential awaits are always faster",
      C: "async let runs only on the main actor",
      D: "There is no difference",
    },
    correctAnswer: "A",
    explanation:
      "If calls are independent, starting them with async let allows them to progress concurrently before their results are collected.",
  },
  {
    id: "swiftiq-q159",
    originalNumber: 159,
    topic: T9,
    question: "What does withTaskGroup(of:) provide?",
    options: {
      A: "A scope for creating and collecting multiple child tasks of a common result type",
      B: "A SwiftUI layout group",
      C: "A global task queue",
      D: "An actor instance",
    },
    correctAnswer: "A",
    explanation:
      "withTaskGroup creates a structured task group whose child tasks return values of the declared element type.",
  },
  {
    id: "swiftiq-q160",
    originalNumber: 160,
    topic: T9,
    question: "When should a throwing task group be used?",
    options: {
      A: "When child tasks may throw errors that should propagate through the group",
      B: "When no task can fail",
      C: "Only for UI animations",
      D: "For synchronous loops",
    },
    correctAnswer: "A",
    explanation:
      "withThrowingTaskGroup supports child tasks that throw; errors can propagate and trigger cancellation of remaining work.",
  },
  {
    id: "swiftiq-q161",
    originalNumber: 161,
    topic: T9,
    question: "What does Task.detached do?",
    options: {
      A: "Creates an unstructured task not inheriting the parent task's actor context and task-local values in the usual way",
      B: "Creates a child task in the current task group",
      C: "Runs code synchronously",
      D: "Creates a SwiftUI sheet",
    },
    correctAnswer: "A",
    explanation:
      "Detached tasks are unstructured and do not inherit the same structured parent relationship or actor context; use them sparingly.",
  },
  {
    id: "swiftiq-q162",
    originalNumber: 162,
    topic: T9,
    question: "Why should Task.detached be used cautiously?",
    options: {
      A: "It weakens structured lifetime and context inheritance, so cancellation and isolation need deliberate handling",
      B: "It is required for every async function",
      C: "It always runs on the main thread",
      D: "It cannot call async functions",
    },
    correctAnswer: "A",
    explanation:
      "Detached tasks are easier to mismanage because they are not scoped as children of the caller.",
  },
  {
    id: "swiftiq-q163",
    originalNumber: 163,
    topic: T9,
    question: "What does try await communicate in a call?",
    options: {
      A: "The asynchronous operation may suspend and may throw an error",
      B: "The call is guaranteed not to fail",
      C: "The call runs on a new thread",
      D: "The result is optional",
    },
    correctAnswer: "A",
    explanation:
      "await marks asynchronous suspension and try marks a throwing call whose error must be handled or propagated.",
  },
  {
    id: "swiftiq-q164",
    originalNumber: 164,
    topic: T9,
    question: "How can errors from an async throwing function be handled?",
    options: {
      A: "Use do-catch around try await",
      B: "Use @Binding",
      C: "Use NavigationPath",
      D: "Use GridItem",
    },
    correctAnswer: "A",
    explanation:
      "A do-catch block handles errors thrown by an async operation called with try await.",
  },
  {
    id: "swiftiq-q165",
    originalNumber: 165,
    topic: T9,
    question: "What is a continuation used for?",
    options: {
      A: "Bridging callback-based or delegate-based asynchronous APIs into async/await",
      B: "Creating a SwiftUI animation",
      C: "Storing environment values",
      D: "Making a view identifiable",
    },
    correctAnswer: "A",
    explanation:
      "Checked continuations adapt completion-handler APIs to async functions; they must be resumed exactly once.",
  },
  {
    id: "swiftiq-q166",
    originalNumber: 166,
    topic: T10,
    question: "What is an actor in Swift?",
    options: {
      A: "A reference type that protects its mutable state through actor isolation",
      B: "A SwiftUI layout container",
      C: "A value type that is always immutable",
      D: "A background thread",
    },
    correctAnswer: "A",
    explanation:
      "Actors serialize access to their isolated mutable state, helping prevent data races.",
  },
  {
    id: "swiftiq-q167",
    originalNumber: 167,
    topic: T10,
    question: "What problem are actors designed to help prevent?",
    options: {
      A: "Data races from concurrent access to shared mutable state",
      B: "Incorrect image aspect ratios",
      C: "Navigation bar overflow",
      D: "List separators",
    },
    correctAnswer: "A",
    explanation:
      "Actor isolation ensures only one task at a time accesses actor-isolated state directly.",
  },
  {
    id: "swiftiq-q168",
    originalNumber: 168,
    topic: T10,
    question: "How do you call an actor-isolated method from outside the actor?",
    options: {
      A: "Usually with await",
      B: "With @State",
      C: "With ForEach",
      D: "With .padding",
    },
    correctAnswer: "A",
    explanation:
      "Crossing an actor isolation boundary is asynchronous, so callers generally use await to access actor-isolated members.",
  },
  {
    id: "swiftiq-q169",
    originalNumber: 169,
    topic: T10,
    question: "What does @MainActor mean?",
    options: {
      A: "The declaration is isolated to the main actor, suitable for UI-related state and work",
      B: "The function always creates a new thread",
      C: "The type is immutable",
      D: "The code runs only in previews",
    },
    correctAnswer: "A",
    explanation:
      "MainActor provides an isolation domain associated with the main thread and is commonly used for UI-facing state.",
  },
  {
    id: "swiftiq-q170",
    originalNumber: 170,
    topic: T10,
    question: "Why should UI updates generally occur on the main actor?",
    options: {
      A: "UI frameworks expect UI state changes to be coordinated on the main actor",
      B: "The main actor is always the fastest CPU core",
      C: "Background tasks cannot return values",
      D: "SwiftUI views are stored in a database",
    },
    correctAnswer: "A",
    explanation:
      "Main-actor isolation helps keep UI-facing state changes safe and consistent with UI framework expectations.",
  },
  {
    id: "swiftiq-q171",
    originalNumber: 171,
    topic: T10,
    question: "Does an actor guarantee that an entire async method runs without interruption?",
    options: {
      A: "No; an actor-isolated async method can be reentrant at suspension points",
      B: "Yes, actors make async methods atomic",
      C: "Only if it returns Int",
      D: "Yes, because actors create locks around every await",
    },
    correctAnswer: "A",
    explanation:
      "An actor can process other work when an isolated method suspends at await, so invariants may need rechecking after suspension.",
  },
  {
    id: "swiftiq-q172",
    originalNumber: 172,
    topic: T10,
    question: "What is actor reentrancy?",
    options: {
      A: "An actor may process another message while an async actor method is suspended",
      B: "An actor can call itself recursively only",
      C: "A task runs on two CPUs simultaneously",
      D: "An actor becomes a struct",
    },
    correctAnswer: "A",
    explanation:
      "At suspension points, an actor can run other queued work. Code should not assume actor state is unchanged after await.",
  },
  {
    id: "swiftiq-q173",
    originalNumber: 173,
    topic: T10,
    question: "What does Sendable indicate?",
    options: {
      A: "A type's values can safely cross concurrency domains under Swift's rules",
      B: "A type can be sent by email",
      C: "A view can be displayed in a sheet",
      D: "A function cannot throw",
    },
    correctAnswer: "A",
    explanation:
      "Sendable communicates that values can safely be transferred across concurrency boundaries, with compiler checking where possible.",
  },
  {
    id: "swiftiq-q174",
    originalNumber: 174,
    topic: T10,
    question: "Why are value types often easier to make Sendable?",
    options: {
      A: "They avoid shared mutable reference state when designed with value semantics",
      B: "They always run on the main actor",
      C: "They cannot contain properties",
      D: "They are automatically Codable",
    },
    correctAnswer: "A",
    explanation:
      "Value semantics reduce shared mutable state, making safe transfer across concurrency domains easier.",
  },
  {
    id: "swiftiq-q175",
    originalNumber: 175,
    topic: T10,
    question: "What is a data race?",
    options: {
      A: "Two or more concurrent operations access the same memory, at least one writes, without proper synchronization",
      B: "Two tasks return the same value",
      C: "A task is cancelled",
      D: "A List row moves",
    },
    correctAnswer: "A",
    explanation:
      "Unsynchronized concurrent reads and writes to shared memory can produce unpredictable behavior.",
  },
  {
    id: "swiftiq-q176",
    originalNumber: 176,
    topic: T10,
    question: "Which construct is generally appropriate for protecting shared mutable state in Swift concurrency?",
    options: {
      A: "Actor",
      B: "HStack",
      C: "NavigationLink",
      D: "TextField",
    },
    correctAnswer: "A",
    explanation:
      "Actors provide isolation for mutable state shared across concurrent tasks.",
  },
  {
    id: "swiftiq-q177",
    originalNumber: 177,
    topic: T10,
    question: "What is the purpose of Task.yield()?",
    options: {
      A: "Gives other tasks an opportunity to run before the current task continues",
      B: "Cancels the current task permanently",
      C: "Creates a new actor",
      D: "Waits for a network response",
    },
    correctAnswer: "A",
    explanation:
      "Task.yield cooperatively suspends the current task briefly so other tasks can make progress.",
  },
  {
    id: "swiftiq-q178",
    originalNumber: 178,
    topic: T10,
    question: "What does Task.sleep(for:) do?",
    options: {
      A: "Suspends the current task for a duration without blocking its thread",
      B: "Blocks the main thread with a busy wait",
      C: "Cancels all child tasks",
      D: "Changes task priority only",
    },
    correctAnswer: "A",
    explanation:
      "Task.sleep is asynchronous and suspends the task for a duration; it can throw if the task is cancelled.",
  },
  {
    id: "swiftiq-q179",
    originalNumber: 179,
    topic: T10,
    question: "What is task priority intended to communicate?",
    options: {
      A: "The relative importance of work to the runtime scheduler",
      B: "A guaranteed execution order",
      C: "The number of threads to create",
      D: "The order of SwiftUI modifiers",
    },
    correctAnswer: "A",
    explanation:
      "Task priority is a scheduling hint, not a strict guarantee that tasks execute in a particular order.",
  },
  {
    id: "swiftiq-q180",
    originalNumber: 180,
    topic: T10,
    question: "What does a task group offer compared with creating unrelated detached tasks?",
    options: {
      A: "Structured lifetime, result collection and cancellation relationships",
      B: "Automatic persistence",
      C: "Guaranteed parallel execution on separate cores",
      D: "A SwiftUI navigation bar",
    },
    correctAnswer: "A",
    explanation:
      "Task groups keep child work scoped to the parent operation and provide a structured way to collect results.",
  },
  {
    id: "swiftiq-q181",
    originalNumber: 181,
    topic: T10,
    question: "Why should long-running work avoid blocking the main actor?",
    options: {
      A: "It can make the UI unresponsive",
      B: "It prevents actors from compiling",
      C: "It makes views lazy",
      D: "It disables SwiftUI previews",
    },
    correctAnswer: "A",
    explanation:
      "Blocking the main actor prevents UI work and event handling from progressing smoothly.",
  },
  {
    id: "swiftiq-q182",
    originalNumber: 182,
    topic: T10,
    question: "What is a good approach for a network request started by a SwiftUI view?",
    options: {
      A: "Use async APIs in a view task or model task, handle errors and cancellation",
      B: "Run a synchronous busy loop in body",
      C: "Start a new detached task on every body evaluation",
      D: "Store the request in a GridItem",
    },
    correctAnswer: "A",
    explanation:
      "Use lifecycle-aware asynchronous work, handle failures, and avoid starting duplicate work from repeatedly evaluated body code.",
  },
  {
    id: "swiftiq-q183",
    originalNumber: 183,
    topic: T10,
    question: "What should an async function do if it performs expensive CPU work and needs to respond to cancellation?",
    options: {
      A: "Check cancellation periodically or call cancellation-aware operations",
      B: "Ignore Task.isCancelled",
      C: "Use opacity(0)",
      D: "Convert the function to a View",
    },
    correctAnswer: "A",
    explanation:
      "Cancellation is cooperative, so long-running loops should periodically check for cancellation and exit when requested.",
  },
  {
    id: "swiftiq-q184",
    originalNumber: 184,
    topic: T10,
    question: "What is the key difference between concurrency and parallelism?",
    options: {
      A: "Concurrency structures multiple tasks that can make progress; parallelism means executing tasks simultaneously",
      B: "They are exactly the same concept",
      C: "Concurrency always means one thread; parallelism always means one actor",
      D: "Parallelism is only for SwiftUI layouts",
    },
    correctAnswer: "A",
    explanation:
      "Concurrency is about managing overlapping work; parallelism is simultaneous execution. A concurrent program is not guaranteed to run in parallel.",
  },
  {
    id: "swiftiq-q185",
    originalNumber: 185,
    topic: T10,
    question: "Which statement about async/await is correct?",
    options: {
      A: "It makes asynchronous code easier to read but does not automatically make every operation parallel",
      B: "It guarantees every function runs on a background thread",
      C: "It removes the need for error handling",
      D: "It makes all shared state thread-safe",
    },
    correctAnswer: "A",
    explanation:
      "async/await improves the expression of asynchronous control flow. Parallelism, isolation and error handling still need to be designed.",
  },
  {
    id: "swiftiq-q186",
    originalNumber: 186,
    topic: T11,
    question: "What does Label combine?",
    options: {
      A: "A title and an icon or image in one semantic view",
      B: "A List and a Grid",
      C: "A sheet and an alert",
      D: "A task and an actor",
    },
    correctAnswer: "A",
    explanation:
      "Label combines a title with an icon or image and is useful for controls and navigation elements.",
  },
  {
    id: "swiftiq-q187",
    originalNumber: 187,
    topic: T11,
    question: "What does Divider display?",
    options: {
      A: "A visual separator between content",
      B: "A navigation destination",
      C: "A progress indicator",
      D: "A text editor",
    },
    correctAnswer: "A",
    explanation:
      "Divider draws a platform-appropriate separator between adjacent content.",
  },
  {
    id: "swiftiq-q188",
    originalNumber: 188,
    topic: T11,
    question: "What is the purpose of a Group view?",
    options: {
      A: "Groups views without introducing a new layout container",
      B: "Creates a scroll view automatically",
      C: "Stores observable data",
      D: "Starts a child task",
    },
    correctAnswer: "A",
    explanation:
      "Group collects multiple views while generally allowing the parent layout to determine their placement.",
  },
  {
    id: "swiftiq-q189",
    originalNumber: 189,
    topic: T11,
    question: "What does fixedSize() commonly affect?",
    options: {
      A: "Whether a view resists compression in its ideal size along selected axes",
      B: "Whether a view is fixed to the screen",
      C: "Whether a task is detached",
      D: "Whether a model is immutable",
    },
    correctAnswer: "A",
    explanation:
      "fixedSize can let a view use its ideal size rather than compressing to fit a proposed size.",
  },
  {
    id: "swiftiq-q190",
    originalNumber: 190,
    topic: T11,
    question: "What is the purpose of contentShape(Rectangle()) on a view?",
    options: {
      A: "Defines the shape of the region used for hit testing and interaction",
      B: "Draws a visible rectangle border",
      C: "Changes the view's background color",
      D: "Clips the view to a rectangle",
    },
    correctAnswer: "A",
    explanation:
      "contentShape defines the interactive hit-testing shape; it does not itself draw a visible shape.",
  },
  {
    id: "swiftiq-q191",
    originalNumber: 191,
    topic: T11,
    question: "What does .overlay place on a view?",
    options: {
      A: "Additional content layered over the modified view",
      B: "Content behind every other app window",
      C: "A new navigation root",
      D: "A database-backed list",
    },
    correctAnswer: "A",
    explanation:
      "overlay layers another view over the original view, often for badges, borders or controls.",
  },
  {
    id: "swiftiq-q192",
    originalNumber: 192,
    topic: T11,
    question: "What does .background place behind a view?",
    options: {
      A: "A background view behind the modified view's content",
      B: "A new view controller",
      C: "A modal alert",
      D: "A second navigation stack",
    },
    correctAnswer: "A",
    explanation:
      "background adds content behind the modified view, and modifier order affects the resulting size and appearance.",
  },
  {
    id: "swiftiq-q193",
    originalNumber: 193,
    topic: T11,
    question: "How can a view be conditionally included in a SwiftUI layout?",
    options: {
      A: "Use an if/else statement inside a ViewBuilder context",
      B: "Use a SQL WHERE clause in body",
      C: "Use Task.sleep",
      D: "Use NavigationPath only",
    },
    correctAnswer: "A",
    explanation:
      "SwiftUI result-builder contexts support conditional view construction using if/else branches.",
  },
  {
    id: "swiftiq-q194",
    originalNumber: 194,
    topic: T11,
    question: "What does the id(_:) view modifier do?",
    options: {
      A: "Assigns an explicit identity to a view, potentially affecting state lifetime",
      B: "Assigns a database primary key automatically",
      C: "Makes the view Identifiable at the model level",
      D: "Adds an accessibility label",
    },
    correctAnswer: "A",
    explanation:
      "id can reset or distinguish view identity. Changing the ID can cause SwiftUI to treat the view as a new identity and recreate its state.",
  },
  {
    id: "swiftiq-q195",
    originalNumber: 195,
    topic: T11,
    question: "What is the purpose of accessibilityLabel on an icon-only button?",
    options: {
      A: "Provides a spoken description for assistive technologies",
      B: "Changes the button's color",
      C: "Makes the icon larger",
      D: "Adds a navigation title",
    },
    correctAnswer: "A",
    explanation:
      "An accessibility label communicates the control's purpose to VoiceOver when visible text is absent or insufficient.",
  },
  {
    id: "swiftiq-q196",
    originalNumber: 196,
    topic: T11,
    question: "What does refreshable provide on supported scroll containers?",
    options: {
      A: "A pull-to-refresh interaction with an async action",
      B: "Automatic periodic background refresh forever",
      C: "A new navigation destination",
      D: "A sheet detent",
    },
    correctAnswer: "A",
    explanation:
      "refreshable attaches an asynchronous refresh operation to supported scrollable content.",
  },
  {
    id: "swiftiq-q197",
    originalNumber: 197,
    topic: T11,
    question: "What is the purpose of .task(id:) compared with .task?",
    options: {
      A: "It restarts the task when the equatable ID value changes",
      B: "It prevents task cancellation",
      C: "It runs only once per app installation",
      D: "It converts the task into a detached task",
    },
    correctAnswer: "A",
    explanation:
      "The id-based task modifier cancels and restarts its task when the supplied identity value changes.",
  },
  {
    id: "swiftiq-q198",
    originalNumber: 198,
    topic: T11,
    question: "What is the purpose of withTaskCancellationHandler?",
    options: {
      A: "Runs a handler when cancellation is requested while managing cancellation-aware work",
      B: "Prevents cancellation from occurring",
      C: "Makes an actor nonisolated",
      D: "Creates a SwiftUI alert",
    },
    correctAnswer: "A",
    explanation:
      "It lets code respond to cancellation, especially when bridging APIs that need explicit cancellation cleanup.",
  },
  {
    id: "swiftiq-q199",
    originalNumber: 199,
    topic: T11,
    question: "What does nonisolated mean on an actor member?",
    options: {
      A: "The member is not isolated to that actor's executor, subject to concurrency-safety rules",
      B: "The member runs only on the main actor",
      C: "The member cannot be called",
      D: "The actor becomes a struct",
    },
    correctAnswer: "A",
    explanation:
      "nonisolated allows access without hopping to the actor, but the member cannot freely access actor-isolated mutable state.",
  },
  {
    id: "swiftiq-q200",
    originalNumber: 200,
    topic: T11,
    question: "What is the safest general approach when sharing mutable state across tasks?",
    options: {
      A: "Give it a clear owner and protect access using actor isolation or another sound synchronization design",
      B: "Make every property global",
      C: "Use sleeps to avoid collisions",
      D: "Assume tasks run one at a time",
    },
    correctAnswer: "A",
    explanation:
      "Shared mutable state needs an explicit synchronization strategy. Actors are often the clearest Swift-concurrency-native option.",
  },
];

