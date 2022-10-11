import { IAction, IAlarm } from 'interfaces/common';

export const ALARM_LIST_QUERY_SUCCESS = 'ALARM_LIST_QUERY_SUCCESS';
export const ALARM_LIST_QUERY_FAILED = 'ALARM_LIST_QUERY_FAILED';

export function AlarmList(state: IAlarm[] = [], action: IAction<IAlarm[]>) {
  switch (action.type) {
    case ALARM_LIST_QUERY_SUCCESS:
      return action.payload ? action.payload.slice(0) : [];
    default:
      return state;
  }
}
