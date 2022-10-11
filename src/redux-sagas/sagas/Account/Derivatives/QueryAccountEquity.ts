import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest } from 'interfaces/common';
import { DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_EQUITY } from 'redux-sagas/actions';

const queryAccountEquity = () => {
  const uri = 'derivatives/account/equity';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAccountEquity(request: IRequest<null>) {
  try {
    const response = yield call(queryAccountEquity);
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

export default function* watchQueryAccountEquity() {
  yield takeLatest(DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_EQUITY, doQueryAccountEquity);
}
