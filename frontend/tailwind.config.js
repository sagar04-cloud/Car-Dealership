/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          900: '#0f172a',
          DEFAULT: '#1a1a1a',
        },
        accent: {
          DEFAULT: '#3066FF',
          hover: '#0047FF',
          soft: '#EBF0FF',
        },
        luxury: {
          gold: '#C5A059',
          dark: '#1C1C1C',
        },
        slate: {
          850: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 30px 60px -12px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(48, 102, 255, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
}
