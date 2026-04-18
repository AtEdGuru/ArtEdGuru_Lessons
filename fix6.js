const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

// Remove progressdoc and rubric from addons block
c = c.replace(
  "  if (addons.includes('progressdoc')) out += '\\nPROJECT PROGRESS DOCUMENT: Generate a filled-in Project Progress Document for this lesson. Include: Project Title, 3 numbered Requirements students must meet, 3 \"To exceed expectations I can...\" goals, and a Peer Feedback prompt. Format clearly with labeled sections.\\n';\n  if (addons.includes('rubric')) out += '\\nUNIVERSAL ART PROJECT RUBRIC: Generate a filled-in Universal Art Project Rubric for this lesson using these exact 5 categories: Project Requirements, Process/Research & Documentation, Time & Management, Detail/Complexity/Craftsmanship & Care, Original/Personal & Unique. Use 4 scoring columns: 100%/Exceeds Expectations, 90%/Meets Expectations, 80%/Approaches Expectations, 70-65%/Missed Expectations. Include an \"I exceeded expectations by:\" fill-in for the Exceeds column. Add \"Created by artedguru.com & FirehousePublications.com\" at the bottom.\\n';",
  ''
);

fs.writeFileSync('public/index.html', c);
console.log('Done!');
