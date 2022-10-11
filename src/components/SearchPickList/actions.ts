import { ISymbolInfo } from 'interfaces/market';
import { SEARCH_REMOVE_SYMBOL, SEARCH_CLEAR } from 'redux-sagas/actions';

export const removeSymbol = (payload: ISymbolInfo) => ({
  type: SEARCH_REMOVE_SYMBOL,
  payload,
});

export const clearSymbol = () => ({
  type: SEARCH_CLEAR,
});
