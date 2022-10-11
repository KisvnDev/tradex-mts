import { IObject } from 'interfaces/common';
import { MARKET_GET_PERIOD_SYMBOL_DATA } from 'redux-sagas/actions';
import { HISTORY_TAB_PERIOD_SYMBOL_DATA_SUCCESS, HISTORY_TAB_PERIOD_SYMBOL_DATA_FAILED } from './reducers';

export const getHistorySymbolData = (payload: IObject) => ({
  type: MARKET_GET_PERIOD_SYMBOL_DATA,
  response: {
    success: HISTORY_TAB_PERIOD_SYMBOL_DATA_SUCCESS,
    failure: HISTORY_TAB_PERIOD_SYMBOL_DATA_FAILED,
  },
  payload,
});
