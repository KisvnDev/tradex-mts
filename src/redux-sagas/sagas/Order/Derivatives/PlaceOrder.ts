import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { ORDER_KIND, STOP_ORDER_TYPE, NOTIFICATION_TYPE } from 'global';
import {
  COMMON_SHOW_NOTIFICATION,
  DERIVATIVES_ORDER_PLACE_ORDER,
  SPEED_ORDER_PLACE_DERIVATIVES_ORDER,
} from 'redux-sagas/actions';
import config from 'config';

const placeOrder = (params: IObject, uri: string) => {
  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doPlaceOrder(request: IRequest<IObject>) {
  try {
    let response = null;
    if (request.orderKind === ORDER_KIND.NORMAL_ORDER) {
      response = yield call(
        placeOrder,
        request.payload,
        config.usingNewKisCore === false ? 'derivatives/order' : 'services/fno/enterorder'
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
          content: 'PLACE_ORDER_SUCCESS',
          contentParams: { orderNumber: response.data.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP;
      response = yield call(
        placeOrder,
        request.payload,
        config.usingNewKisCore === false ? 'derivatives/order/stop' : 'stopOrder'
      );

      yield put({
        type: request.response.success,
        payload: {
          orderNumber: response.data.orderNumber,
          orderKind: request.orderKind,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Derivatives Stop Order',
          content: 'PLACE_STOP_ORDER_SUCCESS',
          contentParams: { orderNumber: response.data.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP_LIMIT;
      response = yield call(
        placeOrder,
        request.payload,
        config.usingNewKisCore === false ? 'derivatives/order/stop' : 'stopOrder'
      );

      yield put({
        type: request.response.success,
        payload: {
          orderNumber: response.data.orderNumber,
          orderKind: request.orderKind,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Derivatives Stop Limit Order',
          content: 'PLACE_STOP_LIMIT_ORDER_SUCCESS',
          contentParams: { orderNumber: response.data.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.ADVANCE_ORDER) {
      response = yield call(placeOrder, request.payload, 'derivatives/order/advance');

      yield put({
        type: request.response.success,
        payload: {
          orderNumber: response.data.tempOrderNumber,
          orderKind: request.orderKind,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Derivatives Advance Order',
          content: 'PLACE_ADVANCE_ORDER_SUCCESS',
          contentParams: { orderNumber: response.data.tempOrderNumber },
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
        contentParams: error.messageParams,
        time: new Date(),
      },
    });
  }
}

export function* watchPlaceOrder() {
  yield takeLatest(DERIVATIVES_ORDER_PLACE_ORDER, doPlaceOrder);
}

export function* watchPlaceSpeedOrder() {
  yield takeLatest(SPEED_ORDER_PLACE_DERIVATIVES_ORDER, doPlaceOrder);
}
