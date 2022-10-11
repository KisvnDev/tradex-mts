import { IAction, IObject } from 'interfaces/common';

export const WITHDRAW_IM_QUERY_HISTORY_SUCCESS = 'WITHDRAW_IM_QUERY_HISTORY_SUCCESS';
export const WITHDRAW_IM_QUERY_HISTORY_FAILED = 'WITHDRAW_IM_QUERY_HISTORY_FAILED';

export function DerivativesWithdrawIMTransactionHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case WITHDRAW_IM_QUERY_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
