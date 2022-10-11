import { IObject, IAction } from 'interfaces/common';

export const WITHDRAW_MONEY_QUERY_HISTORY_SUCCESS = 'WITHDRAW_MONEY_QUERY_HISTORY_SUCCESS';
export const WITHDRAW_MONEY_QUERY_HISTORY_FAILED = 'WITHDRAW_MONEY_QUERY_HISTORY_FAILED';

export const WITHDRAW_MONEY_CANCEL_REQUEST_SUCCESS = 'WITHDRAW_MONEY_CANCEL_REQUEST_SUCCESS';
export const WITHDRAW_MONEY_CANCEL_REQUEST_FAILED = 'WITHDRAW_MONEY_CANCEL_REQUEST_FAILED';

export function WithdrawTransactionHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case WITHDRAW_MONEY_QUERY_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CancelWithdrawResult(state: { success: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case WITHDRAW_MONEY_CANCEL_REQUEST_SUCCESS:
      return {
        success: true,
      };
    default:
      return state;
  }
}
