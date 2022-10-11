import { IObject } from 'interfaces/common';
import { NEWS_QUERY_FAVORITE_NEWS } from 'redux-sagas/actions';
import { NEWS_QUERY_FAVORITE_NEWS_SUCCESS, NEWS_QUERY_FAVORITE_NEWS_FAILED } from './reducers';

export const queryFavoriteNews = (payload: IObject) => ({
  type: NEWS_QUERY_FAVORITE_NEWS,
  response: {
    success: NEWS_QUERY_FAVORITE_NEWS_SUCCESS,
    failure: NEWS_QUERY_FAVORITE_NEWS_FAILED,
  },
  payload,
});
