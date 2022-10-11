import { SEARCH_TEXT_CHANGE } from './reducers';

export const changeSearchText = (payload: string) => ({
  type: SEARCH_TEXT_CHANGE,
  payload,
});
