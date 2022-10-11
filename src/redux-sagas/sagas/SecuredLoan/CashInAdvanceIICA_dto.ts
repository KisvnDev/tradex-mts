import { ICashInAdvance } from './../../../components/CashInAdvance/reducers';
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

export interface ICashInAdvanceIICADTO extends ICashInAdvance, TCashAdvanceIICA {}

export const cashAdvanceDto = (data: TCashAdvanceIICA): any => {
  let newData: ICashInAdvanceIICADTO = {
    availableCashAdvance: 0,
    interestRate: 0,
    maxFee: 0,
    t0AdvAvailable: 0,
    t0Days: 0,
    t1AdvAvailable: 0,
    t1Days: 0,
    t2AdvAvailable: 0,
    t2Days: 0,
    mvChildBeanList: [],
    mvErrorCode: '',
    mvErrorResult: '',
    mvResult: '',
  };

  newData.mvChildBeanList = data.mvChildBeanList;
  newData.mvParentBean = data.mvParentBean;

  newData.availableCashAdvance = Number(0);
  newData.maxFee = Number(
    typeof data.mvParentBean?.mvMaxFeeAmt === 'string' && data.mvParentBean?.mvMaxFeeAmt
      ? data.mvParentBean?.mvMaxFeeAmt
      : 0
  );
  newData.interestRate = Number(0);

  return newData;
};
