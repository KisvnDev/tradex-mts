import { IAction, IObject } from 'interfaces/common';

export const QUERY_STOCK_TRANSFER_AVAILABLE_SUCCESS = 'QUERY_STOCK_TRANSFER_AVAILABLE_SUCCESS';
export const QUERY_STOCK_TRANSFER_AVAILABLE_FAILED = 'QUERY_STOCK_TRANSFER_AVAILABLE_FAILED';

export function StockTransferAvailable(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_STOCK_TRANSFER_AVAILABLE_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
