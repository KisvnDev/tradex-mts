import { IAction } from 'interfaces/common';

export const GLOBAL_DOMAIN_INIT = 'GLOBAL_DOMAIN_INIT';
export const INIT_SOCKET_ERROR = 'INIT_SOCKET_ERROR';

export function DomainInit(state = false, action: IAction<null>) {
  switch (action.type) {
    case GLOBAL_DOMAIN_INIT:
      return true;
    default:
      return state;
  }
}
