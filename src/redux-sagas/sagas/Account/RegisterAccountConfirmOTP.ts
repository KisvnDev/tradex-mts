import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { METHOD } from 'utils/socketApi';
import config from 'config';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, REGISTER_ACCOUNT_CONFIRM_OTP } from 'redux-sagas/actions';

const registerAccountConfirmOTP = (data: IObject) => {
  const uri = `${((config as unknown) as IObject).baseUrlRegisterAccount}v1/otp/confirm`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: METHOD.POST,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async (result) => {
        resolve(JSON.parse(await result.text()));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function* doRegisterAccountConfirmOTP(request: IRequest<IObject>) {
  try {
    const response = yield call(registerAccountConfirmOTP, request.payload);

    if (response.status === 200) {
      if (response.data === true) {
        yield put({
          type: request.response.success,
          hideLoading: true,
        });
      } else {
        throw new Error('WRONG_OTP');
      }
    } else {
      if (response.error != null && response.error[0] != null) {
        throw new Error(response.errors[0]);
      } else {
        throw new Error(response.message);
      }
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
        title: 'Confirm OTP Register Account',
        content: error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchRegisterAccountConfirmOTP() {
  yield takeLatest(REGISTER_ACCOUNT_CONFIRM_OTP, doRegisterAccountConfirmOTP);
}
