import { IObject, IAction } from 'interfaces/common';

export const QUERY_DERIVATIVES_ORDER_TODAY_UNMATCH_SUCCESS = 'QUERY_DERIVATIVES_ORDER_TODAY_UNMATCH_SUCCESS';

export function DerivativesOrderTodayUnmatch(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_DERIVATIVES_ORDER_TODAY_UNMATCH_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
