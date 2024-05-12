const SchedulePage = require('../pages/schedule_page');
const { describe, before, after, it } = require('mocha');
const { assert } = require('chai');

describe('Schedule test', () => {
    let sp;

    before(async () => {
        sp = new SchedulePage();
        await sp.open();
    });

    after(async () => {
        await sp.closeBrowser();
    });

    it('opens schedule page', async () => {
        await sp.openSchedule();
        assert.isTrue(await sp.isSchedulePageOpened(), 'Schedule page did not open');
    });

    it('opens schedule view page', async () => {
        await sp.openViewSchedule();
        assert.isTrue(await sp.isViewSchedulePageOpened(), 'View schedule page did not open');
    });

    it('fills in group', async () => {
        await sp.fillInGroup();
        assert.isTrue(await sp.isGroupFilled(), 'Group was not filled');
    });

    it('checks if needed group is there', async () => {
        const isGroupInList = await sp.checkIfGroupInList();
        assert.isTrue(isGroupInList, 'Needed group is not in the list');
    });

    it('goes to group schedule', async () => {
        await sp.goToGroupSchedule();
        assert.isTrue(await sp.isGroupScheduleOpened(), 'Group schedule did not open');
    });

    it('checks if current day is highlighted', async () => {
        const isCurrentDayHighlighted = await sp.checkIfCurrentDayHighlighted();
        assert.isTrue(isCurrentDayHighlighted, 'Current day is not highlighted');
    });
});