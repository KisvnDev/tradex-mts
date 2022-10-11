import { IAction, IObject } from 'interfaces/common';

export const MINI_QUOTE_SYMBOL_DATA_SUCCESS = 'MINI_QUOTE_SYMBOL_DATA_SUCCESS';
export const MINI_QUOTE_SYMBOL_DATA_FAILED = 'MINI_QUOTE_SYMBOL_DATA_FAILED';

export function MiniQuoteData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case MINI_QUOTE_SYMBOL_DATA_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
