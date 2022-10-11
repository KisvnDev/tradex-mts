import { createSelector } from 'reselect';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, IOrderPrice, ISymbolData } from 'interfaces/market';

const currentSymbol = (state: IState) => state.currentSymbol;

const orderPrice = (state: IState) => state.orderPrice;

const quote = (state: IState) => state.currentSymbolQuote;

export interface IPriceInput {
  currentSymbol: ISymbolInfo | null;
  orderPrice: IOrderPrice | null;
  quote: ISymbolData | null;
  isValid: boolean;
}

export const getPriceInput = createSelector([currentSymbol, orderPrice, quote], (currentSymbol, orderPrice, quote) => {
  let isValid = false;
  if (currentSymbol != null) {
    if (
      quote != null &&
      quote.s === currentSymbol.s &&
      quote.c != null &&
      (orderPrice == null ||
        (orderPrice != null && orderPrice.price != null && orderPrice.symbol.s === currentSymbol.s))
    ) {
      isValid = true;
    }
  }
  return {
    currentSymbol,
    orderPrice,
    quote,
    isValid,
  };
});
