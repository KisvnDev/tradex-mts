import { IAction, IObject } from 'interfaces/common';

export const DERIVATIVES_ACCOUNT_QUERY_CUMULATIVE_PROFIT_LOSS_SUCCESS =
  'DERIVATIVES_ACCOUNT_QUERY_CUMULATIVE_PROFIT_LOSS_SUCCESS';

export function DerivativesCumulativeProfitLoss(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_ACCOUNT_QUERY_CUMULATIVE_PROFIT_LOSS_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
