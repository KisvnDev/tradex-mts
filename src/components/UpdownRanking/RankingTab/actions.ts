import { IObject } from 'interfaces/common';
import { MARKET_GET_UP_DOWN_STOCK_RANKING } from 'redux-sagas/actions';
import { STOCK_RANKING_UP_DOWN_FAILED, STOCK_RANKING_UP_DOWN_SUCCESS } from '../reducers';

export const getUpDownStockRanking = (payload: IObject) => ({
  type: MARKET_GET_UP_DOWN_STOCK_RANKING,
  response: {
    success: STOCK_RANKING_UP_DOWN_SUCCESS,
    failure: STOCK_RANKING_UP_DOWN_FAILED,
  },
  payload,
});
