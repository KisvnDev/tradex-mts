import { IObject } from 'interfaces/common';
import { TRANSFER_STOCK_QUERY_AVAILABLE } from 'redux-sagas/actions';
import { QUERY_STOCK_TRANSFER_AVAILABLE_SUCCESS, QUERY_STOCK_TRANSFER_AVAILABLE_FAILED } from './reducers';

export const queryStockTransferAvailable = (payload: IObject) => ({
  type: TRANSFER_STOCK_QUERY_AVAILABLE,
  response: {
    success: QUERY_STOCK_TRANSFER_AVAILABLE_SUCCESS,
    failure: QUERY_STOCK_TRANSFER_AVAILABLE_FAILED,
  },
  payload,
});
