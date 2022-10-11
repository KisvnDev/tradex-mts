import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { METHOD } from 'utils/socketApi';
import config from 'config';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, GET_FACE_ACTION } from 'redux-sagas/actions';
import store from 'redux-sagas/store';

const getFaceAction = () => {
  const uri = `${((config as unknown) as IObject).baseUrlRegisterAccount}v1/ekyc/face-auth/actions/${
    store.getState().registerAccountForm!.draft_id
  }`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: METHOD.GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (result) => {
        resolve(JSON.parse(await result.text()));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function* doGetFaceAction(request: IRequest<null>) {
  try {
    const response = yield call(getFaceAction);

    if (response.status === 200) {
      yield put({
        type: request.response.success,
        payload: response.data,
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
        title: 'Get Face Action',
        content: error,
        time: new Date(),
      },
    });
  }
}

export default function* watchGetFaceAction() {
  yield takeLatest(GET_FACE_ACTION, doGetFaceAction);
}
