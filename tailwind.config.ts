// tailwind.config.ts

// This config file may not useful
// CSS Variables are in src/styles/global.css

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
}
