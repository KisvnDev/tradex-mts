import { IObject } from 'interfaces/common';
import { ALARM_GET_ALARM_SETTINGS, ALARM_DELETE_ALARM_SETTING } from 'redux-sagas/actions';
import { ALARM_LIST_QUERY_SUCCESS, ALARM_LIST_QUERY_FAILED } from './reducers';

export const getAlarmList = () => ({
  type: ALARM_GET_ALARM_SETTINGS,
  response: {
    success: ALARM_LIST_QUERY_SUCCESS,
    failure: ALARM_LIST_QUERY_FAILED,
  },
});

export const deleteAlarmSetting = (payload: IObject) => ({
  type: ALARM_DELETE_ALARM_SETTING,
  payload,
  showLoading: true,
});
