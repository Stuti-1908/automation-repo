// automation/compare-selectors.js
import fs from 'fs/promises';
import path from 'path';

const [,, baselineFile, currentFile] = process.argv;
const MAPPING_PATH = 'selector-mapping.json';

if (!baselineFile || !currentFile) {
  console.error('❌ Usage: node compare-selectors.js <baseline-file> <current-file>');
  process.exit(1);
}

/**
 * Builds a nested map of pagePath -> selector -> html from the extracted data.
 * @param {Array<Object>} extractedData An array of selector objects from extract-selectors.js.
 * @returns {Object} A map like { "/page1": { "#selector1": "<html>", ... }, "/page2": { ... } }
 */
function buildPageSelectorsMap(extractedData) {
  const pageMap = {};
  if (!Array.isArray(extractedData)) {
    console.warn("⚠️ Input data for buildPageSelectorsMap is not an array. Returning empty map.");
    return pageMap;
  }
  extractedData.forEach(({ pagePath, selector, html }) => {
    if (!pageMap[pagePath]) {
      pageMap[pagePath] = {};
    }
    if (selector) { // Ensure selector is not empty or null
      pageMap[pagePath][selector] = html || '';
    }
  });
  return pageMap;
}

/**
 * Calculates a simple HTML similarity score.
 * @param {string} html1
 * @param {string} html2
 * @returns {number} Score between 0 and 1.
 */
function htmlSimilarity(html1, html2) {
  if (!html1 || !html2) return 0;
  const norm1 = html1.replace(/\s+/g, ''); // Remove all whitespace for comparison
  const norm2 = html2.replace(/\s+/g, '');
  let matches = 0;
  for (let i = 0; i < Math.min(norm1.length, norm2.length); i++) {
    if (norm1[i] === norm2[i]) matches++;
  }
  // Consider both length differences and matching characters
  return matches / Math.max(norm1.length, norm2.length, 1); // Avoid division by zero
}

async function main() {
  let baselineData, currentData;
  try {
    baselineData = JSON.parse(await fs.readFile(baselineFile, 'utf8'));
    currentData = JSON.parse(await fs.readFile(currentFile, 'utf8'));
  } catch (error) {
    console.error(`❌ ERROR: Could not read selector files: ${error.message}`);
    process.exit(1);
  }

  // Convert the flat list of selectors into a page-based map
  const baselinePagesMap = buildPageSelectorsMap(baselineData);
  const currentPagesMap = buildPageSelectorsMap(currentData);

  const selectorMapping = {
    mappings: {}, // For changed/removed selectors per page: { "pagePath": { "oldSelector": "newSelector" } }
    added: {}     // For newly added selectors per page: { "pagePath": ["newSelector1", "newSelector2"] }
  };
  let changesCount = 0;

  console.log('🔎 Starting selector comparison...');

  // --- 1. Identify Changed and Removed Selectors ---
  for (const baselinePagePath in baselinePagesMap) {
    const baselineSelectors = baselinePagesMap[baselinePagePath];
    const currentSelectors = currentPagesMap[baselinePagePath];

    // Initialize mapping for this page
    if (!selectorMapping.mappings[baselinePagePath]) {
      selectorMapping.mappings[baselinePagePath] = {};
    }

    if (!currentSelectors) {
      // Entire page removed or not found in current snapshot
      console.log(`⚠️ Page '${baselinePagePath}' not found in current snapshot. All its selectors marked as removed.`);
      for (const oldSelector in baselineSelectors) {
        selectorMapping.mappings[baselinePagePath][oldSelector] = null;
        changesCount++;
      }
      continue; // Move to next baseline page
    }

    for (const oldSelector in baselineSelectors) {
      const oldHTML = baselineSelectors[oldSelector];

      if (currentSelectors[oldSelector]) {
        // Selector still exists with the same name on the same page - no change needed
        selectorMapping.mappings[baselinePagePath][oldSelector] = oldSelector; // Explicitly map to itself
        continue;
      }

      // Selector name changed or element moved, try to find a similar one
      let bestMatchSelector = null;
      let bestScore = 0;

      for (const newSelector in currentSelectors) {
        // Skip selectors that are already accounted for as direct matches or mapped by other old selectors
        if (Object.values(selectorMapping.mappings[baselinePagePath]).includes(newSelector)) {
          continue;
        }

        const newHTML = currentSelectors[newSelector];
        const score = htmlSimilarity(oldHTML, newHTML);

        if (score > bestScore && score > 0.5) { // Threshold for similarity
          bestScore = score;
          bestMatchSelector = newSelector;
        }
      }

      if (bestMatchSelector) {
        console.log(`🔁 Mapped selector on page '${baselinePagePath}': '${oldSelector}' → '${bestMatchSelector}' (Similarity: ${bestScore.toFixed(2)})`);
        selectorMapping.mappings[baselinePagePath][oldSelector] = bestMatchSelector;
        changesCount++;
      } else {
        console.log(`❌ Removed selector on page '${baselinePagePath}': '${oldSelector}' (No similar match found)`);
        selectorMapping.mappings[baselinePagePath][oldSelector] = null; // Mark as removed
        changesCount++;
      }
    }
  }

  // --- 2. Identify Newly Added Selectors ---
  for (const currentPagePath in currentPagesMap) {
    const currentSelectors = currentPagesMap[currentPagePath];
    const baselineSelectors = baselinePagesMap[currentPagePath];

    // Initialize added list for this page
    if (!selectorMapping.added[currentPagePath]) {
      selectorMapping.added[currentPagePath] = [];
    }

    for (const newSelector in currentSelectors) {
      // A selector is considered "added" if it's in the current snapshot for a page,
      // but NOT in the baseline for that page, AND it wasn't already mapped as a new name for an old selector.
      const isActuallyNew = !baselineSelectors || !baselineSelectors[newSelector];
      const isAlreadyMappedAsNew = Object.values(selectorMapping.mappings[currentPagePath] || {}).includes(newSelector);

      if (isActuallyNew && !isAlreadyMappedAsNew) {
        console.log(`➕ Added selector on page '${currentPagePath}': '${newSelector}'`);
        selectorMapping.added[currentPagePath].push(newSelector);
        changesCount++;
      }
    }
  }

  if (changesCount > 0) {
    await fs.writeFile(MAPPING_PATH, JSON.stringify(selectorMapping, null, 2));
    console.log(`✅ Comparison complete! ${changesCount} changes detected. Mapping saved to ${MAPPING_PATH}`);
  } else {
    console.log('✅ No significant selector changes detected.');
    await fs.writeFile(MAPPING_PATH, JSON.stringify(selectorMapping, null, 2)); // Save even if no changes
  }
}

main();
