import { IObject } from 'interfaces/common';
import { MARKET_GET_MINUTE_SYMBOL_DATA } from 'redux-sagas/actions';
import { MINI_CHART_DATA_SUCCESS, MINI_CHART_DATA_FAILED } from './reducers';

export const getMiniChartData = (payload: IObject) => ({
  type: MARKET_GET_MINUTE_SYMBOL_DATA,
  response: {
    success: MINI_CHART_DATA_SUCCESS,
    failure: MINI_CHART_DATA_FAILED,
  },
  payload,
});
