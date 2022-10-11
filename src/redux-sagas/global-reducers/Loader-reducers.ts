import { IAction } from 'interfaces/common';

export function Loader(state = { loading: false }, action: IAction<null>) {
  if (action.showLoading === true) {
    return {
      loading: true,
    };
  } else if (action.hideLoading === true) {
    return {
      loading: false,
    };
  } else {
    return state;
  }
}
