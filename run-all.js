import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, promises as fs } from 'fs';
import path from 'path';
import open from 'open';

const execAsync = promisify(exec);
const SNAPSHOTS_DIR = 'snapshots';
const BASELINE_FILE = path.join(SNAPSHOTS_DIR, 'baseline-selectors.json');
const CURRENT_FILE = path.join(SNAPSHOTS_DIR, 'current-selectors.json');

/**
 * Executes a shell command and logs its output.
 * @param {string} command - The command to execute.
 */
async function runScript(command) {
    console.log(`\n> Running: ${command}`);
    try {
        const { stdout, stderr } = await execAsync(command);
        if (stdout) console.log(stdout);
        if (stderr) console.error('Error:', stderr);
    } catch (error) {
        console.error(`❌ Failed to execute "${command}":`, error);
        throw error; // Propagate the error to stop the workflow
    }
}

/**
 * Main workflow execution.
 */
async function main() {
    console.log('🚀 Selector Detector: Full Workflow Starting...');

    try {
        // Ensure snapshots directory exists
        await fs.mkdir(SNAPSHOTS_DIR, { recursive: true });

        // Step 1: Extract baseline selectors IF they don't exist
        if (!existsSync(BASELINE_FILE)) {
            console.log('📋 No baseline found. Creating initial baseline snapshot...');
            await runScript(`node extract-selectors.js`);
            await fs.copyFile(CURRENT_FILE, BASELINE_FILE);
            console.log('✅ Baseline created. Please commit `baseline-selectors.json` to your repository.');
            console.log('Workflow finished. Re-run after making UI changes to detect differences.');
            return; // Stop the workflow here on the first run
        }

        // Step 2: Extract current selectors from the live app
        console.log('📥 Extracting current selectors from the application...');
        await runScript(`node extract-selectors.js`);

        // Step 3: Compare snapshots to find changes and generate mapping
        console.log('🔎 Comparing selectors and generating mapping file...');
        await runScript(`node compare-selectors.js ${BASELINE_FILE} ${CURRENT_FILE}`);

        // Step 4: Auto-refactor test files based on the generated mapping
        console.log('🛠️ Auto-refactoring test files...');
        await runScript('node auto-refactor-selectors.js');

        // Step 5 (Optional): Run tests to validate the changes
        console.log('🧪 Running tests (optional step)...');
        // Note: This assumes you have a test command configured in your package.json
        await runScript('npm run test'); 

        console.log('\n🎉 Workflow completed successfully!');
        console.log('\n💡 To accept the new changes as the source of truth, manually copy `snapshots/current-selectors.json` to `snapshots/baseline-selectors.json` and commit the result.');


    } catch (error) {
        console.error('\n❌ Workflow failed due to an error. Please check the logs above.');
        process.exit(1);
    }
}

main();
