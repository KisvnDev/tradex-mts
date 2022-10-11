import { IObject, IAction } from 'interfaces/common';

export const QUERY_ODDLOT_ORDER_HISTORY_SUCCESS = 'QUERY_ODDLOT_ORDER_HISTORY_SUCCESS';

export function EquityOddlotOrderHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_ODDLOT_ORDER_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
