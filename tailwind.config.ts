// tailwind.config.ts

// This config file may not useful
// CSS Variables are in src/styles/global.css

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    colors: {
      note: '#3b82f6',
      tip: '#22c55e',
      important: '#8b5cf6',
      warning: '#f97316',
      caution: '#ef4444',
    },
  },
}
