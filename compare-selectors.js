import fs from 'fs';
import path from 'path';

const baselinePath = 'snapshots/baseline-selectors.json';
const currentPath = 'snapshots/current-selectors.json';
const mappingPath = 'selector-mapping.json';

// ✅ If no baseline — show message, exit cleanly (Git workflow safe)
if (!fs.existsSync(baselinePath)) {
    console.log('⚠️ No baseline selectors found!');
    console.log('👉 Please run:');
    console.log('   npm run extract-selectors');
    console.log('👉 Then save as: snapshots/baseline-selectors.json');
    process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));

const mapping = {};
const added = [];
const removed = [];

console.log('\n🔍 Comparing selectors...');

for (const oldSelector in baseline) {
    if (!(oldSelector in current)) {
        // Removed selector
        removed.push(oldSelector);
        mapping[oldSelector] = null;
        console.log(`❌ REMOVED: ${oldSelector}`);
    } else if (baseline[oldSelector] !== current[oldSelector]) {
        // Changed selector
        mapping[oldSelector] = current[oldSelector];
        console.log(`🔄 CHANGED: ${oldSelector} → ${current[oldSelector]}`);
    } else {
        // No change
        mapping[oldSelector] = current[oldSelector];
    }
}

for (const newSelector in current) {
    if (!(newSelector in baseline)) {
        // New selector added
        added.push(newSelector);
        mapping[`ADDED: ${newSelector}`] = current[newSelector];
        console.log(`➕ ADDED: ${newSelector}`);
    }
}

// Save mapping
fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));

console.log('\n✅ Selector mapping saved to selector-mapping.json');
console.log(`➕ Added: ${added.length}   ❌ Removed: ${removed.length}`);
console.log('🎉 Compare done!');
