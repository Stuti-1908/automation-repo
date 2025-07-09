// automation/extract-selectors.js
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { URL } from 'url'; // Node.js URL module for robust URL parsing

// --- Configuration Loading ---
const configPath = path.join(process.cwd(), 'config.json');

let config;
try {
  config = JSON.parse(await fs.readFile(configPath, 'utf8'));
} catch (error) {
  console.error(`❌ ERROR: Could not load config.json from ${configPath}. Please ensure it exists and is valid JSON.`);
  process.exit(1);
}

const {
  baseUrl,
  outputFile, // This will be overridden by command line argument for baseline/current
  selectorsToExtract,
  maxCrawlingDepth,
  maxPagesToScan,
  crawlExclusionPatterns,
  pageLoadTimeout,
  interactionDelay
} = config;

// Convert exclusion patterns to RegExp objects for efficient checking
const exclusionRegexes = crawlExclusionPatterns.map(pattern => new RegExp(pattern));

// --- Main Logic ---
async function main() {
  // Determine the actual output file based on command line argument or config default
  const finalOutputFile = process.argv[2] || outputFile; // Use command line arg if provided

  const browser = await puppeteer.launch({ headless: true }); // Use headless: true for CI/CD
  const page = await browser.newPage();

  const allExtractedSelectors = [];
  const queue = [{ url: baseUrl, depth: 0 }];
  const visitedUrls = new Set();
  const visitedPaths = new Set();

  console.log(`🚀 Starting autonomous crawl from: ${baseUrl}`);

  while (queue.length > 0 && visitedPaths.size < maxPagesToScan) {
    const { url: currentUrl, depth: currentDepth } = queue.shift();

    const normalizedUrl = new URL(currentUrl).origin + new URL(currentUrl).pathname.replace(/\/$/, '');
    const urlPath = new URL(currentUrl).pathname;

    if (visitedUrls.has(normalizedUrl) || currentDepth > maxCrawlingDepth) {
      continue;
    }
    if (exclusionRegexes.some(regex => regex.test(currentUrl))) {
      console.log(`⏭️ Skipping excluded URL: ${currentUrl}`);
      continue;
    }

    console.log(`\n🌐 Scanning page (Depth ${currentDepth}): ${currentUrl}`);
    visitedUrls.add(normalizedUrl);
    visitedPaths.add(urlPath);

    try {
      await page.goto(currentUrl, { waitUntil: 'networkidle2', timeout: pageLoadTimeout });
      // FIX: Replace page.waitForTimeout with a standard setTimeout
      await new Promise(resolve => setTimeout(resolve, interactionDelay)); 

      // --- Intelligent UI Interaction (Discovering New Links) ---
      const discoveredLinks = await page.evaluate((baseAppUrl, exclusionRegexesStr) => {
        const internalLinks = new Set();
        const exclusionRegexes = exclusionRegexesStr.map(pattern => new RegExp(pattern));
        const baseOrigin = new URL(baseAppUrl).origin;

        Array.from(document.querySelectorAll('a')).forEach(a => {
          try {
            const href = a.href;
            const linkUrl = new URL(href);

            if (linkUrl.origin === baseOrigin && !exclusionRegexes.some(regex => regex.test(href))) {
              const normalizedLinkPath = linkUrl.pathname.replace(/\/$/, '');
              internalLinks.add(linkUrl.origin + normalizedLinkPath);
            }
          } catch (e) {
            // Ignore invalid hrefs
          }
        });

        return Array.from(internalLinks);
      }, baseUrl, crawlExclusionPatterns.map(r => r.source));

      for (const link of discoveredLinks) {
        const linkPath = new URL(link).pathname;
        if (!visitedUrls.has(link) && !queue.some(q => q.url === link) && visitedPaths.size < maxPagesToScan) {
          queue.push({ url: link, depth: currentDepth + 1 });
        }
      }

      // --- Selector Extraction ---
      const pageSelectors = await page.evaluate((currentPagePath, currentPageUrlFull, selectorsToFind) => {
        const extracted = [];
        const uniqueSelectorsFound = new Set();

        selectorsToFind.forEach(selectorQuery => {
          Array.from(document.querySelectorAll(selectorQuery)).forEach(el => {
            let selector = '';
            let type = '';

            if (el.id) {
              selector = `#${el.id}`;
              type = 'id';
            } else if (el.hasAttribute('data-test-id')) {
              selector = `[data-test-id="${el.getAttribute('data-test-id')}"]`;
              type = 'data-test-id';
            } else if (el.hasAttribute('data-qa')) {
              selector = `[data-qa="${el.getAttribute('data-qa')}"]`;
              type = 'data-qa';
            } else if (el.hasAttribute('data-cy')) {
              selector = `[data-cy="${el.getAttribute('data-cy')}"]`;
              type = 'data-cy';
            } else if (el.className) {
              const meaningfulClasses = el.className.split(/\s+/)
                                        .filter(cls => cls && !cls.startsWith('copilot-') && !cls.startsWith('animate-') && !cls.startsWith('flex') && !cls.startsWith('p-') && !cls.startsWith('m-'));
              if (meaningfulClasses.length > 0) {
                  selector = `.${meaningfulClasses[0]}`;
                  type = 'class';
              } else {
                  const allClasses = el.className.split(/\s+/).filter(Boolean);
                  if (allClasses.length > 0) {
                      selector = `.${allClasses[0]}`;
                      type = 'class';
                  }
              }
            } else {
              selector = el.tagName.toLowerCase();
              type = 'tag';
            }

            if (selector && !uniqueSelectorsFound.has(selector)) {
              extracted.push({
                pagePath: currentPagePath,
                pageUrl: currentPageUrlFull,
                selectorType: type,
                selector: selector,
                html: el.outerHTML
              });
              uniqueSelectorsFound.add(selector);
            }
          });
        });
        return extracted;
      }, urlPath, currentUrl, selectorsToExtract);

      if (pageSelectors.length > 0) {
        allExtractedSelectors.push(...pageSelectors);
        console.log(`✅ Extracted ${pageSelectors.length} selectors from ${urlPath}. Total: ${allExtractedSelectors.length}`);
      } else {
        console.log(`⚠️ No selectors found on ${urlPath} with configured queries.`);
      }

    } catch (error) {
      console.error(`❌ Failed to process ${currentUrl}: ${error.message}`);
    }
  }

  // --- Save Results ---
  console.log(`\n💾 Saving all extracted selectors to ${finalOutputFile}`);
  await fs.writeFile(finalOutputFile, JSON.stringify(allExtractedSelectors, null, 2));

  await browser.close();
  console.log(`🎉 Crawl complete! Scanned ${visitedPaths.size} unique pages and saved ${allExtractedSelectors.length} selectors.`);
}

main();
