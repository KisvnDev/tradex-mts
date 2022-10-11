import { IAction, IObject } from 'interfaces/common';

export const WITHDRAW_IM_QUERY_SOURCE_BANK_SUCCESS = 'WITHDRAW_IM_QUERY_SOURCE_BANK_SUCCESS';
export const WITHDRAW_IM_QUERY_SOURCE_BANK_FAILED = 'WITHDRAW_IM_QUERY_SOURCE_BANK_FAILED';

export const WITHDRAW_IM_QUERY_TARGET_BANK_SUCCESS = 'WITHDRAW_IM_QUERY_TARGET_BANK_SUCCESS';
export const WITHDRAW_IM_QUERY_TARGET_BANK_FAILED = 'WITHDRAW_IM_QUERY_TARGET_BANK_FAILED';

export const WITHDRAW_IM_REQUEST_SUCCESS = 'WITHDRAW_IM_REQUEST_SUCCESS';
export const WITHDRAW_IM_REQUEST_FAILED = 'WITHDRAW_IM_REQUEST_FAILED';

export const WITHDRAW_IM_QUERY_DERIVATIVES_WITHDRAW_INFO_SUCCESS =
  'WITHDRAW_IM_QUERY_DERIVATIVES_WITHDRAW_INFO_SUCCESS';
export const WITHDRAW_IM_QUERY_DERIVATIVES_WITHDRAW_INFO_FAILED = 'WITHDRAW_IM_QUERY_DERIVATIVES_WITHDRAW_INFO_FAILED';

export const WITHDRAW_IM_QUERY_DERIVATIVES_FEE_SUCCESS = 'WITHDRAW_IM_QUERY_DERIVATIVES_FEE_SUCCESS';
export const WITHDRAW_IM_QUERY_DERIVATIVES_FEE_FAILED = 'WITHDRAW_IM_QUERY_DERIVATIVES_FEE_FAILED';

export function DerivativesWithdrawIMResult(state: { success: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case WITHDRAW_IM_REQUEST_SUCCESS:
      return {
        success: true,
      };
    default:
      return state;
  }
}

export function DerivativesWithdrawIMSourceBank(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case WITHDRAW_IM_QUERY_SOURCE_BANK_SUCCESS:
      return action.payload;
    case WITHDRAW_IM_QUERY_SOURCE_BANK_FAILED:
      return null;
    default:
      return state;
  }
}

export function DerivativesWithdrawIMTargetBank(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case WITHDRAW_IM_QUERY_TARGET_BANK_SUCCESS:
      return action.payload;
    case WITHDRAW_IM_QUERY_TARGET_BANK_FAILED:
      return null;
    default:
      return state;
  }
}

export function DerivativesWithdrawIMInfo(state: IObject = {}, action: IAction<IObject>) {
  switch (action.type) {
    case WITHDRAW_IM_QUERY_DERIVATIVES_WITHDRAW_INFO_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function DerivativesWithdrawIMFee(state: IObject = {}, action: IAction<IObject>) {
  switch (action.type) {
    case WITHDRAW_IM_QUERY_DERIVATIVES_FEE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
