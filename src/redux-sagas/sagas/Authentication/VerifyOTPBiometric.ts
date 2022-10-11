import { call, put, takeLatest } from 'redux-saga/effects';
import { METHOD, query } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { AUTHENTICATION_VERIFY_OTP_BIOMETRIC, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const callVerifyOTPBiometric = (param: IObject) => {
  const uri = 'verifyBiometricOtp';
  return query(global.domainSocket, uri, METHOD.POST, param);
};

function* doVerifyOTPBiometric(request: IRequest<IObject>) {
  try {
    yield call(callVerifyOTPBiometric, request.payload);

    yield put({
      type: request.response.success,
      hideLoading: true,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Verify OTP',
        content: 'Register biomtric successfully',
        time: new Date(),
      },
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
      hideLoading: true,
      payloads: {
        error,
      },
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Verify OTP',
        content: error.code ?? error.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchVerifyOTPBiometric() {
  yield takeLatest(AUTHENTICATION_VERIFY_OTP_BIOMETRIC, doVerifyOTPBiometric);
}
