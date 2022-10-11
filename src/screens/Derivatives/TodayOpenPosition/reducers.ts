import { IAction, IObject } from 'interfaces/common';

export const DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION_SUCCESS =
  'DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION_SUCCESS';

export function DerivativesTodayOpenPosition(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
