// run-all.js

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { generateHtmlReport } from './generate-html-report.js';
import path from 'path';
import open from 'open';

const execAsync = promisify(exec);

async function runScript(command) {
    try {
        const { stdout, stderr } = await execAsync(command);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error(`Error running "${command}": ${error.message}`);
        throw error;
    }
}

async function main() {
    console.log('🔍 Selector Detector: Full Workflow Starting...');

    try {
        // 1. Extract current selectors
        console.log('📥 Extracting current selectors...');
        await runScript('node extract-selectors.js snapshots/current-selectors.json');

        // 2. Extract baseline selectors if missing
        const baselinePath = path.join('snapshots', 'baseline-selectors.json');
        if (!existsSync(baselinePath)) {
            console.log('📥 Extracting baseline selectors (first run)...');
            await runScript('node extract-selectors.js snapshots/baseline-selectors.json');
        }

        // 3. Compare selectors
        console.log('🔎 Comparing selectors...');
        await runScript('node compare-selectors.js snapshots/baseline-selectors.json snapshots/current-selectors.json');

        // 4. Auto-generate mapping and refactoring
        console.log('🛠️ Auto-refactoring selectors...');
        await runScript('node auto-refactor-selectors.js');

        // 5. Generate HTML reports
        console.log('📊 Generating HTML reports...');
        generateHtmlReport('selector-mapping.json', 'reports');

        // 6. Run tests
        console.log('🧪 Running tests...');
        await runScript('npm run test');

        // Automatically open the generated HTML report
        await open('./reports/selector-report.html'); // Corrected path

        console.log('✅ Workflow completed. Redirecting to the report...');

    } catch (error) {
        console.error('\n❌ Workflow failed:', error.message);
        process.exit(1);
    }
}

main();
