import { IObject, IAction } from 'interfaces/common';

export const DERIVATIVES_HISTORY_QUERY_MARGIN_CALL_SUCCESS = 'DERIVATIVES_HISTORY_QUERY_MARGIN_CALL_SUCCESS';

export function DerivativesMarginCall(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_HISTORY_QUERY_MARGIN_CALL_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
