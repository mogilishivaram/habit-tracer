/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#020617',
        'dark-secondary': '#1e293b',
        'dark-border': '#334155',
        'dark-accent': '#60a5fa',
        'light-bg': '#ffffff',
        'light-secondary': '#f1f5f9',
        'light-border': '#cbd5e1',
        'light-accent': '#3b82f6',
      },
    },
  },
  plugins: [],
}

