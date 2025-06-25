import fs from 'fs';
import path from 'path';

// Parse CLI argument for --generate (default: false)
const shouldGenerate = process.argv.includes('--generate');

// Load current selectors
const selectors = JSON.parse(fs.readFileSync('snapshots/current-selectors.json', 'utf-8'));

// Collect all test and pageobject JS files
function getJsFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(getJsFiles(fullPath));
        } else if (file.endsWith('.js')) {
            results.push(fullPath);
        }
    }
    return results;
}
const testFiles = [
    ...getJsFiles('features'),
    ...getJsFiles(path.join('features', 'pageobjects'))
];

// Find selectors not referenced in any test/pageobject file
const unreferenced = selectors.filter(sel => {
    // Only consider selectors with id or class
    const id = sel.id;
    const className = sel.class;
    let found = false;
    for (const file of testFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        if (id && (
            content.includes(`#${id}`) ||
            content.includes(`'${id}'`) ||
            content.includes(`"${id}"`)
        )) {
            found = true;
            break;
        }
        if (className) {
            // Split className in case of multiple classes
            for (const cls of className.split(/\s+/)) {
                if (
                    content.includes(`.${cls}`) ||
                    content.includes(`'${cls}'`) ||
                    content.includes(`"${cls}"`)
                ) {
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }
    return !found && (id || className);
});

// Always keep the generic step definition so steps are never skipped
const stepsContent = `import { Then } from '@wdio/cucumber-framework';
import assert from 'assert';

Then('I should see the "{word}" element', async function(selector) {
    if (typeof selector !== 'string') {
        throw new Error('Selector parameter is not defined or not a string');
    }
    let el;
    if (selector.startsWith('.')) {
        el = await $(selector);
    } else {
        el = await $(\`#\${selector}\`);
    }
    assert.ok(await el.isExisting(), \`\${selector} element not found\`);
});
`;
fs.writeFileSync(path.join('features', 'auto-generated-steps.js'), stepsContent);

if (unreferenced.length === 0) {
    console.log('No unreferenced selectors found. Generic step definition ensured.');
    process.exit(0);
}

if (shouldGenerate) {
    // Generate feature file only if --generate is passed
    const featureContent = `Feature: Auto-generated tests for new selectors

${unreferenced.map(sel => {
    const id = sel.id;
    const className = sel.class ? sel.class.split(/\s+/)[0] : undefined;
    const selector = id ? id : (className ? '.' + className : '');
    // Use page context to open the correct page
    let navStep = 'Given I open the app';
    if (sel.page && sel.page.toLowerCase().includes('settings')) {
        navStep = 'Given I open the settings page';
    } else if (sel.page && sel.page.toLowerCase().includes('index')) {
        navStep = 'Given I open the app';
    }
    return `Scenario: Verify presence of ${selector} on ${sel.page}
  ${navStep}
  Then I should see the "${selector}" element`;
}).join('\n\n')}
`;
    fs.writeFileSync(path.join('features', 'auto-generated.feature'), featureContent);
    console.log('📝 Generated: features/auto-generated.feature for selectors:', unreferenced.map(s => s.id || s.class));
} else {
    console.log('Unreferenced selectors found:', unreferenced.map(s => s.id || s.class));
    console.log('No feature/spec file generated (run with --generate to create).');
}

