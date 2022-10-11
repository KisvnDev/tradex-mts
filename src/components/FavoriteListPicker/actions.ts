import { IFavorite } from 'interfaces/common';
import { FAVORITE_CHANGE_FAVORITE_LIST } from 'redux-sagas/actions';

export const changeFavoriteList = (payload: IFavorite) => ({
  type: FAVORITE_CHANGE_FAVORITE_LIST,
  payload,
});
