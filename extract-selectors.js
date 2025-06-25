// extract-selectors.js
import { launch } from 'puppeteer';
import { writeFileSync } from 'fs';

(async () => {
    console.log('🔹 Launching Puppeteer...');
    const browser = await launch({ headless: 'new' });
    const page = await browser.newPage();

    const url = 'http://localhost:5173'; // adjust if your vite port is different
    console.log(`🔹 Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('🔹 Extracting selectors...');
    const selectors = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('body *'));
        const result = [];

        elements.forEach(el => {
            const entry = {};

            if (el.id) {
                entry.id = `#${el.id}`;
            }
            if (el.className && typeof el.className === 'string') {
                entry.class = '.' + el.className.trim().split(/\s+/).join('.');
            }
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith('data-')) {
                    entry[attr.name] = `[${attr.name}="${attr.value}"]`;
                }
            });

            // Only save if selector present
            if (Object.keys(entry).length > 0) {
                entry.tagName = el.tagName.toLowerCase();
                entry.textContent = el.textContent.trim().slice(0, 100); // first 100 chars
                result.push(entry);
            }
        });

        return result;
    });

    // Save result
    const outputPath = 'snapshots/baseline_selectors.json';
    writeFileSync(outputPath, JSON.stringify(selectors, null, 2));
    console.log(`✅ Selectors saved to ${outputPath} (${selectors.length} entries)`);

    await browser.close();
})();
