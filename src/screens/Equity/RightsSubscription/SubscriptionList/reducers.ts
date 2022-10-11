import { IAction, IObject } from 'interfaces/common';

export const QUERY_RIGHTS_AVAILABLE_SUCCESS = 'QUERY_RIGHTS_AVAILABLE_SUCCESS';
export const RIGHTS_EXERCISE_REGISTRATION_QUERY_SUCCESS = 'RIGHTS_EXERCISE_REGISTRATION_QUERY_SUCCESS';
export const RIGHTS_EXERCISE_REGISTRATION_QUERY_FAILED = 'RIGHTS_EXERCISE_REGISTRATION_QUERY_FAILED';
export const QUERY_RIGHTS_AVAILABLE_FAILED = 'QUERY_RIGHTS_AVAILABLE_FAILED';

export function RightsAvailable(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_RIGHTS_AVAILABLE_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

export function RightsRegistrationData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case RIGHTS_EXERCISE_REGISTRATION_QUERY_SUCCESS:
      return { ...action.payload };
    case RIGHTS_EXERCISE_REGISTRATION_QUERY_FAILED:
      return null;
    default:
      return state;
  }
}
