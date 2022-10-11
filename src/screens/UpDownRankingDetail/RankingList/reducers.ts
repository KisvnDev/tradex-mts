import { IObject, IAction } from 'interfaces/common';

export const STOCK_RANKING_UP_DOWN_DETAIL_SUCCESS = 'STOCK_RANKING_UP_DOWN_DETAIL_SUCCESS';
export const STOCK_RANKING_UP_DOWN_DETAIL_FAILED = 'STOCK_RANKING_UP_DOWN_DETAIL_FAILED';

export function UpDownRankingDetail(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case STOCK_RANKING_UP_DOWN_DETAIL_SUCCESS:
      return { ...action.payload };
    case STOCK_RANKING_UP_DOWN_DETAIL_FAILED:
      return null;
    default:
      return state;
  }
}
