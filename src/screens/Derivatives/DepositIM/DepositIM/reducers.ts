import { IAction, IObject } from 'interfaces/common';

export const DEPOSIT_IM_QUERY_SOURCE_BANK_SUCCESS = 'DEPOSIT_IM_QUERY_SOURCE_BANK_SUCCESS';
export const DEPOSIT_IM_QUERY_SOURCE_BANK_FAILED = 'DEPOSIT_IM_QUERY_SOURCE_BANK_FAILED';

export const DEPOSIT_IM_QUERY_TARGET_BANK_SUCCESS = 'DEPOSIT_IM_QUERY_TARGET_BANK_SUCCESS';
export const DEPOSIT_IM_QUERY_TARGET_BANK_FAILED = 'DEPOSIT_IM_QUERY_TARGET_BANK_FAILED';

export const DEPOSIT_IM_REQUEST_SUCCESS = 'DEPOSIT_IM_REQUEST_SUCCESS';
export const DEPOSIT_IM_REQUEST_FAILED = 'DEPOSIT_IM_REQUEST_FAILED';

export const DEPOSIT_IM_QUERY_DERIVATIVES_DEPOSIT_INFO_SUCCESS = 'DEPOSIT_IM_QUERY_DERIVATIVES_DEPOSIT_INFO_SUCCESS';
export const DEPOSIT_IM_QUERY_DERIVATIVES_DEPOSIT_INFO_FAILED = 'DEPOSIT_IM_QUERY_DERIVATIVES_DEPOSIT_INFO_FAILED';

export const DEPOSIT_IM_QUERY_DERIVATIVES_FEE_SUCCESS = 'DEPOSIT_IM_QUERY_DERIVATIVES_FEE_SUCCESS';
export const DEPOSIT_IM_QUERY_DERIVATIVES_FEE_FAILED = 'DEPOSIT_IM_QUERY_DERIVATIVES_FEE_FAILED';

export function DerivativesDepositIMResult(state: { success: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case DEPOSIT_IM_REQUEST_SUCCESS:
      return {
        success: true,
      };
    default:
      return state;
  }
}

export function DerivativesDepositIMSourceBank(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DEPOSIT_IM_QUERY_SOURCE_BANK_SUCCESS:
      return action.payload;
    case DEPOSIT_IM_QUERY_SOURCE_BANK_FAILED:
      return null;
    default:
      return state;
  }
}

export function DerivativesDepositIMTargetBank(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DEPOSIT_IM_QUERY_TARGET_BANK_SUCCESS:
      return action.payload;
    case DEPOSIT_IM_QUERY_TARGET_BANK_FAILED:
      return null;
    default:
      return state;
  }
}

export function DerivativesDepositIMInfo(state: IObject = {}, action: IAction<IObject>) {
  switch (action.type) {
    case DEPOSIT_IM_QUERY_DERIVATIVES_DEPOSIT_INFO_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function DerivativesDepositIMFee(state: IObject = {}, action: IAction<IObject>) {
  switch (action.type) {
    case DEPOSIT_IM_QUERY_DERIVATIVES_FEE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
