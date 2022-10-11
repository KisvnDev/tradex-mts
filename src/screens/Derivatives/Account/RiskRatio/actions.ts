import { DERIVATIVES_ACCOUNT_QUERY_RISK_RATIO } from 'redux-sagas/actions';
import { DERIVATIVES_ACCOUNT_QUERY_RISK_RATIO_SUCCESS } from './reducers';

export const queryRiskRatio = () => ({
  type: DERIVATIVES_ACCOUNT_QUERY_RISK_RATIO,
  response: {
    success: DERIVATIVES_ACCOUNT_QUERY_RISK_RATIO_SUCCESS,
  },
});
