import { IAction, IObject } from 'interfaces/common';

export const QUERY_RIGHTS_DETAIL_SUCCESS = 'QUERY_RIGHTS_DETAIL_SUCCESS';
export const QUERY_RIGHTS_DETAIL_FAILED = 'QUERY_RIGHTS_DETAIL_FAILED';

export const RIGHTS_SUBSCRIPTION_REGISTER_SUCCESS = 'RIGHTS_SUBSCRIPTION_REGISTER_SUCCESS';
export const RIGHTS_SUBSCRIPTION_REGISTER_FAILED = 'RIGHTS_SUBSCRIPTION_REGISTER_FAILED';

export function RightsRegisterResult(state: { success: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case RIGHTS_SUBSCRIPTION_REGISTER_SUCCESS:
      return {
        success: true,
      };
    default:
      return state;
  }
}

export function RightSDetail(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_RIGHTS_DETAIL_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
