import { takeLatest, put, call } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest, IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_EQUITY_LOAN_HISTORY } from 'redux-sagas/actions';

const queryLoanHistory = (params: IObject) => {
  const uri = 'equity/account/loanHistory';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryLoanHistory(request: IRequest<IObject>) {
  try {
    if (request.data.loadMore === true) {
      request.data.lastLoanType = store.getState().equityLoanHistory!.lastLoanType;
      request.data.lastLoanDate = store.getState().equityLoanHistory!.lastLoanDate;
      request.data.lastMatchDate = store.getState().equityLoanHistory!.lastMatchDate;
      request.data.lastStockCode = store.getState().equityLoanHistory!.lastStockCode;
      request.data.lastLoanBankCode = store.getState().equityLoanHistory!.lastLoanBankCode;
    }

    request.data.accountNumber = store.getState().selectedAccount!.accountNumber;
    request.data.subNumber = store.getState().selectedAccount!.subNumber;

    const response = yield call(queryLoanHistory, request.data);

    let lastLoanType = null;
    let lastLoanDate = null;
    let lastMatchDate = null;
    let lastStockCode = null;
    let lastLoanBankCode = null;

    if (response.data && response.data.length > 0) {
      lastLoanType = response.data[response.data.length - 1].lastLoanType;
      lastLoanDate = response.data[response.data.length - 1].lastLoanDate;
      lastMatchDate = response.data[response.data.length - 1].lastMatchDate;
      lastStockCode = response.data[response.data.length - 1].lastStockCode;
      lastLoanBankCode = response.data[response.data.length - 1].lastLoanBankCode;
    }

    if (request.data.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          next: true,
          lastLoanType,
          lastLoanDate,
          lastMatchDate,
          lastStockCode,
          lastLoanBankCode,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          lastLoanType,
          lastLoanDate,
          lastMatchDate,
          lastStockCode,
          lastLoanBankCode,
        },
      });
    }
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryLoanHistory() {
  yield takeLatest(ACCOUNT_QUERY_EQUITY_LOAN_HISTORY, doQueryLoanHistory);
}
