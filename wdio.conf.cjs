exports.config = {
    runner: 'local',
    specs: [
        './features/**/*.feature'
    ],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome'
    }],
    logLevel: 'info',
    // Update baseUrl to point to your dynamic app's dev server if needed
    baseUrl: 'http://localhost:5173/',
    waitforTimeout: 10000,
    framework: 'cucumber',
    reporters: ['spec'],
    cucumberOpts: {
        require: ['./features/step-definitions/steps.js'],
        timeout: 60000,
    },
};
