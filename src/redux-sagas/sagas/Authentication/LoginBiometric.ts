import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { takeLatest, put } from 'redux-saga/effects';
import config from 'config';
import { loadClientData, login } from 'utils/socketApi';
import { setKey } from 'utils/asyncStorage';
import { IRequest, IObject } from 'interfaces/common';
import { goToHome } from 'navigations';
import {
  AUTHENTICATION_LOGIN_BIOMETRIC,
  COMMON_SHOW_NOTIFICATION,
  BIOMETRIC_VERIFICATION_FAILED_TRIGGER,
  BIOMETRIC_VERIFICATION_FAILED_TYPE,
  TOGGLE_BANNER,
} from 'redux-sagas/actions';
import { BIOMETRIC_FAILED_TYPE, NOTIFICATION_TYPE } from 'global';

const loginBiometric = async (param: IObject) => {
  const clientData = await loadClientData(global.domainSocket);

  const params = {
    client_id: clientData.data.clientId,
    client_secret: clientData.data.clientSecret,
    sec_code: config.domain,
    username: param.username,
    signatureValue: param.signatureValue,
    grant_type: 'biometric',
    macAddress: param.macAddress,
    platform: Platform.OS,
    osVersion: param.osVersion,
    appVersion: param.appVersion,
  };
  return login(global.domainSocket, params);
};

function* doLoginBiometric(request: IRequest<IObject>) {
  try {
    request.payload.macAddress = yield DeviceInfo.getMacAddress();

    global.viewMode = false;

    yield loginBiometric(request.payload);
    setKey('rememberUsername', {
      isStored: true,
      username: request.payload.username,
    });

    yield put({
      type: request.response.success,
    });
    yield put({
      type: TOGGLE_BANNER,
      payload: true,
    });
    goToHome();
  } catch (error) {
    console.log('error', error.message);
    if (
      error.message === BIOMETRIC_FAILED_TYPE.LOGIN_BIOMETRIC_PASSWORD_NOT_MATCH ||
      error.message === BIOMETRIC_FAILED_TYPE.LOGIN_BIOMETRIC_SIGNATURE_VERIFICATION_FAILED
    ) {
      yield put({
        type: BIOMETRIC_VERIFICATION_FAILED_TRIGGER,
        hideLoading: true,
      });
      yield put({
        type: BIOMETRIC_VERIFICATION_FAILED_TYPE,
        payload: error.message,
        hideLoading: true,
      });
    } else {
      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.ERROR,
          title: 'Log In Biometric',
          content: error.code ?? error.message,
          time: new Date(),
        },
        hideLoading: true,
      });
    }
  }
}

export default function* watchLoginBiometric() {
  yield takeLatest(AUTHENTICATION_LOGIN_BIOMETRIC, doLoginBiometric);
}
