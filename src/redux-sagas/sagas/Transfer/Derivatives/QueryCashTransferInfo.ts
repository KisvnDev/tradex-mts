import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest } from 'interfaces/common';
import { DERIVATIVES_TRANSFER_QUERY_CASH_TRANSFER_INFO } from 'redux-sagas/actions';

const queryCashTransferInfo = () => {
  const uri = 'derivatives/transfer/cash';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryCashTransferInfo(request: IRequest<null>) {
  try {
    const response = yield call(queryCashTransferInfo);
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

export default function* watchQueryCashTransferInfo() {
  yield takeLatest(DERIVATIVES_TRANSFER_QUERY_CASH_TRANSFER_INFO, doQueryCashTransferInfo);
}
