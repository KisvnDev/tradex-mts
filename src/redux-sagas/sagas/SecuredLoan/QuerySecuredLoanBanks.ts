import { call, put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IObject, IResponse } from 'interfaces/common';
import { ISecuredLoanBank, SECURED_LOAN_BANK } from 'components/SecuredLoanBankPicker/reducers';
import { SECURED_LOAN_QUERY_LOAN_BANKS, QUERY_CASH_IN_ADVANCE } from 'redux-sagas/actions';
import config from 'config';
import { cashAdvanceDto } from './CashInAdvanceIICA_dto';

const querySecuredLoanBanks = (params: IObject) => {
  const uri =
    config.usingNewKisCore === false
      ? 'equity/loan/banks'
      : global.isIicaAccount
      ? 'services/eqt/queryAdvancePaymentInfo'
      : 'services/eqt/getLocalAdvanceCreation';
  if (global.isIicaAccount) {
    return query<ISecuredLoanBank[]>(
      global.domainSocket,
      uri,
      METHOD.POST,
      params,
      undefined,
      undefined,
      undefined,
      'restttl'
    );
  }

  return query<ISecuredLoanBank[]>(global.domainSocket, uri, METHOD.GET, params);
};

function* doQuerySecuredLoanBanks(request: IRequest<IObject>) {
  try {
    const paramsNewKisCore = global.isIicaAccount
      ? {
          subAccountID: store.getState().selectedAccount!.accountNumber,
          mvBankID: store.getState().bankInfoIica?.data?.[0].bankID,
          mvSettlement: '3T',
        }
      : {
          accountNo: store.getState().selectedAccount!.accountNumber,
        };

    const params: any =
      config.usingNewKisCore === false
        ? {
            fetchCount: 100,
          }
        : paramsNewKisCore;

    if (config.usingNewKisCore === false) {
      let firstQuery = true;
      let response: IResponse<ISecuredLoanBank[]> = {
        data: [],
      };
      let bankList: ISecuredLoanBank[] = [];

      while (
        firstQuery ||
        (response.data != null && response.data.length > 0 && response.data.length === params.fetchCount)
      ) {
        if (firstQuery !== true) {
          params.lastBankCode = response.data[response.data.length - 1].bankCode;
        }

        firstQuery = false;
        response = yield call(querySecuredLoanBanks, params);
        bankList = bankList.concat(response.data);
      }

      yield put({
        type: request.response.success,
        payload: bankList,
      });

      const securedLoanBank = store.getState().securedLoanBank;

      if (securedLoanBank == null) {
        if (bankList && bankList.length > 0) {
          const securedLoanBank = bankList[0];
          yield put({
            type: SECURED_LOAN_BANK,
            payload: securedLoanBank,
          });
        }
      }
    } else {
      const response = yield call(querySecuredLoanBanks, params);

      if (global.isIicaAccount) {
        const data = cashAdvanceDto(response);
        yield put({
          type: request.response.success,
          payload: data,
        });

        return;
      }

      yield put({
        type: request.response.success,
        payload: response.data,
      });
    }
  } catch (err) {
    console.log('errerr', err);

    yield put({
      type: request.response.failure,
    });
  }
}

export default function* watchQuerySecuredLoanBanks() {
  yield takeLatest(
    config.usingNewKisCore === false ? SECURED_LOAN_QUERY_LOAN_BANKS : QUERY_CASH_IN_ADVANCE,
    doQuerySecuredLoanBanks
  );
}
