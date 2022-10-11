import { IObject, IAction } from 'interfaces/common';

export const FOREIGNER_TAB_SYMBOL_DATA_SUCCESS = 'FOREIGNER_TAB_SYMBOL_DATA_SUCCESS';
export const FOREIGNER_TAB_SYMBOL_DATA_FAILED = 'FOREIGNER_TAB_SYMBOL_DATA_FAILED';

export function SymbolForeignerData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case FOREIGNER_TAB_SYMBOL_DATA_SUCCESS:
      return { ...action.payload };
    case FOREIGNER_TAB_SYMBOL_DATA_FAILED:
      return {
        data: [],
        nextData: [],
        code: action.payload.code,
      };
    default:
      return state;
  }
}
