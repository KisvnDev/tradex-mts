import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, DERIVATIVES_TRANSFER_DEPOSIT_IM_REQUEST } from 'redux-sagas/actions';
import config from 'config';

const depositIM = (data: IObject) => {
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore ? 'services/fno/cpcashDW' : 'derivatives/transfer/im/deposit';

  const params = {
    [isKisCore ? 'sendingAccountNo' : 'accountNumber']: store.getState().selectedAccount!.accountNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doDepositIMRequest(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    yield call(depositIM, data);

    yield put({
      type: request.response.success,
      hideLoading: true,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Deposit IM',
        content: 'REQUEST_DEPOSIT_IM_SUCCESS',
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
        title: 'Deposit IM',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchDepositIMRequest() {
  yield takeLatest(DERIVATIVES_TRANSFER_DEPOSIT_IM_REQUEST, doDepositIMRequest);
}
