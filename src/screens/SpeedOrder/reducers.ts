import { createSelector } from 'reselect';
import { Big } from 'big.js';
import { IState } from 'redux-sagas/reducers';
import { IAction, IObject, IAccountBank, IAccount } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import config from 'config';
import { EnquiryOrderStatus, ORDER_KIND, SELL_BUY_TYPE, SYSTEM_TYPE } from 'global';
import { getSystemType } from 'utils/market';

export const SPEED_ORDER_ACTION_SUCCESS = 'SPEED_ORDER_ACTION_SUCCESS';
export const SPEED_ORDER_ACTION_FAILED = 'SPEED_ORDER_ACTION_FAILED';
export const SPEED_ORDER_ORDER_HISTORY_SUCCESS = 'SPEED_ORDER_ORDER_HISTORY_SUCCESS';
export const SPEED_ORDER_ORDER_HISTORY_FAILED = 'SPEED_ORDER_ORDER_HISTORY_FAILED';
export const SPEED_ORDER_STOP_ORDER_HISTORY_SUCCESS = 'SPEED_ORDER_STOP_ORDER_HISTORY_SUCCESS';
export const SPEED_ORDER_STOP_ORDER_HISTORY_FAILED = 'SPEED_ORDER_STOP_ORDER_HISTORY_FAILED';
export const SPEED_ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS = 'SPEED_ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS';
export const SPEED_ORDER_QUERY_EQUITY_SELLABLE_INFO_FAILED = 'SPEED_ORDER_QUERY_EQUITY_SELLABLE_INFO_FAILED';
export const DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_SUCCESS =
  'DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_SUCCESS';
export const DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_FAILED = 'DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_FAILED';

export const SPEED_ORDER_CURRENT_ROW = 'SPEED_ORDER_CURRENT_ROW';

export enum PROMPT_MODE {
  PLACE,
  MOVE,
  CANCEL,
  CANCEL_ALL,
}

export interface IPriceData {
  stopOrderId?: string;
  [SELL_BUY_TYPE.BUY]?: {
    orderQuantity: number;
    orderNo?: string;
    orderGroupNo?: string;
  };
  [SELL_BUY_TYPE.SELL]?: {
    orderQuantity: number;
    orderNo?: string;
    orderGroupNo?: string;
  };
}

export interface ICurrentRow {
  price: Big;
  quantity?: number;
  onEditMode: boolean;
  showModal: boolean;
  sellBuyType: SELL_BUY_TYPE;
  orderKind: ORDER_KIND;
  promptMode?: PROMPT_MODE;
  newPrice?: Big;
  stopPriceData?: IPriceData;
  orderNo?: string;
  orderGroupNo?: string;
  stopOrderId?: string;
  orderInfo?: any;
}
export function CurrentRow(state: ICurrentRow | null = null, action: IAction<ICurrentRow | null>) {
  switch (action.type) {
    case SPEED_ORDER_CURRENT_ROW:
      if (action.payload != null) {
        return { ...action.payload };
      } else {
        return null;
      }
    default:
      return state;
  }
}

const currentSymbol = (state: IState) => state.currentSymbol;

const selectedAccount = (state: IState) => state.selectedAccount;

const accountBank = (state: IState) => state.accountBank;

export interface ISpeedOrderInput {
  currentSymbol: ISymbolInfo | null;
  selectedAccount: IAccount | null;
  accountBank: IAccountBank | null;
  isValid: boolean;
}

export const getSpeedOrderInput = createSelector(
  [currentSymbol, selectedAccount, accountBank],
  (currentSymbol, selectedAccount, accountBank) => {
    let isValid = false;
    if (currentSymbol != null && selectedAccount != null && getSystemType(currentSymbol.t) === selectedAccount.type) {
      if (selectedAccount.type === SYSTEM_TYPE.EQUITY) {
        if (
          accountBank != null &&
          accountBank.account != null &&
          accountBank.account.accountDisplay === selectedAccount.accountDisplay &&
          !config.usingNewKisCore
        ) {
          isValid = true;
        }

        if (config.usingNewKisCore) {
          isValid = true;
        }
      } else {
        accountBank = null;
        isValid = true;
      }
    }
    return {
      currentSymbol,
      selectedAccount,
      accountBank,
      isValid,
    };
  }
);

const checkOrderStatusType = (type?: string) => {
  switch (type) {
    case EnquiryOrderStatus.CANCELLED:
    case EnquiryOrderStatus.REJECTED:
    case EnquiryOrderStatus.EXP:
    case EnquiryOrderStatus.FULLY_EXECUTED:
    case EnquiryOrderStatus.PARTIALLY_FILLED:
    case EnquiryOrderStatus.REJECT:
    case EnquiryOrderStatus.FILLED:
      return false;
    default:
      return true;
  }
};

