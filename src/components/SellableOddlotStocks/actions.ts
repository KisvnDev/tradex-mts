import { IObject } from 'interfaces/common';
import { ORDER_QUERY_SELLABLE_ODDLOT_STOCKS } from 'redux-sagas/actions';
import { QUERY_SELLABLE_ODDLOT_STOCKS_SUCCESS } from './reducers';

export const querySellableOddlotStocks = (payload: IObject) => ({
  type: ORDER_QUERY_SELLABLE_ODDLOT_STOCKS,
  response: {
    success: QUERY_SELLABLE_ODDLOT_STOCKS_SUCCESS,
  },
  payload,
});
