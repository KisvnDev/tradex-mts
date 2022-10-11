import { put, takeLatest } from 'redux-saga/effects';
import i18n from 'i18next';
import { formatNumber, upperFirstLetter } from 'utils/common';
import { formatTimeToDisplay } from 'utils/datetime';
import { IRequest } from 'interfaces/common';
import { IOrderMatch } from 'interfaces/notification';
import { NOTIFICATION_TYPE } from 'global';
import { NOTIFICATION_ORDER_MATCH, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';

function* doHandleOrderMatch(request: IRequest<IOrderMatch>) {
  try {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.INFO,
        title: 'Order Matching',
        content: 'ORDER_MATCHING_NOTIFICATION',
        contentParams: {
          orderNumber: request.payload.orderNumber,
          matchQuantity: request.payload.matchQuantity,
          matchPrice: formatNumber(request.payload.matchPrice, 2),
          code: request.payload.code,
          time: formatTimeToDisplay(request.payload.time, 'HH:mm:ss', 'HHmmss'),
          sellBuyType: i18n.t(upperFirstLetter(request.payload.sellBuyType)),
        },

        time: new Date(),
      },
    });
  } catch (err) {
    console.log(err);
  }
}

export default function* watchHandleOrderMatch() {
  yield takeLatest(NOTIFICATION_ORDER_MATCH, doHandleOrderMatch);
}
