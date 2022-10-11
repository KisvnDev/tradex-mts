import { IObject, IAction } from 'interfaces/common';

export const QUERY_ODDLOT_ORDER_TODAY_UNMATCH_SUCCESS = 'QUERY_ODDLOT_ORDER_TODAY_UNMATCH_SUCCESS';

export function EquityOddlotTodayUnmatch(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_ODDLOT_ORDER_TODAY_UNMATCH_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
