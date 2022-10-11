import { IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL } from 'redux-sagas/actions';
import {
  ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_SUCCESS,
  ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_FAILED,
} from './reducers';

export const queryAssetInfoDetail = (data: IObject) => ({
  type: ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL,
  response: {
    success: ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_SUCCESS,
    failed: ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_FAILED,
  },
  data,
});
