import { IObject } from 'interfaces/common';
import { MARKET_GET_QUOTE_SYMBOL_DATA } from 'redux-sagas/actions';
import { QUOTE_TAB_QUOTE_SYMBOL_DATA_SUCCESS, QUOTE_TAB_QUOTE_SYMBOL_DATA_FAILED } from './reducers';

export const getQuoteSymbolData = (payload: IObject) => ({
  type: MARKET_GET_QUOTE_SYMBOL_DATA,
  response: {
    success: QUOTE_TAB_QUOTE_SYMBOL_DATA_SUCCESS,
    failure: QUOTE_TAB_QUOTE_SYMBOL_DATA_FAILED,
  },
  payload,
});
