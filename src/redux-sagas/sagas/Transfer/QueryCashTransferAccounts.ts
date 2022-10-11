import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest } from 'interfaces/common';
import { TRANSFER_CASH_QUERY_TRANSFER_ACCOUNT } from 'redux-sagas/actions';

const queryCashTransferAccounts = () => {
  const uri = 'equity/transfer/cash/account';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryCashTransferAccounts(request: IRequest<null>) {
  try {
    const response = yield call(queryCashTransferAccounts);

    yield put({
      type: request.response.success,
      payload: {
        accounts: response.data,
        accountNumber: store.getState().selectedAccount!.accountNumber,
        subNumber: store.getState().selectedAccount!.subNumber,
      },
    });
  } catch (err) {
    yield put({
      type: request.response.failure,
    });
  }
}

export default function* watchQueryCashTransferAccounts() {
  yield takeLatest(TRANSFER_CASH_QUERY_TRANSFER_ACCOUNT, doQueryCashTransferAccounts);
}
