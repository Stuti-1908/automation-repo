//auto-refractor-selectors.js
import fs from 'fs';
import path from 'path';

const mappingPath = 'selector-mapping.json';
const featureDir = 'features';
const stepsDir = 'features'; // Assuming steps.js is directly in features, as per your structure
const pageObjectsDir = 'features/pageobjects';

// Load mapping
if (!fs.existsSync(mappingPath)) {
    console.error('❌ ERROR: selector-mapping.json not found!');
    process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

console.log('\n🔄 Starting auto-refactor...');

// --- Refactor .feature files ---
function refactorFeatureFiles(dir) {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.feature'));
    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        Object.keys(mapping).forEach(oldSelector => {
            const newSelector = mapping[oldSelector];
            // Ensure we don't try to refactor 'ADDED:' entries or null/undefined mappings
            if (newSelector && newSelector !== null && !oldSelector.startsWith('ADDED:')) {
                const safeOld = oldSelector.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\$&'); // Escape regex special chars
                const regex = new RegExp(safeOld, 'g');
                content = content.replace(regex, newSelector);
            }
        });

        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${filePath}`);
    });
}

// --- Refactor steps JS --- (Assuming steps.js is in features directly, if it's nested, adjust path)
function refactorStepsFiles(dir) {
    const files = fs.readdirSync(dir).filter(file => file === 'steps.js'); // Only target steps.js
    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Regex to find $('selector') or $("selector") for replacement
        content = content.replace(/\$\(\s*['"]([^'"]+)['"]\s*\)/g, (match, p1) => {
            const oldSelector = p1; // The actual selector string inside $('...')
            const newSelector = mapping[oldSelector];
            if (newSelector && newSelector !== null && !oldSelector.startsWith('ADDED:')) {
                console.log(`✅ Replacing selector in steps JS: ${oldSelector} → ${newSelector}`);
                // Use the same quote style as the original match
                const quote = match.includes('"') ? '"' : "'";
                return `$(${quote}${newSelector}${quote})`;
            }
            return match; // Return original if no mapping or other conditions not met
        });
        
        // Also check for raw string matches if not wrapped in $() - though less common for selectors in JS
        Object.keys(mapping).forEach(oldSelector => {
            const newSelector = mapping[oldSelector];
            if (newSelector && newSelector !== null && !oldSelector.startsWith('ADDED:')) {
                const safeOld = oldSelector.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\$&');
                // This regex will also catch selectors that are just strings, e.g., 'selectorName'
                const regex = new RegExp(`(['"])${safeOld}(['"])`, 'g');
                content = content.replace(regex, (match, p1, p2) => {
                    if (!match.startsWith('$(')) { // Ensure we don't double-replace $('...') or similar
                        return `${p1}${newSelector}${p2}`;
                    }
                    return match;
                });
            }
        });

        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${filePath}`);
    });
}


// --- Refactor pageObjects JS ---
function refactorPageObjectFiles(dir) {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // This regex correctly targets $('#selector') and will handle the replacement
        content = content.replace(/\$\(\s*['"]([^'"]+)['"]\s*\)/g, (match, p1) => {
            const oldSelector = p1; // The actual selector string like #settings-output
            const newSelector = mapping[oldSelector];
            if (newSelector && newSelector !== null && !oldSelector.startsWith('ADDED:')) {
                console.log(`✅ Replacing selector in pageobject JS: ${oldSelector} → ${newSelector}`);
                // Use the same quote style as the original match
                const quote = match.includes('"') ? '"' : "'";
                return `$(${quote}${newSelector}${quote})`;
            }
            return match; // Return original if no mapping or conditions not met
        });

        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${filePath}`);
    });
}

// Run all:
refactorFeatureFiles(featureDir);
refactorStepsFiles(stepsDir); // Call the new steps refactor
refactorPageObjectFiles(pageObjectsDir);

console.log('🎉 Auto-refactor complete!');