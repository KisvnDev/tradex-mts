import { IObject, IAction } from 'interfaces/common';

export const BUSINESS_INFO_QUERY_BUSINESS_INFO_SUCCESS = 'BUSINESS_INFO_QUERY_BUSINESS_INFO_SUCCESS';
export const BUSINESS_INFO_QUERY_BUSINESS_INFO_FAILED = 'BUSINESS_INFO_QUERY_BUSINESS_INFO_FAILED';

export function BusinessInfo(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case BUSINESS_INFO_QUERY_BUSINESS_INFO_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
