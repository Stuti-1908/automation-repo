import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

async function runCommand(command) {
    try {
        const { stdout, stderr } = await execAsync(command);
        console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
}

async function main() {
    console.log('🔍 Checking UI changes...');
    
    try {
        // 1. Extract current selectors
        console.log('\n📸 Taking snapshot of current selectors...');
        await runCommand('node extract-selectors.js');

        // 2. Compare selectors and generate mapping
        console.log('\n📊 Comparing selectors and generating mapping...');
        await runCommand('node compare-selectors.js');

        // 3. Refactor test files with updated selectors
        console.log('\n🔄 Refactoring test files with updated selectors...');
        await runCommand('node auto-refactor-selectors.js');

        // 4. (Optional) Generate test skeletons for new selectors
        // console.log('\n📝 Generating test skeletons...');
        // await runCommand('node generate-test-skeletons.js --generate');

        // 5. Run tests
        console.log('\n🧪 Running tests...');
        await runCommand('npm run test');

        console.log('\n✅ UI check complete!');
    } catch (error) {
        console.error('\n❌ Process failed:', error.message);
        process.exit(1);
    }
}

main();
