import { takeLatest, put } from 'redux-saga/effects';
import { METHOD, query } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { NOTIFICATION_MOBILE_OTP, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const notifyMobileOtp = (params?: IObject) => {
  const uri = 'notifyMobileOtpKisTtl';

  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doNotifyCard(request: IRequest<IObject>) {
  try {
    yield notifyMobileOtp(request.payload);

    yield put({
      type: request.response.success,
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Generate Kis Card',
        content: error.code ?? error.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchNotifyCard() {
  yield takeLatest(NOTIFICATION_MOBILE_OTP, doNotifyCard);
}
