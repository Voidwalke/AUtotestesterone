const assert = require('assert');
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');

// Создаем экземпляр драйвера для браузера Chrome
const driver = new Builder().forBrowser(Browser.CHROME).build();

// Инициализируем переменные для общего количества задач и оставшихся задач
let total = 5, remaining = 5;


// Функция для выполнения теста
const test = async () => {
    try {
        await driver.get('https://lambdatest.github.io/sample-todo-app/');
        await driver.wait(until.elementLocated(By.xpath('//h2')), 5000);
        
        const heading = await driver.findElement(By.xpath('//h2'));
        assert.strictEqual(await heading.getText(), 'LambdaTest Sample App');

        const getRemainingText = async () => {
            const remainingElement = await driver.findElement(By.xpath('//span[@class="ng-binding"]'));
            return await remainingElement.getText();
        };
        assert.strictEqual(await getRemainingText(), '5 of 5 remaining');
 
        // Функция для тестирования отдельной задачи
        const testItem = async (num) => {
            const item = await driver.findElement(By.xpath(`//ul[@class="list-unstyled"]/li[${num}]`));
            const spanElement = await item.findElement(By.tagName('span'));
            assert.strictEqual(await spanElement.getAttribute('class'), 'done-false');

            const inputElement = await item.findElement(By.tagName('input'));
            await inputElement.click();

            remaining -= 1;
            assert.strictEqual(await spanElement.getAttribute('class'), 'done-true');
            assert.strictEqual(await getRemainingText(), `${remaining} of ${total} remaining`);
        };

        for (let i = 1; i <= 5; i++) {
            await testItem(i);
        }
 // Функция для добавления новой задачи
        const addItem = async (text) => {
            const input = await driver.findElement(By.id('sampletodotext'));
            const btn = await driver.findElement(By.id('addbutton'));
            await input.sendKeys(text, Key.RETURN);

            total += 1;
            remaining += 1;

            const item = await driver.findElement(By.xpath(`//ul[@class="list-unstyled"]/li[last()]`));
            const spanElement = await item.findElement(By.tagName('span'));
            assert.strictEqual(await spanElement.getAttribute('class'), 'done-false');
            assert.strictEqual(await getRemainingText(), `${remaining} of ${total} remaining`);
        };

        await addItem('EASTcostwest');
        await testItem(total);

        await driver.sleep(5000);
    } catch (err) {
        const screenshot = await driver.takeScreenshot();
        require('fs').writeFileSync('screenshot_error.png', screenshot, 'base64');
        console.error(`Тест завершился с ошибкой: ${err}`);
    } finally {
        await driver.quit();
    }
};

test();
