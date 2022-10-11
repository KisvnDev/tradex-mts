import { IObject } from 'interfaces/common';
import { TRANSFER_STOCK_TRANSFER_REQUEST } from 'redux-sagas/actions';
import { STOCK_TRANSFER_REQUEST_SUCCESS, STOCK_TRANSFER_REQUEST_FAILED } from './reducers';

export const requestStockTransfer = (payload: IObject) => ({
  type: TRANSFER_STOCK_TRANSFER_REQUEST,
  response: {
    success: STOCK_TRANSFER_REQUEST_SUCCESS,
    failure: STOCK_TRANSFER_REQUEST_FAILED,
  },
  payload,
  showLoading: true,
});
