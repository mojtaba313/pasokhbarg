import type { Config } from "tailwindcss";

export default {
  darkMode:'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens:{
        xs:'25rem'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      FontFace:{
        vazir:"Vazir"
      }
    },
  },
  plugins: [],
} satisfies Config;