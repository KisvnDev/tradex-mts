import { IAction } from 'interfaces/common';

export const SEARCH_TEXT_CHANGE = 'SEARCH_TEXT_CHANGE';

export function SearchText(state: string = '', action: IAction<string>) {
  switch (action.type) {
    case SEARCH_TEXT_CHANGE:
      return action.payload;
    default:
      return state;
  }
}
