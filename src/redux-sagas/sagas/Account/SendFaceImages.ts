import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { METHOD } from 'utils/socketApi';
import config from 'config';
import { goToConfirmInfo } from 'navigations';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, SEND_FACE_IMAGES } from 'redux-sagas/actions';

const sendFaceImages = (data: IObject) => {
  const uri = `${((config as unknown) as IObject).baseUrlRegisterAccount}v1/ekyc/face-auth`;
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

function* doSendFaceImages(request: IRequest<IObject>) {
  try {
    const response = yield call(sendFaceImages, request.payload);

    if (response.data === true) {
      yield put({
        type: request.response.success,
        payload: response.data,
        hideLoading: true,
      });
      goToConfirmInfo();
    } else if (response.data === false) {
      throw new Error(response.message);
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
        title: 'Send Face Images',
        content: error,
        time: new Date(),
      },
    });
  }
}

export default function* watchSendFaceImages() {
  yield takeLatest(SEND_FACE_IMAGES, doSendFaceImages);
}
