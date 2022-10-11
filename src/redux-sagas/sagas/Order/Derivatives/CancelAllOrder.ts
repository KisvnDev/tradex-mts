import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { ORDER_KIND, STOP_ORDER_TYPE, NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, SPEED_ORDER_CANCEL_DERIVATIVES_ORDER } from 'redux-sagas/actions';
import config from 'config';

const cancelOrder = (params: IObject, uri: string) => {
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doCancelAllOrder(request: IRequest<IObject>) {
  try {
    let response = null;
    if (request.orderKind === ORDER_KIND.NORMAL_ORDER) {
      response = yield call(
        cancelOrder,
        request.payload,
        config.usingNewKisCore ? 'services/fno/cancelorder' : 'derivatives/order/cancel/all'
      );

      yield put({
        type: request.response.success,
        payload: {
          orderNumber: response.data.orderNumber,
          orderKind: request.orderKind,
          sellBuyType: request.payload.sellBuyType,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Derivatives Order',
          content: 'CANCEL_ORDER_SUCCESS',
          contentParams: { orderNumber: request.payload.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP;
      response = yield call(
        cancelOrder,
        request.payload,
        config.usingNewKisCore ? 'stopOrder/cancel/multi' : 'derivatives/order/stop/cancel/all'
      );

      yield put({
        type: request.response.success,
        payload: {
          orderKind: request.orderKind,
          sellBuyType: request.payload.sellBuyType,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Derivatives Stop Order',
          content: 'CANCEL_STOP_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP_LIMIT;
      response = yield call(
        cancelOrder,
        request.payload,
        config.usingNewKisCore ? 'stopOrder/cancel/multi' : 'derivatives/order/stop/cancel/all'
      );

      yield put({
        type: request.response.success,
        payload: {
          orderKind: request.orderKind,
          sellBuyType: request.payload.sellBuyType,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Derivatives Stop Limit Order',
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
  yield takeLatest(SPEED_ORDER_CANCEL_DERIVATIVES_ORDER, doCancelAllOrder);
}
