import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { METHOD } from 'utils/socketApi';
import config from 'config';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, REGISTER_ACCOUNT_FORM } from 'redux-sagas/actions';

const registerAccount = (data: IObject) => {
  const uri = `${((config as unknown) as IObject).baseUrlRegisterAccount}v1/register/step-1`;
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

function* doRegisterAccount(request: IRequest<IObject>) {
  try {
    const response = yield call(registerAccount, request.payload);
    global.registerAccountResendOtp = false;

    if (response.status === 200) {
      yield put({
        type: request.response.success,
        payload: response.data,
        hideLoading: true,
      });
      yield put({
        type: request.response.successTrigger,
      });
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
        title: 'Register Account',
        content: error,
        time: new Date(),
      },
    });
  }
}

export default function* watchRegisterAccount() {
  yield takeLatest(REGISTER_ACCOUNT_FORM, doRegisterAccount);
}
