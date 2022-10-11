import { IAction, IObject } from 'interfaces/common';

export const DEPOSIT_IM_QUERY_HISTORY_SUCCESS = 'DEPOSIT_IM_QUERY_HISTORY_SUCCESS';
export const DEPOSIT_IM_QUERY_HISTORY_FAILED = 'DEPOSIT_IM_QUERY_HISTORY_FAILED';

export function DerivativesDepositIMTransactionHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DEPOSIT_IM_QUERY_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
