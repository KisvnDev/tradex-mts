import { IObject } from 'interfaces/common';
import {
  MARKET_GET_MINUTE_SYMBOL_DATA,
  MARKET_GET_PERIOD_SYMBOL_DATA,
  MARKET_GET_TICK_SYMBOL_DATA,
} from 'redux-sagas/actions';
import {
  CHART_MINUTE_SYMBOL_DATA_SUCCESS,
  CHART_MINUTE_SYMBOL_DATA_FAILED,
  CHART_PERIOD_SYMBOL_DATA_SUCCESS,
  CHART_PERIOD_SYMBOL_DATA_FAILED,
  CHART_TICK_SYMBOL_DATA_SUCCESS,
  CHART_TICK_SYMBOL_DATA_FAILED,
} from './reducers';

export const getTickSymbolData = (payload: IObject) => ({
  type: MARKET_GET_TICK_SYMBOL_DATA,
  response: {
    success: CHART_TICK_SYMBOL_DATA_SUCCESS,
    failure: CHART_TICK_SYMBOL_DATA_FAILED,
  },
  payload,
});

export const getMinuteSymbolData = (payload: IObject) => ({
  type: MARKET_GET_MINUTE_SYMBOL_DATA,
  response: {
    success: CHART_MINUTE_SYMBOL_DATA_SUCCESS,
    failure: CHART_MINUTE_SYMBOL_DATA_FAILED,
  },
  payload,
});

export const getPeriodSymbolData = (payload: IObject) => ({
  type: MARKET_GET_PERIOD_SYMBOL_DATA,
  response: {
    success: CHART_PERIOD_SYMBOL_DATA_SUCCESS,
    failure: CHART_PERIOD_SYMBOL_DATA_FAILED,
  },
  payload,
});
