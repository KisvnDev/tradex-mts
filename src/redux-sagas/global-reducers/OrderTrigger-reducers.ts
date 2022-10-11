import { IAction, IObject } from 'interfaces/common';
import { ORDER_KIND, SELL_BUY_TYPE, STOP_ORDER_STATUS } from 'global';
import { SPEED_ORDER_ACTION_SUCCESS } from 'screens/SpeedOrder/reducers';
import { NOTIFICATION_ORDER_MATCH, NOTIFICATION_STOP_ORDER_ACTIVATION } from 'redux-sagas/actions';
import {
  ORDER_PLACE_ORDER_SUCCESS,
  ORDER_CANCEL_ORDER_SUCCESS,
  ORDER_MODIFY_ORDER_SUCCESS,
} from 'components/OrderForm/reducers';

export interface IOrderTrigger {
  orderKind: ORDER_KIND;
  sellBuyType: SELL_BUY_TYPE;
  success: boolean;
  isStopActivation?: boolean;
  isCancelAction: boolean;
  isModifyAction: boolean;
}

export function OrderTrigger(state: IOrderTrigger | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case SPEED_ORDER_ACTION_SUCCESS:
    case ORDER_PLACE_ORDER_SUCCESS:
    case ORDER_CANCEL_ORDER_SUCCESS:
    case ORDER_MODIFY_ORDER_SUCCESS:
      return {
        orderKind: action.payload.orderKind as ORDER_KIND,
        sellBuyType: action.payload.sellBuyType as SELL_BUY_TYPE,
        success: true,
        isCancelAction: action.type === ORDER_CANCEL_ORDER_SUCCESS,
        isModifyAction: action.type === ORDER_MODIFY_ORDER_SUCCESS,
      };
    case NOTIFICATION_ORDER_MATCH:
      if (action.payload.isCurrentSymbol === true && action.payload.isCurrentAccountSub === true) {
        return {
          orderKind: ORDER_KIND.NORMAL_ORDER,
          sellBuyType: action.payload.sellBuyType as SELL_BUY_TYPE,
          success: true,
        };
      } else {
        return state;
      }
    case NOTIFICATION_STOP_ORDER_ACTIVATION:
      if (
        action.payload.isCurrentSymbol === true &&
        action.payload.isCurrentAccountSub === true &&
        action.payload.status === STOP_ORDER_STATUS.COMPLETED
      ) {
        return {
          orderKind: ORDER_KIND.NORMAL_ORDER,
          sellBuyType: action.payload.sellBuyType as SELL_BUY_TYPE,
          success: true,
          isStopActivation: true,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
