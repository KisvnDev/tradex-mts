import { call, put, takeLatest } from 'redux-saga/effects';
import { NOTIFICATION_TYPE } from 'global';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { SYSTEM_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, TRANSFER_CASH_TRANSFER_REQUEST } from 'redux-sagas/actions';

const DERIVATIVES_SUB_ACCOUNT = '80';

const transferCash = (data: IObject) => {
  const uri = 'equity/transfer/cash';

  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.POST, params);
};

const transferCashForDerivatives = (data: IObject) => {
  const uri = 'derivatives/transfer/cash';

  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doCashTransferRequest(request: IRequest<IObject>) {
  try {
    const data = request.payload;

    if (
      store.getState().selectedAccount!.type !== SYSTEM_TYPE.DERIVATIVES &&
      data.receivedSubNumber !== DERIVATIVES_SUB_ACCOUNT
    ) {
      yield call(transferCash, data);
    } else {
      yield call(transferCashForDerivatives, data);
    }

    yield put({
      type: request.response.success,
      hideLoading: true,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Cash Transfer',
        content: 'REQUEST_TRANSFER_CASH_SUCCESS',
        contentParams: { amount: request.payload.amount },
        time: new Date(),
      },
    });
  } catch (err) {
    yield put({
      type: request.response.failure,
      hideLoading: true,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Cash Transfer',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchCashTransferRequest() {
  yield takeLatest(TRANSFER_CASH_TRANSFER_REQUEST, doCashTransferRequest);
}
