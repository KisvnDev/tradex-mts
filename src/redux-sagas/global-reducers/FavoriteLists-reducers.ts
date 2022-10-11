import { IFavorite, IAction } from 'interfaces/common';

export const GLOBAL_FAVORITE_LISTS = 'GLOBAL_FAVORITE_LISTS';

export function FavoriteLists(state: IFavorite[] = [], action: IAction<IFavorite[]>) {
  switch (action.type) {
    case GLOBAL_FAVORITE_LISTS:
      return action.payload ? action.payload.slice(0) : [];
    default:
      return state;
  }
}
