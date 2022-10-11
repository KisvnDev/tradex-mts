import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { ORDER_KIND, STOP_ORDER_TYPE, NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, DERIVATIVES_ORDER_MODIFY_ORDER } from 'redux-sagas/actions';
import config from 'config';

const modifyOrder = (params: IObject, uri: string) => {
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doModifyOrder(request: IRequest<IObject>) {
  const isNewKisCore = config.usingNewKisCore;
  try {
    let response = null;
    if (request.orderKind === ORDER_KIND.NORMAL_ORDER) {
      const uri = isNewKisCore ? 'services/fno/modifyorder' : 'derivatives/order/modify';

      response = yield call(modifyOrder, request.payload, uri);

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
          content: 'MODIFY_ORDER_SUCCESS',
          contentParams: { orderNumber: request.payload.orderNumber },
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP;
      response = yield call(modifyOrder, request.payload, 'derivatives/order/stop/modify');

      yield put({
        type: request.response.success,
        payload: {
          orderKind: request.orderKind,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        data: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Derivatives Stop Order',
          content: 'MODIFY_STOP_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP_LIMIT;
      response = yield call(
        modifyOrder,
        request.payload,
        config.usingNewKisCore ? 'stopOrder/modify' : 'derivatives/order/stop/modify'
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

export default function* watchModifyOrder() {
  yield takeLatest(DERIVATIVES_ORDER_MODIFY_ORDER, doModifyOrder);
}
