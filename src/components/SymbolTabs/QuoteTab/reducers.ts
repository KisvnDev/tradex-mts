import { IAction, IObject } from 'interfaces/common';

export const QUOTE_TAB_QUOTE_SYMBOL_DATA_SUCCESS = 'QUOTE_TAB_QUOTE_SYMBOL_DATA_SUCCESS';
export const QUOTE_TAB_QUOTE_SYMBOL_DATA_FAILED = 'QUOTE_TAB_QUOTE_SYMBOL_DATA_FAILED';

export function SymbolQuoteData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUOTE_TAB_QUOTE_SYMBOL_DATA_SUCCESS:
      return { ...action.payload };
    case QUOTE_TAB_QUOTE_SYMBOL_DATA_FAILED:
      return {
        data: [],
        nextData: [],
        code: action.payload.code,
      };
    default:
      return state;
  }
}
