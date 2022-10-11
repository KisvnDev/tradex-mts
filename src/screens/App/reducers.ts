import { IAction } from 'interfaces/common';
import { INIT_SOCKET_ERROR } from 'redux-sagas/global-reducers/AppInit-reducers';

export function InitSocketError(
  state: { isError: boolean; error: string } = { isError: false, error: '' },
  action: IAction<{ isError: boolean; error: string }>
) {
  switch (action.type) {
    case INIT_SOCKET_ERROR:
      return action.payload;
    default:
      return state;
  }
}
