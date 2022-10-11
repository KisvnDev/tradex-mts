import { createSelector } from 'reselect';
import * as JsSearch from 'js-search';
import { getMap, isBlank } from 'utils/common';
import { SYMBOL_TYPE } from 'global';
import { ISymbolInfo } from 'interfaces/market';
import { IAction } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';

export const GLOBAL_SYMBOL_LIST = 'GLOBAL_SYMBOL_LIST';

export function SymbolList(state: ISymbolInfo[] = [], action: IAction<ISymbolInfo[]>) {
  switch (action.type) {
    case GLOBAL_SYMBOL_LIST:
      if (action.payload != null) {
        return action.payload;
      } else {
        return [];
      }
    default:
      return state;
  }
}

export const symbolList = (state: IState) => state.symbolList;

export const getSymbolMap = createSelector(symbolList, (symbolList) => {
  return getMap(symbolList, 's');
});

export const getSymbolSearch = createSelector(symbolList, (symbolList) => {
  const search = new JsSearch.Search('s');
  search.addIndex('s');
  search.addDocuments(symbolList);

  return search;
});

export const getHighlightIndexList = createSelector(symbolList, (symbolList) => {
  return symbolList.filter((item) => item.t === SYMBOL_TYPE.INDEX && item.i === true);
});

export const getIndexList = createSelector(symbolList, (symbolList) => {
  return symbolList.filter((item) => item.t === SYMBOL_TYPE.INDEX);
});

export const getStockList = createSelector(symbolList, (symbolList) => {
  return symbolList.filter((item) => item.t === SYMBOL_TYPE.STOCK);
});

export const getFuturesList = createSelector(symbolList, (symbolList) => {
  return symbolList.filter((item) => item.t === SYMBOL_TYPE.FUTURES);
});

export const getCWList = createSelector(symbolList, (symbolList) => {
  return symbolList.filter((item) => item.t === SYMBOL_TYPE.CW);
});

export const getFundAndETF = createSelector(symbolList, (symbolList) => {
  return symbolList.filter((item) => item.t === SYMBOL_TYPE.FUND || item.t === SYMBOL_TYPE.ETF);
});

const searchText = (state: IState) => state.searchText;

export const getFilterList = createSelector(
  [symbolList, searchText, getSymbolSearch],
  (symbolList, searchText, search) => {
    if (isBlank(searchText)) {
      return symbolList;
    } else if (search) {
      return search.search(searchText) as ISymbolInfo[];
    } else {
      return [];
    }
  }
);
