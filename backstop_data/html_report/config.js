report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\ui-visual-regression_Home_Page_0_document_0_desktop.png",
        "test": "..\\bitmaps_test\\20250626-021850\\ui-visual-regression_Home_Page_0_document_0_desktop.png",
        "selector": "document",
        "fileName": "ui-visual-regression_Home_Page_0_document_0_desktop.png",
        "label": "Home Page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:5173/",
        "expect": 0,
        "viewportLabel": "desktop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "0.00"
        }
      },
      "status": "pass"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\ui-visual-regression_Settings_Page_0_document_0_desktop.png",
        "test": "..\\bitmaps_test\\20250626-021850\\ui-visual-regression_Settings_Page_0_document_0_desktop.png",
        "selector": "document",
        "fileName": "ui-visual-regression_Settings_Page_0_document_0_desktop.png",
        "label": "Settings Page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:5173/settings",
        "expect": 0,
        "viewportLabel": "desktop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "0.00"
        }
      },
      "status": "pass"
    }
  ],
  "id": "ui-visual-regression"
});