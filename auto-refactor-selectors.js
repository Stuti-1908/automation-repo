import fs from 'fs';
import path from 'path';

const mappingPath = 'selector-mapping.json';
const featureDir = 'features';
const stepsDir = 'features';
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
            if (newSelector && !oldSelector.startsWith('ADDED:')) {
                const safeOld = oldSelector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const regex = new RegExp(safeOld, 'g');
                content = content.replace(regex, newSelector);
            }
        });

        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${filePath}`);
    });
}

// --- Refactor .steps.js files ---
function refactorStepsFiles(dir) {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('steps.js'));
    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Regex to match: $('selector') or $("selector")
        content = content.replace(/\$\(\s*['"]([^'"]+)['"]\s*\)/g, (match, p1) => {
            const oldSelector = p1;
            const newSelector = mapping[oldSelector];
            if (newSelector && !oldSelector.startsWith('ADDED:')) {
                console.log(`✅ Replacing selector in JS: ${oldSelector} → ${newSelector}`);
                // Use the same quote style as the original match
                const quote = match.includes('"') ? '"' : "'";
                return `$(${quote}${newSelector}${quote})`;
            }
            return match;
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

        content = content.replace(/\$\(\s*['"]([^'"]+)['"]\s*\)/g, (match, p1) => {
            const oldSelector = p1;
            const newSelector = mapping[oldSelector];
            if (newSelector && !oldSelector.startsWith('ADDED:')) {
                console.log(`✅ Replacing selector in pageobject JS: ${oldSelector} → ${newSelector}`);
                // Use the same quote style as the original match
                const quote = match.includes('"') ? '"' : "'";
                return `$(${quote}${newSelector}${quote})`;
            }
            return match;
        });

        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${filePath}`);
    });
}

// Run all:
refactorFeatureFiles(featureDir);
refactorStepsFiles(stepsDir);
refactorPageObjectFiles(pageObjectsDir);

console.log('\n✅ Auto-refactor complete!');
