const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');
c = c.replace(
  'const formattedHTML = formatLesson(lastLessonText);',
  'const formattedHTML = formatLesson(lastLessonText);\n    const hasProgressDoc = addons.includes(\'progressdoc\');\n    const hasRubric = addons.includes(\'rubric\');\n    const formsHTML = (hasProgressDoc ? getProgressDocHTML() : \'\') + (hasRubric ? getRubricHTML() : \'\');'
);
fs.writeFileSync('public/index.html', c);
console.log('Done!');