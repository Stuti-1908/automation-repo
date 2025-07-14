import fs from 'fs';
import path from 'path';

// --- Configuration ---
const MAPPING_PATH = 'selector-mapping.json';
// Define the directories where your test files are located
const TEST_FILE_DIRS = ['features', 'features/pageobjects', 'features/step-definitions'];

// --- Main Logic ---

/**
 * Recursively finds all files in a given directory.
 * @param {string} dir - The directory to search.
 * @returns {string[]} - An array of full file paths.
 */
function getAllFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) {
        console.warn(`⚠️ Directory not found, skipping: ${dir}`);
        return [];
    }
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath));
        } else {
            results.push(filePath);
        }
    });
    return results;
}

/**
 * The core refactoring function.
 * @param {string} filePath - The path to the test file to refactor.
 * @param {object} mapping - The selector mapping for a specific page.
 */
function refactorFile(filePath, mapping) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const oldSelector of Object.keys(mapping)) {
        const newSelector = mapping[oldSelector];

        // Skip entries for newly added selectors or if there's no new selector
        if (oldSelector.startsWith('ADDED:') || !newSelector) {
            continue;
        }
        
        // Create a regular expression to find the old selector as a whole word/string
        // This prevents partial matches (e.g., replacing '#btn' in '#btn-primary')
        const regex = new RegExp(`(['"\`])${oldSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`, 'g');

        if (content.match(regex)) {
            content = content.replace(regex, `$1${newSelector}$1`);
            console.log(`   ✏️  Replaced '${oldSelector}' with '${newSelector}'`);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${path.basename(filePath)}`);
    }
}


// --- Script Execution ---

async function runAutoRefactor() {
    console.log('\n🔄 Starting context-aware auto-refactor...');

    if (!fs.existsSync(MAPPING_PATH)) {
        console.error(`❌ ERROR: Mapping file not found at ${MAPPING_PATH}`);
        process.exit(1);
    }

    const mappingData = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'));
    const { selector_mappings } = mappingData;

    if (!selector_mappings || Object.keys(selector_mappings).length === 0) {
        console.log('✅ No selector mappings to apply. Exiting.');
        return;
    }

    const allTestFiles = TEST_FILE_DIRS.flatMap(dir => getAllFiles(dir));

    // Iterate over each page's mappings
    for (const pagePath in selector_mappings) {
        const pageMapping = selector_mappings[pagePath];
        
        // Determine the page name from the path (e.g., '/about' -> 'about')
        const pageName = pagePath.replace(/^\//, '').replace(/\/$/, '').split('/')[0] || 'home';
        
        console.log(`\n🔎 Applying mappings for page: '${pageName}'`);

        // Find test files that match the page name
        const relevantFiles = allTestFiles.filter(file => 
            path.basename(file).toLowerCase().includes(pageName)
        );

        if (relevantFiles.length === 0) {
            console.log(`   ⚠️ No test files found matching page '${pageName}'.`);
            continue;
        }

        console.log(`   Found ${relevantFiles.length} relevant file(s): ${relevantFiles.map(f => path.basename(f)).join(', ')}`);

        relevantFiles.forEach(file => {
            refactorFile(file, pageMapping);
        });
    }

    console.log('\n🎉 Auto-refactor complete!');
}

runAutoRefactor();
