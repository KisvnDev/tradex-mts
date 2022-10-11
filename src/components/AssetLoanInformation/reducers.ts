import { IObject, IAction } from 'interfaces/common';

export const ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_SUCCESS = 'ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_SUCCESS';
export const ACCOUNT_QUERY_EQUITY_DETAIL_LOAN_INFO_SUCCESS = 'ACCOUNT_QUERY_EQUITY_DETAIL_LOAN_INFO_SUCCESS';
export const ACCOUNT_QUERY_EQUITY_DETAIL_LOAN_INFO_FAILED = 'ACCOUNT_QUERY_EQUITY_DETAIL_LOAN_INFO_FAILED';
export const ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_FAILED = 'ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_FAILED';

export function EquityAssetInfoDetail(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_SUCCESS:
      return { ...action.payload };
    case ACCOUNT_QUERY_EQUITY_ASSET_INFO_DETAIL_FAILED:
      return null;
    default:
      return state;
  }
}
