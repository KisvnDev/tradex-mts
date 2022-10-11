import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, SECURED_LOAN_REGISTER } from 'redux-sagas/actions';

const registerSecuredLoan = (data: IObject) => {
  const uri = 'equity/loan/register';
  return query(global.domainSocket, uri, METHOD.POST, data);
};

function* doRegisterSecuredLoan(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    yield call(registerSecuredLoan, data);
    yield put({
      type: request.response.success,
      hideLoading: true,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Secured Loan',
        content: 'REGISTER_SECURED_LOAN_SUCCESS',
        contentParams: { loanAmount: request.payload.loanAmount },
        time: new Date(),
      },
    });
  } catch (err) {
    yield put({
      type: request.response.failure,
      hideLoading: true,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Secured Loan',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchRegisterSecuredLoan() {
  yield takeLatest(SECURED_LOAN_REGISTER, doRegisterSecuredLoan);
}
