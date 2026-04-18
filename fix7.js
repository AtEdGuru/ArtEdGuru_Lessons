const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

c = c.replace(
  '.rubric-reflection { font-size: 13px; font-weight: bold; margin-top: 8px; }',
  '.rubric-reflection { font-size: 13px; font-weight: bold; margin-top: 8px; }\n.forms-links { font-size: 13px; color: #444; text-align: center; margin-top: 1.5rem; padding: 10px; background: #f5f2ee; border-radius: 8px; }\n.forms-links a { color: #c04a20; text-decoration: none; font-weight: 500; }\n.forms-links a:hover { text-decoration: underline; }'
);

fs.writeFileSync('public/index.html', c);
console.log('Done!');