import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        nav: 'var(--nav-background)',
        card: 'var(--card-background)',
        'card-hover': 'var(--card-hover)',
      },
    },
  },
  plugins: [],
} satisfies Config;
