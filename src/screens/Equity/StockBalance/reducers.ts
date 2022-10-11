import config from 'config';
import { IObject, IAction } from 'interfaces/common';

export const STOCK_BALANCE_QUERY_BALANCE_SUCCESS = 'STOCK_BALANCE_QUERY_BALANCE_SUCCESS';

export function StockBalance(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case STOCK_BALANCE_QUERY_BALANCE_SUCCESS:
      return config.usingNewKisCore === false
        ? {
            extraData: action.payload.extraData,
            data: action.payload.data,
            nextData: action.payload.nextData,
            next: action.payload.next,
            lastStockCode: action.payload.lastStockCode,
          }
        : action.payload;
    default:
      return state;
  }
}
