import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { SECURED_LOAN_QUERY_AVAILABLE_LOANS } from 'redux-sagas/actions';

const getSecuredLoanAvailableList = (data: IObject) => {
  const uri = 'equity/loan/available';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    loanBankCode: data.loanBankCode,
    lastSettlementDate: data.lastSettlementDate ? data.lastSettlementDate : null,
    lastLoanBankCode: data.lastLoanBankCode ? data.lastLoanBankCode : null,
    lastMatchDate: data.lastMatchDate ? data.lastMatchDate : null,
    lastLoanOrderType: data.lastLoanOrderType ? data.lastLoanOrderType : null,
    fetchCount: data.fetchCount,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAvailableSecuredLoan(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastSettlementDate = store.getState().securedLoanAvailable!.lastSettlementDate;
      request.payload.lastSettleBankCode = store.getState().securedLoanAvailable!.lastSettleBankCode;
      request.payload.lastMatchDate = store.getState().securedLoanAvailable!.lastMatchDate;
      request.payload.lastLoanOrderType = store.getState().securedLoanAvailable!.lastLoanOrderType;
    }

    const response = yield call(getSecuredLoanAvailableList, request.payload);

    const data = response.data;

    const lastSettlementDate = data.length > 0 ? data[data.length - 1].settleDate : null;
    const lastSettleBankCode = data.length > 0 ? data[data.length - 1].settleBankCode : null;
    const lastMatchDate = data.length > 0 ? data[data.length - 1].matchDate : null;
    const lastLoanOrderType = data.length > 0 ? data[data.length - 1].loanOrderType : null;

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: data,
          lastSettlementDate,
          lastSettleBankCode,
          lastMatchDate,
          lastLoanOrderType,
          next: true,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data,
          lastSettlementDate,
          lastSettleBankCode,
          lastMatchDate,
          lastLoanOrderType,
          next: false,
        },
      });
    }
  } catch (err) {
    yield put({
      type: request.response.failure,
    });
  }
}

export default function* watchQueryAvailableSecuredLoan() {
  yield takeLatest(SECURED_LOAN_QUERY_AVAILABLE_LOANS, doQueryAvailableSecuredLoan);
}
