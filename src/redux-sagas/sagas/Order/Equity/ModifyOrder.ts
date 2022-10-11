import { put, call, takeLatest } from 'redux-saga/effects';
import { IRequest, IObject } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { ORDER_KIND, NOTIFICATION_TYPE, STOP_ORDER_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, ORDER_MODIFY_ORDER, SPEED_ORDER_MODIFY_ORDER } from 'redux-sagas/actions';
import config from 'config';

const modifyOrder = (params: IObject, uri: string) => {
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doModifyOrder(request: IRequest<IObject>) {
  try {
    if (request.orderKind === ORDER_KIND.NORMAL_ORDER) {
      yield call(
        modifyOrder,
        request.payload,
        config.usingNewKisCore === false ? 'equity/order/modify' : 'services/eqt/modifyOrder'
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
          title: 'Order',
          content: 'MODIFY_ORDER_SUCCESS',
          contentParams: { orderNumber: request.payload.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_ORDER) {
      if (config.usingNewKisCore === false) {
        request.payload.orderType = STOP_ORDER_TYPE.STOP;
      }
      yield call(
        modifyOrder,
        request.payload,
        config.usingNewKisCore === false ? 'equity/order/stop/modify' : 'stopOrder/modify'
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
          title: 'Stop Order',
          content: 'MODIFY_STOP_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
      if (config.usingNewKisCore === false) {
        request.payload.orderType = STOP_ORDER_TYPE.STOP_LIMIT;
      }
      yield call(
        modifyOrder,
        request.payload,
        config.usingNewKisCore === false ? 'equity/order/stop/modify' : 'stopOrder/modify'
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
          title: 'Stop Limit Order',
          content: 'MODIFY_STOP_LIMIT_ORDER_SUCCESS',
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

export function* watchModifyOrder() {
  yield takeLatest(ORDER_MODIFY_ORDER, doModifyOrder);
}

export function* watchModifySpeedOrder() {
  yield takeLatest(SPEED_ORDER_MODIFY_ORDER, doModifyOrder);
}
