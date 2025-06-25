# Automation Workflow: UI Selector Change Detection & Self-Healing Tests

## 1. Prerequisites

- Node.js and npm installed
- Chrome browser installed
- Clone the developer team's application repo into `../development/clonedRepo/DevAuto`
- All automation scripts and dependencies are in the `automation` folder (do not run npm commands in the cloned repo)

## 2. Initial Setup

1. Open a terminal and navigate to the `automation` folder:

```sh
cd automation
npm install

```

2. Take a baseline snapshot of all selectors (run once at project start):

```sh
node extract-selectors.js snapshots/baseline-selectors.json DevAuto

```

## 3. Daily/Regular Workflow

Whenever there are UI changes or deployments:

1. **Extract current selectors from all HTML files:**

```sh
node extract-selectors.js snapshots/current-selectors.json

```

2. **Compare selectors and update the HTML report:**

```sh
node compare-selectors.js snapshots/baseline-selectors.json snapshots/current-selectors.json

```

3. **Generate selector mapping and auto-refactor test files:**

```sh
node auto-generate-mapping.js
node auto-refactor-selectors.js selector-mapping.json

```

4. **(Optional) Generate test skeletons for new selectors:**

- To only detect unreferenced selectors (no test cases generated):

```sh
node generate-test-skeletons.js

```

- To generate feature/spec files for new selectors:

```sh
node generate-test-skeletons.js --generate

```

5. **Run all tests:**

```sh
npm run test

```

or use the all-in-one command:

```sh
npm run check-ui

```

## 4. Workflow Flowchart

```mermaid
flowchart
    A[Developer changes UI in index.html/settings.html] --> B[Extract selectors from all HTML files]
    B --> C[Compare with baseline selectors]
    C --> D[Generate selector mapping]
    D --> E[Auto-refactor test files]
    E --> F{New selectors found?}
    F -- Yes --> G[Generate test skeletons (optional)]
    F -- No --> H[Skip skeleton generation]
    G --> I[Run tests]
    H --> I[Run tests]
    I --> J[Review results & HTML report]
```

## 5. What Each Script Does

- **extract-selectors.js**  
   Extracts all selectors (id and class) from every HTML file in the repo, with page context, and saves to a snapshot JSON.
- **compare-selectors.js**  
   Compares two selector snapshots (baseline and current), flags added/removed selectors per page, and updates a historical HTML report.
- **auto-generate-mapping.js**  
   Generates a mapping of changed selectors (old to new, per page) for use in auto-refactoring.
- **auto-refactor-selectors.js**  
   Updates all test files (step definitions, page objects) to use new selectors, only in the correct page context.
- **generate-test-skeletons.js**  
   Finds selectors not referenced in any test/pageobject file and (optionally) generates feature files and step definitions for them, with correct navigation steps based on page context.
- **check-ui-changes.js**  
   Orchestrates the entire workflow: extraction, comparison, mapping, refactoring, (optional) skeleton generation, and test execution.
- **wdio.conf.cjs**  
   WebdriverIO config: ensures both main and auto-generated step files are loaded for Cucumber.

## 6. Error Handling & Best Practices

- All scripts provide clear console output and error messages.
- Only define each step once across all step files (avoid duplicate step definitions).
- Keep navigation/setup steps in `steps.js` only.
- Always run npm commands from the `automation` folder.
- Review the HTML report in the `report/` folder for a history of selector changes.
- Use the `--generate` flag with `generate-test-skeletons.js` only when you want to create new test cases for untested selectors.

## 7. Example: Adding a New Selector

1. Add a new element in any HTML file, e.g.:

```html
<input id="new_input_field" type="text" />
<div class="copilot-bot">Hello, I am GitHub Copilot, your AI assistant!</div>

```

2. Run the workflow as described above.
3. If you want to generate tests for new selectors:

```sh
node generate-test-skeletons.js --generate

```

4. Run your tests and review the results.

## 8. Summary

- The workflow is robust for multi-page apps and shared selectors.
- Selector changes are tracked per page, with no false positives.
- Test skeletons and navigation steps are generated with correct page context.
- All changes and test results are clearly reported and easy to review.

## 9. How to Use with Dynamic Apps (React, Vite, etc.)

1. **Clone your dynamic app repo:**

```sh
git clone <your-app-git-url> ../development/clonedRepo/YourApp

```

2. **Install dependencies and start the dev server:**

```sh
cd ../development/clonedRepo/YourApp
npm install
npm run dev

```

- Note the local dev server URL (e.g., `http://localhost:5173` for Vite).

3. **Update `extract-selectors.js` in your automation folder:**

- Instead of scanning `.html` files, scan live URLs for each route/page you want to test.
- Example for React/Vite:

