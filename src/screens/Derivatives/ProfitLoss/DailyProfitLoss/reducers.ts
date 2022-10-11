import { IAction, IObject } from 'interfaces/common';

export const DERIVATIVES_ACCOUNT_QUERY_DAILY_PROFIT_LOSS_SUCCESS =
  'DERIVATIVES_ACCOUNT_QUERY_DAILY_PROFIT_LOSS_SUCCESS';

export function DerivativesDailyProfitLoss(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_ACCOUNT_QUERY_DAILY_PROFIT_LOSS_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
