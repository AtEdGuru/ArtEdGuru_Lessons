const fs = require('fs');

// Fix server.js
let s = fs.readFileSync('server.js', 'utf8');
s = s.replace(
  'select=title,url,type',
  'select=Title,URL,Type'
);
fs.writeFileSync('server.js', s);

// Fix index.html
let h = fs.readFileSync('public/index.html', 'utf8');
h = h.replace(
  'r.title}</a> <span class=\"res-type\">(${r.type})',
  'r.Title}</a> <span class=\"res-type\">(${r.Type}'
);
h = h.replace(
  'href=\"${r.url}\"',
  'href=\"${r.URL}\"'
);
fs.writeFileSync('public/index.html', h);

console.log('Done!');