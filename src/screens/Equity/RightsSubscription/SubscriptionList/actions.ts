import { IObject } from 'interfaces/common';
import { RIGHTS_SUBSCRIPTION_QUERY_AVAILABLE, RIGHTS_EXERCISE_REGISTRATION_QUERY } from 'redux-sagas/actions';
import { QUERY_RIGHTS_AVAILABLE_FAILED, QUERY_RIGHTS_AVAILABLE_SUCCESS, RIGHTS_EXERCISE_REGISTRATION_QUERY_FAILED, RIGHTS_EXERCISE_REGISTRATION_QUERY_SUCCESS } from './reducers';

export const queryRightsAvailable = (payload: IObject) => ({
  type: RIGHTS_SUBSCRIPTION_QUERY_AVAILABLE,
  response: {
    success: QUERY_RIGHTS_AVAILABLE_SUCCESS,
    failure: QUERY_RIGHTS_AVAILABLE_FAILED,
  },
  payload,
});

export const queryRightsExerciseRegistration = (payload: IObject) => ({
  type: RIGHTS_EXERCISE_REGISTRATION_QUERY,
  response: {
    success: RIGHTS_EXERCISE_REGISTRATION_QUERY_SUCCESS,
    failure: RIGHTS_EXERCISE_REGISTRATION_QUERY_FAILED,
  },
  payload,
  showLoading: true,
});
