const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');
c = c.replace(
  "lastLessonText = (data.content || []).map(b => b.text || '').join('');",
  "lastLessonText = (data.content || []).map(b => b.text || '').join('');\n    const resources = data.artedguru_resources || [];"
);
c = c.replace(
  "const formattedHTML = formatLesson(lastLessonText);",
  "const formattedHTML = formatLesson(lastLessonText);\n    const resourcesHTML = resources.length ? `<div class=\"resources-block\"><strong>📚 Related ArtEdGuru Resources:</strong><ul>${resources.map(r => `<li><a href=\"${r.url}\" target=\"_blank\">${r.title}</a> <span class=\"res-type\">(${r.type})</span></li>`).join('')}</ul></div>` : '';"
);
c = c.replace(
  '<div class="lesson-content">${formattedHTML}</div>',
  '<div class="lesson-content">${formattedHTML}${resourcesHTML}</div>'
);
c = c.replace(
  '.forms-links {',
  '.resources-block { background: #f0f7ff; border: 1px solid #2e7ac4; border-radius: 8px; padding: 12px 16px; margin-top: 1.5rem; font-size: 14px; }\n.resources-block ul { margin: 8px 0 0 1.2rem; }\n.resources-block li { margin-bottom: 6px; }\n.resources-block a { color: #c04a20; text-decoration: none; font-weight: 500; }\n.resources-block a:hover { text-decoration: underline; }\n.res-type { color: #888; font-size: 12px; }\n.forms-links {'
);
fs.writeFileSync('public/index.html', c);
console.log('Done!');