import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { TRANSFER_CASH_QUERY_TRANSACTION_HISTORY } from 'redux-sagas/actions';

const queryCashTransferHistory = (data: IObject) => {
  const uri = 'equity/transfer/cash/history';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryCashTransferHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastTransactionDate = store.getState().cashTransferTransactionHistory!.lastTransactionDate;
      request.payload.lastTransferSequenceNumber = store.getState().cashTransferTransactionHistory!.lastTransferSequenceNumber;
    }

    const response = yield call(queryCashTransferHistory, request.payload);
    const data = response.data;

    const lastTransactionDate = data.length > 0 ? data[data.length - 1].transactionDate : null;
    const lastTransferSequenceNumber = data.length > 0 ? data[data.length - 1].sequenceNumber : null;

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: data,
          lastTransactionDate,
          lastTransferSequenceNumber,
          next: true,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data,
          lastTransactionDate,
          lastTransferSequenceNumber,
          next: false,
        },
      });
    }
  } catch (err) {
    yield put({ type: request.response.failure });
  }
}

export default function* watchQueryCashTransferHistory() {
  yield takeLatest(TRANSFER_CASH_QUERY_TRANSACTION_HISTORY, doQueryCashTransferHistory);
}
