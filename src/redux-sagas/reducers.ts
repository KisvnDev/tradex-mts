import { combineReducers, AnyAction } from 'redux';
import {
  DomainInit,
  I18n,
  MarketInit,
  MarketStatus,
  SymbolList,
  SymbolData,
  CurrentSymbol,
  CurrentStock,
  CurrentFutures,
  CurrentCW,
  CurrentIndex,
  CurrentIndexQuote,
  CurrentSymbolQuote,
  CurrentSymbolBidOffer,
  Loader,
  FavoriteLists,
  SelectedFavorite,
  UserInfo,
  UserExtraInfo,
  SelectedAccount,
  AccountList,
  AccountInfo,
  OrderTrigger,
  BankInfoIica,
} from './global-reducers';
import {
  BiometricVerificationFailedTrigger,
  BiometricVerificationFailedType,
  GenerateKisCardResult,
  LoginResult,
  ResendLoginOTPSuccessTrigger,
  VerifyOTPSuccessTrigger,
} from 'screens/Login/reducers';
import { UpDownRanking } from 'components/UpdownRanking/reducers';
import { UpDownRankingDetail } from 'screens/UpDownRankingDetail/RankingList/reducers';
import { MiniChartData } from 'components/Charts/MiniChart/reducers';
import { MiniQuoteData } from 'components/MiniQuote/reducers';
import {
  SymbolChartPeriodData,
  SymbolChartMinuteData,
  SymbolChartTickData,
} from 'components/SymbolTabs/ChartTab/reducers';
import { SymbolQuoteData } from 'components/SymbolTabs/QuoteTab/reducers';
import { SymbolForeignerData } from 'components/SymbolTabs/ForeignerTab/reducers';
import { SymbolPeriodData } from 'components/SymbolTabs/HistoryTab/reducers';
import { SymbolNewsData } from 'components/SymbolTabs/NewsTab/reducers';
import { BusinessInfo } from 'components/SymbolTabs/BusinessInfoTab/reducers';
import {
  CurrentRow,
  SpeedOrderHistory,
  StopSpeedOrderHistory,
  EquitySellable,
  DerivativesOpenPosition,
} from 'screens/SpeedOrder/reducers';
import { AccountBanks, AccountBank } from 'components/AccountBankPicker/reducers';
import { SearchText } from 'components/SymbolSearchInput/reducers';
import { SearchPickList } from 'components/SearchPickList/reducers';
import { AWSSignedData, AWSUploadImageInfo } from 'screens/UserProfile/reducers';
import { OrderPassword } from 'screens/ChangeOrderPassword/reducers';
import { HTSPassword } from 'screens/ChangeHTSPassword/reducers';
import { EquityAccountBalance } from 'screens/Equity/AccountBalance/reducers';
import { StockBalance } from 'screens/Equity/StockBalance/reducers';
import { EquityOrderHistory } from 'components/OrderHistory/reducers';
import { EquityOrderTodayUnmatch } from 'components/OrderTodayUnmatch/reducers';
import { EquityStopOrderHistory } from 'components/StopOrderHistory/reducers';
import { EquityAdvanceOrderHistory } from 'components/AdvanceOrderHistory/reducers';
import { SellableOddlotStocks } from 'components/SellableOddlotStocks/reducers';
import { EquityOddlotOrderHistory } from 'components/OddlotOrderHistory/reducers';
import { EquityOddlotTodayUnmatch } from 'components/OddlotTodayUnmatch/reducers';
import {
  WithdrawBankAccounts,
  WithdrawResult,
  EquityWithdrawInfo,
  DerivativesWithdrawInfo,
  WithdrawBankAccountsInfo,
} from 'screens/WithdrawMoney/WithdrawMoney/reducers';
import { WithdrawTransactionHistory, CancelWithdrawResult } from 'screens/WithdrawMoney/TransactionHistory/reducers';
import {
  CashTransferAccounts,
  CashTransferResult,
  DerivativesCashTransferInfo,
  EquityCashTransferInfo,
} from 'screens/CashTransfer/CashTransfer/reducers';
import {
  CashTransferTransactionHistory,
  CancelCashTransferResult,
} from 'screens/CashTransfer/TransactionHistory/reducers';
import { StockTransferAvailable } from 'screens/Equity/StockTransfer/StockBalance/reducers';
import { StockTransferHistory } from 'screens/Equity/StockTransfer/TransactionHistory/reducers';
import { StockTransferResult } from 'screens/Equity/StockTransfer/StockTransferForm/reducers';
import { SecuredLoanAvailable } from 'screens/Equity/SecuredLoan/AvailableSecuredLoan/reducers';
import { SecuredLoanDetail, SecuredLoanRegisterResult } from 'screens/Equity/SecuredLoan/SecuredLoanDetail/reducers';
import { SecuredLoanBanks, SecuredLoanBank } from 'components/SecuredLoanBankPicker/reducers';
import { SecuredLoanHistory } from 'screens/Equity/SecuredLoan/TransactionHistory/reducers';
import { RightsAvailable, RightsRegistrationData } from 'screens/Equity/RightsSubscription/SubscriptionList/reducers';
import { RightSDetail, RightsRegisterResult } from 'screens/Equity/RightsSubscription/SubscriptionForm/reducers';
import {
  DerivativesAccountSummary,
  DerivativesAccountEquity,
} from 'screens/Derivatives/Account/AccountSummary/reducers';
import { DerivativesDailyBalance } from 'screens/Derivatives/Account/DailyBalance/reducers';
import { DerivativesRiskRatio } from 'screens/Derivatives/Account/RiskRatio/reducers';
import { DerivativesTodayOpenPosition } from 'screens/Derivatives/TodayOpenPosition/reducers';
import { DerivativesDailyProfitLoss } from 'screens/Derivatives/ProfitLoss/DailyProfitLoss/reducers';
import { DerivativesCumulativeProfitLoss } from 'screens/Derivatives/ProfitLoss/CumulativeProfitLoss/reducers';
import { DerivativesMarginCall } from 'screens/Derivatives/History/MarginCall/reducers';
import { DerivativesPositionHistory } from 'screens/Derivatives/History/PositionHistory/reducers';
import { DerivativesSettlementHistory } from 'screens/Derivatives/History/SettlementHistory/reducers';
import { DerivativesOrderHistory } from 'components/DerivativesOrderHistory/reducers';
import { DerivativesStopOrderHistory } from 'components/DerivativesStopOrderHistory/reducers';
import { DerivativesAdvanceOrderHistory } from 'components/DerivativesAdvanceOrderHistory/reducers';
import {
  DerivativesWithdrawIMResult,
  DerivativesWithdrawIMSourceBank,
  DerivativesWithdrawIMTargetBank,
  DerivativesWithdrawIMInfo,
  DerivativesWithdrawIMFee,
} from 'screens/Derivatives/WithdrawIM/WithdrawIM/reducers';
import { DerivativesWithdrawIMTransactionHistory } from 'screens/Derivatives/WithdrawIM/TransactionHistory/reducers';
import {
  DerivativesDepositIMResult,
  DerivativesDepositIMSourceBank,
  DerivativesDepositIMTargetBank,
  DerivativesDepositIMInfo,
  DerivativesDepositIMFee,
} from 'screens/Derivatives/DepositIM/DepositIM/reducers';
import { DerivativesDepositIMTransactionHistory } from 'screens/Derivatives/DepositIM/TransactionHistory/reducers';
import {
  OrderPrice,
  EquityBuyableInfo,
  DerivativesOrderAvailable,
  EquitySellableInfo,
  EquityAccountMobile,
  EquityAccountMargin,
  EquityAccountMarginQuerySuccess,
} from 'components/OrderForm/reducers';
import { AlarmList } from 'screens/AlarmList/reducers';
import { FavoriteNewsData } from 'screens/FavoriteNews/reducers';
import { DerivativesOrderTodayUnmatch } from 'components/DerivativesOrderTodayUnmatch/reducers';
import { EquityCashBalanceDetail } from 'components/CashBalanceDetail/reducers';
import { StockBalanceDetail } from 'components/StockBalanceDetail/reducers';
import { EquityAssetInfoDetail } from 'components/AssetLoanInformation/reducers';
import { EquityLoanHistory } from 'components/DetailLoanInformation/reducers';
import { TransactionStatement } from 'screens/Equity/TransactionStatement/reducers';
import {
  RegisterBiometric,
  RegisterBiometricSuccess,
  RegisterBiometricTrigger,
  UsingTouchFaceId,
  VerifyOTPBiometricTrigger,
} from 'screens/Settings/reducers';
import {
  RegisterAccountForm,
  RegisterAccountFormSuccessTrigger,
  RegisterAccountResendOTPSuccessTrigger,
  RegisterAccountConfirmOTPSuccessTrigger,
  RegisterAccountConfirmOTPFailedTrigger,
  RegisterAccountFormRequestInfo,
  ReferralCodeResponse,
  ReferralCodeResponseTrigger,
  RegisterAccountResendOTPData,
} from 'screens/RegisterAccount/reducers';
import { InitSocketError } from 'screens/App/reducers';
import { EkycCheckID, EkycRegisterParams, EkycRegisterReducer } from 'screens/Ekyc/reducer';
import { IdImageInfo, SendIdImageFailedTrigger, SendIdImageSuccessTrigger } from 'screens/IdScanner/reducers';
import { GetFaceActionInfo, GetFaceActionSuccessTrigger } from 'screens/FacePhase/reducers';
import {
  BankBranchList,
  BankBranchListSuccessTrigger,
  BankList,
  BankListSuccessTrigger,
  FinishRegisterAccountSuccessTrigger,
} from 'screens/RegisterAccountService/reducers';
import { SendIdSupportFailed, SendIdSupportSuccess } from 'screens/IdSupport/reducers';
import { BannerVisible, GetFavoriteState } from 'screens/Market/reducers';
import {
  CashInAdvance,
  CheckTimeSubmitAdvancePayment,
  SubmitCashInAdvance,
  CalculateInterest,
} from 'components/CashInAdvance/reducers';
import { TransactionInfo } from 'screens/Equity/SecuredLoan/CashInAdvance/reducers';
import { PortfolioReducer } from 'screens/Portfolio/TabPortfolio/reducers';
import { PositionStatementReducer } from 'screens/PositionStatement/reducers';
import { CashStatementResult } from 'screens/Derivatives/CashStatement/reducer';
import { DerivativesAccountCashBalance } from 'screens/Derivatives/Account/reducers';
import { ConfirmAccountReducer, ResetPasswordReducer } from 'screens/ForgotPassword/reducer';

