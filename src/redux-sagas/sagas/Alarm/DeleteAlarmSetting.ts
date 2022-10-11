import { put, takeLatest, call } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { IRequest, IObject } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { NOTIFICATION_TYPE } from 'global';
import { ALARM_DELETE_ALARM_SETTING, COMMON_SHOW_NOTIFICATION, ALARM_GET_ALARM_SETTINGS } from 'redux-sagas/actions';
import { ALARM_LIST_QUERY_SUCCESS, ALARM_LIST_QUERY_FAILED } from 'screens/AlarmList/reducers';

const deleteAlarmSetting = (params: IObject) => {
  const uri = 'alarm';
  return query(global.domainSocket, uri, METHOD.DELETE, params);
};

function* doDeleteAlarmSetting(request: IRequest<IObject>) {
  try {
    if (request.payload && request.payload.items && (request.payload.items as object[]).length > 0) {
      yield call(deleteAlarmSetting, request.payload);

      store.dispatch({
        type: ALARM_GET_ALARM_SETTINGS,
        response: {
          success: ALARM_LIST_QUERY_SUCCESS,
          failure: ALARM_LIST_QUERY_FAILED,
        },
        hideLoading: true,
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Delete Alarm Setting',
          content: 'DELETE_ALARM_SUCCESS',
          time: new Date(),
        },
        hideLoading: true,
      });
    }
  } catch (err) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Delete Alarm Setting',
        content: err.code ?? err.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchDeleteAlarmSetting() {
  yield takeLatest(ALARM_DELETE_ALARM_SETTING, doDeleteAlarmSetting);
}
