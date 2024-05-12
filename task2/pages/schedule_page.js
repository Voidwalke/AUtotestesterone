const { Builder, Browser, By, Key } = require('selenium-webdriver');
const BasePage = require('./basepage');
const { assert } = require('chai');

class SchedulePage extends BasePage {
    async open() {
        await this.goToUrl('https://mospolytech.ru/');
    }

    async openSchedule() {
        await this.click(By.xpath('//ul[@class="user-nav__list"]//a[@href="/obuchauschimsya/raspisaniya/"]'));
        await this.driver.sleep(1500);
    }

    async openViewSchedule() {
        this.originalWindow = await this.driver.getWindowHandle();
        await this.click(By.xpath('//a[@href="https://rasp.dmami.ru/"]'));
        await this.driver.sleep(1000);
    }

    async fillInGroup() {
        const windows = await this.driver.getAllWindowHandles();
        for (const handle of windows) {
            if (handle !== this.originalWindow) {
                await this.driver.switchTo().window(handle);
            }
        }

        await this.enterText(By.xpath('//input[@class="groups"]'), '221-321');
        await this.driver.findElement(By.xpath('//input[@class="groups"]')).sendKeys(Key.ENTER);
    }

    async checkIfGroupInList() {
        try {
            await this.driver.findElement(By.xpath('//div[@id="221-321"]'));
            return true;
        } catch (error) {
            return false;
        }
    }

    async goToGroupSchedule() {
        await this.click(By.xpath('//div[@id="221-321"]'));
    }

    async checkIfCurrentDayHighlighted() {
        const currentDayElement = await this.driver.findElement(By.xpath(`//div[@class="schedule-week"]/div[${new Date().getDay() + 1}]`));
        const classValue = await currentDayElement.getAttribute('class');
        return classValue.includes('schedule-day_today');
    }
}

module.exports = SchedulePage;