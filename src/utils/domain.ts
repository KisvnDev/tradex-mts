import { IObject, IAccount, IAccountBank } from 'interfaces/common';
import { SYSTEM_TYPE, EQUITY_DEFAULT_BANK_CODE } from 'global';
import config from 'config';

export function getAccounts(accountList: IObject[] | null | undefined) {
  const accounts: IAccount[] = [];

  if (accountList) {
    accountList.forEach((element: IObject) => {
      if (element && element.accountSubs) {
        (element.accountSubs as IObject[]).forEach((sub: IObject) => {
          let isBankLinkingAccount = false;
          const bankAccounts = Array.from(
            new Set((sub.bankAccounts as IAccountBank[]).map((item) => item.bankCode))
          ).map((bankCode) => {
            if (bankCode !== EQUITY_DEFAULT_BANK_CODE) {
              isBankLinkingAccount = true;
            }
            return (sub.bankAccounts as IAccountBank[]).find((item) => item.bankCode === bankCode);
          });

          const account = element.accountNumber as string;
          const accountDisplay = config.usingNewKisCore === false ? `${element.accountNumber}-${sub.subNumber}` : `${element.accountNumber}`;

          accounts.push({
            accountNumber: element.accountNumber as string,
            subNumber: sub.subNumber as string,
            type: sub.type as SYSTEM_TYPE,
            account,
            accountDisplay,
            banks: bankAccounts as IAccountBank[],
            isBankLinkingAccount,
          });
        });
      }
    });
  }
  return accounts;
}
