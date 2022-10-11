import { IObject } from 'interfaces/common';
import {
  FAVORITE_GET_FAVORITE_LISTS,
  FAVORITE_ADD_FAVORITE_LIST,
  FAVORITE_GET_FAVORITE_LISTS_FAILED,
  FAVORITE_GET_FAVORITE_LISTS_SUCCESS,
} from 'redux-sagas/actions';

export const getFavoriteLists = () => ({
  type: FAVORITE_GET_FAVORITE_LISTS,
  response: {
    failure: FAVORITE_GET_FAVORITE_LISTS_FAILED,
    success: FAVORITE_GET_FAVORITE_LISTS_SUCCESS,
  },
});

export const addFavoriteList = (payload: IObject) => ({
  type: FAVORITE_ADD_FAVORITE_LIST,
  showLoading: true,
  payload,
});
