import { IAction } from 'interfaces/common';
import { IMarketStatus } from 'interfaces/market';

export const GLOBAL_MARKET_STATUS = 'GLOBAL_MARKET_STATUS';
export const GLOBAL_MARKET_STATUS_CHANGE_DATA = 'GLOBAL_MARKET_STATUS_CHANGE_DATA';

export function MarketStatus(state: IMarketStatus[] = [], action: IAction<IMarketStatus[] | IMarketStatus>) {
  switch (action.type) {
    case GLOBAL_MARKET_STATUS:
      if (action.payload) {
        return (action.payload as IMarketStatus[]).slice(0);
      } else {
        return state;
      }
    case GLOBAL_MARKET_STATUS_CHANGE_DATA:
      if (action.payload) {
        state.forEach((status: IMarketStatus) => {
          if (
            (action.payload as IMarketStatus).market === status.market &&
            (action.payload as IMarketStatus).type === status.type
          ) {
            return Object.assign(status, action.payload);
          } else {
            return;
          }
        });

        return state;
      }
    default:
      return state;
  }
}
