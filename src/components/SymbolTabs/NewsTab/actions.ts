import { IObject } from 'interfaces/common';
import { NEWS_QUERY_SYMBOL_NEWS } from 'redux-sagas/actions';
import { NEWS_QUERY_SYMBOL_NEWS_FAILED, NEWS_QUERY_SYMBOL_NEWS_SUCCESS } from './reducers';

export const querySymbolNews = (payload: IObject) => ({
  type: NEWS_QUERY_SYMBOL_NEWS,
  response: {
    success: NEWS_QUERY_SYMBOL_NEWS_SUCCESS,
    failure: NEWS_QUERY_SYMBOL_NEWS_FAILED,
  },
  payload,
});
