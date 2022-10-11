import { IAction } from 'interfaces/common';
import {
  FAVORITE_GET_FAVORITE_LISTS_FAILED,
  FAVORITE_GET_FAVORITE_LISTS_LOADING,
  FAVORITE_GET_FAVORITE_LISTS_RESET,
  TOGGLE_BANNER,
} from 'redux-sagas/actions';

export interface IGetFavoriteState {
  error: null;
  loading: boolean;
}

export function BannerVisible(state: boolean = false, action: IAction<boolean>) {
  switch (action.type) {
    case TOGGLE_BANNER:
      return action.payload;
    default:
      return state;
  }
}

export function GetFavoriteState(
  state: IGetFavoriteState = {
    loading: false,
    error: null,
  },
  action: IAction<IGetFavoriteState>
) {
  switch (action.type) {
    case FAVORITE_GET_FAVORITE_LISTS_RESET:
      return {
        loading: false,
        error: null,
      };

    case FAVORITE_GET_FAVORITE_LISTS_FAILED:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case FAVORITE_GET_FAVORITE_LISTS_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}
