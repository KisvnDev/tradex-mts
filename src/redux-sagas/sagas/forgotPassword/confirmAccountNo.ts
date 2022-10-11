import { call, takeLatest, put } from 'redux-saga/effects';
import { IRequest, IObject } from 'interfaces/common';
import { COMFIRM_ACCOUNT_NO, COMMON_SHOW_NOTIFICATION } from '../../actions';
import { COMFIRM_ACCOUNT_NO_SUCCESS, COMFIRM_ACCOUNT_NO_FAIlED } from 'screens/ForgotPassword/actions';
import { METHOD, query } from 'utils/socketApi';
import { NOTIFICATION_TYPE } from 'global';

const callConfirmAccountNo = (params: any) => {
  return query(global.domainSocket, 'resetPassword/verifyIdentity', METHOD.POST, params);
};

function* confirmAccountNo(request: IRequest<IObject>) {
  try {
    const params = { ...(request.payload ?? {}) };

    const response = yield call(callConfirmAccountNo, params);

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Confirm Account and Card ID',
        content: 'Check otp on your phone',
        time: new Date(),
      },
    });

    yield put({
      type: COMFIRM_ACCOUNT_NO_SUCCESS,
      payload: response.data,
      hideLoading: true,
    });
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Confirm Account and Card ID',
        content: error.code ? error.code : 'Account or ID Card not right !',
        time: new Date(),
      },
    });
    yield put({
      type: COMFIRM_ACCOUNT_NO_FAIlED,
      payload: error,
      hideLoading: true,
    });
  }
}

export function* watchConfirmAccountNo() {
  yield takeLatest(COMFIRM_ACCOUNT_NO, confirmAccountNo);
}
