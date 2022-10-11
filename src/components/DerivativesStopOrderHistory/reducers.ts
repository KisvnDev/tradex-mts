import { IObject, IAction } from 'interfaces/common';

export const QUERY_DERIVATIVES_STOP_ORDER_HISTORY_SUCCESS = 'QUERY_DERIVATIVES_STOP_ORDER_HISTORY_SUCCESS';

export function DerivativesStopOrderHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_DERIVATIVES_STOP_ORDER_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
