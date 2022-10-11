import { IAction } from 'interfaces/common';

export const STOCK_TRANSFER_REQUEST_SUCCESS = 'STOCK_TRANSFER_REQUEST_SUCCESS';
export const STOCK_TRANSFER_REQUEST_FAILED = 'STOCK_TRANSFER_REQUEST_FAILED';

export function StockTransferResult(state: { success: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case STOCK_TRANSFER_REQUEST_SUCCESS:
      return {
        success: true,
      };
    default:
      return state;
  }
}
