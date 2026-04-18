const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');
c = c.replace(
  "const filter = uniqueKeywords.map(k => `tags.ilike.%${k}%`).join(',');\n        const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/resources?or=(${filter})&limit=3`, {",
  "const filter = uniqueKeywords.map(k => `tags.ilike.%${k}%`).join(',');\n        const supaBase = SUPABASE_URL.endsWith('/') ? SUPABASE_URL.slice(0,-1) : SUPABASE_URL;\n        const supaRes = await fetch(`${supaBase}/rest/v1/resources?or=(${filter})&limit=3&select=title,url,type`, {"
);
fs.writeFileSync('server.js', c);
console.log('Done!');