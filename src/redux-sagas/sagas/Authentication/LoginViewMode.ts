import { put, takeLatest } from 'redux-saga/effects';
import { goToHome } from 'navigations';
import { setKey } from 'utils/asyncStorage';
import { IRequest, IObject } from 'interfaces/common';
import { AUTHENTICATION_LOGIN_VIEW_MODE, TOGGLE_BANNER } from 'redux-sagas/actions';
import { VIEW_MODE_KEY, NOTIFICATION_TYPE, VIEW_MODE_USERNAME } from 'global';
import { COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';

function* doLoginViewMode(request: IRequest<IObject>) {
  try {
    const accessToken = global.domainSocket.authToken.accessToken;

    yield put({
      type: request.response.success,
      hideLoading: true,
    });

    setKey(VIEW_MODE_KEY, accessToken);
    setKey(VIEW_MODE_USERNAME, request.payload.username as string);

    global.viewMode = true;
    global.username = request.payload.username as string;
    yield put({
      type: TOGGLE_BANNER,
      payload: true,
    });
    goToHome();
  } catch (error) {
    yield put({
      type: request.response.failure,
      hideLoading: true,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Login View Mode',
        content: error.code ?? error.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchLoginViewMode() {
  yield takeLatest(AUTHENTICATION_LOGIN_VIEW_MODE, doLoginViewMode);
}
