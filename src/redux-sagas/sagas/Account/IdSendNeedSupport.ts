import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { METHOD } from 'utils/socketApi';
import config from 'config';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, SEND_NEED_SUPPORT } from 'redux-sagas/actions';

const idSendNeedSupport = (data: IObject) => {
  const uri = `${((config as unknown) as IObject).baseUrlRegisterAccount}/v1/supports`;
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

function* doIdSendNeedSupport(request: IRequest<IObject>) {
  try {
    const response = yield call(idSendNeedSupport, request.payload);

    if (response.data === true) {
      yield put({
        type: request.response.success,
        hideLoading: true,
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
        title: 'Support',
        content: error,
        time: new Date(),
      },
    });
  }
}

export default function* watchIdSendNeedSupport() {
  yield takeLatest(SEND_NEED_SUPPORT, doIdSendNeedSupport);
}
