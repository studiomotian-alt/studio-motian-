import type { Config } from "tailwindcss";

const fontStack = [
  "Pretendard Variable",
  "Pretendard",
  "Helvetica Neue",
  "Helvetica",
  "Arial",
  "sans-serif",
];

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        ink: "#0A0A0A",
        muted: "#7A7A7A",
        line: "#E8E8E8",
        accent: "#000000",
      },
      fontFamily: {
        sans: fontStack,
        display: fontStack,
        mono: fontStack,
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
        wider: "0.08em",
        widest: "0.22em",
      },
      fontSize: {
        "display-xl": ["0.9375rem", { lineHeight: "1.55", letterSpacing: "0" }],
        "display-lg": ["0.875rem", { lineHeight: "1.55", letterSpacing: "0" }],
        "display-md": ["0.8125rem", { lineHeight: "1.55", letterSpacing: "0" }],
      },
      maxWidth: {
        container: "1280px",
        prose: "640px",
      },
    },
  },
  plugins: [],
};

export default config;
