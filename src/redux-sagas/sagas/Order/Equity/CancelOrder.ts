import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { ORDER_KIND, STOP_ORDER_TYPE, NOTIFICATION_TYPE } from 'global';
import { ORDER_CANCEL_ORDER, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import config from 'config';

const cancelOrder = (params: IObject, uri: string) => {
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doCancelOrder(request: IRequest<IObject>) {
  try {
    if (request.orderKind === ORDER_KIND.NORMAL_ORDER) {
      const res = yield call(
        cancelOrder,
        request.payload,
        config.usingNewKisCore === false ? 'equity/order/cancel' : 'services/eqt/cancelOrder'
      );

      if (res.data?.length > 0) {
        const data = res.data?.find(function (el: any) {
          return !el.success;
        });

        if (data) {
          yield put({
            type: COMMON_SHOW_NOTIFICATION,
            payload: {
              type: NOTIFICATION_TYPE.ERROR,
              title: request.orderKind,
              content: data?.rejectCause || 'Cancel not allow !',
              time: new Date(),
            },
            hideLoading: true,
          });

          return;
        }
      }

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
          content: 'CANCEL_ORDER_SUCCESS',
          contentParams: { orderNumber: request.payload.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_ORDER) {
      if (config.usingNewKisCore === false) {
        request.payload.orderType = STOP_ORDER_TYPE.STOP;
      }
      yield call(
        cancelOrder,
        request.payload,
        config.usingNewKisCore === false ? 'equity/order/stop/cancel' : 'stopOrder/cancel'
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
          content: 'CANCEL_STOP_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
      if (config.usingNewKisCore === false) {
        request.payload.orderType = STOP_ORDER_TYPE.STOP_LIMIT;
      }
      yield call(
        cancelOrder,
        request.payload,
        config.usingNewKisCore === false ? 'equity/order/stop/cancel' : 'stopOrder/cancel'
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
          content: 'CANCEL_STOP_LIMIT_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.ADVANCE_ORDER) {
      yield call(cancelOrder, request.payload, 'equity/order/advance/cancel');

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
          title: 'Advance Order',
          content: 'CANCEL_ADVANCE_ORDER_SUCCESS',
          contentParams: { orderNumber: request.payload.tempOrderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.ODDLOT_ORDER) {
      yield call(cancelOrder, request.payload, 'equity/order/oddlot/cancel');

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
          content: 'CANCEL_ODDLOT_ORDER_SUCCESS',
          contentParams: { stockCode: request.payload.orderNumber },
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
  yield takeLatest(ORDER_CANCEL_ORDER, doCancelOrder);
}
