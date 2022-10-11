import { put, takeLatest, call } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest } from 'interfaces/common';
import { DERIVATIVES_TRANSFER_QUERY_WITHDRAW_INFO } from 'redux-sagas/actions';

const queryWithdrawInfo = () => {
  const uri = 'derivatives/transfer/cash/withdraw';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryWithdrawInfo(request: IRequest<null>) {
  try {
    const response = yield call(queryWithdrawInfo);
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

export default function* watchQueryWithdrawInfo() {
  yield takeLatest(DERIVATIVES_TRANSFER_QUERY_WITHDRAW_INFO, doQueryWithdrawInfo);
}
