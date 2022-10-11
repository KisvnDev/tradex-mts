import { put, takeLatest, call } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { ORDER_KIND, NOTIFICATION_TYPE, STOP_ORDER_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, ORDER_PLACE_ORDER, SPEED_ORDER_PLACE_ORDER } from 'redux-sagas/actions';
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
        config.usingNewKisCore === false ? 'equity/order' : 'services/eqt/enterorder'
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
          title: 'Order',
          content: 'PLACE_ORDER_SUCCESS',
          contentParams: { orderNumber: response.data.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_ORDER) {
      const uri = config.usingNewKisCore ? 'stopOrder' : 'equity/order/stop';
      request.payload.orderType = STOP_ORDER_TYPE.STOP;
      response = yield call(placeOrder, request.payload, uri);

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
          title: 'Stop Order',
          content: 'PLACE_STOP_ORDER_SUCCESS',
          contentParams: { orderNumber: response.data.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
      if (config.usingNewKisCore === false) {
        request.payload.orderType = STOP_ORDER_TYPE.STOP_LIMIT;
        response = yield call(placeOrder, request.payload, 'equity/order/stop');
      } else {
        response = yield call(placeOrder, request.payload, 'stopOrder');
      }

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
          title: 'Stop Limit Order',
          content: 'PLACE_STOP_LIMIT_ORDER_SUCCESS',
          contentParams: { orderNumber: response.data.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.ADVANCE_ORDER) {
      response = yield call(placeOrder, request.payload, 'equity/order/advance');

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
          title: 'Advance Order',
          content: 'PLACE_ADVANCE_ORDER_SUCCESS',
          contentParams: { orderNumber: response.data.tempOrderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.ODDLOT_ORDER) {
      response = yield call(placeOrder, request.payload, 'equity/order/oddlot');

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
          title: 'Oddlot Order',
          content: 'PLACE_ODDLOT_ORDER_SUCCESS',
          contentParams: { stockCode: response.data.orderNumber },
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
  yield takeLatest(ORDER_PLACE_ORDER, doPlaceOrder);
}

export function* watchPlaceSpeedOrder() {
  yield takeLatest(SPEED_ORDER_PLACE_ORDER, doPlaceOrder);
}
