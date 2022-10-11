import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { METHOD } from 'utils/socketApi';
import config from 'config';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, SEND_ID_IMAGE, GET_FACE_ACTION } from 'redux-sagas/actions';
import { GET_FACE_ACTION_FAILED, GET_FACE_ACTION_SUCCESS } from 'screens/FacePhase/reducers';

const sendIdImage = async (data: IObject) => {
  const uri = `${((config as unknown) as IObject).baseUrlRegisterAccount}v1/ekyc/ocr/card`;
  const formData = new FormData();
  formData.append('front', ({
    uri: data.front,
    name: data.frontName,
    type: 'image/png',
  } as unknown) as Blob);
  formData.append('back', ({
    uri: data.back,
    name: data.backName,
    type: 'image/png',
  } as unknown) as Blob);
  formData.append('ref', data.ref as string);

  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: METHOD.POST,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(async (result) => {
        resolve(JSON.parse(await result.text()));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function* doSendIdImage(request: IRequest<IObject>) {
  try {
    const response = yield call(sendIdImage, request.payload);
    if (response.status === 200) {
      if (response.data.userData == null) {
        throw new Error('Cannot read image please try again');
      } else if (response.error != null) {
        yield put({
          type: request.response.success,
          payload: { ...response.data, main_score: response.score, errorContent: response.error },
          hideLoading: true,
        });
        yield put({
          type: GET_FACE_ACTION,
          response: {
            success: GET_FACE_ACTION_SUCCESS,
            failure: GET_FACE_ACTION_FAILED,
          },
          showLoading: true,
        });
      } else {
        yield put({
          type: request.response.success,
          payload: { ...response.data, main_score: response.score },
          hideLoading: true,
        });
        yield put({
          type: GET_FACE_ACTION,
          response: {
            success: GET_FACE_ACTION_SUCCESS,
            failure: GET_FACE_ACTION_FAILED,
          },
          showLoading: true,
        });
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
        title: 'Send Id Images',
        content: error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchSendIdImage() {
  yield takeLatest(SEND_ID_IMAGE, doSendIdImage);
}
