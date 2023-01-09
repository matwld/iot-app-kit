import { AssetQuery } from '@iot-app-kit/core';
import { Action } from 'redux';

import { AppKitWidget } from '../../../types';
import { DashboardState } from '../../state';

/**
 * 
 * Maybe something like this for the action?????
 * 
 */
type UpdateAssetQueryActionPayload = {
  widget: AppKitWidget;
  assetQuery: AssetQuery[];
};
export interface UpdateAssetQueryAction extends Action {
  type: 'UPDATE_ASSET_QUERY';
  payload: UpdateAssetQueryActionPayload;
}

export const onUpdateAssetQueryAction = (payload: UpdateAssetQueryActionPayload): UpdateAssetQueryAction => ({
  type: 'UPDATE_ASSET_QUERY',
  payload,
});

export const updateAssetQuery = (state: DashboardState, action: UpdateAssetQueryAction): DashboardState => {
  const widgets = state.dashboardConfiguration.widgets
    .map(w => {
      if (w.id === action.payload.widget.id) {
        return { ...w, assetQuery: action.payload.assetQuery };
      }
      return w;
    });

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets,
    },
  };
};
