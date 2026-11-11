import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { ui: ['DM Sans', 'system-ui', 'sans-serif'], display: ['Fraunces', 'Georgia', 'serif'] },
      boxShadow: { card: '5px 5px 0 #F5C59E' },
      colors: {
        accent: '#F97316', 'soft-orange': 'var(--theme-soft-orange, #FFF0DF)', cream: 'var(--theme-cream, #FFF8F0)', peach: 'var(--theme-peach, #FFE2CA)', ink: 'var(--theme-ink, #25211E)', muted: 'var(--theme-muted, #51463E)', action: 'var(--theme-action, #C2410C)', 'action-hover': 'var(--theme-action-hover, #9A3412)', outline: 'var(--theme-outline, #25211E)',
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#ff5e14",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-out forwards',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'slideInUp': 'slideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slideInDown': 'slideInDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slideOutUp': 'slideOutUp 0.18s ease-in forwards',
        'slideOutDown': 'slideOutDown 0.18s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideOutUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(0.97)' },
        },
        slideOutDown: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(40px) scale(0.97)' },
        },
      }
    },
  },
  plugins: [],
};
export default config;
