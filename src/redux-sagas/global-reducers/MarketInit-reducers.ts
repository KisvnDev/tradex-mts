import { IAction } from 'interfaces/common';

export const GLOBAL_MARKET_INIT = 'GLOBAL_MARKET_INIT';

export function MarketInit(state: boolean = false, action: IAction<null>) {
  switch (action.type) {
    case GLOBAL_MARKET_INIT:
      return true;
    default:
      return state;
  }
}
