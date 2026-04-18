const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

// Add printable forms links to the credit line area
c = c.replace(
  'html += `<div class="credit-line">Generated with <a href="https://artedguru.com" target="_blank">ArtEdGuru</a> — <a href="https://artedguru.com" target="_blank">artedguru.com</a> | <a href="https://firehousepublications.com" target="_blank">FirehousePublications.com</a></div>`;',
  'html += `<div class="forms-links"><strong>📋 Printable ArtEdGuru Forms:</strong> <a href="https://www.artedguru.com/uploads/3/0/6/1/30613521/project_progress_document.pdf" target="_blank">Project Progress Document</a> &nbsp;|&nbsp; <a href="https://www.artedguru.com/assessments.html" target="_blank">Universal Art Project Rubric</a></div><div class="credit-line">Generated with <a href="https://artedguru.com" target="_blank">ArtEdGuru</a> — <a href="https://artedguru.com" target="_blank">artedguru.com</a> | <a href="https://firehousepublications.com" target="_blank">FirehousePublications.com</a></div>`;'
);

fs.writeFileSync('public/index.html', c);
console.log('Done!');