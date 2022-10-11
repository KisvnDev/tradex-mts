import { IObject } from 'interfaces/common';
import {
  FAVORITE_UPDATE_FAVORITE_LIST_ORDER,
  FAVORITE_ADD_FAVORITE_LIST,
  FAVORITE_DELETE_FAVORITE_LIST,
} from 'redux-sagas/actions';

export const addFavoriteList = (payload: IObject) => ({
  type: FAVORITE_ADD_FAVORITE_LIST,
  showLoading: true,
  payload,
});

export const updateFavoriteListOrder = (payload: IObject[]) => ({
  type: FAVORITE_UPDATE_FAVORITE_LIST_ORDER,
  payload,
});

export const deleteFavoriteList = (payload: IObject) => ({
  type: FAVORITE_DELETE_FAVORITE_LIST,
  showLoading: true,
  payload,
});
