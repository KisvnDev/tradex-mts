export interface TCashAdvanceIICA {
  mvChildBeanList: MvChildBeanList[];
  mvErrorCode: string;
  mvErrorResult: string;
  mvParentBean?: MvParentBean;
  mvResult: string;
}

export interface MvChildBeanList {
  mvOrderID: string;
  mvContractID: string;
  mvAmount: string;
  mvFormatedAmount: string;
  mvQuantity: string;
  mvStockID: string;
  mvSettleDay: string;
  mvMarketId: string;
  mvPrice: string;
  tradeDate: string;
  tranDate: string;
  tradingFee: string;
  cashSettleDay: string;
  mvAvailableAmount: string;
}

export interface MvParentBean {
  mvBankAccID: null;
  mvBankID: null;
  mvClientID: null;
  mvCurrencySymbol: null;
  mvFeeRate: null;
  mvLendAmt: null;
  mvMaxFeeAmt: null;
  mvMinFeeAmt: null;
  mvSettlement: null;
}

export const formatStringToNumber = (value?: string, separator = ',') =>
  typeof value === 'string'
    ? Number(value?.replace(new RegExp(`\\${separator}`, 'g'), ''))
    : value == null
    ? NaN
    : Number(value);

export const transactionInfoDto = (data: TCashAdvanceIICA, bankId?: string): any => {
  if (data.mvChildBeanList?.length <= 0) {
    return [];
  }

  return data.mvChildBeanList.map((el) => ({
    netSoldAmount: formatStringToNumber(el.mvAmount),
    mvAvailableAmount: formatStringToNumber(el.mvAvailableAmount),
    value: formatStringToNumber(el.mvPrice) * formatStringToNumber(el.mvQuantity),
    volume: formatStringToNumber(el.mvQuantity),
    feeTax: el.tradingFee ? el.tradingFee : null,
    soldDate: el.tradeDate,
    stock: el.mvStockID,
    id: el.mvContractID,
    paymentDate: el.cashSettleDay,
    mvSettleDay: el.mvSettleDay,
    mvOrderID: el.mvOrderID,
    mvContractID: el.mvContractID,
    mvBankID: bankId,
  }));
};
