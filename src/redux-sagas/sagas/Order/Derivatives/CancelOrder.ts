import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { ORDER_KIND, STOP_ORDER_TYPE, NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, DERIVATIVES_ORDER_CANCEL_ORDER } from 'redux-sagas/actions';
import config from 'config';

const cancelOrder = (params: IObject, uri: string) => {
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doCancelOrder(request: IRequest<IObject>) {
  try {
    let response = null;
    if (request.orderKind === ORDER_KIND.NORMAL_ORDER) {
      response = yield call(
        cancelOrder,
        request.payload,
        config.usingNewKisCore ? 'services/fno/cancelorder' : 'derivatives/order/cancel'
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
        config.usingNewKisCore ? 'stopOrder/cancel/multi' : 'derivatives/order/stop/cancel'
      );

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
        config.usingNewKisCore ? 'stopOrder/cancel/multi' : 'derivatives/order/stop/cancel'
      );

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
          title: 'Derivatives Stop Limit Order',
          content: 'CANCEL_STOP_LIMIT_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.ADVANCE_ORDER) {
      response = yield call(cancelOrder, request.payload, 'derivatives/order/advance/cancel');

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
          title: 'Derivatives Advance Order',
          content: 'CANCEL_ADVANCE_ORDER_SUCCESS',
          contentParams: { orderNumber: request.payload.tempOrderNumber },
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

export default function* watchCancelOrder() {
  yield takeLatest(DERIVATIVES_ORDER_CANCEL_ORDER, doCancelOrder);
}
