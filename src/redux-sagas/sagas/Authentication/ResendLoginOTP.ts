import OneSignal from 'react-native-onesignal';
import { takeLatest, put } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { RESEND_LOGIN_OTP, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const notifyMobileOtp = (params?: IObject) => {
  const uri = 'notifyMobileOtp';

  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doResendLoginOtp(request: IRequest<IObject>) {
  try {
    yield put({
      type: request.response.success,
      hideLoading: true,
    });
    if (request.payload.forceSMS === true) {
      notifyMobileOtp({ forceSMS: true });
    } else {
      OneSignal.getTags((tags: { [key: string]: string } | null) => {
        if (tags) {
          notifyMobileOtp({ forceSMS: tags.username !== (request.payload.username as string).toLowerCase() });
        } else {
          notifyMobileOtp();
        }
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
        title: 'Resend login otp',
        content: 'Resend failed',
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchResendLoginOtp() {
  yield takeLatest(RESEND_LOGIN_OTP, doResendLoginOtp);
}
