import { call, put, takeLatest } from 'redux-saga/effects';
import { METHOD, query } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest, IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL } from 'redux-sagas/actions';

const queryAssetInfoDetail = (param: IObject) => {
  const uri = 'equity/account/assetInfo';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    bankCode: param.bankCode,
    bankAccount: param.bankAccount ? param.bankAccount : '9999',
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAssetInfoDetail(request: IRequest<IObject>) {
  try {
    const response = yield call(queryAssetInfoDetail, request.data);
    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryAssetInfoDetail() {
  yield takeLatest(ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL, doQueryAssetInfoDetail);
}