export const appReducer = combineReducers({
  //Global
  loader: Loader,
  domainInit: DomainInit,
  i18n: I18n,
  marketInit: MarketInit,
  marketStatus: MarketStatus,
  userInfo: UserInfo,
  userExtraInfo: UserExtraInfo,
  symbolList: SymbolList,
  symbolData: SymbolData,
  currentSymbol: CurrentSymbol,
  currentStock: CurrentStock,
  currentFutures: CurrentFutures,
  currentCW: CurrentCW,
  currentIndex: CurrentIndex,
  currentIndexQuote: CurrentIndexQuote,
  currentSymbolQuote: CurrentSymbolQuote,
  currentSymbolBidOffer: CurrentSymbolBidOffer,
  favoriteLists: FavoriteLists,
  selectedFavorite: SelectedFavorite,
  selectedAccount: SelectedAccount,
  accountList: AccountList,
  accountInfo: AccountInfo,
  orderTrigger: OrderTrigger,
  usingTouchFaceId: UsingTouchFaceId,
  biometricVerificationFailedTrigger: BiometricVerificationFailedTrigger,
  biometricVerificationFailedType: BiometricVerificationFailedType,
  initSocketError: InitSocketError,
  verifyOTPSuccessTrigger: VerifyOTPSuccessTrigger,

  //Login Screen
  loginResult: LoginResult,
  resendLoginOTPSuccessTrigger: ResendLoginOTPSuccessTrigger,
  generateKisCardResult: GenerateKisCardResult,

  //Alarm List
  alarmList: AlarmList,

  //Up/Down Ranking
  upDownRanking: UpDownRanking,

  //Up/Down Ranking Detail
  upDownRankingDetail: UpDownRankingDetail,

  //Mini Chart
  miniChartData: MiniChartData,

  //Mini Quote
  miniQuoteData: MiniQuoteData,

  //Chart Tab
  symbolChartTickData: SymbolChartTickData,
  symbolChartMinuteData: SymbolChartMinuteData,
  symbolChartPeriodData: SymbolChartPeriodData,

  //Quote Tab
  symbolQuoteData: SymbolQuoteData,

  //Foreigner Tab
  symbolForeignerData: SymbolForeignerData,

  //History Tab
  symbolPeriodData: SymbolPeriodData,

  //News Tab
  symbolNewsData: SymbolNewsData,

  //Business Info Tab
  businessInfo: BusinessInfo,

  //Favorite News
  favoriteNewsData: FavoriteNewsData,
  favoriteState: GetFavoriteState,

  //Speed Order
  currentRow: CurrentRow,
  speedOrderHistory: SpeedOrderHistory,
  stopSpeedOrderHistory: StopSpeedOrderHistory,
  equitySellable: EquitySellable,
  derivativesOpenPosition: DerivativesOpenPosition,

  //Account Bank Picker
  accountBanks: AccountBanks,
  accountBank: AccountBank,

  //Search Input
  searchText: SearchText,

  //Search Pick List
  searchPickList: SearchPickList,

  //User Profile
  awsSignedData: AWSSignedData,
  awsUploadImageInfo: AWSUploadImageInfo,

  //Order Password
  orderPassword: OrderPassword,

  //HTS Password
  htsPassword: HTSPassword,

  //Account Balance
  equityAccountBalance: EquityAccountBalance,

  //Stock Balance
  stockBalance: StockBalance,

  //Order History
  equityOrderHistory: EquityOrderHistory,

  //Order Today Unmatch
  equityOrderTodayUnmatch: EquityOrderTodayUnmatch,

  //Stop Order History
  equityStopOrderHistory: EquityStopOrderHistory,

  //Advance Order History
  equityAdvanceOrderHistory: EquityAdvanceOrderHistory,

  //Sellable Oddlot Stocks
  sellableOddlotStocks: SellableOddlotStocks,

  //Oddlot Order History
  equityOddlotOrderHistory: EquityOddlotOrderHistory,

  //Oddlot Order Today Unmatch
  equityOddlotTodayUnmatch: EquityOddlotTodayUnmatch,

  //Transastion Statement
  transactionStatement: TransactionStatement,

  //Withdraw Money
  withdrawBankAccounts: WithdrawBankAccounts,
  withdrawResult: WithdrawResult,
  withdrawBankAccountsInfo: WithdrawBankAccountsInfo,
  equityWithdrawInfo: EquityWithdrawInfo,
  derivativesWithdrawInfo: DerivativesWithdrawInfo,
  withdrawTransactionHistory: WithdrawTransactionHistory,
  cancelWithdrawResult: CancelWithdrawResult,

  //Cash Transfer
  cashTransferAccounts: CashTransferAccounts,
  cashTransferResult: CashTransferResult,
  derivativesCashTransferInfo: DerivativesCashTransferInfo,
  equityCashTransferInfo: EquityCashTransferInfo,
  cashTransferTransactionHistory: CashTransferTransactionHistory,
  cancelCashTransferResult: CancelCashTransferResult,

  //Stock Transfer
  stockTransferAvailable: StockTransferAvailable,
  stockTransferHistory: StockTransferHistory,
  stockTransferResult: StockTransferResult,

  //Secured Loan
  securedLoanBank: SecuredLoanBank,
  securedLoanBanks: SecuredLoanBanks,
  securedLoanAvailable: SecuredLoanAvailable,
  securedLoanDetail: SecuredLoanDetail,
  securedLoanRegisterResult: SecuredLoanRegisterResult,
  securedLoanHistory: SecuredLoanHistory,

  //Cash In Advance
  cashInAdvance: CashInAdvance,
  checkTimeSubmitAdvance: CheckTimeSubmitAdvancePayment,
  transactionInfo: TransactionInfo,
  submitCashInAdvance: SubmitCashInAdvance,
  calculateInterest: CalculateInterest,

  //Rights Subscription
  rightsAvailable: RightsAvailable,
  rightsDetail: RightSDetail,
  rightsRegisterResult: RightsRegisterResult,
  rightsRegistrationData: RightsRegistrationData,

  //Cash Balance Detail
  equityCashBalanceDetail: EquityCashBalanceDetail,

  //Stock Balance Detail
  stockBalanceDetail: StockBalanceDetail,

  //Derivatives Account
  derivativesAccountSummary: DerivativesAccountSummary,
  derivativesAccountEquity: DerivativesAccountEquity,
  derivativesDailyBalance: DerivativesDailyBalance,
  derivativesRiskRatio: DerivativesRiskRatio,
  derivativesAccountCashBalance: DerivativesAccountCashBalance,

  //Derivatives Today Open Position
  derivativesTodayOpenPosition: DerivativesTodayOpenPosition,

  //Derivatives Profit/Loss
  derivativesDailyProfitLoss: DerivativesDailyProfitLoss,
  derivativesCumulativeProfitLoss: DerivativesCumulativeProfitLoss,

  //Derivatives Margin Call
  derivativesMarginCall: DerivativesMarginCall,

  //Derivatives Position History
  derivativesPositionHistory: DerivativesPositionHistory,

  //Derivatives Settlement History
  derivativesSettlementHistory: DerivativesSettlementHistory,

  //Derivatives Order History
  derivativesOrderHistory: DerivativesOrderHistory,

  //Derivatives Order Today Unmatch
  derivativesOrderTodayUnmatch: DerivativesOrderTodayUnmatch,

  //Derivatives Stop Order History
  derivativesStopOrderHistory: DerivativesStopOrderHistory,

  //Derivatives Advance Order History
  derivativesAdvanceOrderHistory: DerivativesAdvanceOrderHistory,

  //Derivatives Withdraw IM
  derivativesWithdrawIMResult: DerivativesWithdrawIMResult,
  derivativesWithdrawIMSourceBank: DerivativesWithdrawIMSourceBank,
  derivativesWithdrawIMTargetBank: DerivativesWithdrawIMTargetBank,
  derivativesWithdrawIMInfo: DerivativesWithdrawIMInfo,
  derivativesWithdrawIMFee: DerivativesWithdrawIMFee,
  derivativesWithdrawIMTransactionHistory: DerivativesWithdrawIMTransactionHistory,

  //Derivatives DepositIM
  derivativesDepositIMResult: DerivativesDepositIMResult,
  derivativesDepositIMSourceBank: DerivativesDepositIMSourceBank,
  derivativesDepositIMTargetBank: DerivativesDepositIMTargetBank,
  derivativesDepositIMInfo: DerivativesDepositIMInfo,
  derivativesDepositIMFee: DerivativesDepositIMFee,
  derivativesDepositIMTransactionHistory: DerivativesDepositIMTransactionHistory,

  //Order Form
  orderPrice: OrderPrice,
  equityBuyableInfo: EquityBuyableInfo,
  equitySellableInfo: EquitySellableInfo,
  equityAccountMobile: EquityAccountMobile,
  derivativesOrderAvailable: DerivativesOrderAvailable,
  equityAccountMargin: EquityAccountMargin,
  equityAccountMarginQuerySuccess: EquityAccountMarginQuerySuccess,

  //Asset Loan Info
  equityAssetInfoDetail: EquityAssetInfoDetail,
  equityLoanHistory: EquityLoanHistory,

  //Biometric
  registerBiometricResult: RegisterBiometric,
  registerBiometricSuccess: RegisterBiometricSuccess,
  registerBiometricTrigger: RegisterBiometricTrigger,
  verifyOTPBiometricTrigger: VerifyOTPBiometricTrigger,

  //Register Account
  registerAccountForm: RegisterAccountForm,
  registerAccountFormSuccessTrigger: RegisterAccountFormSuccessTrigger,
  registerAccountResendOTPSuccessTrigger: RegisterAccountResendOTPSuccessTrigger,
  registerAccountConfirmOTPSuccessTrigger: RegisterAccountConfirmOTPSuccessTrigger,
  registerAccountConfirmOTPFailedTrigger: RegisterAccountConfirmOTPFailedTrigger,
  idImageInfo: IdImageInfo,
  sendIdImageSuccessTrigger: SendIdImageSuccessTrigger,
  getFaceActionSuccessTrigger: GetFaceActionSuccessTrigger,
  getFaceActionInfo: GetFaceActionInfo,
  bankList: BankList,
  bankListSuccessTrigger: BankListSuccessTrigger,
  bankBranchList: BankBranchList,
  bankBranchListSuccessTrigger: BankBranchListSuccessTrigger,
  registerAccountFormRequestInfo: RegisterAccountFormRequestInfo,
  SendIdImageFailedTrigger: SendIdImageFailedTrigger,
  sendIdSupportSuccess: SendIdSupportSuccess,
  sendIdSupportFailed: SendIdSupportFailed,
  finishRegisterAccountSuccessTrigger: FinishRegisterAccountSuccessTrigger,
  referralCodeResponse: ReferralCodeResponse,
  referralCodeResponseTrigger: ReferralCodeResponseTrigger,
  registerAccountResendOTPData: RegisterAccountResendOTPData,

  //Banner
  bannerVisible: BannerVisible,

  //Ekyc
  ekycCheckID: EkycCheckID,
  ekycRegister: EkycRegisterReducer,
  ekycParams: EkycRegisterParams,

  //Portfolio
  Portfolio: PortfolioReducer,
  //PositionStatement
  positionStatement: PositionStatementReducer,
  //CashStatement
  cashStatement: CashStatementResult,

  //IICA account
  bankInfoIica: BankInfoIica,

  //ForgotPassword
  confirmAccountReducer: ConfirmAccountReducer,
  resetPasswordReducer: ResetPasswordReducer,
});

