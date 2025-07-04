report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\backstop_default_Home_Page_0_document_0_phone.png",
        "test": "..\\bitmaps_test\\20250703-201635\\backstop_default_Home_Page_0_document_0_phone.png",
        "selector": "document",
        "fileName": "backstop_default_Home_Page_0_document_0_phone.png",
        "label": "Home Page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:5173/",
        "expect": 0,
        "viewportLabel": "phone",
        "diff": {
          "isSameDimensions": false,
          "dimensionDifference": {
            "width": -64,
            "height": -205
          },
          "rawMisMatchPercentage": 20.296152676399025,
          "misMatchPercentage": "20.30",
          "analysisTime": 76
        },
        "diffImage": "..\\bitmaps_test\\20250703-201635\\failed_diff_backstop_default_Home_Page_0_document_0_phone.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\backstop_default_Home_Page_0_document_1_tablet.png",
        "test": "..\\bitmaps_test\\20250703-201635\\backstop_default_Home_Page_0_document_1_tablet.png",
        "selector": "document",
        "fileName": "backstop_default_Home_Page_0_document_1_tablet.png",
        "label": "Home Page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:5173/",
        "expect": 0,
        "viewportLabel": "tablet",
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
        "reference": "..\\bitmaps_reference\\backstop_default_Settings_Page_0_document_0_phone.png",
        "test": "..\\bitmaps_test\\20250703-201635\\backstop_default_Settings_Page_0_document_0_phone.png",
        "selector": "document",
        "fileName": "backstop_default_Settings_Page_0_document_0_phone.png",
        "label": "Settings Page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:5173/settings",
        "expect": 0,
        "viewportLabel": "phone",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "rawMisMatchPercentage": 0.006082725060827251,
          "misMatchPercentage": "0.01",
          "analysisTime": 116
        }
      },
      "status": "pass"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\backstop_default_Settings_Page_0_document_1_tablet.png",
        "test": "..\\bitmaps_test\\20250703-201635\\backstop_default_Settings_Page_0_document_1_tablet.png",
        "selector": "document",
        "fileName": "backstop_default_Settings_Page_0_document_1_tablet.png",
        "label": "Settings Page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:5173/settings",
        "expect": 0,
        "viewportLabel": "tablet",
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
  "id": "backstop_default"
});