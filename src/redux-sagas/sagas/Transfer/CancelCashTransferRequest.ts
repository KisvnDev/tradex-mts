import { call, put, takeLatest } from 'redux-saga/effects';
import { NOTIFICATION_TYPE } from 'global';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, TRANSFER_CASH_TRANSFER_CANCEL_REQUEST } from 'redux-sagas/actions';

const cancelCashTransfer = (data: IObject) => {
  const uri = 'equity/trasnfer/cash/cancel';

  const params = {
    ...{
      accountNumber: store.getState().selectedAccount!.accountNumber,
      subNumber: store.getState().selectedAccount!.subNumber,
    },
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doCancelCashTransferRequest(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    yield call(cancelCashTransfer, data);
    yield put({
      type: request.response.success,
      hideLoading: true,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Cancel Cash Transfer',
        content: 'CANCEL_CASH_TRANSFER_REQUEST_SUCCESS',
        contentParams: { sequenceNumber: request.payload.sequenceNumber },
        time: new Date(),
      },
    });
  } catch (err) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Cancel Cash Transfer',
        content: err.code ?? err.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchCancelCashTransferRequest() {
  yield takeLatest(TRANSFER_CASH_TRANSFER_CANCEL_REQUEST, doCancelCashTransferRequest);
}
