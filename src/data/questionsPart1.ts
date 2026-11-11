import type { Question } from "../types/quiz";

const T1 = "Views, modifiers, text, images and custom views";
const T2 = "Container views and layout stacks";
const T3 = "Grid sizing, dynamic views and reusable data-driven UI";
const T4 = "App lifecycle, state, binding and controls";
const T5 = "Observable, Bindable, data flow and environment";

export const QUESTIONS_PART_1: Question[] = [
  {
    id: "swiftiq-q001",
    originalNumber: 1,
    topic: T1,
    question: "What is the fundamental building block used to describe a SwiftUI interface?",
    options: {
      A: "A View",
      B: "A ViewController",
      C: "A Storyboard",
      D: "A WindowScene",
    },
    correctAnswer: "A",
    explanation:
      "In SwiftUI, types conforming to View describe pieces of the interface. SwiftUI combines these descriptions into the rendered UI.",
  },
  {
    id: "swiftiq-q002",
    originalNumber: 2,
    topic: T1,
    question: "Which protocol must a custom SwiftUI view conform to?",
    options: {
      A: "UIView",
      B: "View",
      C: "SceneDelegate",
      D: "ObservableObject",
    },
    correctAnswer: "B",
    explanation:
      "A custom SwiftUI component conforms to View and provides a body property.",
  },
  {
    id: "swiftiq-q003",
    originalNumber: 3,
    topic: T1,
    question: "What is the purpose of the body property in a View?",
    options: {
      A: "It stores network data",
      B: "It describes the view's content and layout",
      C: "It starts the app process",
      D: "It handles database migrations",
    },
    correctAnswer: "B",
    explanation:
      "body is a computed property returning some View. It describes what should appear, not a manually managed view hierarchy.",
  },
  {
    id: "swiftiq-q004",
    originalNumber: 4,
    topic: T1,
    question: "What does the some View return type mean?",
    options: {
      A: "The body can return any unrelated type at runtime",
      B: "The compiler knows one concrete return type hidden behind an opaque type",
      C: "The view is optional",
      D: "The view is always a Text",
    },
    correctAnswer: "B",
    explanation:
      "some View is an opaque return type: callers know the value conforms to View, while the concrete type remains hidden.",
  },
  {
    id: "swiftiq-q005",
    originalNumber: 5,
    topic: T1,
    question: "What does the .padding() modifier do by default?",
    options: {
      A: "Adds space inside a Text string",
      B: "Adds space around a view",
      C: "Changes the font",
      D: "Makes a view scrollable",
    },
    correctAnswer: "B",
    explanation:
      "padding adds layout space around the modified view. It does not insert characters into text.",
  },
  {
    id: "swiftiq-q006",
    originalNumber: 6,
    topic: T1,
    question: "In a modifier chain, which view is affected by a modifier?",
    options: {
      A: "Always the entire screen",
      B: "The view produced immediately before that modifier",
      C: "Only the parent scene",
      D: "Every view in the app",
    },
    correctAnswer: "B",
    explanation:
      "Modifiers wrap the view expression to their left, so modifier order and placement matter.",
  },
  {
    id: "swiftiq-q007",
    originalNumber: 7,
    topic: T1,
    question: "What is a key consequence of changing modifier order?",
    options: {
      A: "The result can change because modifiers wrap views in sequence",
      B: "The compiler always sorts modifiers alphabetically",
      C: "Modifier order never matters",
      D: "The app changes from SwiftUI to UIKit",
    },
    correctAnswer: "A",
    explanation:
      "For example, padding before background differs from background before padding because the background is applied to a differently sized view.",
  },
  {
    id: "swiftiq-q008",
    originalNumber: 8,
    topic: T1,
    question: "Which modifier changes the foreground color of text or symbols?",
    options: {
      A: "background",
      B: "foregroundStyle",
      C: "padding",
      D: "frame",
    },
    correctAnswer: "B",
    explanation:
      "foregroundStyle controls the foreground rendering style, including colors and hierarchical styles.",
  },
  {
    id: "swiftiq-q009",
    originalNumber: 9,
    topic: T1,
    question: "Which modifier is commonly used to set a view's font?",
    options: {
      A: "font",
      B: "fontSize",
      C: "textStyleOnly",
      D: "typeface",
    },
    correctAnswer: "A",
    explanation:
      "Text and other text-based views use .font(...), such as .font(.title) or .font(.system(size: 18)).",
  },
  {
    id: "swiftiq-q010",
    originalNumber: 10,
    topic: T1,
    question: "How do you make a Text view support multiple lines without truncating at one line?",
    options: {
      A: "Set lineLimit(1)",
      B: "Allow the layout to provide width and use an appropriate lineLimit, such as nil",
      C: "Use Image instead",
      D: "Set opacity(0)",
    },
    correctAnswer: "B",
    explanation:
      "Text wraps according to available width. lineLimit(nil) removes a fixed line cap; the parent layout must still provide usable space.",
  },
  {
    id: "swiftiq-q011",
    originalNumber: 11,
    topic: T1,
    question: "Which initializer displays an image asset named 'logo' from the asset catalog?",
    options: {
      A: 'Image("logo")',
      B: 'Text("logo")',
      C: 'UIImage("logo")',
      D: 'Asset("logo")',
    },
    correctAnswer: "A",
    explanation:
      'Image("logo") loads an image resource by name from the app\'s asset catalog or other supported image resource lookup.',
  },
  {
    id: "swiftiq-q012",
    originalNumber: 12,
    topic: T1,
    question: "What does resizable() do to an Image?",
    options: {
      A: "Allows the image to scale to fit its layout frame",
      B: "Automatically crops the image to a circle",
      C: "Downloads a larger image",
      D: "Makes the image editable",
    },
    correctAnswer: "A",
    explanation:
      "Image is not resizable by default. resizable() lets SwiftUI scale it within the proposed layout size.",
  },
  {
    id: "swiftiq-q013",
    originalNumber: 13,
    topic: T1,
    question: "What is the difference between scaledToFit and scaledToFill?",
    options: {
      A: "They are identical",
      B: "Fit preserves the whole image; Fill covers the box and may crop",
      C: "Fit crops; Fill always shows the whole image",
      D: "Fill changes the image file",
    },
    correctAnswer: "B",
    explanation:
      "scaledToFit preserves the full image within the available bounds; scaledToFill fills the bounds and can crop excess content.",
  },
  {
    id: "swiftiq-q014",
    originalNumber: 14,
    topic: T1,
    question: "Which modifier clips a view to a circular shape?",
    options: {
      A: "cornerRadius(100) only",
      B: "clipShape(Circle())",
      C: "circle(true)",
      D: "maskToCircle()",
    },
    correctAnswer: "B",
    explanation:
      "clipShape applies a shape as a clipping mask. Circle() is the standard circular shape.",
  },
  {
    id: "swiftiq-q015",
    originalNumber: 15,
    topic: T1,
    question: "How can a view be made partially transparent?",
    options: {
      A: "blur",
      B: "opacity",
      C: "scaleEffect",
      D: "fixedSize",
    },
    correctAnswer: "B",
    explanation:
      "opacity accepts a value from 0.0 (transparent) to 1.0 (opaque).",
  },
  {
    id: "swiftiq-q016",
    originalNumber: 16,
    topic: T1,
    question: "What does a custom ViewModifier allow you to do?",
    options: {
      A: "Define a reusable collection of view modifications",
      B: "Create a new app target",
      C: "Replace the Swift compiler",
      D: "Store a database",
    },
    correctAnswer: "A",
    explanation:
      "A type conforming to ViewModifier packages styling or layout changes so they can be reused consistently.",
  },
  {
    id: "swiftiq-q017",
    originalNumber: 17,
    topic: T1,
    question: "How is a custom ViewModifier applied?",
    options: {
      A: ".modifier(MyModifier())",
      B: ".applyClass(MyModifier())",
      C: ".view(MyModifier())",
      D: ".styleProtocol(MyModifier())",
    },
    correctAnswer: "A",
    explanation:
      "Use the modifier(_:) method, often wrapped in a convenience extension for a readable custom modifier.",
  },
  {
    id: "swiftiq-q018",
    originalNumber: 18,
    topic: T1,
    question: "Why extract repeated UI into a custom view?",
    options: {
      A: "To make every view global",
      B: "To improve reuse, readability and separation of concerns",
      C: "To avoid using body",
      D: "To disable state updates",
    },
    correctAnswer: "B",
    explanation:
      "A reusable view encapsulates a coherent UI component and reduces duplicated layout code.",
  },
  {
    id: "swiftiq-q019",
    originalNumber: 19,
    topic: T1,
    question: "What does @ViewBuilder enable?",
    options: {
      A: "Building a view from multiple view expressions and conditional branches",
      B: "Running background threads",
      C: "Saving view state to disk",
      D: "Creating a database schema",
    },
    correctAnswer: "A",
    explanation:
      "ViewBuilder is a result builder used by SwiftUI APIs to combine multiple child view expressions.",
  },
  {
    id: "swiftiq-q020",
    originalNumber: 20,
    topic: T1,
    question: "What is the role of #Preview in modern SwiftUI projects?",
    options: {
      A: "Declares a compile-time macro for previewing a view in Xcode",
      B: "Creates an App Store listing",
      C: "Runs UI tests on a device",
      D: "Registers a notification",
    },
    correctAnswer: "A",
    explanation:
      "#Preview provides an Xcode preview declaration so a view can be inspected during development.",
  },
  {
    id: "swiftiq-q021",
    originalNumber: 21,
    topic: T2,
    question: "Which container arranges children vertically?",
    options: {
      A: "HStack",
      B: "VStack",
      C: "ZStack",
      D: "Grid",
    },
    correctAnswer: "B",
    explanation: "VStack places its children in a vertical sequence.",
  },
  {
    id: "swiftiq-q022",
    originalNumber: 22,
    topic: T2,
    question: "Which container arranges children horizontally?",
    options: {
      A: "HStack",
      B: "VStack",
      C: "ZStack",
      D: "List",
    },
    correctAnswer: "A",
    explanation: "HStack places children in a horizontal row.",
  },
  {
    id: "swiftiq-q023",
    originalNumber: 23,
    topic: T2,
    question: "Which container layers children along the depth axis?",
    options: {
      A: "VStack",
      B: "HStack",
      C: "ZStack",
      D: "Form",
    },
    correctAnswer: "C",
    explanation:
      "ZStack overlays children, with later children generally drawn above earlier ones.",
  },
  {
    id: "swiftiq-q024",
    originalNumber: 24,
    topic: T2,
    question: "What does the spacing parameter of VStack control?",
    options: {
      A: "Distance between arranged children",
      B: "Text character spacing",
      C: "Screen brightness",
      D: "Safe-area inset only",
    },
    correctAnswer: "A",
    explanation:
      "Stack spacing controls the gap between adjacent arranged children.",
  },
  {
    id: "swiftiq-q025",
    originalNumber: 25,
    topic: T2,
    question: "What does alignment: .leading mean in a VStack?",
    options: {
      A: "Align children to the leading horizontal edge",
      B: "Place children at the top of the screen",
      C: "Align text baselines only",
      D: "Reverse the order of children",
    },
    correctAnswer: "A",
    explanation:
      "For a vertical stack, alignment controls horizontal alignment of its children. .leading aligns their leading edges.",
  },
  {
    id: "swiftiq-q026",
    originalNumber: 26,
    topic: T2,
    question: "What is the main difference between LazyVStack and VStack?",
    options: {
      A: "LazyVStack creates children as needed during scrolling/layout",
      B: "VStack supports only Text",
      C: "LazyVStack is always horizontal",
      D: "VStack requires a List",
    },
    correctAnswer: "A",
    explanation:
      "Lazy stacks defer creating off-screen child views where possible, which is useful for long or large collections.",
  },
  {
    id: "swiftiq-q027",
    originalNumber: 27,
    topic: T2,
    question: "Where is LazyVStack commonly used?",
    options: {
      A: "Inside a ScrollView for long vertical content",
      B: "Only inside an Alert",
      C: "Only as an app root",
      D: "Inside a Color asset",
    },
    correctAnswer: "A",
    explanation:
      "A ScrollView containing a LazyVStack is a common pattern for vertically scrolling content with many rows.",
  },
  {
    id: "swiftiq-q028",
    originalNumber: 28,
    topic: T2,
    question: "What is the main purpose of LazyHStack?",
    options: {
      A: "Lazy horizontal arrangement of content",
      B: "A vertical navigation bar",
      C: "A database-backed list",
      D: "An image filter",
    },
    correctAnswer: "A",
    explanation:
      "LazyHStack arranges children horizontally and creates them as needed, often inside a horizontal ScrollView.",
  },
  {
    id: "swiftiq-q029",
    originalNumber: 29,
    topic: T2,
    question: "Which container is generally appropriate for a small, fixed set of views?",
    options: {
      A: "VStack or HStack",
      B: "LazyVStack in every case",
      C: "LazyHGrid only",
      D: "NavigationPath",
    },
    correctAnswer: "A",
    explanation:
      "For a small fixed group, ordinary stacks are simple and appropriate; lazy containers are useful for larger or deferred content.",
  },
  {
    id: "swiftiq-q030",
    originalNumber: 30,
    topic: T2,
    question: "In a ZStack, how is the visual stacking order normally determined?",
    options: {
      A: "First child always appears on top",
      B: "Later children are drawn above earlier children",
      C: "Children are sorted by name",
      D: "Only the last child is displayed",
    },
    correctAnswer: "B",
    explanation:
      "ZStack layers views in declaration order, with later views visually above earlier ones.",
  },
  {
    id: "swiftiq-q031",
    originalNumber: 31,
    topic: T2,
    question: "What does Spacer() do inside a stack?",
    options: {
      A: "Consumes available flexible space to push views apart",
      B: "Adds a fixed 1-point border",
      C: "Creates a scroll view",
      D: "Loads an image",
    },
    correctAnswer: "A",
    explanation:
      "Spacer expands along the stack's main axis when space is available, helping distribute or push content.",
  },
  {
    id: "swiftiq-q032",
    originalNumber: 32,
    topic: T2,
    question: "What does frame(width:height:) generally specify?",
    options: {
      A: "A view's proposed or constrained layout dimensions",
      B: "The pixel size of the source image file",
      C: "The app's minimum OS version",
      D: "The number of stack children",
    },
    correctAnswer: "A",
    explanation:
      "frame participates in layout by proposing or constraining dimensions; it does not necessarily change the underlying asset's pixels.",
  },
  {
    id: "swiftiq-q033",
    originalNumber: 33,
    topic: T2,
    question: "What does maxWidth: .infinity commonly achieve in a frame?",
    options: {
      A: "Allows a view to expand to the maximum offered width",
      B: "Sets width to exactly one pixel",
      C: "Makes the view infinitely tall",
      D: "Disables layout",
    },
    correctAnswer: "A",
    explanation:
      "A maximum width of infinity allows the view to take the available horizontal space offered by its parent.",
  },
  {
    id: "swiftiq-q034",
    originalNumber: 34,
    topic: T2,
    question: "What is the purpose of alignment in a ZStack?",
    options: {
      A: "Aligns overlaid children within the stack's bounds",
      B: "Changes the order of navigation destinations",
      C: "Sets a view's opacity",
      D: "Controls task priority",
    },
    correctAnswer: "A",
    explanation:
      "ZStack alignment determines how its children are positioned relative to the stack's shared coordinate space.",
  },
  {
    id: "swiftiq-q035",
    originalNumber: 35,
    topic: T2,
    question: "Which layout is best suited to a regular two-dimensional arrangement of rows and columns?",
    options: {
      A: "Grid",
      B: "HStack only",
      C: "NavigationStack",
      D: "Alert",
    },
    correctAnswer: "A",
    explanation:
      "Grid provides a two-dimensional layout with explicit rows and columns.",
  },
  {
    id: "swiftiq-q036",
    originalNumber: 36,
    topic: T2,
    question: "What is a key difference between Grid and LazyVGrid?",
    options: {
      A: "Grid creates all children eagerly; LazyVGrid creates items lazily as needed",
      B: "Grid is horizontal only",
      C: "LazyVGrid cannot have columns",
      D: "Grid is only for images",
    },
    correctAnswer: "A",
    explanation:
      "Grid is a non-lazy two-dimensional layout; LazyVGrid lazily creates items in vertically scrolling grid content.",
  },
  {
    id: "swiftiq-q037",
    originalNumber: 37,
    topic: T2,
    question: "What does LazyVGrid(columns:) define?",
    options: {
      A: "The grid's column layout and sizing rules",
      B: "The number of navigation destinations",
      C: "A vertical animation curve",
      D: "The app's color scheme",
    },
    correctAnswer: "A",
    explanation:
      "GridItem definitions describe each column's sizing behavior, spacing and alignment.",
  },
  {
    id: "swiftiq-q038",
    originalNumber: 38,
    topic: T2,
    question: "What does GridItem(.flexible()) mean?",
    options: {
      A: "The column or row can adapt within available space",
      B: "The column has a fixed 1-point size",
      C: "The column is hidden",
      D: "The column always scrolls",
    },
    correctAnswer: "A",
    explanation:
      "A flexible GridItem expands or contracts to fit available space subject to its constraints.",
  },
  {
    id: "swiftiq-q039",
    originalNumber: 39,
    topic: T2,
    question: "When is GridItem(.fixed(100)) useful?",
    options: {
      A: "When a grid track should have a fixed 100-point dimension",
      B: "When the grid should have 100 rows automatically",
      C: "When items should be hidden",
      D: "When content should be fetched asynchronously",
    },
    correctAnswer: "A",
    explanation:
      "A fixed GridItem specifies a fixed track size, useful when consistent dimensions are required.",
  },
  {
    id: "swiftiq-q040",
    originalNumber: 40,
    topic: T2,
    question: "What is LazyHGrid designed to create?",
    options: {
      A: "A lazily populated grid that scrolls horizontally with rows defined",
      B: "A vertical list with sections",
      C: "A tab bar",
      D: "A navigation path",
    },
    correctAnswer: "A",
    explanation:
      "LazyHGrid arranges content in rows and is commonly placed in a horizontal ScrollView.",
  },
  {
    id: "swiftiq-q041",
    originalNumber: 41,
    topic: T3,
    question: "What is the purpose of ForEach in SwiftUI?",
    options: {
      A: "Create views for each element in a collection",
      B: "Run a loop on a background thread",
      C: "Sort a database automatically",
      D: "Navigate to a URL",
    },
    correctAnswer: "A",
    explanation:
      "ForEach maps identifiable or explicitly identified data elements to views.",
  },
  {
    id: "swiftiq-q042",
    originalNumber: 42,
    topic: T3,
    question: "Why does ForEach need stable identity for dynamic data?",
    options: {
      A: "SwiftUI uses identity to track which views correspond to which data items",
      B: "It needs identity to compile any Text",
      C: "Identity controls screen brightness",
      D: "It prevents all animations",
    },
    correctAnswer: "A",
    explanation:
      "Stable identity helps SwiftUI preserve the correct view state and efficiently update inserted, removed or changed elements.",
  },
  {
    id: "swiftiq-q043",
    originalNumber: 43,
    topic: T3,
    question: "Which protocol is commonly used to provide identity to model values in ForEach?",
    options: {
      A: "Identifiable",
      B: "Codable only",
      C: "Equatable only",
      D: "Sendable only",
    },
    correctAnswer: "A",
    explanation:
      "Identifiable provides a stable id property that ForEach can use to distinguish elements.",
  },
  {
    id: "swiftiq-q044",
    originalNumber: 44,
    topic: T3,
    question: "What can go wrong when using array indices as IDs for frequently changing data?",
    options: {
      A: "State may become associated with the wrong logical item after insertions or reordering",
      B: "The app cannot display Text",
      C: "The array becomes immutable",
      D: "The view always becomes lazy",
    },
    correctAnswer: "A",
    explanation:
      "Indices identify positions, not the underlying item. When positions shift, SwiftUI may reuse view identity incorrectly.",
  },
  {
    id: "swiftiq-q045",
    originalNumber: 45,
    topic: T3,
    question: "Which ForEach form is appropriate for a range of integers?",
    options: {
      A: "ForEach(0..<5, id: \\.self) { index in ... }",
      B: "ForEach(0..<5) without identity in all contexts",
      C: "ForEach(Int)",
      D: "ForEach(range: 5)",
    },
    correctAnswer: "A",
    explanation:
      "A range of integers can use each integer as its identity with id: \\.self.",
  },
  {
    id: "swiftiq-q046",
    originalNumber: 46,
    topic: T3,
    question: "What is the purpose of GridRow inside Grid?",
    options: {
      A: "Defines one row of cells in a Grid",
      B: "Defines a navigation destination",
      C: "Defines a task group",
      D: "Defines a tab item",
    },
    correctAnswer: "A",
    explanation: "GridRow groups the views that occupy one row of a Grid.",
  },
  {
    id: "swiftiq-q047",
    originalNumber: 47,
    topic: T3,
    question: "How can a cell span multiple grid columns?",
    options: {
      A: "Use gridCellColumns(_:)",
      B: "Use navigationDestination",
      C: "Use opacity",
      D: "Use taskGroup",
    },
    correctAnswer: "A",
    explanation:
      "gridCellColumns lets a grid child occupy multiple columns, useful for headers or full-width content.",
  },
  {
    id: "swiftiq-q048",
    originalNumber: 48,
    topic: T3,
    question: "What does the .adaptive(minimum: 100) GridItem configuration mean?",
    options: {
      A: "Fit as many columns of at least about 100 points as the available width permits",
      B: "Always create exactly 100 columns",
      C: "Make every cell 100 points tall",
      D: "Adapt only the text font",
    },
    correctAnswer: "A",
    explanation:
      "Adaptive sizing packs as many tracks as fit while respecting the minimum size (and any maximum).",
  },
  {
    id: "swiftiq-q049",
    originalNumber: 49,
    topic: T3,
    question: "What is a common use of LazyVGrid with adaptive columns?",
    options: {
      A: "Photo galleries that adjust the number of columns to screen width",
      B: "A fixed bottom tab bar",
      C: "A modal alert",
      D: "A single navigation link",
    },
    correctAnswer: "A",
    explanation:
      "Adaptive columns are useful for responsive galleries and card grids.",
  },
  {
    id: "swiftiq-q050",
    originalNumber: 50,
    topic: T3,
    question: "Which view is suitable for presenting a vertically scrolling collection with separators and row behavior built in?",
    options: {
      A: "List",
      B: "ZStack",
      C: "Color",
      D: "Spacer",
    },
    correctAnswer: "A",
    explanation:
      "List is a collection-oriented container with platform-native scrolling and row presentation behavior.",
  },
  {
    id: "swiftiq-q051",
    originalNumber: 51,
    topic: T3,
    question: "How can a developer create a section heading in a List?",
    options: {
      A: "Use Section with a header",
      B: "Use Spacer only",
      C: "Use TaskGroup",
      D: "Use NavigationPath",
    },
    correctAnswer: "A",
    explanation:
      "Section groups related list content and can provide headers and footers.",
  },
  {
    id: "swiftiq-q052",
    originalNumber: 52,
    topic: T3,
    question: "What does .listStyle(.plain) affect?",
    options: {
      A: "The visual presentation style of a List",
      B: "The order of the data model",
      C: "The network request priority",
      D: "The app lifecycle",
    },
    correctAnswer: "A",
    explanation:
      "List style influences list appearance and behavior, not the underlying data.",
  },
  {
    id: "swiftiq-q053",
    originalNumber: 53,
    topic: T3,
    question: "How do you make a list row respond to a tap?",
    options: {
      A: "Attach an onTapGesture or use a Button in the row",
      B: "Use .task only",
      C: "Add a GridItem",
      D: "Set lineLimit(0)",
    },
    correctAnswer: "A",
    explanation:
      "A row can handle taps through a gesture or, preferably for clear accessibility semantics, a Button.",
  },
  {
    id: "swiftiq-q054",
    originalNumber: 54,
    topic: T3,
    question: "Which modifier enables swipe actions on a List row?",
    options: {
      A: "swipeActions",
      B: "swipeListRowOnly",
      C: "onSwipeButton",
      D: "rowGesture",
    },
    correctAnswer: "A",
    explanation:
      "swipeActions adds contextual actions revealed by swiping a row.",
  },
  {
    id: "swiftiq-q055",
    originalNumber: 55,
    topic: T3,
    question: "Which modifier supports deleting rows from a dynamic List?",
    options: {
      A: "onDelete",
      B: "onRemoveAll",
      C: "deleteRowsNow",
      D: "removeAtIndex",
    },
    correctAnswer: "A",
    explanation:
      "onDelete provides an IndexSet of offsets that the data source should remove.",
  },
  {
    id: "swiftiq-q056",
    originalNumber: 56,
    topic: T3,
    question: "What does onMove provide?",
    options: {
      A: "An IndexSet of moved items and a destination position",
      B: "A new NavigationPath",
      C: "A Task handle",
      D: "A text selection",
    },
    correctAnswer: "A",
    explanation:
      "onMove reports which rows moved and the destination offset, allowing the model to reorder its collection.",
  },
  {
    id: "swiftiq-q057",
    originalNumber: 57,
    topic: T3,
    question: "Why should a row's action update the source data model?",
    options: {
      A: "SwiftUI reflects the model's new state in the UI",
      B: "Rows cannot have buttons otherwise",
      C: "It automatically saves data to iCloud",
      D: "It disables animations",
    },
    correctAnswer: "A",
    explanation:
      "In a data-driven UI, changing the source of truth causes the displayed list to update.",
  },
  {
    id: "swiftiq-q058",
    originalNumber: 58,
    topic: T3,
    question: "What is the role of a Button in SwiftUI?",
    options: {
      A: "It presents an actionable control with an action closure",
      B: "It creates a new thread",
      C: "It stores an environment value",
      D: "It lays out a grid",
    },
    correctAnswer: "A",
    explanation:
      "Button communicates an action to the system and supports interaction and accessibility semantics.",
  },
  {
    id: "swiftiq-q059",
    originalNumber: 59,
    topic: T3,
    question: "What does Toggle control?",
    options: {
      A: "A Boolean setting or on/off state",
      B: "A navigation stack",
      C: "A list section",
      D: "A task group",
    },
    correctAnswer: "A",
    explanation:
      "Toggle binds to a Boolean value and lets the user switch it on or off.",
  },
  {
    id: "swiftiq-q060",
    originalNumber: 60,
    topic: T3,
    question: "What does Slider typically bind to?",
    options: {
      A: "A numeric value within a range",
      B: "A String identifier only",
      C: "A NavigationPath",
      D: "An image asset",
    },
    correctAnswer: "A",
    explanation:
      "Slider represents continuous or stepped numeric input through a binding.",
  },
  {
    id: "swiftiq-q061",
    originalNumber: 61,
    topic: T4,
    question: "Which protocol marks the entry point of a SwiftUI app?",
    options: {
      A: "App",
      B: "ViewController",
      C: "UIApplicationDelegate only",
      D: "Scene",
    },
    correctAnswer: "A",
    explanation:
      "A SwiftUI application typically defines a type conforming to App and a body that declares scenes.",
  },
  {
    id: "swiftiq-q062",
    originalNumber: 62,
    topic: T4,
    question: "Which property wrapper is used to declare a local source of truth owned by a view?",
    options: {
      A: "@State",
      B: "@Binding",
      C: "@Environment",
      D: "@FocusState only",
    },
    correctAnswer: "A",
    explanation:
      "@State stores value state managed by SwiftUI for the lifetime of the view identity.",
  },
  {
    id: "swiftiq-q063",
    originalNumber: 63,
    topic: T4,
    question: "What happens when a @State value changes?",
    options: {
      A: "SwiftUI invalidates dependent view content and updates the UI",
      B: "The app always restarts",
      C: "The value is written to a server",
      D: "The view is permanently destroyed",
    },
    correctAnswer: "A",
    explanation:
      "Changing state signals SwiftUI that dependent views need to be recomputed and rendered as appropriate.",
  },
  {
    id: "swiftiq-q064",
    originalNumber: 64,
    topic: T4,
    question: "What is @Binding used for?",
    options: {
      A: "A child view gets read/write access to state owned elsewhere",
      B: "A view creates its own independent state",
      C: "A value is stored permanently on disk",
      D: "A view starts a task",
    },
    correctAnswer: "A",
    explanation:
      "A Binding is a two-way connection to a value owned by another source, often a parent view's @State.",
  },
  {
    id: "swiftiq-q065",
    originalNumber: 65,
    topic: T4,
    question: "How is a binding commonly passed from a parent to a child?",
    options: {
      A: "ChildView(value: $value)",
      B: "ChildView(value: value!)",
      C: "ChildView(@State value)",
      D: "ChildView(environment: value.id)",
    },
    correctAnswer: "A",
    explanation:
      "The $ prefix projects a property wrapper's binding, which can be passed to a child expecting @Binding.",
  },
  {
    id: "swiftiq-q066",
    originalNumber: 66,
    topic: T4,
    question: "What is the difference between @State and @Binding?",
    options: {
      A: "@State owns state; @Binding accesses state owned elsewhere",
      B: "@Binding owns persistent storage; @State is read-only",
      C: "They are identical",
      D: "@State is only for strings",
    },
    correctAnswer: "A",
    explanation:
      "The owner creates @State; a child receives a Binding so it can read and write the owner's value.",
  },
  {
    id: "swiftiq-q067",
    originalNumber: 67,
    topic: T4,
    question: "Why should @State generally not be used to store an externally owned model object in modern Observation-based code?",
    options: {
      A: "Ownership and observation should be expressed with the appropriate model and wrapper, such as @State for an owned @Observable reference",
      B: "@State cannot store any reference types",
      C: "Observation only works in UIKit",
      D: "Objects cannot be stored in views",
    },
    correctAnswer: "A",
    explanation:
      "Modern Observation distinguishes ownership from observing a reference model. @State can own an @Observable model, while @Bindable creates bindings to its properties.",
  },
  {
    id: "swiftiq-q068",
    originalNumber: 68,
    topic: T4,
    question: "Which control is appropriate for choosing one option from a small set?",
    options: {
      A: "Picker",
      B: "ProgressView",
      C: "Spacer",
      D: "Canvas",
    },
    correctAnswer: "A",
    explanation:
      "Picker presents a selection interface and can be configured with styles appropriate to the platform.",
  },
  {
    id: "swiftiq-q069",
    originalNumber: 69,
    topic: T4,
    question: "Which control is designed to accept text input?",
    options: {
      A: "TextField",
      B: "Label",
      C: "ProgressView",
      D: "Divider",
    },
    correctAnswer: "A",
    explanation:
      "TextField accepts editable text and typically uses a Binding<String>.",
  },
  {
    id: "swiftiq-q070",
    originalNumber: 70,
    topic: T4,
    question: "Which control supports longer multi-line text input?",
    options: {
      A: "TextEditor",
      B: "TextField only",
      C: "Image",
      D: "Stepper",
    },
    correctAnswer: "A",
    explanation:
      "TextEditor provides a scrollable multi-line text editing area and binds to a String.",
  },
  {
    id: "swiftiq-q071",
    originalNumber: 71,
    topic: T4,
    question: "What does Stepper provide?",
    options: {
      A: "Increment and decrement controls for a value",
      B: "A map route",
      C: "A modal sheet",
      D: "An image crop",
    },
    correctAnswer: "A",
    explanation:
      "Stepper lets users increase or decrease a bound value, often by a configured step amount.",
  },
  {
    id: "swiftiq-q072",
    originalNumber: 72,
    topic: T4,
    question: "What is ProgressView used for?",
    options: {
      A: "Showing progress or an indeterminate activity indicator",
      B: "Editing a paragraph",
      C: "Selecting a tab",
      D: "Deleting a row",
    },
    correctAnswer: "A",
    explanation:
      "ProgressView communicates task progress; it can show a determinate value or indeterminate activity.",
  },
  {
    id: "swiftiq-q073",
    originalNumber: 73,
    topic: T4,
    question: "What does .disabled(condition) do?",
    options: {
      A: "Disables user interaction when the condition is true",
      B: "Hides the view permanently",
      C: "Removes it from the view tree",
      D: "Stops all async tasks",
    },
    correctAnswer: "A",
    explanation:
      "disabled controls whether the view can be interacted with; the modifier can also affect descendants.",
  },
  {
    id: "swiftiq-q074",
    originalNumber: 74,
    topic: T4,
    question: "What is the purpose of the SwiftUI App body?",
    options: {
      A: "Declares the app's scenes, such as WindowGroup",
      B: "Declares every button action",
      C: "Stores all view state",
      D: "Defines the app's database",
    },
    correctAnswer: "A",
    explanation:
      "The App body returns scenes. WindowGroup is a common scene that creates app windows.",
  },
  {
    id: "swiftiq-q075",
    originalNumber: 75,
    topic: T4,
    question: "What does WindowGroup provide?",
    options: {
      A: "A scene that can create one or more windows displaying a root view",
      B: "A stack layout",
      C: "A database transaction",
      D: "A sheet presentation style",
    },
    correctAnswer: "A",
    explanation:
      "WindowGroup is a scene container used by many SwiftUI apps to present a root content view in windows.",
  },
  {
    id: "swiftiq-q076",
    originalNumber: 76,
    topic: T4,
    question: "Which scene phase value indicates the app is active and receiving events?",
    options: {
      A: "active",
      B: "inactive",
      C: "background",
      D: "suspendedOnly",
    },
    correctAnswer: "A",
    explanation:
      "ScenePhase.active means the scene is in the foreground and interactive.",
  },
  {
    id: "swiftiq-q077",
    originalNumber: 77,
    topic: T4,
    question: "Which property wrapper is commonly used to read a scene's phase?",
    options: {
      A: "@Environment(\\.scenePhase)",
      B: "@StateObject(\\.scenePhase)",
      C: "@Binding(\\.scenePhase)",
      D: "@Published(\\.scenePhase)",
    },
    correctAnswer: "A",
    explanation:
      "The scenePhase environment value can be read using @Environment and observed for lifecycle transitions.",
  },
  {
    id: "swiftiq-q078",
    originalNumber: 78,
    topic: T4,
    question: "When is a view's onAppear closure called?",
    options: {
      A: "When the view appears in the interface",
      B: "Only once for the entire app process",
      C: "Before the App type is created",
      D: "Only after a network response",
    },
    correctAnswer: "A",
    explanation:
      "onAppear runs when the view appears, but it may run more than once as the view enters and leaves the hierarchy.",
  },
  {
    id: "swiftiq-q079",
    originalNumber: 79,
    topic: T4,
    question: "Why should onAppear not be treated as a guaranteed one-time initializer?",
    options: {
      A: "A view can appear multiple times during its lifetime",
      B: "It runs only on macOS",
      C: "It cannot access state",
      D: "It is called only by buttons",
    },
    correctAnswer: "A",
    explanation:
      "SwiftUI view values are transient and views can reappear. Use state/model initialization patterns that tolerate repeated appearance.",
  },
  {
    id: "swiftiq-q080",
    originalNumber: 80,
    topic: T4,
    question: "What is the purpose of @Observable on a model type?",
    options: {
      A: "Makes changes to its properties observable by the Observation system",
      B: "Makes every property constant",
      C: "Converts the class into a View",
      D: "Automatically persists the object",
    },
    correctAnswer: "A",
    explanation:
      "@Observable instruments a model so SwiftUI can track which properties are read and update dependent views when they change.",
  },
  {
    id: "swiftiq-q081",
    originalNumber: 81,
    topic: T5,
    question: "Which module provides the modern @Observable macro?",
    options: {
      A: "Observation",
      B: "Combine only",
      C: "UIKit",
      D: "CoreData",
    },
    correctAnswer: "A",
    explanation:
      "The Observation framework provides the @Observable macro and related observation tools.",
  },
  {
    id: "swiftiq-q082",
    originalNumber: 82,
    topic: T5,
    question: "What does @Bindable provide for an @Observable model?",
    options: {
      A: "Bindings to mutable properties of the observable object",
      B: "Permanent disk storage",
      C: "A network connection",
      D: "A new model instance on every render",
    },
    correctAnswer: "A",
    explanation:
      "@Bindable creates bindings to properties of an observable object so controls such as TextField can edit them.",
  },
  {
    id: "swiftiq-q083",
    originalNumber: 83,
    topic: T5,
    question: "When is @State private var model = Model() appropriate with an @Observable model?",
    options: {
      A: "When the view owns the model instance",
      B: "When the model is owned by a remote server only",
      C: "When the model must be a value type",
      D: "When the model is never read",
    },
    correctAnswer: "A",
    explanation:
      "A view can use @State to own an @Observable reference model and preserve it for the view identity.",
  },
  {
    id: "swiftiq-q084",
    originalNumber: 84,
    topic: T5,
    question: "How can a child view receive an observable model as a property?",
    options: {
      A: "Pass the model in its initializer or property input",
      B: "Only through a global singleton",
      C: "Only through UserDefaults",
      D: "It cannot receive models",
    },
    correctAnswer: "A",
    explanation:
      "Passing model references explicitly makes dependencies clear and allows child views to observe the properties they read.",
  },
  {
    id: "swiftiq-q085",
    originalNumber: 85,
    topic: T5,
    question: "What is a benefit of passing data as view properties?",
    options: {
      A: "Dependencies are explicit and the view is easier to reuse and test",
      B: "It makes all data global",
      C: "It prevents previews",
      D: "It disables updates",
    },
    correctAnswer: "A",
    explanation:
      "Explicit inputs clarify what a view needs and reduce hidden dependencies.",
  },
  {
    id: "swiftiq-q086",
    originalNumber: 86,
    topic: T5,
    question: "What is @Environment commonly used for?",
    options: {
      A: "Reading values supplied by the environment, such as color scheme or dismiss action",
      B: "Creating a new database",
      C: "Defining a custom font file",
      D: "Looping through arrays",
    },
    correctAnswer: "A",
    explanation:
      "Environment values communicate contextual information through the view hierarchy without manually passing each value through every level.",
  },
  {
    id: "swiftiq-q087",
    originalNumber: 87,
    topic: T5,
    question: "How do you read the current color scheme?",
    options: {
      A: "@Environment(\\.colorScheme) var colorScheme",
      B: "@State var colorScheme",
      C: "@Binding(\\.colorScheme)",
      D: "@Observable colorScheme",
    },
    correctAnswer: "A",
    explanation:
      "colorScheme is an environment value and can be read using @Environment.",
  },
  {
    id: "swiftiq-q088",
    originalNumber: 88,
    topic: T5,
    question: "What does the dismiss environment action do?",
    options: {
      A: "Dismisses the current presentation or closes the relevant presentation context",
      B: "Deletes the current view source file",
      C: "Always terminates the app",
      D: "Pops every navigation stack in the app",
    },
    correctAnswer: "A",
    explanation:
      "The dismiss action asks SwiftUI to dismiss the current presentation context, such as a sheet or presented destination.",
  },
  {
    id: "swiftiq-q089",
    originalNumber: 89,
    topic: T5,
    question: "What is a custom environment value useful for?",
    options: {
      A: "Sharing a contextual value through a view hierarchy without threading it through every initializer",
      B: "Creating a global mutable variable accessible to every process",
      C: "Replacing all @State properties",
      D: "Making a view render only once",
    },
    correctAnswer: "A",
    explanation:
      "Custom environment values let an app define contextual data or behavior that descendants can read.",
  },
  {
    id: "swiftiq-q090",
    originalNumber: 90,
    topic: T5,
    question: "Which modern API pattern defines a custom EnvironmentKey?",
    options: {
      A: "Create a type conforming to EnvironmentKey and provide a defaultValue",
      B: "Create a ViewModifier named Environment",
      C: "Add a key to Info.plist only",
      D: "Use ForEach with an ID",
    },
    correctAnswer: "A",
    explanation:
      "A custom EnvironmentKey supplies a default value; an EnvironmentValues extension exposes a typed property.",
  },
  {
    id: "swiftiq-q091",
    originalNumber: 91,
    topic: T5,
    question: "Why should custom environment values have sensible defaults?",
    options: {
      A: "Views can work when no ancestor explicitly supplies an override",
      B: "SwiftUI requires every key to be optional",
      C: "Defaults make values persistent",
      D: "Defaults disable inheritance",
    },
    correctAnswer: "A",
    explanation:
      "A default lets a view behave safely even when no parent has injected a custom value.",
  },
  {
    id: "swiftiq-q092",
    originalNumber: 92,
    topic: T5,
    question: "What does .environment(\\.someKey, value) do?",
    options: {
      A: "Overrides an environment value for the modified view and its descendants",
      B: "Changes a view's identity",
      C: "Creates a new app scene",
      D: "Saves a value to iCloud",
    },
    correctAnswer: "A",
    explanation:
      "The environment modifier injects a value into the environment inherited by descendants.",
  },
  {
    id: "swiftiq-q093",
    originalNumber: 93,
    topic: T5,
    question: "What is the purpose of @Environment(\\.dismiss) var dismiss?",
    options: {
      A: "Reads a callable dismiss action from the environment",
      B: "Reads the app's battery percentage",
      C: "Creates a Boolean binding",
      D: "Starts a task",
    },
    correctAnswer: "A",
    explanation:
      "The dismiss environment value is an action that can be invoked, commonly from a close or cancel button.",
  },
  {
    id: "swiftiq-q094",
    originalNumber: 94,
    topic: T5,
    question: "What is a source of truth in SwiftUI data flow?",
    options: {
      A: "The authoritative state or model from which displayed values are derived",
      B: "The first view in the file",
      C: "The asset catalog",
      D: "The navigation bar title",
    },
    correctAnswer: "A",
    explanation:
      "A clear source of truth avoids conflicting copies of state and makes UI updates predictable.",
  },
  {
    id: "swiftiq-q095",
    originalNumber: 95,
    topic: T5,
    question: "Why should derived values often be computed rather than stored separately?",
    options: {
      A: "They cannot drift out of sync with the underlying source values",
      B: "Computed properties are always faster",
      C: "SwiftUI forbids stored properties",
      D: "They automatically become environment values",
    },
    correctAnswer: "A",
    explanation:
      "If a value can be derived from authoritative state, computing it reduces duplicated state and synchronization bugs.",
  },
  {
    id: "swiftiq-q096",
    originalNumber: 96,
    topic: T5,
    question: "What is the role of @Published in a traditional ObservableObject model?",
    options: {
      A: "Publishes changes to a property so subscribers can observe them",
      B: "Creates a SwiftUI binding automatically in every context",
      C: "Makes the class Codable",
      D: "Persists changes to disk",
    },
    correctAnswer: "A",
    explanation:
      "@Published is part of Combine and is commonly used with ObservableObject's objectWillChange publisher in the older observation model.",
  },
  {
    id: "swiftiq-q097",
    originalNumber: 97,
    topic: T5,
    question: "Which wrapper traditionally observes an ObservableObject supplied to a view?",
    options: {
      A: "@ObservedObject",
      B: "@Bindable only",
      C: "@Environment only",
      D: "@State only",
    },
    correctAnswer: "A",
    explanation:
      "@ObservedObject subscribes a view to an ObservableObject owned elsewhere; @StateObject is traditionally used when the view owns it.",
  },
  {
    id: "swiftiq-q098",
    originalNumber: 98,
    topic: T5,
    question: "What is the traditional purpose of @StateObject?",
    options: {
      A: "Create and own an ObservableObject instance for a view identity",
      B: "Create a binding to any Int",
      C: "Read color scheme",
      D: "Store a URL",
    },
    correctAnswer: "A",
    explanation:
      "@StateObject manages the lifetime of an ObservableObject owned by a SwiftUI view. Modern @Observable models commonly use @State instead.",
  },
  {
    id: "swiftiq-q099",
    originalNumber: 99,
    topic: T5,
    question: "Can a view read an @Observable model from the environment?",
    options: {
      A: "Yes, using the appropriate typed environment access",
      B: "No, only ObservableObject can use environment",
      C: "Only inside UIKit",
      D: "Only after converting it to JSON",
    },
    correctAnswer: "A",
    explanation:
      "Modern SwiftUI supports placing observable models in the environment and reading them in descendants using the supported environment APIs.",
  },
  {
    id: "swiftiq-q100",
    originalNumber: 100,
    topic: T5,
    question: "What is a good reason to prefer explicit property passing over environment injection?",
    options: {
      A: "The dependency is local and explicit, making the component's requirements obvious",
      B: "Environment values cannot be read by children",
      C: "Property passing is always faster",
      D: "Environment injection is deprecated",
    },
    correctAnswer: "A",
    explanation:
      "For a small/local dependency, an explicit initializer communicates the dependency clearly; environment is useful for broadly shared context.",
  },
];

