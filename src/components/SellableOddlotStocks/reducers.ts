import { IObject, IAction } from 'interfaces/common';

export const QUERY_SELLABLE_ODDLOT_STOCKS_SUCCESS = 'QUERY_SELLABLE_ODDLOT_STOCKS_SUCCESS';

export function SellableOddlotStocks(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_SELLABLE_ODDLOT_STOCKS_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
