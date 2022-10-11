declare interface Res<T> {
  data: T;
}
declare type Stock = {
  availableVolume?: number;
  marketID?: string;
  stockSymbol?: string;
  stockType?: string;
  stockCode?: string;
  availableQuantity?: number;
  limitAvailableQuantity?: number;
};
declare type ItemDropdown = {
  label: string;
  value: any;
  key?: string | number;
};
interface AssetInfoPortfolio {
  accountSummary?: AccountSummary;
  buyingPower?: BuyingPower;
  cashInformation?: CashInformation;
  fee?: Fee;
  margin?: Margin;
  marginCallByStockMainAmount?: number;
  marginCallByCash?: number;
}
interface AccountSummary {
  totalAsset?: number;
  totalStockMarketValue?: number;
  cashBalance?: number;
  netAssetValue?: number;
}

interface BuyingPower {
  purchasingPower?: number;
}

interface CashInformation {
  cashWithdrawal?: number;
  pendingApprovalForWithdrawal?: number;
  holdForPendingPurchaseT0?: number;
  holdForExecutedPurchaseT0?: number;
  availableAdvancedCash?: number;
  soldT0?: number;
  soldT1?: number;
}

interface Fee {}

interface Margin {
  fixedLoan?: number;
  dayLoan?: number;
  accuredDebitInterest?: number;
  stockMain?: number;
  equity?: number;
  marginRatio?: number;
  maintenanceRatio?: number;
}
declare type WithdrawReceivedAccount = {
  accountState: any;
  clientID: string;
  counterPartyAC: string;
  defaultSubAccount: boolean;
  investorType: string;
  investorTypeName?: string;
  service: string;
  sessionID: any;
  subAccountID: string;
  subAccountName: string;
  subAccountType: string;
  tradingAccSeq: string;
};
interface TransferWithdraw {
  clientID?: string;
  transferableAmount?: number;
  beneficiaryAccountList?: BeneficiaryAccount[];
  isDefaultAccount?: boolean;
  senderFullName?: string;
  transferableAmountToInternalSubsOrToBank?: number;
  transferableAmountToVSDAccount?: number;
  transferableAmountOfVSDAccount?: number;
}

declare type BeneficiaryAccount = {
  accountNo: string;
  fullName?: string;
  bankName?: string;
  bankBranch?: string;
  transferFee?: string;
};
declare type WithdrawHistory = {
  date?: string;
  transferType?: string;
  beneficiary?: string;
  beneficiaryAccNo?: string;
  beneficiaryBank?: string;
  transferAmount?: number;
  status?: string;
  //VCSC
  isCancel?: string;
  note?: string;
  bankCode?: string;
  bankName?: string;
  amount: number;
  bankAccount?: string;
  transactionDate?: string;
  sequenceNumber?: string;
};
declare interface QueryClientCashBalance {
  accountSummary?: AccountSummary;
  portfolioAssessment?: PortfolioAssessment;
  cashInformation?: CashInformation;
}

declare interface AccountSummary {
  totalStockMarketValue?: number;
  dailyPL?: number;
  netAssetValue?: number;
  totalEquity?: number;
  accountBalance?: number;
  commission_tax?: string;
  interest?: number;
  extLoan?: number;
  deliveryAmount?: number;
  floatingPL_tradingPL?: string;
  totalPL?: number;
  minReserve?: number;
  marginable?: number;
  rcCall?: number;
  cash_nonCash?: string;
}

declare interface CashInformation {
  internal?: CashInformationExchange;
  exchange?: CashInformationExchange;
}

declare interface CashInformationExchange {
  cash?: number;
  totalValue?: number;
  cashWithdrawable?: number;
  EE?: number;
}

declare interface PortfolioAssessment {
  internal?: PortfolioAssessmentExchange;
  exchange?: PortfolioAssessmentExchange;
}

declare interface PortfolioAssessmentExchange {
  initialMargin?: number | null;
  spreadMargin?: null;
  deliveryMargin?: number | null;
  marginReq?: number;
  accountRatio?: number;
  warning123?: string;
  marginCall?: number;
}
declare interface ClientPortfolio {
  accountNo?: string;
  openPositionList?: PositionList[];
  closePositionList?: PositionList[];
}

