import { IAction } from 'interfaces/common';
import { INewsListData } from 'interfaces/news';

export const NEWS_QUERY_SYMBOL_NEWS_SUCCESS = 'NEWS_QUERY_SYMBOL_NEWS_SUCCESS';
export const NEWS_QUERY_SYMBOL_NEWS_FAILED = 'NEWS_QUERY_SYMBOL_NEWS_FAILED';

export function SymbolNewsData(state: INewsListData | null = null, action: IAction<INewsListData>) {
  switch (action.type) {
    case NEWS_QUERY_SYMBOL_NEWS_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
