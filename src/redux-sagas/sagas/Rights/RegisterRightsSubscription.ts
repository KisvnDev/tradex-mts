import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, RIGHTS_SUBSCRIPTION_REGISTER } from 'redux-sagas/actions';
import config from 'config';

const registerRightsSubscription = (data: IObject) => {
  const uri = config.usingNewKisCore !== true ? 'equity/rights/register' : 'services/eqt/doRegisterExercise';
  let params = {};
  if (config.usingNewKisCore !== true) {
    params = {
      ...{
        accountNumber: store.getState().selectedAccount!.accountNumber,
        subNumber: store.getState().selectedAccount!.subNumber,
      },
      ...data,
    };
  } else {
    params = {
      accountNumber: store.getState().selectedAccount!.accountNumber,
      ...data,
    };
  }
  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doRegisterRightsSubscription(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    yield call(registerRightsSubscription, data);

    yield put({
      type: request.response.success,
      hideLoading: true,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Register Rights Subscription',
        content: 'REGISTER_RIGHTS_SUBSCRIPTION_SUCCESS',
        contentParams: {
          amount: request.payload.quantity,
          stockCode: request.payload.stockCode,
        },
        time: new Date(),
      },
    });
  } catch (err) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Register Rights Subscription',
        content: err.code ?? err.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchRegisterRightsSubscription() {
  yield takeLatest(RIGHTS_SUBSCRIPTION_REGISTER, doRegisterRightsSubscription);
}
