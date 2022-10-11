import { put, takeLatest, call } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import config from 'config';
import { IObject, IRequest } from 'interfaces/common';
import { ORDER_KIND, STOP_ORDER_TYPE, NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, SPEED_ORDER_MOVE_ORDER } from 'redux-sagas/actions';

const modifyOrder = (params: IObject, uri: string) => {
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doMoveSpeedOrder(request: IRequest<IObject>) {
  const isUsingNewKisCore = config.usingNewKisCore;
  try {
    if (request.orderKind === ORDER_KIND.NORMAL_ORDER) {
      const uri = config.usingNewKisCore ? 'services/speedOrder/modify' : 'equity/order/modify/all';

      yield call(modifyOrder, request.payload, uri);

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
          content: 'MOVE_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP;
      const uri = isUsingNewKisCore ? 'stopOrder/speedModify' : 'equity/order/stop/modify';

      yield call(modifyOrder, request.payload, uri);

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
          title: 'Order',
          content: 'MOVE_STOP_ORDER_SUCCESS',
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

export default function* watchMoveSpeedOrder() {
  yield takeLatest(SPEED_ORDER_MOVE_ORDER, doMoveSpeedOrder);
}
