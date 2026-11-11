/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        swift: {
          orange: "#F05138",
          accent: "#FF6B00",
          soft: "#FFF1E8",
          bg: "#FAFAFA",
          ink: "#1D1D1F",
          muted: "#86868B",
          border: "#E8E8ED",
          correct: "#22A06B",
          incorrect: "#E5484D",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        apple:
          "0 1px 2px rgba(0, 0, 0, 0.03), 0 8px 24px -12px rgba(29, 29, 31, 0.08)",
        "apple-hover":
          "0 4px 12px rgba(0, 0, 0, 0.04), 0 18px 36px -14px rgba(240, 81, 56, 0.16)",
      },
    },
  },
  plugins: [],
};

