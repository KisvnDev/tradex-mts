import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { CHECK_TIME_SUBMIT_ADVANCE_PAYMENT, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import store from 'redux-sagas/store';
import { NOTIFICATION_TYPE } from 'global';

const checkTime = (params: IObject) => {
  const uri = 'services/eqt/checkAdvancePaymentTime';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doCheckTime(request: IRequest<IObject>) {
  try {
    const params = {
      accountNo: store.getState().selectedAccount!.accountNumber,
    };

    const response = yield call(checkTime, params);

    if (!response.data?.result) {
      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.ERROR,
          title: 'Advance Payment Time',
          content: 'Advance Payment Time Checked Failure',
          time: new Date(),
        },
      });
    }

    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
      payload: error,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Advance Payment Time',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchCheckTime() {
  yield takeLatest(CHECK_TIME_SUBMIT_ADVANCE_PAYMENT, doCheckTime);
}
