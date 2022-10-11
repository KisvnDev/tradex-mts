import KeepAwake from 'react-native-keep-awake';
import { call, put, takeLatest } from 'redux-saga/effects';
import { SCChannel } from 'sc-channel';
import { goToAuth } from 'navigations';
import { logout } from 'utils/socketApi';
import { removeKey } from 'utils/asyncStorage';
import { IRequest, IObject } from 'interfaces/common';
import { OTP_TOKEN_FOR_NEW_KIS_CORE, SESSION_TIME_KEY, VIEW_MODE_KEY } from 'global';
import { AUTHENTICATION_SIGNOUT, COMMON_TOGGLE_LOADING } from 'redux-sagas/actions';
import { RESET_REDUCER } from 'redux-sagas/reducers';
import { GLOBAL_ACCOUNT_INFO } from 'redux-sagas/global-reducers/AccountInfo-reducers';
import config from 'config';

const revokeDomainToken = () => {
  return logout(global.domainSocket, {});
};

function* doSignOut(request: IRequest<IObject>) {
  try {
    yield call(revokeDomainToken);

    if (global.domainSocket.domainChannels) {
      global.domainSocket.domainChannels.forEach((channel: SCChannel) => {
        channel.unwatch();
        channel.unsubscribe();
      });
      global.domainSocket.domainChannels = [];
    }
  } catch (err) {
  } finally {
    yield global.domainSocket.deauthenticate();
    if (config.usingNewKisCore === true) {
      removeKey(OTP_TOKEN_FOR_NEW_KIS_CORE);
    }
    removeKey(VIEW_MODE_KEY);
    removeKey(SESSION_TIME_KEY);
    global.OTPTokenMatrix = null;

    yield put({
      type: RESET_REDUCER,
    });

    yield put({
      type: GLOBAL_ACCOUNT_INFO,
      payload: null,
    });
    yield put({
      type: COMMON_TOGGLE_LOADING,
      hideLoading: true,
    });
    KeepAwake.deactivate();

    goToAuth();
  }
}

export default function* watchSignOut() {
  yield takeLatest(AUTHENTICATION_SIGNOUT, doSignOut);
}
