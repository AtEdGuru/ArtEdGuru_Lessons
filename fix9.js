const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');
c = c.replace(
  "const express = require('express');",
  "const express = require('express');\nconst SUPABASE_URL = process.env.SUPABASE_URL;\nconst SUPABASE_KEY = process.env.SUPABASE_KEY;"
);
c = c.replace(
  "    res.json(data);\n  } catch (err) {",
  "    // Search Supabase for related resources\n    const lessonText = JSON.stringify(data).toLowerCase();\n    let resources = [];\n    try {\n      const keywords = req.body.prompt.toLowerCase().match(/drawing|painting|sculpture|printmaking|collage|watercolor|acrylic|clay|photography|mosaic|fiber|portrait|landscape|color|design|STEAM|math|science|history/gi) || [];\n      const uniqueKeywords = [...new Set(keywords)].slice(0, 3);\n      if (uniqueKeywords.length && SUPABASE_URL && SUPABASE_KEY) {\n        const filter = uniqueKeywords.map(k => `tags.ilike.%${k}%`).join(',');\n        const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/resources?or=(${filter})&limit=3`, {\n          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }\n        });\n        resources = await supaRes.json();\n      }\n    } catch(e) { console.log('Supabase error:', e.message); }\n    data.artedguru_resources = resources;\n    res.json(data);\n  } catch (err) {"
);
fs.writeFileSync('server.js', c);
console.log('Done!');