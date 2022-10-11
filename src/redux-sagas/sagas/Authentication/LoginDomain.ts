import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';
import { takeLatest, put } from 'redux-saga/effects';
import config from 'config';
import { login, loadClientData, query, METHOD } from 'utils/socketApi';
import { setKey } from 'utils/asyncStorage';
import { IRequest, IObject } from 'interfaces/common';
import { AUTHENTICATION_LOGIN_DOMAIN, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';
import { goToHome } from 'navigations';

export function reduceUsername(username: string) {
  if (username?.includes('057')) {
    username = username.replace('057', '');
  }

  return username;
}

const loginDomain = async (param: IObject) => {
  if (config.usingNewKisCore) {
    param.username = reduceUsername(param.username as string);
  }

  const clientData = await loadClientData(global.domainSocket);

  const params = {
    grant_type: config.usingNewKisCore === true ? 'password' : 'password_otp',
    client_id: clientData.data.clientId,
    client_secret: clientData.data.clientSecret,
    sec_code: config.domain,
    username: param.username,
    password: param.password,
    mobileLogin: true,
    macAddress: param.macAddress,
    platform: Platform.OS,
    appVersion: param.appVersion,
    osVersion: param.osVersion,
  };

  return login(global.domainSocket, params);
};

const notifyMobileOtp = (params?: IObject) => {
  const uri = 'notifyMobileOtp';

  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doLoginDomain(request: IRequest<IObject>) {
  try {
    request.payload.macAddress = yield DeviceInfo.getMacAddress();

    const response = yield loginDomain(request.payload);
    if (config.usingNewKisCore === false) {
      if (request.payload.rememberUsername === true) {
        setKey('rememberUsername', {
          isStored: true,
          username: reduceUsername(request.payload.username as string),
        });
      } else {
        setKey('rememberUsername', {
          isStored: false,
          username: null,
        });
      }

      yield put({
        type: request.response.success,
        payload: {
          otpIndex: response.data.otpIndex,
          registerMobileOtp: response.data.registerMobileOtp,
        },
      });

      OneSignal.getTags((tags: { [key: string]: string } | null) => {
        if (tags) {
          notifyMobileOtp({
            forceSMS: tags.username !== (request.payload.username as string).toLowerCase(),
          });
        } else {
          notifyMobileOtp({
            forceSMS: true,
          });
        }
      });
    } else {
      if (request.payload.rememberUsername === true) {
        setKey('rememberUsername', {
          isStored: true,
          username: request.payload.username,
        });
      } else {
        setKey('rememberUsername', {
          isStored: false,
          username: null,
        });
      }
      yield put({
        type: request.response.success,
        hideLoading: true,
      });

      goToHome();
    }
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Log In',
        content: error.code ?? error.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchLoginDomain() {
  yield takeLatest(AUTHENTICATION_LOGIN_DOMAIN, doLoginDomain);
}
