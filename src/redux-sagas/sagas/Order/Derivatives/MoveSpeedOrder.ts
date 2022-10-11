import { put, takeLatest, call } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { ORDER_KIND, STOP_ORDER_TYPE, NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, SPEED_ORDER_MOVE_DERIVATIVES_ORDER } from 'redux-sagas/actions';
import config from 'config';

const modifyOrder = (params: IObject, uri: string) => {
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doMoveSpeedOrder(request: IRequest<IObject>) {
  try {
    if (request.orderKind === ORDER_KIND.NORMAL_ORDER) {
      yield call(
        modifyOrder,
        request.payload,
        config.usingNewKisCore ? 'services/speedOrder/modify' : 'derivatives/order/modify/all'
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
          title: 'Derivatives Order',
          content: 'MOVE_ORDER_SUCCESS',
          time: new Date(),
        },
      });
    } else if (request.orderKind === ORDER_KIND.STOP_ORDER) {
      request.payload.orderType = STOP_ORDER_TYPE.STOP;
      yield call(
        modifyOrder,
        request.payload,
        config.usingNewKisCore ? 'stopOrder/speedModify' : 'derivatives/order/stop/modify/all'
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
          title: 'Derivatives Order',
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
  yield takeLatest(SPEED_ORDER_MOVE_DERIVATIVES_ORDER, doMoveSpeedOrder);
}
