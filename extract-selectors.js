// extract-selectors.js
import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const outputFile = process.argv[2] || 'snapshots/current-selectors.json';
const APP_URL = 'http://localhost:5173/';

console.log('🌐 Launching headless browser...');
const browser = await puppeteer.launch();
const page = await browser.newPage();

console.log(`🌐 Navigating to ${APP_URL}...`);
await page.goto(APP_URL, { waitUntil: 'networkidle2' });

// --- MODIFICATION START ---

// Logic to ensure settings panel is visible for selector extraction
try {
  // Check if the settings panel is already visible (it is by default in App.jsx)
  const isSettingsPanelVisible = await page.evaluate(() => {
    const panel = document.getElementById('settings-panel');
    return panel && window.getComputedStyle(panel).display !== 'none' && window.getComputedStyle(panel).visibility !== 'hidden';
  });

  if (isSettingsPanelVisible) {
    console.log('✅ Settings panel is already visible. Proceeding to extract selectors.');
  } else {
    // If not visible, try to toggle it
    console.log('⚠️ Settings panel not visible by default. Attempting to toggle...');
    
    // Use the ID for the toggle button for more robustness
    const toggleButtonSelector = '#settings-toggle'; 
    await page.waitForSelector(toggleButtonSelector, { timeout: 10000 }); // Increased timeout for button to appear
    await page.click(toggleButtonSelector); // Directly click the button
    
    // Wait for the panel to become visible after clicking the toggle button
    await page.waitForSelector('#settings-panel', { timeout: 10000 }); // Increased timeout for panel to appear
    console.log('✅ Settings panel is now visible. Extracting selectors...');
  }
} catch (err) {
  console.warn('⚠️ Could not ensure settings panel visibility:', err.message);
  console.warn('   Selectors within the settings panel might be missing from the snapshot.');
}

// --- MODIFICATION END ---

// Extract all elements with IDs
const selectors = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('[id]')).map(el => ({
    selector: `#${el.id}`,
    html: el.outerHTML
  }));
});

console.log(`💾 Saving selectors to ${outputFile}`);
await fs.writeFile(outputFile, JSON.stringify(selectors, null, 2));

await browser.close();
console.log('✅ Selectors extracted successfully.');