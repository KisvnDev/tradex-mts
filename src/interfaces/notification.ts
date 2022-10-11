import { SELL_BUY_TYPE, ORDER_TYPE, STOP_ORDER_STATUS } from 'global';

export interface IOrderMatch {
  orderNumber: string;
  originalOrderNumber: string;
  username: string;
  accountNumber: string;
  subNumber: string;
  orderPrice: number;
  orderQuantity: number;
  matchPrice: number;
  matchQuantity: number;
  totalMatchQuantity: number;
  unmatchQuantity: number;
  code: string;
  tradingType: string;
  marketType: string;
  time: string;
  sellBuyType: SELL_BUY_TYPE;
  isCurrentSymbol: boolean;
  isCurrentAccountSub: boolean;
}

export interface IStopOrderActivation {
  accountNumber: string;
  subNumber: string;
  code: string;
  orderType: ORDER_TYPE;
  orderPrice: number;
  orderQuantity: number;
  orderNumber: string;
  failedReason: string;
  sellBuyType: SELL_BUY_TYPE;
  status: STOP_ORDER_STATUS;
  time: string;
  isCurrentSymbol: boolean;
  isCurrentAccountSub: boolean;
}

export interface IAlarmPrice {
  userId: number;
  code: string;
  value: number;
  currentValue: number;
  type: string;
  option: string;
  notificationMethod: string;
  id: number;
  time: string;
}
