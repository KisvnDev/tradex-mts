import { put, takeLatest, call } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { NOTIFICATION_TYPE } from 'global';
import { ALARM_UPDATE_ALARM_SETTING, COMMON_SHOW_NOTIFICATION, ALARM_GET_ALARM_SETTINGS } from 'redux-sagas/actions';
import { ALARM_LIST_QUERY_SUCCESS, ALARM_LIST_QUERY_FAILED } from 'screens/AlarmList/reducers';

const updateAlarmSetting = (params: IObject) => {
  const uri = 'alarm/{alarmId}';
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doUpdateAlarmSetting(request: IRequest<IObject>) {
  try {
    yield call(updateAlarmSetting, request.payload);

    store.dispatch({
      type: ALARM_GET_ALARM_SETTINGS,
      response: {
        success: ALARM_LIST_QUERY_SUCCESS,
        failure: ALARM_LIST_QUERY_FAILED,
      },
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Update Alarm Setting',
        content: 'UPDATE_ALARM_SUCCESS',
        time: new Date(),
      },
      hideLoading: true,
    });
  } catch (err) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Update Alarm Setting',
        content: err.code ?? err.message,
        time: new Date(),
        hideLoading: true,
      },
    });
  }
}

export default function* watchUpdateAlarmSetting() {
  yield takeLatest(ALARM_UPDATE_ALARM_SETTING, doUpdateAlarmSetting);
}
