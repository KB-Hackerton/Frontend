/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      colors: {
        black: '#222222',
        gray: {
          100: '#F2F3F7',
          200: '#BABABA',
          300: '#7A7A7A',
          400: '#3B3B3B',
        },
        white: '#FFFFFF',
        blue: '#5EA7DF',
        main: '#DA4C24',
        pink: '#F58D80',
        yellow: '#FFF600',
        green: '#89B548',
        red: '#FC0707',
      },
    },
  },
  plugins: [],
}
