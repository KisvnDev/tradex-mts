import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, TRANSFER_STOCK_TRANSFER_REQUEST } from 'redux-sagas/actions';
import config from 'config';

const transferStock = (data: IObject) => {
  const uri = config.usingNewKisCore ? 'services/eqt/instrumentDW' : 'equity/transfer/stock';

  const params = {
    ...{
      accountNumber: store.getState().selectedAccount!.accountNumber,
      subNumber: store.getState().selectedAccount!.subNumber,
    },
    ...data,
  };

  return query(global.domainSocket, uri, METHOD.POST, config.usingNewKisCore ? data : params);
};

function* doStockTransferRequest(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    yield call(transferStock, data);
    yield put({
      type: request.response.success,
      hideLoading: true,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Stock Transfer',
        content: 'REQUEST_TRANSFER_STOCK_SUCCESS',
        contentParams: {
          stockCode: request.payload.stockCode,
          quantity: request.payload.quantity,
        },
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
        title: 'Stock Transfer',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchStockTransferRequest() {
  yield takeLatest(TRANSFER_STOCK_TRANSFER_REQUEST, doStockTransferRequest);
}
