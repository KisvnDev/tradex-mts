import { IObject, IAction } from 'interfaces/common';

export const MINI_CHART_DATA_SUCCESS = 'MINI_CHART_DATA_SUCCESS';
export const MINI_CHART_DATA_FAILED = 'MINI_CHART_DATA_FAILED';

export function MiniChartData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case MINI_CHART_DATA_SUCCESS:
      return { ...action.payload };
    case MINI_CHART_DATA_FAILED:
      return {
        data: [],
        code: action.payload.code,
      };
    default:
      return state;
  }
}
