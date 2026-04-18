const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');
c = c.replace(
  "headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }",
  "headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }"
);
fs.writeFileSync('server.js', c);
console.log('Done!');