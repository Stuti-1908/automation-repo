// run-all.js

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { generateHtmlReport } from './generate-html-report.js';
import waitOn from 'wait-on';

const execAsync = promisify(exec);

// 📦 Load configuration from config.json
const config = JSON.parse(readFileSync('./config.json', 'utf-8'));

async function runCommand(command, cwd = process.cwd()) {
    try {
        const { stdout, stderr } = await execAsync(command, { cwd });
        console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error(`Error running "${command}": ${error.message}`);
        throw error;
    }
}

async function main() {
    console.log('🔍 Selector Detector: Full Workflow Starting...\n');

    try {
        // 1. Clone the repo
        console.log('📥 Cloning repo...');
        await runCommand(`git clone ${config.repoUrl} ${config.cloneDir}`);

        // 2. Install dependencies in cloned repo
        console.log('\n📦 Installing dependencies...');
        await runCommand('npm install', config.cloneDir);

        // 3. Start dev server
        console.log('\n🚀 Starting dev server...');
        const devProcess = spawn(config.devStartCommand.split(' ')[0], config.devStartCommand.split(' ').slice(1), {
            cwd: config.cloneDir,
            shell: true,
            stdio: 'inherit'
        });

        // 4. Wait for server to be ready
        console.log(`\n⏳ Waiting for ${config.appUrl} to be ready...`);
        await waitOn({ resources: [config.appUrl], timeout: 15000 });

        // 5. Extract selectors
        console.log('\n📸 Extracting selectors...');
        await runCommand('node extract-selectors.js');

        // 6. Compare selectors
        console.log('\n📊 Comparing selectors...');
        await runCommand('node compare-selectors.js');

        // 7. Refactor test files
        console.log('\n🛠️ Refactoring test files...');
        await runCommand('node auto-refactor-selectors.js');

        // 8. Run tests
        console.log('\n🧪 Running tests...');
        await runCommand('npm run test');

        // 9. Generate HTML report
        console.log('\n📄 Generating visual report...');
        generateHtmlReport(config.selectorHistoryPath, config.reportOutputDir);

        // 10. Cleanup or info
        console.log('\n✅ Workflow complete! Report generated in: /report/selector-report.html');

    } catch (error) {
        console.error('\n❌ Workflow failed:', error.message);
        process.exit(1);
    }
}

main();