export function SpeedOrderHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case SPEED_ORDER_ORDER_HISTORY_SUCCESS:
      let orderHistory: IObject = {};
      const isUsingNewKisCore = config.usingNewKisCore;

      let totalBid = 0;
      let totalOffer = 0;

      if (action.payload == null) {
        return { ...orderHistory };
      }

      (action.payload.data as IObject[]).forEach((item: IObject) => {
        const typeOrderString = typeof item.orderStatus === 'string' ? item.orderStatus : item.orderStatus.toString();
        const isMatchCode = (item?.code || item?.stockCode || item?.symbol) === action.payload.code;

        if (isMatchCode && checkOrderStatusType(typeOrderString)) {
          const orderPrice = String(item.orderPrice);
          if (orderHistory[orderPrice] == null) {
            orderHistory[orderPrice] = {
              [SELL_BUY_TYPE.BUY]: {
                orderQuantity: 0,
              },
              [SELL_BUY_TYPE.SELL]: {
                orderQuantity: 0,
              },
            };
          }
          const typeOrder = isUsingNewKisCore ? item.buySellOrder ?? item.sellBuyType : item.sellBuyType;
          orderHistory[orderPrice]![typeOrder as SELL_BUY_TYPE].orderQuantity += isUsingNewKisCore
            ? item.unmatchedQuantity || item.orderQty || item.orderQuantity
            : item.unmatchedQuantity;
          if (item?.orderNo && isUsingNewKisCore) {
            orderHistory[orderPrice]![typeOrder as SELL_BUY_TYPE].orderNo = item.orderNo ?? item.orderNumber;
          }

          if (item?.orderNumber && isUsingNewKisCore) {
            orderHistory[orderPrice]![typeOrder as SELL_BUY_TYPE].orderNumber = item.orderNumber;
          }

          if (item?.orderGroupNo && isUsingNewKisCore) {
            orderHistory[orderPrice]![typeOrder as SELL_BUY_TYPE].orderGroupNo = item.orderGroupNo;
          }

          if (item?.orderGroupID && isUsingNewKisCore) {
            orderHistory[orderPrice]![typeOrder as SELL_BUY_TYPE].orderGroupID = item.orderGroupID;
          }

          if (isUsingNewKisCore) {
            orderHistory[orderPrice]![typeOrder as SELL_BUY_TYPE].orderInfo = item;
          }

          if (typeOrder === SELL_BUY_TYPE.BUY) {
            totalBid += (isUsingNewKisCore
              ? item.orderQty || item.orderQuantity || item.unmatchedQuantity
              : item.unmatchedQuantity) as number;
          } else {
            totalOffer += (isUsingNewKisCore
              ? item.orderQty || item.orderQuantity || item.unmatchedQuantity
              : item.unmatchedQuantity) as number;
          }
        }
      });

      orderHistory.totalBid = totalBid;
      orderHistory.totalOffer = totalOffer;
      orderHistory.code = action.payload.code;

      return orderHistory;
    case SPEED_ORDER_ORDER_HISTORY_FAILED:
      return {};
    default:
      return state;
  }
}
export function StopSpeedOrderHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case SPEED_ORDER_STOP_ORDER_HISTORY_SUCCESS:
      const stopOrderHistory: IObject = {};

      let totalBid = 0;
      let totalOffer = 0;

      if (action.payload == null) {
        return stopOrderHistory;
      }

      (action.payload.data as IObject[]).forEach((item: IObject) => {
        const isPassStatusType = config.usingNewKisCore ? checkOrderStatusType(item?.status as string) : true;
        if ((item.code === action.payload.code || item.stockCode === action.payload.code) && isPassStatusType) {
          const stopPrice = item.stopPrice.toString();
          if (stopOrderHistory[stopPrice] == null) {
            stopOrderHistory[stopPrice] = {
              [SELL_BUY_TYPE.BUY]: {
                orderQuantity: 0,
              },
              [SELL_BUY_TYPE.SELL]: {
                orderQuantity: 0,
              },
            };
          }

          if (item?.stopOrderId && config.usingNewKisCore) {
            // eslint-disable-next-line dot-notation
            stopOrderHistory[stopPrice]['stopOrderId'] = item?.stopOrderId;
          }

          stopOrderHistory[stopPrice]![item.sellBuyType as SELL_BUY_TYPE].orderQuantity += item.orderQuantity;
          if (item.sellBuyType === SELL_BUY_TYPE.BUY) {
            totalBid += item.orderQuantity as number;
          } else {
            totalOffer += item.orderQuantity as number;
          }
        }
      });

      stopOrderHistory.totalBid = totalBid;
      stopOrderHistory.totalOffer = totalOffer;
      stopOrderHistory.code = action.payload.code;

      return stopOrderHistory;
    case SPEED_ORDER_STOP_ORDER_HISTORY_FAILED:
      return {};
    default:
      return state;
  }
}

export function EquitySellable(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case SPEED_ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

export function DerivativesOpenPosition(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_SUCCESS:
      return { ...action.payload };
    case DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_FAILED:
      return {
        data: null,
      };
    default:
      return state;
  }
}
