import { put, call, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { ORDER_KIND, NOTIFICATION_TYPE, STOP_ORDER_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, SPEED_ORDER_CANCEL_ORDER } from 'redux-sagas/actions';
import config from 'config';

const cancelOrder = (params: IObject, uri: string) => {
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doCancelAllOrder(request: IRequest<IObject>) {
  const isUsingNewKisCore = config.usingNewKisCore;

  try {
    if (request.orderKind === ORDER_KIND.NORMAL_ORDER) {
      const uri = isUsingNewKisCore ? 'services/eqt/cancelOrder' : 'equity/order/cancel/all';

      const res = yield call(cancelOrder, request.payload, uri);

      yield put({
        type: request.response.success,
        payload: {
          orderKind: request.orderKind,
          sellBuyType: request.payload.sellBuyType,
        },
        hideLoading: true,
      });

      const orderNumber = isUsingNewKisCore ? res.data?.[0].orderNo : request.payload.orderNumber;

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Order',
          content: 'CANCEL_ORDER_SUCCESS',
          contentParams: { orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP;
      const uri = isUsingNewKisCore ? 'stopOrder/speedCancel' : 'equity/order/stop/cancel/all';

      yield call(cancelOrder, request.payload, uri);

      yield put({
        type: request.response.success,
        payload: {
          orderKind: request.orderKind,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Stop Order',
          content: 'CANCEL_STOP_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP_LIMIT;
      yield call(cancelOrder, request.payload, 'equity/order/stop/cancel/all');

      yield put({
        type: request.response.success,
        payload: {
          orderKind: request.orderKind,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Stop Limit Order',
          content: 'CANCEL_STOP_LIMIT_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    }
  } catch (error) {
    yield put({
      type: request.response.failure,
      hideLoading: true,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: request.orderKind,
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchCancelSpeedOrder() {
  yield takeLatest(SPEED_ORDER_CANCEL_ORDER, doCancelAllOrder);
}
