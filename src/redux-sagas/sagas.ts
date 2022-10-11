import { all } from 'redux-saga/effects';
import { initSocket } from './sagas/Socket';
import { initI18n, changeLanguage } from './sagas/Localization';
import { showNotification, changeSettings } from './sagas/Common';
import {
  loginDomain,
  verifyOTP,
  logout,
  loginViewMode,
  loginBiometric,
  registerBiometric,
  verifyOTPBiometric,
  resendLoginOTP,
  generateNewKisCard,
  notifyMobileOtp,
} from './sagas/Authentication';
import {
  initMarket,
  initMarketExtra,
  setCurrentSymbol,
  setCurrentIndex,
  querySymbolData,
  subscribeSymbol,
  subscribeCurrentSymbol,
  unsubscribeSymbol,
  getUpDownStockRanking,
  getMinuteSymbolData,
  getQuoteSymbolData,
  getPeriodSymbolData,
  getTickSymbolData,
  getForeignerSymbolData,
  followMarketRefresh,
} from './sagas/Market';
import { queryBusinessInfo } from './sagas/BusinessInfo';
import {
  getFavoriteLists,
  changeFavoriteLists,
  updateFavoriteList,
  updateFavoriteListOrder,
  addFavoriteList,
  deleteFavoriteList,
} from './sagas/Favorite';
import { getAlarmSettings, addAlarmSetting, updateAlarmSetting, deleteAlarmSetting } from './sagas/Alarm';
import { querySymbolNews, queryFavoriteNews } from './sagas/News';
import {
  queryOrderHistory,
  queryOrderTodayUnmatch,
  queryStopOrderHistory,
  queryAdvanceOrderHistory,
  queryOddlotSellabeStocks,
  queryOddlotOrderHistory,
  queryOddlotOrderTodayUnmatch,
  placeEquityOrder,
  placeEquitySpeedOrder,
  modifyEquityOrder,
  modifyEquitySpeedOrder,
  cancelEquityOrder,
  cancelEquitySpeedOrder,
  moveEquitySpeedOrder,
  queryDerivativesOrderHistory,
  queryDerivativesStopOrderHistory,
  queryDerivativesOrderTodayUnmatch,
  queryDerivativesAdvanceOrderHistory,
  placeDerivativesOrder,
  placeDerivativesSpeedOrder,
  cancelDerivativesOrder,
  cancelDerivativesSpeedOrder,
  moveDerivativesSpeedOrder,
  modifyDerivativesOrder,
  queryDerivativesOrderAvailable,
  queryAllStopOrderHistory,
} from './sagas/Order';
import {
  changeAccount,
  changeOrderPassword,
  changeHTSPassword,
  queryEquityAccountBank,
  queryAccountInfo,
  queryAllAccounts,
  queryEquityAccountBalance,
  queryStockBalance,
  queryEquityBuyableInfo,
  queryEquitySellableInfo,
  queryAccountMobile,
  queryDerivativesAccountSummary,
  queryDerivativesAccountEquity,
  queryDerivativesAccountDailyBalance,
  queryDerivativesAccountRiskRatio,
  queryDerivativesAccountCumulativeProfitLoss,
  queryDerivativesAccountDailyProfitLoss,
  queryDerivativesTodayOpenPosition,
  queryCashBalanceDetail,
  queryStockBalanceDetail,
  queryAssetInfoDetail,
  queryLoanHistory,
  queryTransactionStatement,
  queryBiometricStatus,
  registerAccount,
  resendOTPRegsiterAccount,
  registerAccountConfirmOTP,
  sendIdImage,
  getFaceAction,
  sendFaceImages,
  queryBankList,
  queryBankBranch,
  checkReferralCode,
  finishRegisterAccount,
  idSendNeedSupport,
  queryAccountMargin,
  queryAccountCashBalance,
  queryBankInfoIica,
} from './sagas/Account';
import { addSymbol, clearSymbol, removeSymbol } from './sagas/Search';
import { getAWSSignedData, uploadImageToAWS } from './sagas/AWS';
import { updateProfile } from './sagas/User';
import {
  queryWithdrawBankAccounts,
  withdrawRequest,
  queryWithdrawHistory,
  cancelWithdrawRequest,
  queryDerivativesWithdrawInfo,
  queryWithdrawBankAccountsInfo,
} from './sagas/WithdrawMoney';
import {
  queryCashTransferAccounts,
  queryDerivativesCashTransferInfo,
  cashTransferRequest,
  queryCashTransferHistory,
  cancelCashTransferRequest,
  queryStockTransferBalance,
  queryStockTransferHistory,
  stockTransferRequest,
  queryDerivativesTransferIMBank,
  queryDerivativesTransferIMFee,
  queryDerivativesDepositIMInfo,
  queryDerivativesWithdrawIMInfo,
  queryDerivativesTransferIMHistory,
  depositIMRequest,
  withdrawIMRequest,
} from './sagas/Transfer';
import {
  queryAvailableSecuredLoan,
  querySecuredLoanHistory,
  querySecuredLoanBanks,
  querySecuredLoanDetail,
  registerSecuredLoan,
  calculatorInterest,
} from './sagas/SecuredLoan';
import {
  queryRightsAvailable,
  queryRightsDetail,
  queryRightsSubscriptionAvailable,
  registerRightsSubscription,
} from './sagas/Rights';
import { handleOrderMatch, handleStopOrderActivation, handleAlarmPrice } from './sagas/Notification';
import {
  queryDerivativesMarginCall,
  queryDerivativesSettlementHistory,
  queryDerivativesPositionHistory,
} from './sagas/History';
import { openBankAccount } from './sagas/OpenBankAccount';
import { ekycCheckID } from './sagas/Ekyc';
import { submitAdvancepayment, checkTime, queryTransactionInfo } from './sagas/CashInAdvance';
import { watchPortfolio } from './sagas/Portfolio';
import { watchPositionStatementQuery } from './sagas/PositionStatement';
import { watchQueryCashStatement } from './sagas/CashStatement';
import { watchResetPassword } from './sagas/forgotPassword';
import { watchConfirmAccountNo } from './sagas/forgotPassword/confirmAccountNo';

