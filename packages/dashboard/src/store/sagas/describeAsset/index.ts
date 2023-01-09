
// Will need to install redux-saga


// https://redux-saga.js.org/

// https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_DescribeAsset.html

import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import { UpdateAssetQueryAction } from '../../actions/updateAssetQuery';

// Worker saga will be fired on USER_FETCH_REQUESTED actions
function* describeAsset(action: UpdateAssetQueryAction) {
   try {
      const assetQueryToMap = action.payload.assetQuery;
      const describedAssetModels = yield all(assetQueryToMap.map(assetQuery => call(/* DescribeAsset SDK */, assetQuery)));
      yield put({type: "DESCRIBE_ASSET_MODELS_SUCCEEDED", describedAssetModels });
   } catch (e: Error) {
      yield put({type: "DESCRIBE_ASSET_MODELS_FAILED", message: e.message});
   }
}

export function* describeAssetSaga() {
  yield takeEvery("UPDATE_ASSET_QUERY", describeAsset);
}
