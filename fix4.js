const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

// Remove the two form checkboxes
c = c.replace(
  '\n        <label class="checkbox-item"><input type="checkbox" value="progressdoc"> Project Progress Document</label>\n        <label class="checkbox-item"><input type="checkbox" value="rubric"> Universal Art Project Rubric</label>',
  ''
);

// Remove forms from output
c = c.replace('</div>${formsHTML}', '</div>');

fs.writeFileSync('public/index.html', c);
console.log('Done!');