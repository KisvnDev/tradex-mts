import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { SECURED_LOAN_QUERY_LOAN_HISTORY } from 'redux-sagas/actions';
import config from 'config';

const isNewCoreKis = config.usingNewKisCore;

const getSecuredLoanHistoryList = (data: IObject) => {
  const uri = isNewCoreKis ? 'services/eqt/getCashAdvanceHistory' : 'equity/loan/history';

  if (isNewCoreKis) {
    let params: any = {
      accountNo: store.getState().selectedAccount!.accountNumber,
      offset: data?.offset,
      fetchCount: data?.fetchCount,
      state: data?.status,
    };

    return query(global.domainSocket, uri, METHOD.GET, params);
  }

  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    loanBankCode: data.loanBankCode,
    lastLoanDate: data.lastLoanDate ? data.lastLoanDate : null,
    lastLoanBankCode: data.lastLoanBankCode ? data.lastLoanBankCode : null,
    lastMatchDate: data.lastMatchDate ? data.lastMatchDate : null,
    lastStockCode: data.lastLoanOrderType ? data.lastStockCode : null,
    fetchCount: data.fetchCount,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQuerySecuredLoanHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true && isNewCoreKis === false) {
      request.payload.lastLoanDate = store.getState().securedLoanHistory!.lastLoanDate;
      request.payload.lastLoanBankCode = store.getState().securedLoanHistory!.lastLoanBankCode;
      request.payload.lastMatchDate = store.getState().securedLoanHistory!.lastMatchDate;
      request.payload.lastStockCode = store.getState().securedLoanHistory!.lastStockCode;
    }

    const response = yield call(getSecuredLoanHistoryList, request.payload);
    const data = response.data;

    if (isNewCoreKis) {
      yield put({
        type: request.response.success,
        payload: {
          data: data,
        },
      });
    }

    const lastLoanDate = data.length > 0 ? data[data.length - 1].loanDate : null;
    const lastLoanBankCode = data.length > 0 ? data[data.length - 1].loanBankCode : null;
    const lastMatchDate = data.length > 0 ? data[data.length - 1].matchDate : null;
    const lastStockCode = data.length > 0 ? data[data.length - 1].stockCode : null;

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: data,
          lastLoanDate,
          lastLoanBankCode,
          lastMatchDate,
          lastStockCode,
          next: true,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data,
          lastLoanDate,
          lastLoanBankCode,
          lastMatchDate,
          lastStockCode,
          next: false,
        },
      });
    }
  } catch (err) {
    yield put({ type: request.response.failure, data: null });
  }
}

export default function* watchQuerySecuredLoanHistory() {
  yield takeLatest(SECURED_LOAN_QUERY_LOAN_HISTORY, doQuerySecuredLoanHistory);
}
