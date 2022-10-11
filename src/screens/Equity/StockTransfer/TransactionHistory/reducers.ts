import config from 'config';
import { IObject, IAction } from 'interfaces/common';

export const QUERY_STOCK_TRANSFER_HISTORY_SUCCESS = 'QUERY_STOCK_TRANSFER_HISTORY_SUCCESS';
export const QUERY_STOCK_TRANSFER_HISTORY_FAILED = 'QUERY_STOCK_TRANSFER_HISTORY_FAILED';

export function StockTransferHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_STOCK_TRANSFER_HISTORY_SUCCESS:
      return config.usingNewKisCore
        ? action.payload
        : {
            data: action.payload.data,
            nextData: action.payload.nextData,
            next: action.payload.next,
            lastTransactionDate: action.payload.lastTransactionDate,
            lastSequenceNumber: action.payload.lastSequenceNumber,
          };
    case QUERY_STOCK_TRANSFER_HISTORY_FAILED:
      return {
        data: [],
        nextData: [],
      };
    default:
      return state;
  }
}
