import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_TRANSFER_QUERY_WITHDRAW_IM_INFO } from 'redux-sagas/actions';
import config from 'config';

const queryWithdrawIMInfo = (data: IObject) => {
  const uri = 'derivatives/transfer/im/withdraw';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

const queryAccountSummary = () => {
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore ? 'services/fno/clientcashbalanceshortver' : 'derivatives/account/summary';
  const params = {
    [isKisCore ? 'accountNo' : 'accountNumber']: store.getState().selectedAccount!.accountNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryWithdrawIMInfo(request: IRequest<IObject>) {
  const isKisCore = config.usingNewKisCore;
  let withdrawIMInfo = {};
  try {
    if (!isKisCore) {
      const response = yield call(queryWithdrawIMInfo, request.payload);
      withdrawIMInfo = response.data;
    }

    const summary = yield call(queryAccountSummary);

    withdrawIMInfo = {
      ...withdrawIMInfo,
      ...summary.data,
    };

    yield put({
      type: request.response.success,
      payload: withdrawIMInfo,
    });
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryWithdrawIMInfo() {
  yield takeLatest(DERIVATIVES_TRANSFER_QUERY_WITHDRAW_IM_INFO, doQueryWithdrawIMInfo);
}
