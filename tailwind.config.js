/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'raisin-black': '#1D1E2C',
        'paynes-gray': '#59656F',
        'rose-quartz': '#AC9FBB',
        'thistle': '#DDBDD5',
        'lavender': '#F7EBEC',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'poller': ['"Poller One"', 'cursive'],
        'open-sans': ['"Open Sans"', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['32px', { lineHeight: '40px', fontWeight: '500' }],
        'heading-2': ['24px', { lineHeight: '32px', fontWeight: '500' }],
        'heading-3': ['20px', { lineHeight: '28px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