export default function* () {
  yield all([
    //Socket
    initSocket(),

    //Localization
    initI18n(),
    changeLanguage(),

    //Common
    showNotification(),
    changeSettings(),

    //Authentication
    loginDomain(),
    loginBiometric(),
    registerBiometric(),
    verifyOTPBiometric(),
    verifyOTP(),
    loginViewMode(),
    logout(),
    resendLoginOTP(),
    generateNewKisCard(),

    //Notification
    handleOrderMatch(),
    handleStopOrderActivation(),
    handleAlarmPrice(),

    //AWS
    getAWSSignedData(),
    uploadImageToAWS(),

    //User
    updateProfile(),
    queryBiometricStatus(),

    //Market
    initMarket(),
    initMarketExtra(),
    setCurrentSymbol(),
    setCurrentIndex(),
    querySymbolData(),
    subscribeSymbol(),
    subscribeCurrentSymbol(),
    unsubscribeSymbol(),
    getUpDownStockRanking(),
    getMinuteSymbolData(),
    getQuoteSymbolData(),
    getPeriodSymbolData(),
    getTickSymbolData(),
    getForeignerSymbolData(),
    followMarketRefresh(),

    //Business Info
    queryBusinessInfo(),

    //Search
    addSymbol(),
    clearSymbol(),
    removeSymbol(),

    //Favorite
    getFavoriteLists(),
    changeFavoriteLists(),
    updateFavoriteList(),
    updateFavoriteListOrder(),
    addFavoriteList(),
    deleteFavoriteList(),

    //Alarm
    getAlarmSettings(),
    addAlarmSetting(),
    updateAlarmSetting(),
    deleteAlarmSetting(),

    //News
    querySymbolNews(),
    queryFavoriteNews(),

    //Account
    changeAccount(),
    changeOrderPassword(),
    changeHTSPassword(),
    queryAccountInfo(),
    queryAllAccounts(),
    queryEquityAccountBank(),
    queryEquityAccountBalance(),
    queryStockBalance(),
    queryEquityBuyableInfo(),
    queryEquitySellableInfo(),
    queryAccountMobile(),
    queryCashBalanceDetail(),
    queryStockBalanceDetail(),
    queryTransactionStatement(),
    queryAccountCashBalance(),

    //Order
    queryOrderHistory(),
    queryOrderTodayUnmatch(),
    queryStopOrderHistory(),
    queryAllStopOrderHistory(),
    queryAdvanceOrderHistory(),
    queryOddlotSellabeStocks(),
    queryOddlotOrderHistory(),
    queryOddlotOrderTodayUnmatch(),
    placeEquityOrder(),
    placeEquitySpeedOrder(),
    modifyEquityOrder(),
    modifyEquitySpeedOrder(),
    cancelEquityOrder(),
    cancelEquitySpeedOrder(),
    moveEquitySpeedOrder(),
    queryAccountMargin(),

    //Withdraw Money
    queryWithdrawBankAccounts(),
    withdrawRequest(),
    queryWithdrawHistory(),
    cancelWithdrawRequest(),
    queryDerivativesWithdrawInfo(),
    queryWithdrawBankAccountsInfo(),

    //Cash Transfer
    queryCashTransferAccounts(),
    cashTransferRequest(),
    queryCashTransferHistory(),
    cancelCashTransferRequest(),

    //Stock Transfer
    queryStockTransferBalance(),
    queryStockTransferHistory(),
    stockTransferRequest(),

    //Secured Loan
    queryAvailableSecuredLoan(),
    querySecuredLoanHistory(),
    querySecuredLoanBanks(),
    querySecuredLoanDetail(),
    registerSecuredLoan(),

    // CashInAdvance
    submitAdvancepayment(),
    checkTime(),
    queryTransactionInfo(),

    //Rights
    queryRightsAvailable(),
    queryRightsDetail(),
    registerRightsSubscription(),
    queryRightsSubscriptionAvailable(),

    //Derivatives Account
    queryDerivativesAccountSummary(),
    queryDerivativesAccountEquity(),
    queryDerivativesAccountDailyBalance(),
    queryDerivativesAccountRiskRatio(),
    queryDerivativesAccountCumulativeProfitLoss(),
    queryDerivativesAccountDailyProfitLoss(),
    queryDerivativesTodayOpenPosition(),

    //Derivatives Order
    queryDerivativesOrderHistory(),
    queryDerivativesStopOrderHistory(),
    queryDerivativesOrderTodayUnmatch(),
    queryDerivativesAdvanceOrderHistory(),
    placeDerivativesOrder(),
    placeDerivativesSpeedOrder(),
    cancelDerivativesOrder(),
    cancelDerivativesSpeedOrder(),
    moveDerivativesSpeedOrder(),
    modifyDerivativesOrder(),
    queryDerivativesOrderAvailable(),

    //Derivatives Transfer
    queryDerivativesCashTransferInfo(),
    queryDerivativesTransferIMBank(),
    queryDerivativesTransferIMFee(),
    queryDerivativesDepositIMInfo(),
    queryDerivativesWithdrawIMInfo(),
    queryDerivativesTransferIMHistory(),
    depositIMRequest(),
    withdrawIMRequest(),

    //Derivatives History
    queryDerivativesMarginCall(),
    queryDerivativesPositionHistory(),
    queryDerivativesSettlementHistory(),

    //Asset Loan Information
    queryAssetInfoDetail(),
    queryLoanHistory(),

    //Register Account
    registerAccount(),
    resendOTPRegsiterAccount(),
    registerAccountConfirmOTP(),
    sendIdImage(),
    sendFaceImages(),
    getFaceAction(),
    queryBankList(),
    queryBankBranch(),
    checkReferralCode(),
    finishRegisterAccount(),
    idSendNeedSupport(),

    //Open Bank Account
    openBankAccount(),

    // Ekyc
    ekycCheckID(),
    // ekycRegisterSaga(),

    notifyMobileOtp(),
    //Portfolio
    watchPortfolio(),
    //PositionStatement
    watchPositionStatementQuery(),
    //Cash Statement
    watchQueryCashStatement(),
    // IICA Account
    queryBankInfoIica(),
    calculatorInterest(),

    //Forgot password
    watchResetPassword(),
    watchConfirmAccountNo(),
  ]);
}
