import { put, takeLatest, call } from 'redux-saga/effects';
import { IRequest } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { ALARM_GET_ALARM_SETTINGS } from 'redux-sagas/actions';

const getAlarmList = () => {
  const uri = 'alarm';
  return query(global.domainSocket, uri, METHOD.GET);
};

function* doGetAlarmList(request: IRequest<null>) {
  try {
    const response = yield call(getAlarmList);
    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (err) {
    yield put({
      type: request.response.failure,
    });
  }
}

export default function* watchGetAlarmList() {
  yield takeLatest(ALARM_GET_ALARM_SETTINGS, doGetAlarmList);
}
