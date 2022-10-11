import OneSignal from 'react-native-onesignal';
import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, REGISTER_BIOMETRIC } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';
import config from 'config';

const registerBiometric = (params: IObject) => {
  const uri = 'biometricRegister';
  return query(global.domainSocket, uri, METHOD.POST, params);
};

const notifyMobileOtp = (params: IObject) => {
  const uri = 'notifyBiometricMobileOtp';

  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doRegisterBiometric(request: IRequest<IObject>) {
  try {
    const response = yield call(registerBiometric, request.payload);
    yield put({
      type: request.response.success,
      payload: response.data,
    });
    const param = {
      biometricId: response.data.biometricId,
    };

    if (config.usingNewKisCore) {
      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Verify OTP',
          content: 'Register biomtric successfully',
          time: new Date(),
        },
      });
    } else {
      OneSignal.getTags(() => {
        notifyMobileOtp(param);
      });
    }
  } catch (error) {
    yield put({
      type: request.response.failure,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Verify password',
        content: error.code ?? error.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchRegisterBiometric() {
  yield takeLatest(REGISTER_BIOMETRIC, doRegisterBiometric);
}
