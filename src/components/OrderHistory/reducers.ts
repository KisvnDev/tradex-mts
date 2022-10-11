import { IObject, IAction } from 'interfaces/common';

export const QUERY_ORDER_HISTORY_SUCCESS = 'QUERY_ORDER_HISTORY_SUCCESS';
export const QUERY_ORDER_HISTORY_FAILED = 'QUERY_ORDER_HISTORY_FAILED';

export function EquityOrderHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_ORDER_HISTORY_SUCCESS:
      return { ...action.payload };
    case QUERY_ORDER_HISTORY_FAILED:
      return { data: [] };
    default:
      return state;
  }
}
