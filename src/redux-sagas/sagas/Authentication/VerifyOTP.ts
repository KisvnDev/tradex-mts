import { call, put, takeLatest } from 'redux-saga/effects';
import { goToHome } from 'navigations';
import { METHOD, query, verifyOTP } from 'utils/socketApi';
import { removeKey, setKey } from 'utils/asyncStorage';
import { IRequest, IObject } from 'interfaces/common';
import { AUTHENTICATION_VERIFY_OTP, COMMON_SHOW_NOTIFICATION, TOGGLE_BANNER } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE, OTP_TOKEN_FOR_NEW_KIS_CORE, SESSION_TIME_KEY } from 'global';
import config from 'config';

const callVerifyOTP = (param: IObject) => {
  if (config.usingNewKisCore === false) {
    const params = {
      otp_value: param.otpValue,
      mobile_otp: param.mobileOTP,
    };

    return verifyOTP(global.domainSocket, params);
  } else {
    const uri = 'verifyAndSaveOTP';
    return query(global.domainSocket, uri, METHOD.POST, param);
  }
};

function* doVerifyOTP(request: IRequest<IObject>) {
  try {
    const response = yield call(callVerifyOTP, request.payload);

    global.viewMode = false;
    if (config.usingNewKisCore === true) {
      setKey(OTP_TOKEN_FOR_NEW_KIS_CORE, response.data.otpToken);
      global.OTPTokenMatrix = response.data.otpToken;
    }

    yield put({
      type: request.response.success,
      hideLoading: true,
    });

    setKey(SESSION_TIME_KEY, new Date().getTime());
    yield put({
      type: TOGGLE_BANNER,
      payload: true,
    });
    if (config.usingNewKisCore === false) {
      goToHome();
    }
  } catch (error) {
    global.OTPTokenMatrix = null;
    removeKey(OTP_TOKEN_FOR_NEW_KIS_CORE);

    yield put({
      type: request.response.failure,
      hideLoading: true,
      payload: {
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

export default function* watchVerifyOTP() {
  yield takeLatest(AUTHENTICATION_VERIFY_OTP, doVerifyOTP);
}
