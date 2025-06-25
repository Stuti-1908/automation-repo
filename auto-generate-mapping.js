// auto-refactor-selectors.js
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mapping = JSON.parse(readFileSync('selector-mapping.json'));

// Files to refactor
const filesToRefactor = [
    join(__dirname, 'features', 'login.feature'),
    join(__dirname, 'features', 'steps.js'),
    join(__dirname, 'features', 'pageobjects', 'login.page.js'),
    join(__dirname, 'features', 'pageobjects', 'page.js'),
    join(__dirname, 'features', 'pageobjects', 'secure.page.js'),
];

filesToRefactor.forEach(filePath => {
    if (existsSync(filePath)) {
        console.log(`🔹 Refactoring ${filePath} ...`);
        let content = readFileSync(filePath, 'utf8');

        Object.entries(mapping).forEach(([oldSelector, newSelector]) => {
            if (oldSelector.startsWith('ADDED:')) return; // skip added keys

            // Skip invalid or empty selectors
            if (
                newSelector === null ||
                (typeof newSelector === 'string' && (
                    newSelector.trim() === '' ||
                    newSelector === '#' ||
                    newSelector === '.'
                ))
            ) {
                console.log(`⚠️ Replacing removed selector with safe placeholder: ${oldSelector}`);
                
                // Safe placeholder replacement for removed selectors
                const pattern = [
                    `\\$\\(['"]${escapeRegExp(oldSelector)}['"]\\)`,
                    `['"]${escapeRegExp(oldSelector)}['"]`
                ];
                
                pattern.forEach(pat => {
                    const regex = new RegExp(pat, 'g');
                    content = content.replace(regex, match => {
                        console.log(`⚠️ Replacing REMOVED match: ${match} → '#SAFE_PLACEHOLDER_DO_NOT_USE'`);
                        return match.startsWith('$')
                            ? `$('#SAFE_PLACEHOLDER_DO_NOT_USE')`
                            : `'SAFE_PLACEHOLDER_DO_NOT_USE'`;
                    });
                });

                return;
            }

            // Valid selector → replace using smart pattern
            const pattern = [
                `\\$\\(['"]${escapeRegExp(oldSelector)}['"]\\)`,
                `['"]${escapeRegExp(oldSelector)}['"]`
            ];

            pattern.forEach(pat => {
                const regex = new RegExp(pat, 'g');
                content = content.replace(regex, match => {
                    console.log(`✅ Replacing match: ${match} → '${newSelector}'`);
                    return match.startsWith('$')
                        ? `$('${newSelector}')`
                        : `'${newSelector}'`;
                });
            });
        });

        // Save file back
        writeFileSync(filePath, content);
        console.log(`✅ Refactored: ${filePath}`);
    } else {
        console.warn(`⚠️ File not found: ${filePath}`);
    }
});

console.log('🎉 All files refactored!');

// Helper to escape regex special chars
function escapeRegExp(string) {
    return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
