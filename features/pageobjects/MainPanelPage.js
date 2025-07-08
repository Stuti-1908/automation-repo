// pages/MainPanelPage.js
export default class MainPanelPage {
  get inputBox() {
    return $('#my-input');
  }

  get clickMeButton() {
    return $('button=Click Me');
  }

  get resetButton() {
    return $('button=Reset');
  }

  get outputText() {
    return $('#main-output');
  }
  async clickButton(label) {
  const btn = await $(`button=${label}`);
  await btn.waitForClickable({ timeout: 5000 });
  await btn.click();
}


  async enterText(text) {
    await this.inputBox.waitForDisplayed({ timeout: 10000 });
    await this.inputBox.setValue(text);
  }

  // 👇 Add this if your step calls `enterInput`
  async enterInput(text) {
    await this.enterText(text);
  }

  async clickClickMe() {
    await this.clickMeButton.click();
  }

  async clickReset() {
    await this.resetButton.click();
  }

  async getOutputText() {
    return await this.outputText.getText();
  }
}
