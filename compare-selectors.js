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

// Build lookup maps for selectors by id/class
function buildSelectorMap(arr) {
    const map = {};
    arr.forEach(sel => {
        if (sel.id) map[sel.id] = sel;
        else if (sel.class) map[sel.class] = sel;
    });
    return map;
}

const baselineMap = buildSelectorMap(baseline);
const currentMap = buildSelectorMap(current);

const mapping = {};
const added = [];
const removed = [];

console.log('\n🔍 Comparing selectors...');

// Check for removed or changed selectors
for (const key in baselineMap) {
    if (!(key in currentMap)) {
        removed.push(key);
        mapping[key] = null;
        console.log(`❌ REMOVED: ${key}`);
    } else {
        // Compare selector objects (shallow)
        const oldSel = baselineMap[key];
        const newSel = currentMap[key];
        if (JSON.stringify(oldSel) !== JSON.stringify(newSel)) {
            // Store only the selector string (id or class)
            mapping[key] = newSel.id || newSel.class;
            console.log(`🔄 CHANGED: ${key} → ${mapping[key]}`);
        } else {
            mapping[key] = newSel.id || newSel.class;
        }
    }
}

// Check for added selectors
for (const key in currentMap) {
    if (!(key in baselineMap)) {
        added.push(key);
        mapping[`ADDED: ${key}`] = currentMap[key].id || currentMap[key].class;
        console.log(`➕ ADDED: ${key}`);
    }
}

// Save mapping
fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));

console.log('\n✅ Selector mapping saved to selector-mapping.json');
console.log(`➕ Added: ${added.length}   ❌ Removed: ${removed.length}`);
console.log('🎉 Compare done!');
