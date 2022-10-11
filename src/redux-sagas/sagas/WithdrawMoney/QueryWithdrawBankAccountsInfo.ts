import { put, takeLatest, call } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, WITHDRAW_MONEY_QUERY_BANK_INFO } from 'redux-sagas/actions';
import store from 'redux-sagas/store';
import { NOTIFICATION_TYPE, SYSTEM_TYPE } from 'global';

const queryWithdrawBankAccountsInfo = () => {
  const params = {
    accountNo: store.getState().selectedAccount?.accountNumber,
  };
  const uri =
    store.getState().selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES
      ? 'services/fno/queryBankInfo'
      : 'services/eqt/queryBankInfo';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryWithdrawBankAccountsInfo(request: IRequest<null>) {
  try {
    const response = yield call(queryWithdrawBankAccountsInfo);

    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Bank Info',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryWithdrawBankAccountsInfo() {
  yield takeLatest(WITHDRAW_MONEY_QUERY_BANK_INFO, doQueryWithdrawBankAccountsInfo);
}
