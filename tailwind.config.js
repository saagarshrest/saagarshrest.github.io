/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./contact.html",
    "./single-post.html", 
    "./single-project.html",
    "./js/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffc62d',
        secondary: '#11d5ed',
        'secondary-dark': '#0052f8',
        'text-base': '#262626',
        'text-light': '#b5b5b5',
        'heading': '#000000',
        'nav': '#000000',
        'bg-light': '#F6F6F6',
        'bg-dark': '#131313',
        'border': '#E9E9E9',
        'border-dark': '#323232',
        'meta': '#909090'
      },
      fontFamily: {
        body: ['nimbus-sans', 'Archivo', 'sans-serif'],
        heading: ['aktiv-grotesk-extended', 'Montserrat', 'sans-serif']
      },
      height: {
        'nav-short': '60px',
        'nav-full': '136px'
      }
    },
  },
  plugins: [],
}