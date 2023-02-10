import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import IotDashboard, { IotDashboardProps } from '../../src/components/dashboard';
import { query, REGION } from '../../testing/siteWiseQueries';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { getEnvCredentials } from '../../testing/getEnvCredentials';

import { MockWidgetFactory } from '../../testing/mocks';
import { SaveableDashboard } from '../../src/store/state';

const getDashboardProps = (defaultProps: IotDashboardProps): IotDashboardProps => {
  const cachedDashboard = window.localStorage.getItem('dashboard');
  const dashboard = cachedDashboard ? (JSON.parse(cachedDashboard) as SaveableDashboard) : defaultProps;

  return {
    ...defaultProps,
    ...dashboard,
  };
};

export default {
  title: 'IotDashboard',
  component: IotDashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof IotDashboard>;

let client: IoTSiteWiseClient | undefined;
try {
  client = new IoTSiteWiseClient({
    region: REGION,
    credentials: getEnvCredentials(),
  });
} catch (e) {
  console.log(e);
}

const args = {
  client,
  dashboardConfiguration: {
    widgets: [
      {
        id: 'mock-text-widget',
        componentTag: 'input',
        x: 0,
        y: 0,
        z: 1,
        width: 30,
        height: 5,
        options: [
          { label: 'Going to lunch', value: '1' },
          { label: 'Company event', value: '2' },
          { label: 'Taking training', value: '3' }
        ]
      }
    ],
    viewport: { duration: '5m' },
  },
  query,
  onSave: (dashboard) => {
    window.localStorage.setItem('dashboard', JSON.stringify(dashboard));
    console.log(dashboard);
  },
} as IotDashboardProps;

export const Main: ComponentStory<typeof IotDashboard> = () => <IotDashboard {...getDashboardProps(args)} />;

const readOnlyArgs = {
  client,
  grid: {
    height: 100,
    width: 100,
    cellSize: 10,
    stretchToFit: false,
  },
  query,
  dashboardConfiguration: {
    viewport: { duration: '5m' },
    widgets: [
      {
        id: 'mock-text-widget',
        componentTag: 'input',
        x: 0,
        y: 0,
        z: 1,
        width: 30,
        height: 5,
        options: [
          { label: 'Going to lunch', value: '1' },
          { label: 'Company event', value: '2' },
          { label: 'Taking training', value: '3' }
        ]
      }
    ],
  },
  readOnly: true,
} as IotDashboardProps;

export const ReadOnly: ComponentStory<typeof IotDashboard> = () => {
  return <IotDashboard {...getDashboardProps(readOnlyArgs)} />;
};
