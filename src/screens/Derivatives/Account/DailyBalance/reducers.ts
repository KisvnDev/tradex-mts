import { IAction, IObject } from 'interfaces/common';

export const DERIVATIVES_ACCOUNT_QUERY_DAILY_BALANCE_SUCCESS = 'DERIVATIVES_ACCOUNT_QUERY_DAILY_BALANCE_SUCCESS';

export function DerivativesDailyBalance(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_ACCOUNT_QUERY_DAILY_BALANCE_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
