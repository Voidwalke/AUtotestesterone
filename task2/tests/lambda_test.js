const LambdaPage = require('../pages/lambda_page');
const { describe, before, after, it } = require('mocha');
const { assert } = require('chai');

describe('Lambda test', () => {
    let lp;

    before(async () => {
        lp = new LambdaPage(5, 5);
        await lp.open();
    });

    after(async () => {
        await lp.closeBrowser();
    });

    it('opens Lambda page and checks for title', async () => {
        const heading = await lp.getHeading();
        assert.equal(heading, 'LambdaTest Sample App', 'Incorrect page title');
    });

    it('checks that list remaining text is present', async () => {
        const isRemainingTextPresent = await lp.checkRemaining();
        assert.isTrue(isRemainingTextPresent, 'Remaining text is not present');
    });

    it('checks that first element is not done', async () => {
        const isFirstElementActive = await lp.isItemActive(await lp.getListItem(1));
        assert.isFalse(isFirstElementActive, 'First element is active');
    });

    it('clicks the first element and checks if it becomes active and remaining text changes respectively', async () => {
        await lp.clickItem(await lp.getListItem(1));
        assert.isTrue(await lp.isItemActive(await lp.getListItem(1)), 'First element did not become active');
        assert.isTrue(await lp.checkRemaining(), 'Remaining text did not change after clicking the first element');
    });

    it('checks if other list items become active and remaining text changes respectively', async () => {
        for (let i = 2; i <= lp.total; i++) {
            const isItemActive = await lp.isItemActive(await lp.getListItem(i));
            assert.isFalse(isItemActive, `Item ${i} is already active`);

            await lp.clickItem(await lp.getListItem(i));

            assert.isTrue(await lp.isItemActive(await lp.getListItem(i)), `Item ${i} did not become active`);
            assert.isTrue(await lp.checkRemaining(), 'Remaining text did not change after clicking other items');
        }
    });

    it('adds a new list item and checks if it is not active', async () => {
        await lp.addItem('4iterok007');
        assert.isFalse(await lp.isItemActive(await lp.getListItem(lp.total)), 'New item is active');
        assert.isTrue(await lp.checkRemaining(), 'Remaining text did not change after adding a new item');
    });

    it('clicks the new element and checks if remaining text changes', async () => {
        await lp.clickItem(await lp.getListItem(lp.total));
        assert.isTrue(await lp.checkRemaining(), 'Remaining text did not change after clicking the new item');
    });
});