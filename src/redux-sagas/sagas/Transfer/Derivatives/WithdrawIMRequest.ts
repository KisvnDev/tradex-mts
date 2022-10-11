import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, DERIVATIVES_TRANSFER_WITHDRAW_IM_REQUEST } from 'redux-sagas/actions';
import config from 'config';

const withdrawIM = (data: IObject) => {
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore ? 'services/fno/cpcashDW' : 'derivatives/transfer/im/withdraw';

  const params = {
    ...data,
  };

  isKisCore
    ? (params.sendingAccountNo = '057' + store.getState().userInfo?.username)
    : (params.accountNumber = store.getState().selectedAccount!.accountNumber);

  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doWithdrawIMRequest(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    yield call(withdrawIM, data);

    yield put({
      type: request.response.success,
      hideLoading: true,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Withdraw IM',
        content: 'REQUEST_WITHDRAW_IM_SUCCESS',
        contentParams: { amount: request.payload.amount },
        time: new Date(),
      },
    });
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
        hideLoading: true,
      });
    }
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Withdraw IM',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchWithdrawIMRequest() {
  yield takeLatest(DERIVATIVES_TRANSFER_WITHDRAW_IM_REQUEST, doWithdrawIMRequest);
}
