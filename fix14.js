const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');
c = c.replace(
  "const supaRes = await fetch(`${supaBase}/rest/v1/resources?or=(${filter})&limit=3&select=title,url,type`, {\n          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }\n        });\n        resources = await supaRes.json();",
  "const supaRes = await fetch(`${supaBase}/rest/v1/resources?or=(${filter})&limit=3&select=title,url,type`, {\n          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' }\n        });\n        const supaData = await supaRes.json();\n        console.log('Supabase status:', supaRes.status);\n        console.log('Supabase response:', JSON.stringify(supaData).slice(0,200));\n        resources = Array.isArray(supaData) ? supaData : [];"
);
fs.writeFileSync('server.js', c);
console.log('Done!');