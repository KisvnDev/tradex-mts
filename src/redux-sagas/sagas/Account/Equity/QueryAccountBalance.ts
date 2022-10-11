import { call, put, takeLatest } from 'redux-saga/effects';
import { METHOD, query } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest } from 'interfaces/common';
import { ACCOUNT_QUERY_EQUITY_ACCOUNT_BALANCE } from 'redux-sagas/actions';
import config from 'config';

const queryAccountBalance = () => {
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore ? 'services/eqt/assetInfoFromPortfolio' : 'equity/account/cashBalance';
  const accountBank = store.getState().accountBank;
  let params: any = {};

  !isKisCore &&
    (params = {
      subNumber: store.getState().selectedAccount!.subNumber,
      bankCode: accountBank ? accountBank.bankCode : null,
      bankName: accountBank ? accountBank.bankName : null,
    });

  params.accountNumber = store.getState().selectedAccount!.accountNumber;
  return query(global.domainSocket, uri, METHOD.GET, params);
};
const queryMarginBalanceKis = () => {
  const uri = 'services/eqt/accountbalance';
  const params = { accountNumber: store.getState().selectedAccount!.accountNumber };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAccountBalance(request: IRequest<null>) {
  try {
    const response = yield call(queryAccountBalance);

    if (config.usingNewKisCore && store.getState().selectedAccount?.account.includes('M')) {
      const resMargin = yield call(queryMarginBalanceKis);
      response.data = { ...response.data, ...resMargin.data };
    }
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

export default function* watchQueryAccountBalance() {
  yield takeLatest(ACCOUNT_QUERY_EQUITY_ACCOUNT_BALANCE, doQueryAccountBalance);
}
