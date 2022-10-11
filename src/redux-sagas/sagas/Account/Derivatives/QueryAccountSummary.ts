import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest } from 'interfaces/common';
import { DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_SUMMARY } from 'redux-sagas/actions';

const queryAccountSummary = () => {
  const uri = 'derivatives/account/summary';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAccountSummary(request: IRequest<null>) {
  try {
    const response = yield call(queryAccountSummary);
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

export default function* watchQueryAccountSummary() {
  yield takeLatest(DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_SUMMARY, doQueryAccountSummary);
}
