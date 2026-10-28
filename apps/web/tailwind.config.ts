import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/admin/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        craft: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#EADBC8',
          300: '#DAC0A3',
          400: '#B89774',
          500: '#946C45',
          600: '#7A522E',
          700: '#5C3C1E',
          800: '#3D2713',
          900: '#1F140A',
        },
        brand: {
          primary: '#A35424',
          dark: '#713616',
          accent: '#F4C76B',
          charcoal: '#1A1412',
          surface: '#FFFAF3',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 35px rgba(60, 32, 12, 0.06)',
        lifted: '0 20px 40px rgba(60, 32, 12, 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
