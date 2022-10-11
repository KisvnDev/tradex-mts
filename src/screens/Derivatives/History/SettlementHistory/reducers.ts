import { IObject, IAction } from 'interfaces/common';

export const DERIVATIVES_HISTORY_QUERY_SETTLEMENT_HISTORY_SUCCESS =
  'DERIVATIVES_HISTORY_QUERY_SETTLEMENT_HISTORY_SUCCESS';

export function DerivativesSettlementHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_HISTORY_QUERY_SETTLEMENT_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
