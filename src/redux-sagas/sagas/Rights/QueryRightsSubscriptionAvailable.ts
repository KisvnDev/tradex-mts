import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, RIGHTS_EXERCISE_REGISTRATION_QUERY } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const queryRightsSubscriptionAvailable = (data: IObject) => {
  const uri = 'services/eqt/getEntitlementStockList';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryRightsSubscriptionAvailable(request: IRequest<IObject>) {
  try {
    const response = yield call(queryRightsSubscriptionAvailable, request.payload);
    yield put({
      type: request.response.success,
      payload: response.data,
      hideLoading: true,
    });
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
        hideLoading: true,
      });
      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.ERROR,
          title: 'Query Rights Exercise Registration',
          content: err.code,
        },
      });
    }
  }
}

export default function* watchQueryRightsSubscriptionAvailable() {
  yield takeLatest(RIGHTS_EXERCISE_REGISTRATION_QUERY, doQueryRightsSubscriptionAvailable);
}
