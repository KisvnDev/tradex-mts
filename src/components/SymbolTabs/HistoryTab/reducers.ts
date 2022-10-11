import { IAction, IObject } from 'interfaces/common';

export const HISTORY_TAB_PERIOD_SYMBOL_DATA_SUCCESS = 'HISTORY_TAB_PERIOD_SYMBOL_DATA_SUCCESS';
export const HISTORY_TAB_PERIOD_SYMBOL_DATA_FAILED = 'HISTORY_TAB_PERIOD_SYMBOL_DATA_FAILED';

export function SymbolPeriodData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case HISTORY_TAB_PERIOD_SYMBOL_DATA_SUCCESS:
      return { ...action.payload };
    case HISTORY_TAB_PERIOD_SYMBOL_DATA_FAILED:
      return {
        data: [],
        nextData: [],
        code: action.payload.code,
      };
    default:
      return state;
  }
}
