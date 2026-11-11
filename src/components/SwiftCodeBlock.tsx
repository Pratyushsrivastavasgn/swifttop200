import React from "react";

const SWIFT_KEYWORDS = new Set([
  "struct",
  "class",
  "actor",
  "enum",
  "protocol",
  "extension",
  "func",
  "var",
  "let",
  "some",
  "any",
  "async",
  "await",
  "try",
  "throws",
  "throw",
  "do",
  "catch",
  "if",
  "else",
  "for",
  "in",
  "return",
  "import",
  "private",
  "nonisolated",
  "mutating",
  "nil",
  "true",
  "false",
  "self",
]);

const SWIFT_TYPES = new Set([
  "View",
  "Text",
  "Image",
  "VStack",
  "HStack",
  "ZStack",
  "LazyVStack",
  "LazyHStack",
  "Grid",
  "GridRow",
  "LazyVGrid",
  "LazyHGrid",
  "GridItem",
  "List",
  "Section",
  "ForEach",
  "Spacer",
  "Divider",
  "Group",
  "Button",
  "Toggle",
  "Slider",
  "Picker",
  "TextField",
  "TextEditor",
  "Stepper",
  "ProgressView",
  "Label",
  "App",
  "Scene",
  "WindowGroup",
  "NavigationStack",
  "NavigationLink",
  "NavigationPath",
  "NavigationSplitView",
  "TabView",
  "Task",
  "Sendable",
  "Identifiable",
  "Hashable",
  "ObservableObject",
  "ViewModifier",
  "EnvironmentKey",
  "EnvironmentValues",
  "Binding",
  "String",
  "Int",
  "Bool",
  "Circle",
  "Rectangle",
  "Color",
  "ScrollView",
]);

function tokenizeSwiftLine(line: string): React.ReactNode[] {
  const tokenRegex =
    /(\/\/.*$|"(?:\\.|[^"\\])*"|@[A-Za-z_][A-Za-z0-9_]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    let className = "text-[#1D1D1F]";

    if (token.startsWith("//")) {
      className = "text-[#86868B] italic";
    } else if (token.startsWith('"')) {
      className = "text-[#C41A16]";
    } else if (token.startsWith("@")) {
      className = "text-[#AD3DA4] font-medium";
    } else if (/^\d/.test(token)) {
      className = "text-[#1C00CF]";
    } else if (SWIFT_KEYWORDS.has(token)) {
      className = "text-[#9B2393] font-semibold";
    } else if (SWIFT_TYPES.has(token)) {
      className = "text-[#0B4F79] font-medium";
    }

    nodes.push(
      <span key={keyIdx++} className={className}>
        {token}
      </span>
    );
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
}

export function SwiftCodeBlock({ code }: { code: string }) {
  const lines = code.replace(/\r\n/g, "\n").split("\n");

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-[#E8E8ED] bg-[#F8F8FA]">
      <div className="flex items-center justify-between border-b border-[#E8E8ED] bg-white/70 px-4 py-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#86868B]">
          Swift
        </span>
      </div>
      <pre className="swift-scroll overflow-x-auto px-4 py-3.5 font-mono text-[13.5px] leading-relaxed text-[#1D1D1F]">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="min-h-[1.4em]">
              {line.length > 0 ? tokenizeSwiftLine(line) : " "}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/**
 * Renders prose while lightly styling explicit backticked code spans if present,
 * never altering a single character of non-backticked source wording.
 */
export function FormattedQuestionText({ text }: { text: string }) {
  if (!text.includes("`")) {
    return <>{text}</>;
  }
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={idx}
              className="mx-0.5 rounded-md bg-[#FFF1E8] px-1.5 py-0.5 font-mono text-[0.9em] font-medium text-[#D93D26]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
}

