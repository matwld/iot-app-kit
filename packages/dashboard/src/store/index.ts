import { Store } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import merge from 'lodash/merge';

import { DashboardAction } from './actions';
import { DashboardState, initialState } from './state';
import { dashboardReducer } from './reducer';
import { describeAssetSaga } from './sagas/describeAsset';

export type DashboardStore = Store<DashboardState, DashboardAction>;

export const configureDashboardStore = (preloadedState?: Partial<DashboardState>) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: dashboardReducer,
    preloadedState: merge(initialState, preloadedState),
  });

  sagaMiddleware.run(describeAssetSaga);

  return store;
}
