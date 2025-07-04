// generate-html-report.js
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export function generateHtmlReport(mappingPath, outputPath) {
    if (!existsSync(mappingPath)) {
        console.warn('⚠️ selector-mapping.json not found.');
        return;
    }

    const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));

    let html = `
    <html>
    <head>
        <title>Selector Detector Report</title>
        <style>
            body { font-family: sans-serif; padding: 20px; background: #f4f4f4; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
            th, td { border: 1px solid #ccc; padding: 10px; }
            th { background: #007BFF; color: white; }
            tr:nth-child(even) { background: #f9f9f9; }
        </style>
    </head>
    <body>
        <h1>Selector Change Report</h1>
        <table>
            <thead><tr><th>Type</th><th>Old Selector</th><th>New Selector</th></tr></thead>
            <tbody>
    `;

    let hasRows = false;
    for (const [oldSel, newSel] of Object.entries(mapping)) {
        if (oldSel.startsWith('ADDED: ')) {
            html += `<tr><td>Added</td><td>—</td><td>${newSel.id || newSel.class || JSON.stringify(newSel)}</td></tr>`;
            hasRows = true;
        } else if (newSel === null) {
            html += `<tr><td>Removed</td><td>${oldSel}</td><td>—</td></tr>`;
            hasRows = true;
        } else if (typeof newSel === 'object' && oldSel !== (newSel.id || newSel.class)) {
            html += `<tr><td>Changed</td><td>${oldSel}</td><td>${newSel.id || newSel.class || JSON.stringify(newSel)}</td></tr>`;
            hasRows = true;
        }
    }
    if (!hasRows) {
        html += `<tr><td colspan="3" style="text-align:center;">No selector changes detected.</td></tr>`;
    }

    html += `
            </tbody>
        </table>
    </body>
    </html>
    `;

    const folder = join(outputPath);
    if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

    const reportPath = join(folder, 'selector-report.html');
    writeFileSync(reportPath, html);
    console.log(`📄 HTML report saved at: ${reportPath}`);
}