export type IState = ReturnType<typeof appReducer>;

export const RESET_REDUCER = 'RESET_REDUCER';

export const rootReducer = (state: IState, action: AnyAction) => {
  if (action.type === RESET_REDUCER) {
    state = {
      //Global
      loader: { loading: false },
      domainInit: true,
      i18n: state.i18n,
      marketInit: true,
      marketStatus: state.marketStatus,
      userInfo: null,
      userExtraInfo: {},
      symbolList: state.symbolList,
      symbolData: null,
      currentSymbol: null,
      currentStock: null,
      currentFutures: null,
      currentCW: null,
      currentIndex: null,
      currentIndexQuote: null,
      currentSymbolQuote: null,
      currentSymbolBidOffer: null,
      favoriteLists: [],
      favoriteState: {
        error: null,
        loading: false,
      },
      selectedFavorite: null,
      selectedAccount: null,
      accountList: [],
      accountInfo: null,
      orderTrigger: null,
      usingTouchFaceId: false,
      biometricVerificationFailedTrigger: false,
      verifyOTPSuccessTrigger: false,
      biometricVerificationFailedType: '',
      initSocketError: {
        isError: false,
        error: '',
      },

      //Login Screen
      loginResult: {
        showOTP: false,
      },
      resendLoginOTPSuccessTrigger: false,
      generateKisCardResult: null,

      //Alarm List
      alarmList: [],

      //Up/Down Ranking
      upDownRanking: null,

      //Up/Down Ranking Detail
      upDownRankingDetail: null,

      //Mini Chart
      miniChartData: null,

      //Mini Quote
      miniQuoteData: null,

      //Chart Tab
      symbolChartTickData: null,
      symbolChartMinuteData: null,
      symbolChartPeriodData: null,

      //Quote Tab
      symbolQuoteData: null,

      //Foreigner Tab
      symbolForeignerData: null,

      //History Tab
      symbolPeriodData: null,

      //News Tab
      symbolNewsData: null,

      //Business Info Tab
      businessInfo: null,

      //News Tab
      favoriteNewsData: null,

      //Speed Order
      currentRow: null,
      speedOrderHistory: null,
      stopSpeedOrderHistory: null,
      equitySellable: null,
      derivativesOpenPosition: null,

      //Account Bank Picker
      accountBanks: {
        banks: [],
      },
      accountBank: null,

      //Search Input
      searchText: '',

      //Search Pick List
      searchPickList: [],

      //User Profile
      awsSignedData: null,
      awsUploadImageInfo: null,

      //Order Password
      orderPassword: null,

      //HTS Password
      htsPassword: null,

      //Account Balance
      equityAccountBalance: null,

      //Stock Balance
      stockBalance: null,

      //Order History
      equityOrderHistory: null,

      //Order Today Unmatch
      equityOrderTodayUnmatch: null,

      //Stop Order History
      equityStopOrderHistory: null,

      //Advance Order History
      equityAdvanceOrderHistory: null,

      //Sellable Oddlot Stock
      sellableOddlotStocks: null,

      //Oddlot Order History
      equityOddlotOrderHistory: null,

      //Oddlot Order Today Unmatch
      equityOddlotTodayUnmatch: null,

      //Transaction statement
      transactionStatement: null,

      //Withdraw Money
      withdrawBankAccounts: null,
      withdrawResult: null,
      withdrawBankAccountsInfo: null,
      equityWithdrawInfo: null,
      derivativesWithdrawInfo: null,
      withdrawTransactionHistory: null,
      cancelWithdrawResult: null,

      //Cash Transfer
      cashTransferAccounts: null,
      cashTransferResult: null,
      derivativesCashTransferInfo: null,
      equityCashTransferInfo: null,
      cashTransferTransactionHistory: null,
      cancelCashTransferResult: null,

      //Stock Transfer
      stockTransferAvailable: null,
      stockTransferHistory: null,
      stockTransferResult: null,

      //Secured Loan
      securedLoanBank: null,
      securedLoanBanks: [],
      securedLoanAvailable: null,
      securedLoanDetail: [],
      securedLoanRegisterResult: null,
      securedLoanHistory: null,

      //Cash In Advance
      cashInAdvance: null,
      checkTimeSubmitAdvance: null,
      transactionInfo: null,
      submitCashInAdvance: null,
      calculateInterest: null,

      //Rights Subscription
      rightsAvailable: null,
      rightsDetail: null,
      rightsRegisterResult: null,
      rightsRegistrationData: null,

      //Cash Balance Detail
      equityCashBalanceDetail: null,

      //Stock Balance Detail
      stockBalanceDetail: null,

      //Derivatives Account
      derivativesAccountSummary: null,
      derivativesAccountEquity: null,
      derivativesDailyBalance: null,
      derivativesRiskRatio: null,
      derivativesAccountCashBalance: null,

      //Derivatives Today Open Position
      derivativesTodayOpenPosition: null,

      //Derivatives Profit/Loss
      derivativesDailyProfitLoss: null,
      derivativesCumulativeProfitLoss: null,

      //Derivatives Margin Call
      derivativesMarginCall: null,

      //Derivatives Position History
      derivativesPositionHistory: null,

      //Derivatives Settlement History
      derivativesSettlementHistory: null,

      //Derivatives Order History
      derivativesOrderHistory: null,

      //Derivatives Order Today Unmatch
      derivativesOrderTodayUnmatch: null,

      //Derivatives Stop Order History
      derivativesStopOrderHistory: null,

      //Derivatives Advance Order History
      derivativesAdvanceOrderHistory: null,

      //Derivatives Withdraw IM
      derivativesWithdrawIMResult: null,
      derivativesWithdrawIMSourceBank: null,
      derivativesWithdrawIMTargetBank: null,
      derivativesWithdrawIMInfo: {},
      derivativesWithdrawIMFee: {},
      derivativesWithdrawIMTransactionHistory: null,

      //Derivatives DepositIM
      derivativesDepositIMResult: null,
      derivativesDepositIMSourceBank: null,
      derivativesDepositIMTargetBank: null,
      derivativesDepositIMInfo: {},
      derivativesDepositIMFee: {},
      derivativesDepositIMTransactionHistory: null,

      //Order Form
      orderPrice: null,
      equityBuyableInfo: null,
      equitySellableInfo: null,
      equityAccountMobile: null,
      derivativesOrderAvailable: null,
      equityAccountMargin: null,
      equityAccountMarginQuerySuccess: false,

      //Asset Loan Info
      equityAssetInfoDetail: null,
      equityLoanHistory: null,

      //Biometric
      registerBiometricResult: { showOTP: false },
      registerBiometricSuccess: false,
      registerBiometricTrigger: false,
      verifyOTPBiometricTrigger: false,

      //Register Account
      registerAccountForm: null,
      registerAccountFormSuccessTrigger: false,
      registerAccountResendOTPSuccessTrigger: false,
      registerAccountConfirmOTPSuccessTrigger: false,
      registerAccountConfirmOTPFailedTrigger: false,
      idImageInfo: null,
      getFaceActionInfo: null,
      sendIdImageSuccessTrigger: false,
      getFaceActionSuccessTrigger: false,
      bankList: null,
      bankListSuccessTrigger: false,
      bankBranchListSuccessTrigger: false,
      SendIdImageFailedTrigger: false,
      sendIdSupportSuccess: false,
      sendIdSupportFailed: false,
      finishRegisterAccountSuccessTrigger: false,
      bankBranchList: null,
      registerAccountFormRequestInfo: {},
      referralCodeResponse: {
        displayName: '',
        status: false,
      },
      referralCodeResponseTrigger: false,
      registerAccountResendOTPData: null,

      //Banner
      bannerVisible: false,

      //Ekyc
      ekycCheckID: null,
      ekycRegister: null,
      ekycParams: {},
      //Portfolio
      Portfolio: {},
      //PositionStatement
      positionStatement: [],
      //CashStatement
      cashStatement: [],

      //IICA account
      bankInfoIica: null,

      //Forgot Password
      resetPasswordReducer: {
        data: null,
        error: null,
      },
      confirmAccountReducer: {
        data: null,
        error: null,
      },
    };
  }
  return appReducer(state, action);
};
