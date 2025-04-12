import type { Config } from "tailwindcss";

const base64PenSVG = `PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIGhlaWdodD0iODAwcHgiIHdpZHRoPSI4MDBweCIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDI4Mi44MzcgMjgyLjgzNyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBkPSJNMTkuNTM5LDI0Ni4wMDZjLTEuNDEyLTEuNDEzLTIuOTk1LTIuMTU5LTQuNTc2LTIuMTU5Yy0yLjM2MSwwLTQuMzMsMS42NzYtNS4yNjYsNC40ODJsLTkuMjQsMjcuNzIzDQoJCWMtMC43MDEsMi4xMDMtMC41OTEsMy45NSwwLjMwOSw1LjIwMWMwLjczNiwxLjAyMSwxLjk1OSwxLjU4NCwzLjQ0MywxLjU4NGMwLjc5LDAsMS42NTUtMC4xNTUsMi41NzEtMC40NjFsMjcuNzIyLTkuMjQxDQoJCWMyLjM2LTAuNzg2LDMuOTA3LTIuMjY3LDQuMzU1LTQuMTY3YzAuNDQ4LTEuOS0wLjI3My0zLjkxNi0yLjAzMi01LjY3NUwxOS41MzksMjQ2LjAwNnoiLz4NCgk8cGF0aCBkPSJNMjgwLjIwNSw0OC4yNzlMMjM0LjU1MywyLjYyN0MyMzIuODYsMC45MzQsMjMwLjU5OSwwLDIyOC4xODksMGMtMi40MSwwLTQuNjcsMC45MzQtNi4zNjMsMi42MjdMNTEuODkyLDE3Mi41NjENCgkJYy0zLjIxMiwzLjIxMi02Ljk5Myw5LjMzLTguNDI5LDEzLjYzOGwtNy40MTcsMjIuMjUyYy0xLjUwMyw0LjUwOCwwLjAwOCwxMC45MDksMy4zNjgsMTQuMjdsMjAuNjk3LDIwLjY5Nw0KCQljMi40MDMsMi40MDMsNi40OCwzLjk1NywxMC4zODgsMy45NTdjMCwwLDAsMCwwLjAwMSwwYzEuNDA0LDAsMi43MS0wLjE5OCwzLjg4MS0wLjU4OWwyMi4yNTMtNy40MTcNCgkJYzQuMzA5LTEuNDM2LDEwLjQyNi01LjIxNywxMy42MzctOC40MjhMMjgwLjIwNSw2MS4wMDdDMjgzLjcxNCw1Ny40OTgsMjgzLjcxNCw1MS43ODgsMjgwLjIwNSw0OC4yNzl6IE0yNTIuNTM1LDcwLjg5Ng0KCQlMMTY2LjgsMTU2LjYzMWMtMi45MjksMi45MjktNi43NjgsNC4zOTMtMTAuNjA3LDQuMzkzcy03LjY3OC0xLjQ2NS0xMC42MDYtNC4zOTNjLTUuODU4LTUuODU3LTUuODU4LTE1LjM1NSwwLTIxLjIxMw0KCQlsODUuNzM1LTg1LjczNWM1Ljg1Ny01Ljg1NywxNS4zNTUtNS44NTcsMjEuMjEzLDBDMjU4LjM5Myw1NS41NCwyNTguMzkzLDY1LjAzOCwyNTIuNTM1LDcwLjg5NnoiLz4NCjwvZz4NCjwvc3ZnPg==`;

export default {
  // corePlugins: {
  //   // preflight: false,
  // },
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "25rem",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        vazir: "Vazir",
      },
      cursor: {
        default: `url(/svg/pen.svg),default`,
      },
      gridTemplateColumns: {
        "auto-fit": "repeat(auto-fit, min(100%, 15em))",
      },
      animation: {
        "spin-slow": "spin 4s linear infinite",
      },
      backgroundImage: {
        "gradient-conic":
          "conic-gradient(#ff4545, #00ff99, #006aff, #ff0095, #ff4545)",
      },
      
    },
  },
  plugins: [],
} satisfies Config;
