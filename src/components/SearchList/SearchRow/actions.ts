import { ISymbolInfo } from 'interfaces/market';
import { SEARCH_ADD_SYMBOL, SEARCH_REMOVE_SYMBOL } from 'redux-sagas/actions';

export const addSymbol = (payload: ISymbolInfo) => ({
  type: SEARCH_ADD_SYMBOL,
  payload,
});

export const removeSymbol = (payload: ISymbolInfo) => ({
  type: SEARCH_REMOVE_SYMBOL,
  payload,
});
