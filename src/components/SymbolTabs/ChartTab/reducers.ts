import { IAction, IObject } from 'interfaces/common';

export const CHART_TICK_SYMBOL_DATA_SUCCESS = 'CHART_TICK_SYMBOL_DATA_SUCCESS';
export const CHART_TICK_SYMBOL_DATA_FAILED = 'CHART_TICK_SYMBOL_DATA_FAILED';
export const CHART_MINUTE_SYMBOL_DATA_SUCCESS = 'CHART_MINUTE_SYMBOL_DATA_SUCCESS';
export const CHART_MINUTE_SYMBOL_DATA_FAILED = 'CHART_MINUTE_SYMBOL_DATA_FAILED';
export const CHART_PERIOD_SYMBOL_DATA_SUCCESS = 'CHART_PERIOD_SYMBOL_DATA_SUCCESS';
export const CHART_PERIOD_SYMBOL_DATA_FAILED = 'CHART_PERIOD_SYMBOL_DATA_FAILED';

export function SymbolChartTickData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case CHART_TICK_SYMBOL_DATA_SUCCESS:
      return { ...action.payload };
    case CHART_TICK_SYMBOL_DATA_FAILED:
      return {
        data: [],
      };
    default:
      return state;
  }
}

export function SymbolChartMinuteData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case CHART_MINUTE_SYMBOL_DATA_SUCCESS:
      return { ...action.payload };
    case CHART_MINUTE_SYMBOL_DATA_FAILED:
      return {
        data: [],
      };
    default:
      return state;
  }
}

export function SymbolChartPeriodData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case CHART_PERIOD_SYMBOL_DATA_SUCCESS:
      return { ...action.payload };
    case CHART_PERIOD_SYMBOL_DATA_FAILED:
      return {
        data: [],
      };
    default:
      return state;
  }
}
