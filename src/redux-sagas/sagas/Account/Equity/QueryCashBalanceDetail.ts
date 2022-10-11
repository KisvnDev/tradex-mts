import { call, put, takeLatest } from 'redux-saga/effects';
import { METHOD, query } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest } from 'interfaces/common';
import { ACCOUNT_QUERY_EQUITY_CASH_BALANCE_DETAIL } from 'redux-sagas/actions';

const queryCashBalanceDetail = () => {
  const uri = 'equity/account/balance/info';
  const accountBank = store.getState().accountBank;
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    bankCode: accountBank ? accountBank.bankCode : null,
    bankAccount: accountBank ? accountBank.bankAccount : null,
  };

  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryCashBalanceDetail(request: IRequest<null>) {
  try {
    const accountBank = store.getState().accountBank;
    if (accountBank) {
      const response = yield call(queryCashBalanceDetail);
      yield put({
        type: request.response.success,
        payload: response.data,
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

export default function* watchQueryCashBalanceDetail() {
  yield takeLatest(ACCOUNT_QUERY_EQUITY_CASH_BALANCE_DETAIL, doQueryCashBalanceDetail);
}
