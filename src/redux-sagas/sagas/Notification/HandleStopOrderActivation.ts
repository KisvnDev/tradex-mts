import { put, takeLatest } from 'redux-saga/effects';
import i18n from 'i18next';
import { formatNumber, upperFirstLetter } from 'utils/common';
import { formatTimeToDisplay } from 'utils/datetime';
import { IRequest } from 'interfaces/common';
import { IStopOrderActivation } from 'interfaces/notification';
import { COMMON_SHOW_NOTIFICATION, NOTIFICATION_STOP_ORDER_ACTIVATION } from 'redux-sagas/actions';
import { STOP_ORDER_STATUS, NOTIFICATION_TYPE } from 'global';

function* doHandleStopOrderActivation(request: IRequest<IStopOrderActivation>) {
  try {
    if (request.payload.status === STOP_ORDER_STATUS.COMPLETED) {
      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.INFO,
          title: 'Stop Order Activation',
          content: 'STOP_ORDER_ACTIVATION_NOTIFICATION',
          contentParams: {
            orderNumber: request.payload.orderNumber,
            orderQuantity: request.payload.orderQuantity,
            orderPrice: formatNumber(request.payload.orderPrice, 2),
            code: request.payload.code,
            time: formatTimeToDisplay(request.payload.time),
            sellBuyType: i18n.t(upperFirstLetter(request.payload.sellBuyType)),
          },

          time: new Date(),
        },
      });
    } else {
      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.ERROR,
          title: 'Stop Order Activation',
          content: 'STOP_ORDER_ACTIVATION_FAILED_NOTIFICATION',
          contentParams: {
            code: request.payload.code,
            failedReason: i18n.t(request.payload.failedReason),
            time: formatTimeToDisplay(request.payload.time),
            sellBuyType: i18n.t(upperFirstLetter(request.payload.sellBuyType)),
          },

          time: new Date(),
        },
      });
    }
  } catch (err) {}
}

export default function* watchHandleStopOrderActivation() {
  yield takeLatest(NOTIFICATION_STOP_ORDER_ACTIVATION, doHandleStopOrderActivation);
}
