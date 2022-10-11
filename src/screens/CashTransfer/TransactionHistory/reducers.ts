import { IObject, IAction } from 'interfaces/common';

export const TRANSFER_CASH_CANCEL_REQUEST_SUCCESS = 'TRANSFER_CASH_CANCEL_REQUEST_SUCCESS';
export const TRANSFER_CASH_CANCEL_REQUEST_FAILED = 'TRANSFER_CASH_CANCEL_REQUEST_FAILED';
export const CASH_TRANSFER_QUERY_HISTORY_SUCCESS = 'CASH_TRANSFER_QUERY_HISTORY_SUCCESS';
export const CASH_TRANSFER_QUERY_HISTORY_FAILED = 'CASH_TRANSFER_QUERY_HISTORY_FAILED';

export function CashTransferTransactionHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case CASH_TRANSFER_QUERY_HISTORY_SUCCESS:
      return action.payload;
    case CASH_TRANSFER_QUERY_HISTORY_FAILED:
      return {
        data: [],
        nextData: [],
      };
    default:
      return state;
  }
}

export function CancelCashTransferResult(state: { success: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case TRANSFER_CASH_CANCEL_REQUEST_SUCCESS:
      return {
        success: true,
      };
    default:
      return state;
  }
}
