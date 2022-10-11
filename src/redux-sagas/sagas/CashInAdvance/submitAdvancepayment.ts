import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, SUBMIT_ADVANCE_PAYMENT_CREATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';
import { IParamsSubmits } from 'components/CashInAdvance/actions';

const submitAdvancepayment = (params: IObject) => {
  const uri = 'services/eqt/submitAdvancePaymentCreation';
  return query(global.domainSocket, uri, METHOD.POST, params);
};

const submitAdvancepaymenttIica = (params: any) => {
  const uri = 'submitBankAdvancePayment';

  return query(global.domainSocket, uri, METHOD.POST, params, undefined, undefined, undefined, 'restttl');
};

function* doSubmitAdvancepayment(request: IRequest<IParamsSubmits>) {
  try {
    let params = {};

    if (global.isIicaAccount) {
      params = {
        mvAmount: request.payload?.submitAmount,
        mvBankID: request.payload?.item?.mvBankID,
        mvContractIDStrArray: request.payload?.item?.mvContractID,
        mvOrderIDStrArray: request.payload?.item?.mvOrderID,
        mvTPLUSX: request.payload?.item?.mvSettleDay,
        mvTotalAmt: request.payload?.item?.mvAvailableAmount,
        subAccountID: request.payload?.accountNo,
      };
    } else {
      params = { ...request.payload };
    }
    const response = yield call(global.isIicaAccount ? submitAdvancepaymenttIica : submitAdvancepayment, params);

    if (response?.data?.success) {
      yield put({
        type: request.response.success,
        payload: {
          isSuccess: true,
        },
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.SUCCESS,
          title: 'Submit advance payment',
          content: 'Submit Success',
          time: new Date(),
        },
      });
    } else {
      yield put({
        type: request.response.failure,
        payload: {
          isSucess: false,
        },
      });

      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.ERROR,
          title: 'Submit advance payment',
          content: 'Submit failure',
          time: new Date(),
        },
      });
    }
  } catch (error) {
    yield put({
      type: request.response.failure,
      payload: {
        isSucess: false,
      },
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Submit advance payment',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchSubmitAdvancepayment() {
  yield takeLatest(SUBMIT_ADVANCE_PAYMENT_CREATION, doSubmitAdvancepayment);
}
