import { takeLatest, put, call } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import config from 'config';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { WITHDRAW_MONEY_QUERY_HISTORY } from 'redux-sagas/actions';
import { SYSTEM_TYPE } from 'global';

const isDerivativesAccount = () => store.getState().selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES;
const queryWithdrawHistory = (data: IObject) => {
  const uri = config.usingNewKisCore
    ? isDerivativesAccount()
      ? 'services/fno/cashDWenquiry'
      : 'services/eqt/hksCashTransactionHistory'
    : 'equity/withdraw/history';
  const params = {
    [config.usingNewKisCore ? 'accountNo' : 'accountNumber']: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryWithdrawHistory(request: IRequest<IObject>) {
  try {
    const isKisCore = config.usingNewKisCore;
    const { loadMore } = request.payload;

    if (isKisCore) {
      request.payload.offset = loadMore ? store.getState().withdrawTransactionHistory!.offset : 0;
    } else {
      const { lastTransactionDate, lastSequenceNumber } = store.getState().withdrawTransactionHistory!;
      loadMore && (request.payload = { ...request.payload, lastTransactionDate, lastSequenceNumber });
    }

    const response = yield call(queryWithdrawHistory, request.payload);
    const data = isKisCore && !isDerivativesAccount() ? response.data.list : response.data;

    //TODO: Set payload action
    let payload: any = {};
    if (!isKisCore) {
      const { transactionDate: lastTransactionDate = null, sequenceNumber: lastSequenceNumber = null } = data.length
        ? data[data.length - 1]
        : {};
      payload = { lastTransactionDate, lastSequenceNumber };
    } else {
      let offset =
        ((request.payload.loadMore && store.getState()?.withdrawTransactionHistory?.offset) || 0) + data.length;
      payload = { offset };
    }
    payload[loadMore ? 'nextData' : 'data'] = data;
    payload.next = loadMore;

    //TODO: dispatch success get list transfer history
    yield put({
      type: request.response.success,
      payload,
    });
  } catch (err) {
    console.log(err);
    yield put({ type: request.response.failure });
  }
}

export default function* watchQueryWithdrawHistory() {
  yield takeLatest(WITHDRAW_MONEY_QUERY_HISTORY, doQueryWithdrawHistory);
}
