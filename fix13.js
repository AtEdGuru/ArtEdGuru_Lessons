const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');
c = c.replace(
  "} catch(e) { console.log('Supabase error:', e.message); }",
  "} catch(e) { console.log('Supabase error:', e.message); console.log('Supabase URL:', SUPABASE_URL ? 'set' : 'missing'); console.log('Supabase KEY:', SUPABASE_KEY ? 'set' : 'missing'); }"
);
fs.writeFileSync('server.js', c);
console.log('Done!');