// compare-selectors.js
import fs from 'fs/promises';

const [,, baselineFile, currentFile] = process.argv;
const MAPPING_PATH = 'selector-mapping.json';

if (!baselineFile || !currentFile) {
  console.error('❌ Usage: node compare-selectors.js <baseline> <current>');
  process.exit(1);
}

function buildSelectorMap(data) {
  if (Array.isArray(data)) {
    const map = {};
    data.forEach(({ selector, html }) => {
      if (selector) map[selector] = html || '';
    });
    return map;
  }
  return data;
}

function selToName(selector) {
  return selector.replace(/^#|^\./, '').replace(/[-_](.)/g, (_, char) => char.toUpperCase());
}

function htmlSimilarity(html1, html2) {
  if (!html1 || !html2) return 0;
  const norm1 = html1.replace(/\s+/g, '');
  const norm2 = html2.replace(/\s+/g, '');
  let matches = 0;
  for (let i = 0; i < Math.min(norm1.length, norm2.length); i++) {
    if (norm1[i] === norm2[i]) matches++;
  }
  return matches / Math.max(norm1.length, norm2.length);
}

try {
  const [baselineRaw, currentRaw] = await Promise.all([
    fs.readFile(baselineFile, 'utf8'),
    fs.readFile(currentFile, 'utf8'),
  ]);

  const baseline = buildSelectorMap(JSON.parse(baselineRaw));
  const current = buildSelectorMap(JSON.parse(currentRaw));

  let selectorMapping = {};
  try {
    selectorMapping = JSON.parse(await fs.readFile(MAPPING_PATH, 'utf8'));
  } catch {
    console.warn('⚠️ No existing selector-mapping.json found.');
  }

  const baselineKeys = Object.keys(baseline);
  const currentKeys = Object.keys(current);

  let changes = 0;

  for (const baseSel of baselineKeys) {
    const baseHTML = baseline[baseSel];

    // Direct match
    if (current[baseSel]) continue;

    // Try to find a similar one
    let bestMatch = null;
    let bestScore = 0;

    for (const currSel of currentKeys) {
      if (selectorMapping[baseSel] === currSel) continue;
      const score = htmlSimilarity(baseHTML, current[currSel]);
      if (score > bestScore && score > 0.5) {
        bestScore = score;
        bestMatch = currSel;
      }
    }

    if (bestMatch) {
      console.log(`🔁 Mapping changed selector: ${baseSel} → ${bestMatch}`);
      selectorMapping[baseSel] = bestMatch;
      changes++;
    } else {
      console.log(`❌ Removed selector (no match): ${baseSel}`);
      selectorMapping[baseSel] = null;
    }
  }

  // Add new selectors
  for (const currSel of currentKeys) {
    if (!baseline[currSel] && !Object.values(selectorMapping).includes(currSel)) {
      console.log(`➕ New selector added: ${currSel}`);
      selectorMapping[`ADDED: ${currSel}`] = currSel;
      changes++;
    }
  }

  if (changes > 0) {
    await fs.writeFile(MAPPING_PATH, JSON.stringify(selectorMapping, null, 2), 'utf8');
    console.log(`✅ Updated ${MAPPING_PATH} with ${changes} change(s).`);
  } else {
    console.log('✅ No selector changes detected.');
  }

} catch (err) {
  console.error(`❌ Error comparing selectors: ${err.message}`);
  process.exit(1);
}
