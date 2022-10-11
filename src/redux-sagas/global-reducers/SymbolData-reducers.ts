import { ISymbolData } from 'interfaces/market';
import { IAction } from 'interfaces/common';

export const GLOBAL_SYMBOL_DATA = 'GLOBAL_SYMBOL_DATA';

export function SymbolData(state: ISymbolData | null = null, action: IAction<ISymbolData>): ISymbolData | null {
  switch (action.type) {
    case GLOBAL_SYMBOL_DATA:
      return { ...action.payload };
    default:
      return state;
  }
}
