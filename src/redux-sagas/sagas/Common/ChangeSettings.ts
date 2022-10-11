import { put, takeLatest, call } from 'redux-saga/effects';
import { setKey } from 'utils/asyncStorage';
import { query, METHOD } from 'utils/socketApi';
import { GLOBAL_USER_EXTRA_INFO } from 'redux-sagas/global-reducers/UserInfo-reducers';
import { SETTINGS_CHANGE_SETTINGS } from 'redux-sagas/actions';
import { IRequest, IObject } from 'interfaces/common';
import store from 'redux-sagas/store';

const registerMobileOTP = () => {
  const uri = 'registerMobileOtp';
  return query(global.domainSocket, uri, METHOD.POST, {});
};

const unregisterMobileOTP = () => {
  const uri = 'unregisterMobileOtp';
  return query(global.domainSocket, uri, METHOD.POST, {});
};

function* doChangeSettings(request: IRequest<IObject>) {
  try {
    const userExtraInfo = store.getState().userExtraInfo;

    if (userExtraInfo.settings == null) {
      userExtraInfo.settings = {
        autoLockPrevention: false,
        usingTouchFaceId: false,
        loginSession: 30,
      };
    }

    if (request.payload) {
      if (request.payload.autoLockPrevention != null) {
        userExtraInfo.settings.autoLockPrevention = request.payload.autoLockPrevention as boolean;
      }

      if (request.payload.usingTouchFaceId != null) {
        userExtraInfo.settings.usingTouchFaceId = request.payload.usingTouchFaceId as boolean;
      }

      if (request.payload.loginSession != null) {
        userExtraInfo.settings.loginSession = request.payload.loginSession as number;
      }

      if (request.payload.usingMobileOTP != null) {
        userExtraInfo.settings.usingMobileOTP = request.payload.usingMobileOTP as boolean;

        if (request.payload.usingMobileOTP === true) {
          yield call(registerMobileOTP);
        } else {
          yield call(unregisterMobileOTP);
        }
      }
    }

    yield put({
      type: GLOBAL_USER_EXTRA_INFO,
      payload: userExtraInfo,
    });

    if (store.getState().userInfo) {
      setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
    }
  } catch (err) {
    //todo
  }
}

export default function* watchChangeSettings() {
  yield takeLatest(SETTINGS_CHANGE_SETTINGS, doChangeSettings);
}
