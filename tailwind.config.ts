import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5EF',
        paperdim: '#EFEBDF',
        ink: '#1C2230',
        primary: { DEFAULT: '#2B4C7E', light: '#6C93C7', dark: '#1D3760' },
        amber: { DEFAULT: '#E8A33D', light: '#F6C878' },
        coral: { DEFAULT: '#D65A55', light: '#E6746F' },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
