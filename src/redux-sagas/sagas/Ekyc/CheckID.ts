import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { CHECK_ID, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const ekycCheckID = (params: IObject) => {
  const uri = 'equity/account/checkNationalId';
  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doEkycCheckID(request: IRequest<IObject>) {
  try {
    yield call(ekycCheckID, request.payload);
    yield put({
      type: request.response.success,
      payload: true,
      hideLoading: true,
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
      hideLoading: true,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Check ID',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchEkycCheckID() {
  yield takeLatest(CHECK_ID, doEkycCheckID);
}