```js
// In extract-selectors.js
const pages = [
  { name: 'home', url: 'http://localhost:5173/' },
  { name: 'settings', url: 'http://localhost:5173/settings' }
  // Add more routes as needed
];
// rest as it is ...

```

4. **Run the automation workflow as usual:**

- Make sure your dev server is running.
- In the `automation` folder, run:

```sh
node extract-selectors.js snapshots/current-selectors.json
node compare-selectors.js snapshots/baseline-selectors.json snapshots/current-selectors.json
node auto-generate-mapping.js
node auto-refactor-selectors.js selector-mapping.json
node generate-test-skeletons.js --generate   # (optional)
npm run test

```

- Or use:

```sh
npm run check-ui

```

5. **Review the HTML report and test results as usual.**

**Note:**

- You can add or remove routes in the `pages` array in `extract-selectors.js` to match your app's navigation.
- The rest of the workflow remains the same as for static HTML apps.

# Selector Detector Tool

A fully automated tool to detect UI selector changes in dynamic React/Vite apps and auto-update existing test cases.

---

## ✨ Features

✅ Extracts current UI selectors from live app  
✅ Compares with baseline selectors  
✅ Auto-generates mapping for changed selectors  
✅ Auto-refactors existing `.steps.js`, `.feature` files, and pageObjects  
✅ Supports WebdriverIO + Cucumber + .feature + steps.js test frameworks  
✅ Fully CI/CD ready — can run after each deployment  
✅ Prevents selector drift and broken tests after UI changes

## 🛠️ Project Setup

```bash
# Clone your target React app repo
git clone <repo_url>
cd <repo_folder>

# Install dependencies
npm install

```

## 🚀 Usage

### First Time (After cloning repo):

```bash
# 1️⃣ Start the React app
npm run dev

# 2️⃣ Extract baseline selectors (1st time only)
node extract-selectors.js

# 3️⃣ Save as baseline
cp snapshots/current-selectors.json snapshots/baseline-selectors.json

```

### Regular Run (After new deployments):

```bash
# One command runs everything:
node run-all.js

```

Or:

```bash
npm run all

```

## 🔄 Workflow

```mermaid
graph TD
    A[Clone Repo & Install] --> B[Start App (npm run dev)]
    B --> C[Extract baseline selectors (once)]
    C --> D[Commit baseline-selectors.json to Git]
    D --> E[Deploy new version of app]
    E --> F[Run: npm run all]
    F --> G[Extract current selectors]
    G --> H[Compare with baseline]
    H --> I[Auto-generate mapping]
    I --> J[Auto-refactor test files]
    J --> K[Run WebdriverIO tests]
```

## Commands

| Action                      | Command                        |
|-----------------------------|--------------------------------|
| Extract current selectors   | `node extract-selectors.js`    |
| Compare selectors           | `node compare-selectors.js`    |
| Auto-refactor test files    | `node auto-refactor-selectors.js` |
| Run full pipeline (deploy)  | `node run-all.js` or `npm run all` |

## 10. Visual Regression Testing (Step-by-Step)

Add automated screenshot comparison to catch visual/UI changes that selector-based tests might miss.

### 1. Install BackstopJS

```sh
npm install -g backstopjs
cd automation
npx backstop init
```

### 2. Configure BackstopJS

- Edit `backstop.json` to add scenarios for your app's key pages/routes, e.g.:

```json
{
  "id": "ui-visual-regression",
  "viewports": [
    { "label": "desktop", "width": 1200, "height": 800 }
  ],
  "scenarios": [
    {
      "label": "Home Page",
      "url": "http://localhost:5173/",
      "selectors": ["document"]
    },
    {
      "label": "Settings Page",
      "url": "http://localhost:5173/settings",
      "selectors": ["document"]
    }
  ],
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test": "backstop_data/bitmaps_test",
    "engine_scripts": "backstop_data/engine_scripts",
    "html_report": "backstop_data/html_report",
    "ci_report": "backstop_data/ci_report"
  },
  "engine": "puppeteer",
  "report": ["browser", "CI"],
  "debug": false
}
```

### 3. Create Baseline Screenshots

```sh
npx backstop reference
```

### 4. Run Visual Regression Tests

```sh
npx backstop test
```

- If there are visual differences, BackstopJS will show a report in `backstop_data/html_report/index.html`.

### 5. Integrate with Your Workflow

- Add `npx backstop test` to your CI/CD pipeline or as a step after selector-based tests.
- Optionally, add a script in your `package.json`:

```json
"scripts": {
  "visual-test": "npx backstop test"
}
```

---

**Now, your tool will catch both selector changes and visual/UI regressions!**