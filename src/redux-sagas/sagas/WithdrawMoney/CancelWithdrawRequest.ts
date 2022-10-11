import { call, put, takeLatest } from 'redux-saga/effects';
import { NOTIFICATION_TYPE } from 'global';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, WITHDRAW_MONEY_CANCEL_REQUEST } from 'redux-sagas/actions';

const cancelWithdrawMoney = (data: IObject) => {
  const uri = 'equity/withdraw/cancel';

  const params = {
    ...{
      accountNumber: store.getState().selectedAccount!.accountNumber,
      subNumber: store.getState().selectedAccount!.subNumber,
    },
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doCancelWithdrawRequest(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    yield call(cancelWithdrawMoney, data);
    yield put({
      type: request.response.success,
      hideLoading: true,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Cancel Withdraw Money',
        content: 'CANCEL_WITHDRAW_MONEY_REQUEST_SUCCESS',
        contentParams: { sequenceNumber: request.payload.sequenceNumber },
        time: new Date(),
      },
    });
  } catch (err) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Cancel Withdraw Money',
        content: err.code ?? err.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchCancelWithdrawRequest() {
  yield takeLatest(WITHDRAW_MONEY_CANCEL_REQUEST, doCancelWithdrawRequest);
}
