export default class SettingsPanelPage {
    get panel() {
        return $('#settings-panel');
    }

    get inputField() {
        return $('#settings_input');
    }

    get outputField() {
        // This is the old selector that should be automatically updated
        return $('#settings_output');
    }

    async clickButton(text) {
        let btn;

        if (text === 'Save Settings') {
            btn = await $('button=Save Settings');
        } else if (text === 'Toggle Settings') {
            btn = await $('button=Toggle Settings');
        } else {
            return false;
        }

        await btn.waitForDisplayed({ timeout: 5000 });
        await btn.waitForClickable({ timeout: 5000 });
        await btn.click();
        return true;
    }

    async enterInput(value) {
        await this.inputField.waitForDisplayed({ timeout: 5000 });
        await this.inputField.setValue(value);
    }
}