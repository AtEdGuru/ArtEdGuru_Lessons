const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');
const css = `
.form-suggestions { background: #f0f7ff; border: 1px solid #2e7ac4; border-radius: 10px; padding: 1.25rem; margin-top: 1.5rem; }
.form-suggestions h3 { font-size: 15px; color: #1a3a5c; margin-bottom: 8px; }
.form-tip { font-size: 13px; color: #555; margin-bottom: 12px; }
.suggestion-block { margin-bottom: 12px; }
.suggestion-block strong { font-size: 13px; color: #333; }
.suggestion-content { font-size: 13px; color: #444; background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 8px 12px; margin-top: 4px; }
.printable-form { background: #fff; border: 1px solid #e8e4df; border-radius: 12px; padding: 1.75rem; margin-top: 1.5rem; font-family: Arial, sans-serif; font-size: 13px; }
.form-header-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.form-main-title { font-size: 20px; font-weight: bold; }
.form-subtext { font-size: 12px; color: #444; margin-bottom: 10px; }
.form-field-block { margin-bottom: 8px; }
.form-line-long { display: inline-block; border-bottom: 1px solid #000; width: 60%; margin-left: 4px; }
.form-line-med { display: inline-block; border-bottom: 1px solid #000; width: 40%; margin-left: 4px; }
.form-line-short { display: inline-block; border-bottom: 1px solid #000; width: 60px; margin: 0 4px; }
.form-divider-line { border: none; border-top: 1px solid #000; margin: 12px 0; }
.form-two-col { display: flex; gap: 20px; }
.form-left-col { flex: 1; }
.form-right-col { width: 200px; }
.form-numbered { margin-bottom: 8px; }
.instructor-box { border: 3px solid #000; padding: 8px; }
.instructor-header { background: #000; color: #fff; text-align: center; font-weight: bold; font-size: 12px; padding: 4px; margin-bottom: 8px; }
.progress-row { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; font-size: 12px; }
.form-bottom-row { display: flex; justify-content: space-between; margin-top: 8px; }
.form-footer-right { text-align: right; font-size: 12px; margin-top: 8px; }
.rubric-header-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
.rubric-title { text-align: center; font-size: 18px; font-weight: bold; font-style: italic; margin-bottom: 12px; }
.rubric-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.rubric-table th, .rubric-table td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; }
.rubric-table th { background: #f0f0f0; font-weight: bold; }
.rubric-footer { font-size: 11px; color: #555; margin-top: 8px; }
.rubric-reflection { font-size: 13px; font-weight: bold; margin-top: 8px; }
@media print { .output-toolbar, .export-row, .generate-btn, .footer-links, .header, .subject-pills, .subject-desc, .form-grid, #std-toggle, #addon-checks, .section-label { display: none !important; } }`;
c = c.replace('</style>', css + '\n</style>');
fs.writeFileSync('public/index.html', c);
console.log('Done!');