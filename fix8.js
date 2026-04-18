const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

c = c.replace(
  '<a href="https://www.artedguru.com/uploads/3/0/6/1/30613521/project_progress_document.pdf" target="_blank">Project Progress Document</a> &nbsp;|&nbsp; <a href="https://www.artedguru.com/assessments.html" target="_blank">Universal Art Project Rubric</a>',
  '<a href="https://www.artedguru.com/uploads/3/0/6/1/30613521/project_progress_document.pdf" target="_blank">Project Progress Document &amp; Universal Rubric — Free Download</a>'
);

fs.writeFileSync('public/index.html', c);
console.log('Done!');