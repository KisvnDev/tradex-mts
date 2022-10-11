import { IObject } from 'interfaces/common';
import { MARKET_GET_FOREIGNER_SYMBOL_DATA } from 'redux-sagas/actions';
import { FOREIGNER_TAB_SYMBOL_DATA_SUCCESS, FOREIGNER_TAB_SYMBOL_DATA_FAILED } from './reducers';

export const getForeignerSymbolData = (payload: IObject) => ({
  type: MARKET_GET_FOREIGNER_SYMBOL_DATA,
  response: {
    success: FOREIGNER_TAB_SYMBOL_DATA_SUCCESS,
    failure: FOREIGNER_TAB_SYMBOL_DATA_FAILED,
  },
  payload,
});
