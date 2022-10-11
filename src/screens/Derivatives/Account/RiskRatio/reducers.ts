import { IObject, IAction } from 'interfaces/common';

export const DERIVATIVES_ACCOUNT_QUERY_RISK_RATIO_SUCCESS = 'DERIVATIVES_ACCOUNT_QUERY_RISK_RATIO_SUCCESS';

export function DerivativesRiskRatio(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_ACCOUNT_QUERY_RISK_RATIO_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
