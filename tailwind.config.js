/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
          light: '#6366f1',
        },
        accent: '#8b5cf6',
        surface: '#ffffff',
        app: {
          bg: '#f5f6fb',
          border: '#e8e9f1',
          text: '#1e2130',
          muted: '#7a7f93',
        },
      },
      borderRadius: {
        sm: '10px',
        DEFAULT: '16px',
        lg: '22px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(30, 33, 48, 0.06)',
        DEFAULT: '0 8px 24px -8px rgba(30, 33, 48, 0.14)',
        lg: '0 24px 48px -16px rgba(30, 33, 48, 0.28)',
      },
    },
  },
  plugins: [],
};
