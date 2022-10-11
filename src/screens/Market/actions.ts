import { MARKET_INIT_EXTRA, TOGGLE_BANNER } from 'redux-sagas/actions';

export const initMarketExtra = () => ({
  type: MARKET_INIT_EXTRA,
});

export const toggleBanner = (payload: boolean) => ({
  type: TOGGLE_BANNER,
  payload,
});