/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0f0fe',
          200: '#bae6fd',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#0f172a',
        },
        hospi: {
          bg: '#f8fafc',
          card: '#ffffff',
          primary: '#2563eb',
          primaryHover: '#1d4ed8',
          subtle: '#f0f6ff',
          textDark: '#0f172a',
          textMuted: '#64748b',
          border: '#e2e8f0',
        }
      },
      boxShadow: {
        'hospi': '0 10px 30px -10px rgba(37, 99, 235, 0.12)',
        'hospi-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'hospi-hover': '0 12px 28px -4px rgba(37, 99, 235, 0.18)',
      }
    },
  },
  plugins: [],
}
