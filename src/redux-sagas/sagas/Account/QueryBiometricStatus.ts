import { call, put, takeLatest } from 'redux-saga/effects';
import { METHOD, query } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, QUERY_USING_BIOMETRIC_STATUS } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const queryBiometricStatus = (param: IObject) => {
  const uri = 'queryBiometricStatus';
  return query(global.domainSocket, uri, METHOD.GET, param);
};

function* doQueryBiometricStatus(request: IRequest<IObject>) {
  try {
    const response = yield call(queryBiometricStatus, request.payload);
    yield put({
      type: request.response.success,
      payload: response.data.isEnable,
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Biometric Status',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryBiometricStatus() {
  yield takeLatest(QUERY_USING_BIOMETRIC_STATUS, doQueryBiometricStatus);
}
