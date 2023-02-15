import * as React from 'react';
import { act } from 'react-dom/test-utils';
import * as ReactDOM from 'react-dom';

import Dashboard, { IotDashboardProps } from './index';
import { mockQuery } from '../../../testing/siteWiseQueries';

describe('Dashboard', () => {
  it('should render', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const args: IotDashboardProps = {
      query: mockQuery(),
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
      client: undefined,
    };

    act(() => {
      ReactDOM.render(<Dashboard {...args} />, container);
    });
    const dashboard = container.querySelector('.iot-dashboard');
    expect(dashboard).toBeTruthy();
  });
});
