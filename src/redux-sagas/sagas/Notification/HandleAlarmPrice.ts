import { put, takeLatest } from 'redux-saga/effects';
import { formatNumber } from 'utils/common';
import { formatTimeToDisplay } from 'utils/datetime';
import { IRequest } from 'interfaces/common';
import { IAlarmPrice } from 'interfaces/notification';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, NOTIFICATION_ALARM_PRICE } from 'redux-sagas/actions';

function* doHandleAlarmPrice(request: IRequest<IAlarmPrice>) {
  try {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.INFO,
        title: 'Alarm',
        content: 'ALARM_PRICE_NOTIFICATION',
        contentParams: {
          code: request.payload.code,
          value: request.payload.value,
          currentValue: formatNumber(request.payload.currentValue, 2),
          time: formatTimeToDisplay(request.payload.time),
        },

        time: new Date(),
      },
    });
  } catch (err) {
    console.log(err);
  }
}

export default function* watchHandleAlarmPrice() {
  yield takeLatest(NOTIFICATION_ALARM_PRICE, doHandleAlarmPrice);
}
