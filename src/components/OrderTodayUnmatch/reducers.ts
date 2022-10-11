import { IObject, IAction } from 'interfaces/common';

export const QUERY_ORDER_TODAY_UNMATCH_SUCCESS = 'QUERY_ORDER_TODAY_UNMATCH_SUCCESS';

export function EquityOrderTodayUnmatch(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_ORDER_TODAY_UNMATCH_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
