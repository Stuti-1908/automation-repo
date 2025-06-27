export default async (page, scenario, vp) => {
  // If loadCookies.js is an ES module (uses export default), require() will fail.
  // To ensure compatibility, use dynamic import if needed:
  try {
    // Try CommonJS require first
    const loadCookies = require('./loadCookies');
    await loadCookies(page, scenario);
  } catch (err) {
    // Fallback to dynamic import for ES module or other errors
    if (err.code === 'ERR_REQUIRE_ESM' || err.message.includes('require is not defined')) {
      const { default: loadCookies } = await import('./loadCookies.js');
      await loadCookies(page, scenario);
    } else {
      throw err;
    }
  }
};
