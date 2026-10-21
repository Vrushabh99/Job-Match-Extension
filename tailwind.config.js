/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f4f7fa',
        ink: '#15212c',
        muted: '#5d6b78',
        line: '#d5dde5',
        'match-bg': '#dff1ee',
        'match-ink': '#0b4f49',
        'match-line': '#9ccfc8',
        'miss-bg': '#fbe7e1',
        'miss-ink': '#8a2f1c',
        'miss-line': '#e6b3a5',
        accent: '#0f766e',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

