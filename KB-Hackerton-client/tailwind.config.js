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
          200: '#D5D5D5',
          300: '#7A7A7A',
          400: '#3B3B3B',
        },
        white: '#FFFFFF',
        blue: '#5EA7DF',
        main: '#DA4C24',
        pink: { 100: '#F58D80' },
        yellow: '#FFF600',
        green: '#89B548',
        red: '#FC0707',
        'pastel-lavender': '#F3E8FF',
        'pastel-lilac': '#EDE9FE',
        'pastel-babyblue': '#E0F2FE',
        'pastel-sky': '#DBEAFE',
        'pastel-mint': '#CCFBF1',
        'pastel-lightgreen': '#DCFCE7',
        'pastel-babypink': '#FCE7F3',
        'pastel-rose': '#FFE4E6',
        'pastel-salmon': '#FFE2E2',
        'pastel-peach': '#FFE4F3',
      },
      backgroundImage: {
        gradient: 'linear-gradient(to right, #F58D80, #89B548)',
      },
    },
    fontSize: {
      8: '0.5rem', // 8px
      10: '0.625rem', // 10px
      12: '0.75rem', // 12px
      14: '0.875rem', // 14px
      15: '0.9375rem', // 15px
      16: '1rem', // 16px
      17: '1.0625rem', // 17px
      18: '1.125rem', // 18px
      20: '1.25rem', // 20px
      24: '1.5rem', // 24px
      25: '1.5625rem', // 25px
      26: '1.625rem', // 26px
      28: '1.75rem', // 28px
      40: '2.5rem', // 40px
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-gradient': {
          'background-image': 'linear-gradient(to right, #F58D80, #89B548)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          color: 'transparent',
        },
      })
    },
  ],
}
