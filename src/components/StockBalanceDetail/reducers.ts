import { IObject, IAction } from 'interfaces/common';

export const BALANCE_DETAIL_QUERY_STOCK_BALANCE_SUCCESS = 'BALANCE_DETAIL_QUERY_STOCK_BALANCE_SUCCESS';

export function StockBalanceDetail(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case BALANCE_DETAIL_QUERY_STOCK_BALANCE_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
