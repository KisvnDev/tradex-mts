import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { RIGHTS_SUBSCRIPTION_QUERY_DETAIL } from 'redux-sagas/actions';

const queryRightsDetail = (data: IObject) => {
  const uri = 'equity/rights/detail';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryRightsDetail(request: IRequest<IObject>) {
  try {
    const response = yield call(queryRightsDetail, request.payload);
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

export default function* watchQueryRightsDetail() {
  yield takeLatest(RIGHTS_SUBSCRIPTION_QUERY_DETAIL, doQueryRightsDetail);
}
