import { COMMON_TOGGLE_LOADING } from 'redux-sagas/actions';

export const hideLoader = () => ({
  type: COMMON_TOGGLE_LOADING,
  hideLoading: true,
});
