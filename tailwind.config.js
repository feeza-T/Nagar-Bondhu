/** Design-system colours live here AND as CSS variables in src/styles/index.css */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#F26B21', clay: '#C4501F', lime: '#DDF545', olive: '#5F8A1A',
        forest: '#24402B', ink: '#151515', surface: '#F3F3EE',
        mint1: '#CDEEDD', mint2: '#E9F6EE', teal: '#2F9E80', cream: '#FDF5E6',
      },
     fontFamily: {
  display: ['"Bebas Neue"', '"Hind Siliguri"', 'sans-serif'],
  sans: ['Poppins', '"Hind Siliguri"', 'sans-serif'],
},
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
      },
      animation: { float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
