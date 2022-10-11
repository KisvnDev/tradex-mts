import { call, takeLatest, put } from 'redux-saga/effects';
import { IRequest, IObject } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, RESET_PASSWORD } from '../../actions';
import { RESET_PASSWORD_FAIlED, RESET_PASSWORD_SUCCESS } from 'screens/ForgotPassword/actions';
import { METHOD, query } from 'utils/socketApi';
import { NOTIFICATION_TYPE } from 'global';

const callResetPassword = (params: any) => {
  return query(global.domainSocket, 'resetPassword', METHOD.POST, params);
};

function* resetPassword(request: IRequest<IObject>) {
  try {
    const params = { ...(request.payload ?? {}) };

    yield call(callResetPassword, params);

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Reset password',
        content: 'Reset password success',
        time: new Date(),
      },
    });

    yield put({
      type: RESET_PASSWORD_SUCCESS,
      payload: { isSuccess: true },
      hideLoading: true,
    });
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Reset password',
        content: error.code ? error.code : 'Reset password wrong',
        time: new Date(),
      },
    });
    yield put({
      type: RESET_PASSWORD_FAIlED,
      payload: error,
      hideLoading: true,
    });
  }
}

export function* watchResetPassword() {
  yield takeLatest(RESET_PASSWORD, resetPassword);
}
