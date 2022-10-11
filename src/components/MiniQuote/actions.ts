import { IObject } from 'interfaces/common';
import { MARKET_GET_QUOTE_SYMBOL_DATA } from 'redux-sagas/actions';
import { MINI_QUOTE_SYMBOL_DATA_SUCCESS, MINI_QUOTE_SYMBOL_DATA_FAILED } from './reducers';

export const getQuoteSymbolData = (payload: IObject) => ({
  type: MARKET_GET_QUOTE_SYMBOL_DATA,
  response: {
    success: MINI_QUOTE_SYMBOL_DATA_SUCCESS,
    failure: MINI_QUOTE_SYMBOL_DATA_FAILED,
  },
  payload,
});
