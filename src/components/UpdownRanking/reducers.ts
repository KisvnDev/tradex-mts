import { IObject, IAction } from 'interfaces/common';

export const STOCK_RANKING_UP_DOWN_SUCCESS = 'STOCK_RANKING_UP_DOWN_SUCCESS';
export const STOCK_RANKING_UP_DOWN_FAILED = 'STOCK_RANKING_UP_DOWN_FAILED';

export function UpDownRanking(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case STOCK_RANKING_UP_DOWN_SUCCESS:
      return {
        ...action.payload,
      };
    case STOCK_RANKING_UP_DOWN_FAILED:
      return null;
    default:
      return state;
  }
}
