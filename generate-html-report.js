// generate-html-report.js
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export function generateHtmlReport(historyPath, outputPath) {
    if (!existsSync(historyPath)) {
        console.warn('⚠️ selector-history.json not found.');
        return;
    }

    const data = JSON.parse(readFileSync(historyPath, 'utf-8'));

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

    if (data.removed) {
        data.removed.forEach(sel => {
            html += `<tr><td>Removed</td><td>${sel}</td><td>—</td></tr>`;
        });
    }

    if (data.added) {
        data.added.forEach(sel => {
            html += `<tr><td>Added</td><td>—</td><td>${sel}</td></tr>`;
        });
    }

    if (data.changed) {
        for (const [oldSel, newSel] of Object.entries(data.changed)) {
            html += `<tr><td>Changed</td><td>${oldSel}</td><td>${newSel}</td></tr>`;
        }
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
