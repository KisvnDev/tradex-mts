import { IAction } from 'interfaces/common';

export const GLOBAL_I18N = 'GLOBAL_I18N';

export function I18n(state = false, action: IAction<null>) {
  switch (action.type) {
    case GLOBAL_I18N:
      return true;
    default:
      return state;
  }
}
