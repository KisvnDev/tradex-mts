import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { BUSINESS_INFO_QUERY_BUSINESS_INFO, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const queryBusinessInfo = (params: IObject) => {
  const uri = 'businessInfo';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryBusinessInfo(request: IRequest<IObject>) {
  try {
    const response = yield call(queryBusinessInfo, request.payload);
    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Business Info',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryBusinessInfo() {
  yield takeLatest(BUSINESS_INFO_QUERY_BUSINESS_INFO, doQueryBusinessInfo);
}
