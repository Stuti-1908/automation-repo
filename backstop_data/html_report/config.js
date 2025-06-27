report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\backstop_default_Home_Page_0_document_0_phone.png",
        "test": "..\\bitmaps_test\\20250627-204212\\backstop_default_Home_Page_0_document_0_phone.png",
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
            "height": -229
          },
          "rawMisMatchPercentage": 55.91575575928538,
          "misMatchPercentage": "55.92",
          "analysisTime": 120
        },
        "diffImage": "..\\bitmaps_test\\20250627-204212\\failed_diff_backstop_default_Home_Page_0_document_0_phone.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\backstop_default_Home_Page_0_document_1_tablet.png",
        "test": "..\\bitmaps_test\\20250627-204212\\backstop_default_Home_Page_0_document_1_tablet.png",
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
          "rawMisMatchPercentage": 42.60495503743489,
          "misMatchPercentage": "42.60",
          "analysisTime": 136
        },
        "diffImage": "..\\bitmaps_test\\20250627-204212\\failed_diff_backstop_default_Home_Page_0_document_1_tablet.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\backstop_default_Settings_Page_0_document_0_phone.png",
        "test": "..\\bitmaps_test\\20250627-204212\\backstop_default_Settings_Page_0_document_0_phone.png",
        "selector": "document",
        "fileName": "backstop_default_Settings_Page_0_document_0_phone.png",
        "label": "Settings Page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:5173/settings",
        "expect": 0,
        "viewportLabel": "phone",
        "diff": {
          "isSameDimensions": false,
          "dimensionDifference": {
            "width": -64,
            "height": -229
          },
          "rawMisMatchPercentage": 55.91575575928538,
          "misMatchPercentage": "55.92",
          "analysisTime": 143
        },
        "diffImage": "..\\bitmaps_test\\20250627-204212\\failed_diff_backstop_default_Settings_Page_0_document_0_phone.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\backstop_default_Settings_Page_0_document_1_tablet.png",
        "test": "..\\bitmaps_test\\20250627-204212\\backstop_default_Settings_Page_0_document_1_tablet.png",
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
          "rawMisMatchPercentage": 42.60495503743489,
          "misMatchPercentage": "42.60",
          "analysisTime": 131
        },
        "diffImage": "..\\bitmaps_test\\20250627-204212\\failed_diff_backstop_default_Settings_Page_0_document_1_tablet.png"
      },
      "status": "fail"
    }
  ],
  "id": "backstop_default"
});