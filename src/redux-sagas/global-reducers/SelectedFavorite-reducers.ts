import { IFavorite, IAction } from 'interfaces/common';

export const GLOBAL_SELECTED_FAVORITE = 'GLOBAL_SELECTED_FAVORITE';

export function SelectedFavorite(state: IFavorite | null = null, action: IAction<IFavorite>) {
  switch (action.type) {
    case GLOBAL_SELECTED_FAVORITE:
      return { ...action.payload };
    default:
      return state;
  }
}
