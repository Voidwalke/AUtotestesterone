const { Builder, Browser } = require('selenium-webdriver');

module.exports = class BasePage {
    constructor() {
        this.driver = new Builder().forBrowser(Browser.CHROME).build();
    }

    async goToUrl(url) {
        await this.driver.get(url);
    }

    async getElText(locator) {
        const element = await this.driver.findElement(locator);
        return await element.getText();
    }

    async enterText(locator, text) {
        const element = await this.driver.findElement(locator);
        await element.sendKeys(text);
    }

    async click(locator) {
        const element = await this.driver.findElement(locator);
        await element.click();
    }

    async saveScreenshot(fileName) {
        const screenshot = await this.driver.takeScreenshot();
        require('fs').writeFileSync(fileName, screenshot, 'base64');
    }

    async closeBrowser(delay = 0) {
        if (delay) await this.driver.sleep(delay);
        await this.driver.quit();
    }
}