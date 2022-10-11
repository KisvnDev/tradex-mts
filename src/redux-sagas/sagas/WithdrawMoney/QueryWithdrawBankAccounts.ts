import { put, takeLatest, call } from 'redux-saga/effects';
import { query, METHOD, readJson } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IAccount, IRequest } from 'interfaces/common';
import config from 'config';
import { WITHDRAW_MONEY_QUERY_BANK_ACCOUNTS } from 'redux-sagas/actions';
import { SYSTEM_TYPE } from 'global';

const queryWithdrawBankAccounts = () => {
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore ? 'subaccount/retrieve' : 'equity/withdraw/banks';
  const params = isKisCore
    ? {
        clientID: global.username,
      }
    : {
        accountNumber: store.getState().selectedAccount!.accountNumber,
        subNumber: store.getState().selectedAccount!.subNumber,
      };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

const isDerivativesAccount = (account?: IAccount) =>
  (account || store.getState().selectedAccount?.type) === SYSTEM_TYPE.DERIVATIVES;

const getTransferAmount = () => {
  const uri = isDerivativesAccount() ? 'services/fno/clientcashbalanceshortver' : 'services/eqt/genfundtransfer';
  const params = { accountNo: store.getState().selectedAccount!.accountNumber };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

const queryExtendBankAccountKis = () => {
  const uri = 'services/eqt/queryBankInfo';
  const params = {
    accountNo: store.getState().selectedAccount!.accountNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

const queryBankJson = () => readJson(config.rest.baseUri.replace('rest', 'files/resources/bank_info_data.json'));

function* doQueryWithdrawBankAccounts(request: IRequest<{ isExtend: boolean }>) {
  try {
    const accountList = store?.getState()?.accountList;

    const response = yield call(queryWithdrawBankAccounts);

    const payloadOther: any = {};
    if (config.usingNewKisCore) {
      const accountSelectedID = store.getState().selectedAccount?.accountNumber;
      const listAccount = response.data as WithdrawReceivedAccount[];

      const selectedAccount = listAccount.find((it) => it.subAccountID === accountSelectedID);

      //Transfer to bank
      if (request.payload?.isExtend) {
        if (!isDerivativesAccount()) {
          const resBank = yield call(queryExtendBankAccountKis);
          response.data = resBank.data;
        } else {
          response.data = [];
        }

        const resBankJson: Res<JsonBankItem[]> = yield call(queryBankJson);
        payloadOther.jsonBank = resBankJson;
      } else {
        const derivativeAccount = accountList.find((item) => item.type === SYSTEM_TYPE.DERIVATIVES);

        response.data = listAccount.filter((item) => {
          if (isDerivativesAccount()) {
            return item.defaultSubAccount;
          }

          return selectedAccount?.defaultSubAccount
            ? !item.defaultSubAccount
            : item.subAccountID !== derivativeAccount?.account && selectedAccount?.subAccountID !== item.subAccountID;
        });
      }

      payloadOther.isDefaultAccount = selectedAccount?.defaultSubAccount;
      payloadOther.senderFullName = selectedAccount?.subAccountName;

      const resAmount: Res<TransferWithdraw> = yield call(getTransferAmount);

      payloadOther.transferableAmount =
        resAmount.data[isDerivativesAccount() ? 'transferableAmountToInternalSubsOrToBank' : 'transferableAmount'];
      payloadOther.beneficiaryAccountList = resAmount.data.beneficiaryAccountList;
    }

    yield put({
      type: request.response.success,
      payload: {
        bankAccounts: response.data,
        accountNumber: store.getState().selectedAccount!.accountNumber,
        subNumber: store.getState().selectedAccount!.subNumber,
        ...payloadOther,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

export default function* watchQueryWithdrawBankAccounts() {
  yield takeLatest(WITHDRAW_MONEY_QUERY_BANK_ACCOUNTS, doQueryWithdrawBankAccounts);
}
