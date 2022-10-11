import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_HISTORY } from 'redux-sagas/actions';
import config from 'config';

const queryTransferIMHistory = (data: IObject) => {
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore ? 'services/fno/cpcashDWenquiry' : 'derivatives/transfer/im/history';
  const params = {
    [isKisCore ? 'accountNo' : 'accountNumber']: store.getState().selectedAccount!.accountNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryTransferIMHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      // if (request.response.success === DEPOSIT_IM_QUERY_HISTORY_SUCCESS) {
      //   request.payload.lastTransactionDate = store.getState().derivativesDepositIMTransactionHistory!.lastTransactionDate;
      //   request.payload.lastSequenceNumber = store.getState().derivativesDepositIMTransactionHistory!.lastSequenceNumber;
      // } else if (request.response.success === WITHDRAW_IM_QUERY_HISTORY_SUCCESS) {
      //   request.payload.lastTransactionDate = store.getState().derivativesWithdrawIMTransactionHistory!.lastTransactionDate;
      //   request.payload.lastSequenceNumber = store.getState().derivativesWithdrawIMTransactionHistory!.lastSequenceNumber;
      // }
    }

    const response = yield call(queryTransferIMHistory, request.payload);
    const data = response.data;

    const lastTransactionDate = data.length > 0 ? data[data.length - 1].transactionDate : null;
    const lastSequenceNumber = data.length > 0 ? data[data.length - 1].sequenceNumber : null;

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: data,
          lastTransactionDate,
          lastSequenceNumber,
          next: true,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data,
          lastTransactionDate,
          lastSequenceNumber,
          next: false,
        },
      });
    }
  } catch (err) {
    if (request.response.failure) {
      yield put({ type: request.response.failure });
    }
  }
}

export default function* watchQueryTransferIMHistory() {
  yield takeLatest(DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_HISTORY, doQueryTransferIMHistory);
}
