const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');
c = c.replace(
  '<div class="lesson-content">${formattedHTML}</div>',
  '<div class="lesson-content">${formattedHTML}</div>${formsHTML}'
);
fs.writeFileSync('public/index.html', c);
console.log('Done!');