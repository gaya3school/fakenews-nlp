/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Poppins', 'sans-serif'],
      },
      colors: {
        surface: '#f8fafc',
        panel: '#ffffff',
        ink: '#0f172a',
        accent: {
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
        teal: {
          500: '#0d9488',
          600: '#0f766e',
        },
      },
      boxShadow: {
        glow: '0 10px 35px rgba(79,70,229,0.22)',
        card: '0 12px 30px rgba(15,23,42,0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
