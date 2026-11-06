// Build: npx tailwindcss@3.4.17 -c tailwind.config.js -i assets/css/tailwind.src.css -o assets/css/tailwind.css --minify
module.exports = {
  content: ['./**/*.html', './assets/js/**/*.js', '!./node_modules/**'],
  theme: { extend: { colors: { primary: '#0D0D0D', secondary: '#1E40AF', accent: '#F59E0B' } } },
};
