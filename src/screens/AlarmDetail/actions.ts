import { IAlarm } from 'interfaces/common';
import { ALARM_ADD_ALARM_SETTING, ALARM_UPDATE_ALARM_SETTING } from 'redux-sagas/actions';

export const addAlarmSetting = (payload: IAlarm) => ({
  type: ALARM_ADD_ALARM_SETTING,
  payload,
  showLoading: true,
});

export const updateAlarmSetting = (payload: IAlarm) => ({
  type: ALARM_UPDATE_ALARM_SETTING,
  payload,
  showLoading: true,
});
