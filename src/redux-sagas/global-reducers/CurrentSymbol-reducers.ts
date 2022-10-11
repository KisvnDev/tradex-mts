import { createSelector } from 'reselect';
import { IState } from 'redux-sagas/reducers';
import { IAction, IObject } from 'interfaces/common';
import { ISymbolInfo, ISymbolData, IBidOffer } from 'interfaces/market';

export const GLOBAL_CURRENT_SYMBOL = 'GLOBAL_CURRENT_SYMBOL';
export const GLOBAL_CURRENT_STOCK = 'GLOBAL_CURRENT_STOCK';
export const GLOBAL_CURRENT_FUTURES = 'GLOBAL_CURRENT_FUTURES';
export const GLOBAL_CURRENT_CW = 'GLOBAL_CURRENT_CW';
export const GLOBAL_CURRENT_INDEX = 'GLOBAL_CURRENT_INDEX';
export const GLOBAL_CURRENT_INDEX_QUOTE = 'GLOBAL_CURRENT_INDEX_QUOTE';
export const GLOBAL_CURRENT_SYMBOL_QUOTE = 'GLOBAL_CURRENT_SYMBOL_QUOTE';
export const GLOBAL_CURRENT_SYMBOL_BID_OFFER = 'GLOBAL_CURRENT_SYMBOL_BID_OFFER';

export function CurrentSymbol(state: ISymbolInfo | null = null, action: IAction<ISymbolInfo>): ISymbolInfo | null {
  switch (action.type) {
    case GLOBAL_CURRENT_SYMBOL:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CurrentStock(state: ISymbolInfo | null = null, action: IAction<ISymbolInfo>): ISymbolInfo | null {
  switch (action.type) {
    case GLOBAL_CURRENT_STOCK:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CurrentFutures(state: ISymbolInfo | null = null, action: IAction<ISymbolInfo>): ISymbolInfo | null {
  switch (action.type) {
    case GLOBAL_CURRENT_FUTURES:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CurrentCW(state: ISymbolInfo | null = null, action: IAction<ISymbolInfo>): ISymbolInfo | null {
  switch (action.type) {
    case GLOBAL_CURRENT_CW:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CurrentIndex(state: ISymbolInfo | null = null, action: IAction<ISymbolInfo>): ISymbolInfo | null {
  switch (action.type) {
    case GLOBAL_CURRENT_INDEX:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CurrentIndexQuote(state: ISymbolData | null = null, action: IAction<ISymbolData>): ISymbolData | null {
  switch (action.type) {
    case GLOBAL_CURRENT_INDEX_QUOTE:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CurrentSymbolQuote(state: ISymbolData | null = null, action: IAction<ISymbolData>): ISymbolData | null {
  switch (action.type) {
    case GLOBAL_CURRENT_SYMBOL_QUOTE:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CurrentSymbolBidOffer(
  state: ISymbolData | null = null,
  action: IAction<ISymbolData>
): ISymbolData | null {
  switch (action.type) {
    case GLOBAL_CURRENT_SYMBOL_BID_OFFER:
      return { ...action.payload };
    default:
      return state;
  }
}

const currentSymbolBidOffer = (state: IState) => state.currentSymbolBidOffer;

export const getBidOfferMap = createSelector(currentSymbolBidOffer, (currentSymbolBidOffer) => {
  return {
    s: currentSymbolBidOffer ? currentSymbolBidOffer.s : null,
    bb:
      currentSymbolBidOffer && currentSymbolBidOffer.bb
        ? currentSymbolBidOffer.bb.reduce((map: IObject, obj: IBidOffer) => {
            if (obj.p) {
              map[obj.p.toString()] = obj;
            }
            return map;
          }, {})
        : null,
    bo:
      currentSymbolBidOffer && currentSymbolBidOffer.bo
        ? currentSymbolBidOffer.bo.reduce((map: IObject, obj: IBidOffer) => {
            if (obj.p) {
              map[obj.p.toString()] = obj;
            }
            return map;
          }, {})
        : null,
  };
});
