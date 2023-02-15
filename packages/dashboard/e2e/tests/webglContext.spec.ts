import { expect } from '@playwright/test';

import { test } from '../fixtures';

test.describe('Dashboard Canvas', () => {
  test('should render the webgl context canvas in the appropriate position', async ({
    singleWidgetCustomDataSourceDashboardPage: { page },
  }) => {
    // await page.evaluate(() => window.customDataSourceLoaded);
    expect(await page.screenshot()).toMatchSnapshot();
  });
});
