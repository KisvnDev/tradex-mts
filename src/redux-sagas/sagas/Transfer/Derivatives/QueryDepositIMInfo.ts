import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_TRANSFER_QUERY_DEPOSIT_IM_INFO } from 'redux-sagas/actions';
import config from 'config';

const queryDepositIMInfo = (data: IObject) => {
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore ? 'services/fno/clientcashbalanceshortver' : 'derivatives/transfer/im/deposit';
  const params = {
    [isKisCore ? 'accountNo' : 'accountNumber']: store.getState().selectedAccount!.accountNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryDepositIMInfo(request: IRequest<IObject>) {
  try {
    const response = yield call(queryDepositIMInfo, request.payload);
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

export default function* watchQueryDepositIMInfo() {
  yield takeLatest(DERIVATIVES_TRANSFER_QUERY_DEPOSIT_IM_INFO, doQueryDepositIMInfo);
}
