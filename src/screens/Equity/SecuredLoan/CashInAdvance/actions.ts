import { IObject } from 'interfaces/common';
import { QUERY_TRANSACTION_INFO } from 'redux-sagas/actions';
import { QUERY_TRANSACTION_INFO_FAILED, QUERY_TRANSACTION_INFO_SUCCESS } from './reducers';
import { CASH_IN_ADVANCE_QUERY_SUCCESS, ICashInAdvance } from 'components/CashInAdvance/reducers';

export const queryTransactionInfo = (payload: IObject) => ({
  type: QUERY_TRANSACTION_INFO,
  response: {
    success: QUERY_TRANSACTION_INFO_SUCCESS,
    failure: QUERY_TRANSACTION_INFO_FAILED,
  },
  payload,
});

export const updateCashInAdvance = (payload: ICashInAdvance) => ({
  type: CASH_IN_ADVANCE_QUERY_SUCCESS,
  payload,
});
