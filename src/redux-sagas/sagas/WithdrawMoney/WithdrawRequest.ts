import { takeLatest, call, put } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { NOTIFICATION_TYPE, SYSTEM_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, WITHDRAW_MONEY_REQUEST } from 'redux-sagas/actions';
import config from 'config';
import { queryWithdrawBankAccounts } from 'screens/WithdrawMoney/WithdrawMoney/actions';
import { TransferType } from 'screens/WithdrawMoney';

const isDerivativesAccount = () => store.getState().selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES;
const withdrawMoney = (data: IObject) => {
  const findReceiveSub = store.getState().accountList.find((item) => {
    return data.beneficiaryAccountNo === item.accountNumber;
  });
  const receiveSubIsDerivatives = findReceiveSub == null ? false : findReceiveSub.type === SYSTEM_TYPE.DERIVATIVES;
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore
    ? isDerivativesAccount()
      ? data.isExtend
        ? 'services/fno/cashDW'
        : 'services/fno/cashtransfer'
      : receiveSubIsDerivatives
      ? 'services/fno/cashtransfer'
      : 'services/eqt/dofundtransfer'
    : 'equity/withdraw/request';

  const params = {
    ...data,
    [isKisCore && data.isExtend
      ? isDerivativesAccount()
        ? 'sendingAccountNumber'
        : 'senderAccountNo'
      : !isDerivativesAccount()
      ? receiveSubIsDerivatives
        ? 'accountNumber'
        : 'senderAccountNo'
      : 'accountNumber']:
      !(isKisCore && data.isExtend) && !isDerivativesAccount() && receiveSubIsDerivatives
        ? data.beneficiaryAccountNo
        : store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    transferType: receiveSubIsDerivatives ? 'EQT_TO_DR' : data.transferType,
  };
  return query(global.domainSocket, uri, METHOD.POST, params);
};

const withdrawMoneyForDerivatives = (data: IObject) => {
  const uri = 'derivatives/transfer/cash/withdraw';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    ...data,
  };

  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doWithdrawRequest(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    if (config.usingNewKisCore) {
      yield call(withdrawMoney, data);
      store.dispatch(queryWithdrawBankAccounts({ isExtend: request.payload.transferType === TransferType.EXTEND }));
    } else {
      yield store.getState().selectedAccount!.type === SYSTEM_TYPE.EQUITY
        ? call(withdrawMoney, data)
        : call(withdrawMoneyForDerivatives, data);
    }

    yield put({
      type: request.response.success,
      hideLoading: true,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Withdraw Money',
        content: 'REQUEST_WITHDRAW_MONEY_SUCCESS',
        contentParams: { amount: request.payload.amount },
        time: new Date(),
      },
    });
  } catch (err) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Withdraw Money',
        content: err.code ?? err.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchWithdrawRequest() {
  yield takeLatest(WITHDRAW_MONEY_REQUEST, doWithdrawRequest);
}
