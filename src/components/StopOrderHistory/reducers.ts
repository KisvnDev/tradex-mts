import { IObject, IAction } from 'interfaces/common';

export const QUERY_ORDER_STOP_HISTORY_SUCCESS = 'QUERY_ORDER_STOP_HISTORY_SUCCESS';

export function EquityStopOrderHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_ORDER_STOP_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
