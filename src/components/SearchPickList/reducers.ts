import { IAction } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';

export const SEARCH_PICK_LIST = 'SEARCH_PICK_LIST';

export function SearchPickList(state: ISymbolInfo[] = [], action: IAction<ISymbolInfo[]>) {
  switch (action.type) {
    case SEARCH_PICK_LIST:
      return action.payload.slice(0);
    default:
      return state;
  }
}
