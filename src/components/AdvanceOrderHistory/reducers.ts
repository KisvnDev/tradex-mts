import { IObject, IAction } from 'interfaces/common';

export const QUERY_ORDER_ADVANCE_HISTORY_SUCCESS = 'QUERY_ORDER_ADVANCE_HISTORY_SUCCESS';

export function EquityAdvanceOrderHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_ORDER_ADVANCE_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