declare interface PositionList {
  seriesID?: string;
  long?: number;
  short?: number;
  averageBid?: number;
  averageAsk?: number;
  marketPrice?: number;
  tradingPL?: number;
  floatingPL?: number;
}
declare interface EnquiryPortfolio {
  accountNumber?: string;
  summary?: Summary;
  portfolioList?: PortfolioList[];
}

declare interface PortfolioList {
  symbol?: string;
  totalVol?: number;
  sellable?: number;
  holdToSell?: number;
  boughtT0?: number;
  boughtT1?: number;
  boughtT2?: number;
  mortgage?: number;
  awaitTrading?: number;
  right?: number;
  value?: number;
  marketPrice?: number;
  lendingRate?: number;
  others?: number;
  dayChangeValue?: DayChangePercent;
  dayChangePercent?: DayChangePercent;
  weight?: DayChangePercent;
  avgPrice?: number;
  marketValue?: number;
  unrealizedPLValue?: number;
  unrealizedPLPercent?: number | null;
}

declare enum DayChangePercent {
  Xxx = 'XXX',
}

declare interface Summary {
  netAssetValue?: number;
  marketValue?: number;
  totalStockMarketValue?: number;
  marginRatio?: number;
  PP?: number;
  dailyPL?: number;
  profitLoss?: number;
  profitLossPercent?: null;
}
declare interface PortfolioInfo {
  netAssetValue: number;
  purchasingPower: number;
  profitLoss?: number;
  accountRatio: number;
  marketValue?: number;
}

declare type KisBankAccount = { bankID: string; bankAccNo?: string; balance?: null; isDefault?: boolean };
declare type KisBankHistoryRow = {
  date?: string;
  transferType?: string;
  beneficiary?: string;
  beneficiaryAccNo?: string;
  beneficiaryBank?: string;
  transferAmount?: number;
  status?: string;
  beneficiaryAccountNo?: string;
};
declare type JsonBankItem = { _id: string; name: string; longName: string; shortName: string; branch: Branch[] };
declare interface Branch {
  branchCode: string;
  branchName: string;
}
declare type StockStatementEnquiryItem = {
  balanceClosingPrice?: number;
  balanceLong?: number;
  balanceShort?: number;
  date?: string;
  expiredLong?: number;
  expiredShort?: number;
  netoffLong?: number;
  netoffShort?: number;
  seriesID?: string;
  totalPL?: number;
};
declare type StockStatementEnquiry = StockStatementEnquiryItem[];
declare type CashDWEnquiry = {
  date?: string;
  transferAccount?: string;
  transferType?: string;
  beneficiary?: string;
  beneficiaryAccountNo?: string;
  transferAmount?: number;
  transferFee?: number;
  status?: string;
  content?: string;
};
declare type OrderEnquiry = {
  accountNumber?: string;
  auctionOrder?: boolean;
  cancellable?: boolean;
  commodityName?: string;
  conditionOrderGroupID?: null;
  contractMonth?: string;
  marketID?: string;
  matchedPrice?: number;
  matchedQuantity?: number;
  matchedValue?: number;
  minQty?: number;
  modifiable?: boolean;
  orderGroupID?: string;
  orderInfo?: OrderInfo;
  orderNumber?: string;
  orderPrice?: number;
  orderQuantity?: number;
  orderStatus?: string;
  orderTime?: string;
  orderType?: string;
  position?: string;
  rejectReason?: string;
  sellBuyType?: string;
  stopOrder?: boolean;
  stopPrice?: number;
  stopType?: string;
  symbol?: string;
  tPlus1?: boolean;
  unmatchedQuantity?: number;
  userID?: string;
  validity?: string;
  validityDate?: null;
};
declare interface OrderInfo {
  bs?: string;
  commodityName?: string;
  conditionOrderGroupID?: null;
  contractMonth?: string;
  marketID?: string;
  orderGroupID?: string;
  orderID?: string;
  orderType?: string;
  seriesID?: string;
  validity?: string;
  validityDate?: null;
}
declare type CashStatement = {
  date?: string;
  description?: string;
  cashAtMasCredit?: number;
  cashAtMasDebit?: number;
  cashAtVSDCredit?: number;
  cashAtVSDDebit?: number;
  totalBalance?: number;
  brokerCredit?: number;
  brokerDebit?: number;
  clientCredit?: number;
  clientDebit?: number;
  counterPartyAC?: string;
  creationTime?: string;
  remarks?: string;
  tranType?: string;
  txnType?: string;
  valueDate?: string;
};
