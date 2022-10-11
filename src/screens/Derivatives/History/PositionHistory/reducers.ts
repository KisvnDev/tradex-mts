import { IObject, IAction } from 'interfaces/common';

export const DERIVATIVES_HISTORY_QUERY_POSITION_HISTORY_SUCCESS = 'DERIVATIVES_HISTORY_QUERY_POSITION_HISTORY_SUCCESS';

export function DerivativesPositionHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_HISTORY_QUERY_POSITION_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
