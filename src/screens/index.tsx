import React from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import AnimatedSplash from 'react-native-animated-splash-screen';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import store from 'redux-sagas/store';
import { DropdownAlertOverlay } from 'components/DropdownAlert';
import FavoritePicker from 'components/FavoritePicker';
import SymbolSearchInput from 'components/SymbolSearchInput';
import App from './App';
import Login from './Login';
import Market from './Market';
import FavoriteList from './FavoriteList';
import FavoriteNews from './FavoriteNews';
import FavoriteLists from './FavoriteLists';
import IndexList from './IndexList';
import Ranking from './Ranking';
import UpDownRankingDetail from './UpDownRankingDetail';
import SymbolInfo from './SymbolInfo';
import IndexInfo from './IndexInfo';
import NewsDetail from './NewsDetail';
import SpeedOrder from './SpeedOrder';
import SymbolSearch from './SymbolSearch';
import More from './More';
import UserProfile from './UserProfile';
import ChangeOrderPassword from './ChangeOrderPassword';
import ChangeHTSPassword from './ChangeHTSPassword';
import ChangePassword from './ChangePassword';
import MarginAndAssetInfo from './MarginAndAssetInfo';
import Order from './Order';
import AccountBalance from './Equity/AccountBalance';
import TransactionStatement from './Equity/TransactionStatement';
import StockBalance from './Equity/StockBalance';
import BalanceDetail from './Equity/BalanceDetail';
import OrderHistory from './Equity/OrderHistory';
import OddlotOrder from './Equity/OddlotOrder';
import WithdrawMoney from './WithdrawMoney';
import CashTransfer from './CashTransfer';
import StockTransfer from './Equity/StockTransfer';
import SecuredLoan from './Equity/SecuredLoan';
import RightsSubscription from './Equity/RightsSubscription';
import DerivativesAccount from './Derivatives/Account';
import TodayOpenPosition from './Derivatives/TodayOpenPosition';
import DerivativesProfitLoss from './Derivatives/ProfitLoss';
import DerivativesHistory from './Derivatives/History';
import DerivativesOrderHistory from './Derivatives/OrderHistory';
import DepositIM from './Derivatives/DepositIM';
import WithdrawIM from './Derivatives/WithdrawIM';
import Settings from './Settings';
import AlarmList from './AlarmList';
import EkycFirstStep from './Ekyc/FirstStep';
import EkycPersonalInformation from './Ekyc/PersonalInformation';
import EkycServiceInformation from './Ekyc/ServiceInformation';
import EkycSuccessfulRegistration from './Ekyc/SuccessfulRegistration';
import EkycUploadSignature from './Ekyc/Signature';
import EkycStepProgress from './Ekyc/StepProgress';
import WithdrawAndTransfer from './WithdrawAndTransfer';
import { SymbolAlarmDetail, IndexAlarmDetail } from './AlarmDetail';
import config from 'config';
import RegisterAccount from './RegisterAccount';
import IdPhase from './IdPhase';
import IdScanner from './IdScanner';
import FacePhase from './FacePhase';
import FaceScanner from './FaceScanner';
import ConfirmInfo from './ConfirmInfo';
import RegisterAccountService from './RegisterAccountService';
import IdSupport from './IdSupport';
import TopBarStep from 'components/TopBarStep';
import RegisterAccountLastNotification from './RegisterAccountLastNotification';
import OpenBankAccount from './OpenBankAccount';
import OpenBankAccountDetail from './OpenBankAccountDetail';
import EkycOTP from './Ekyc/EkycOTP';
import Portfolio from './Portfolio';
import PositionStatement from './PositionStatement';
import DerivativesCashStatement from './Derivatives/CashStatement';
import ForgotPassword from './ForgotPassword';

export function registerScreens() {
  Navigation.registerComponent('DropdownAlert', () => DropdownAlertOverlay);
  Navigation.registerComponent(
    'FavoritePicker',
    () => (props) => (
      <Provider store={store}>
        <FavoritePicker {...props} />
      </Provider>
    ),
    () => FavoritePicker
  );

  Navigation.registerComponent(
    'SymbolSearchInput',
    () => (props) => (
      <Provider store={store}>
        <SymbolSearchInput {...props} />
      </Provider>
    ),
    () => SymbolSearchInput
  );

  Navigation.registerComponent(
    'TopBarStep',
    () => (props) => (
      <Provider store={store}>
        <TopBarStep {...props} />
      </Provider>
    ),
    () => TopBarStep
  );

  Navigation.registerComponent(
    'TradeX',
    () => (props) => (
      <Provider store={store}>
        <AnimatedSplash
          translucent={true}
          isLoaded={false}
          imageBackgroundSource={config.companyInfo[config.domain].launch}
        >
          <App {...props} />
        </AnimatedSplash>
      </Provider>
    ),
    () => App
  );
  Navigation.registerComponent(
    'Login',
    () => (props) => (
      <Provider store={store}>
        <Login {...props} />
      </Provider>
    ),
    () => Login
  );
  Navigation.registerComponent(
    'Market',
    () => (props) => (
      <Provider store={store}>
        <Market {...props} />
      </Provider>
    ),
    () => Market
  );
  Navigation.registerComponent(
    'IdSupport',
    () => (props) => (
      <Provider store={store}>
        <IdSupport {...props} />
      </Provider>
    ),
    () => IdSupport
  );
  Navigation.registerComponent(
    'FavoriteNews',
    () => (props) => (
      <Provider store={store}>
        <FavoriteNews {...props} />
      </Provider>
    ),
    () => FavoriteNews
  );
  Navigation.registerComponent(
    'RegisterAccount',
    () => (props) => (
      <Provider store={store}>
        <RegisterAccount {...props} />
      </Provider>
    ),
    () => RegisterAccount
  );
  Navigation.registerComponent(
    'IdPhase',
    () => (props) => (
      <Provider store={store}>
        <IdPhase {...props} />
      </Provider>
    ),
    () => IdPhase
  );
  Navigation.registerComponent(
    'RegisterAccountLastNotification',
    () => (props) => (
      <Provider store={store}>
        <RegisterAccountLastNotification {...props} />
      </Provider>
    ),
    () => RegisterAccountLastNotification
  );
  Navigation.registerComponent(
    'FacePhase',
    () => (props) => (
      <Provider store={store}>
        <FacePhase {...props} />
      </Provider>
    ),
    () => FacePhase
  );
  Navigation.registerComponent(
    'IdScanner',
    () => (props) => (
      <Provider store={store}>
        <IdScanner {...props} />
      </Provider>
    ),
    () => IdScanner
  );
  Navigation.registerComponent(
    'FaceScanner',
    () => (props) => (
      <Provider store={store}>
        <FaceScanner {...props} />
      </Provider>
    ),
    () => FaceScanner
  );
  Navigation.registerComponent(
    'ConfirmInfo',
    () => (props) => (
      <Provider store={store}>
        <ConfirmInfo {...props} />
      </Provider>
    ),
    () => ConfirmInfo
  );
  Navigation.registerComponent(
    'RegisterAccountService',
    () => (props) => (
      <Provider store={store}>
        <RegisterAccountService {...props} />
      </Provider>
    ),
    () => RegisterAccountService
  );
  Navigation.registerComponent(
    'FavoriteList',
    () => (props) => (
      <Provider store={store}>
        <FavoriteList {...props} />
      </Provider>
    ),
    () => FavoriteList
  );
  Navigation.registerComponent(
    'FavoriteLists',
    () => (props) => (
      <Provider store={store}>
        <FavoriteLists {...props} />
      </Provider>
    ),
    () => FavoriteLists
  );
  Navigation.registerComponent(
    'IndexList',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <IndexList {...props} />
        </Provider>
      )),
    () => IndexList
  );
  Navigation.registerComponent(
    'Ranking',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <Ranking {...props} />
        </Provider>
      )),
    () => Ranking
  );
  Navigation.registerComponent(
    'UpDownRankingDetail',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <UpDownRankingDetail {...props} />
        </Provider>
      )),
    () => UpDownRankingDetail
  );
  Navigation.registerComponent(
    'SpeedOrder',
    () => (props) => (
      <Provider store={store}>
        <SpeedOrder {...props} />
      </Provider>
    ),
    () => SpeedOrder
  );
  Navigation.registerComponent(
    'SymbolInfo',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <SymbolInfo {...props} />
        </Provider>
      )),
    () => SymbolInfo
  );
  Navigation.registerComponent(
    'IndexInfo',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <IndexInfo {...props} />
        </Provider>
      )),
    () => IndexInfo
  );
  Navigation.registerComponent(
    'NewsDetail',
    () => (props) => (
      <Provider store={store}>
        <NewsDetail {...props} />
      </Provider>
    ),
    () => NewsDetail
  );
  Navigation.registerComponent(
    'SymbolSearch',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <SymbolSearch {...props} />
        </Provider>
      )),
    () => SymbolSearch
  );
  Navigation.registerComponent(
    'More',
    () => (props) => (
      <Provider store={store}>
        <More {...props} />
      </Provider>
    ),
    () => More
  );
  Navigation.registerComponent(
    'UserProfile',
    () => (props) => (
      <Provider store={store}>
        <UserProfile {...props} />
      </Provider>
    ),
    () => UserProfile
  );

  Navigation.registerComponent(
    'ChangeOrderPassword',
    () => (props) => (
      <Provider store={store}>
        <ChangeOrderPassword {...props} />
      </Provider>
    ),
    () => ChangeOrderPassword
  );

  Navigation.registerComponent(
    'ChangePassword',
    () => (props) => (
      <Provider store={store}>
        <ChangePassword {...props} />
      </Provider>
    ),
    () => ChangePassword
  );

  Navigation.registerComponent(
    'WithdrawAndTransfer',
    () => (props) => (
      <Provider store={store}>
        <WithdrawAndTransfer {...props} />
      </Provider>
    ),
    () => WithdrawAndTransfer
  );

  Navigation.registerComponent(
    'ChangeHTSPassword',
    () => (props) => (
      <Provider store={store}>
        <ChangeHTSPassword {...props} />
      </Provider>
    ),
    () => ChangeHTSPassword
  );

  Navigation.registerComponent(
    'MarginAndAssetInfo',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <MarginAndAssetInfo {...props} />
        </Provider>
      )),
    () => MarginAndAssetInfo
  );

  Navigation.registerComponent(
    'Order',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <Order {...props} />
        </Provider>
      )),
    () => Order
  );

  Navigation.registerComponent(
    'AccountBalance',
    () => (props) => (
      <Provider store={store}>
        <AccountBalance {...props} />
      </Provider>
    ),
    () => AccountBalance
  );

  Navigation.registerComponent('TransactionStatement', () => (props) => (
    <Provider store={store}>
      <TransactionStatement {...props} />
    </Provider>
  ));

  Navigation.registerComponent(
    'StockBalance',
    () => (props) => (
      <Provider store={store}>
        <StockBalance {...props} />
      </Provider>
    ),
    () => StockBalance
  );

  Navigation.registerComponent(
    'OrderHistory',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <OrderHistory {...props} />
        </Provider>
      )),
    () => OrderHistory
  );
  Navigation.registerComponent(
    'OddlotOrder',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <OddlotOrder {...props} />
        </Provider>
      )),
    () => OddlotOrder
  );
  Navigation.registerComponent(
    'WithdrawMoney',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <WithdrawMoney {...props} />
        </Provider>
      )),
    () => WithdrawMoney
  );
  Navigation.registerComponent(
    'CashTransfer',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <CashTransfer {...props} />
        </Provider>
      )),
    () => CashTransfer
  );
  Navigation.registerComponent(
    'StockTransfer',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <StockTransfer {...props} />
        </Provider>
      )),
    () => StockTransfer
  );
  Navigation.registerComponent(
    'SecuredLoan',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <SecuredLoan {...props} />
        </Provider>
      )),
    () => SecuredLoan
  );
  Navigation.registerComponent(
    'RightsSubscription',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <RightsSubscription {...props} />
        </Provider>
      )),
    () => RightsSubscription
  );
  Navigation.registerComponent(
    'BalanceDetail',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <BalanceDetail {...props} />
        </Provider>
      )),
    () => BalanceDetail
  );
  Navigation.registerComponent(
    'DerivativesAccount',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <DerivativesAccount {...props} />
        </Provider>
      )),
    () => DerivativesAccount
  );
  Navigation.registerComponent(
    'DerivativesCashStatement',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <DerivativesCashStatement {...props} />
        </Provider>
      )),
    () => DerivativesAccount
  );
  Navigation.registerComponent(
    'TodayOpenPosition',
    () => (props) => (
      <Provider store={store}>
        <TodayOpenPosition {...props} />
      </Provider>
    ),
    () => TodayOpenPosition
  );
  Navigation.registerComponent(
    'DerivativesProfitLoss',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <DerivativesProfitLoss {...props} />
        </Provider>
      )),
    () => DerivativesProfitLoss
  );
  Navigation.registerComponent(
    'DerivativesHistory',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <DerivativesHistory {...props} />
        </Provider>
      )),
    () => DerivativesHistory
  );
  Navigation.registerComponent(
    'DerivativesOrderHistory',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <DerivativesOrderHistory {...props} />
        </Provider>
      )),
    () => DerivativesOrderHistory
  );
  Navigation.registerComponent(
    'DerivativesDepositIM',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <DepositIM {...props} />
        </Provider>
      )),
    () => DepositIM
  );
  Navigation.registerComponent(
    'OpenBankAccount',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <OpenBankAccount {...props} />
        </Provider>
      )),
    () => OpenBankAccount
  );
  Navigation.registerComponent(
    'OpenBankAccountDetail',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <OpenBankAccountDetail {...props} />
        </Provider>
      )),
    () => OpenBankAccountDetail
  );
  Navigation.registerComponent(
    'DerivativesWithdrawIM',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <WithdrawIM {...props} />
        </Provider>
      )),
    () => WithdrawIM
  );

  Navigation.registerComponent(
    'Settings',
    () => (props) => (
      <Provider store={store}>
        <Settings {...props} />
      </Provider>
    ),
    () => Settings
  );

  Navigation.registerComponent(
    'AlarmList',
    () => (props) => (
      <Provider store={store}>
        <AlarmList {...props} />
      </Provider>
    ),
    () => AlarmList
  );

  Navigation.registerComponent(
    'SymbolAlarmDetail',
    () => (props) => (
      <Provider store={store}>
        <SymbolAlarmDetail {...props} />
      </Provider>
    ),
    () => SymbolAlarmDetail
  );

  Navigation.registerComponent(
    'IndexAlarmDetail',
    () => (props) => (
      <Provider store={store}>
        <IndexAlarmDetail {...props} />
      </Provider>
    ),
    () => IndexAlarmDetail
  );

  Navigation.registerComponent(
    'EkycFirstStep',
    () => (props) => (
      <Provider store={store}>
        <EkycFirstStep {...props} />
      </Provider>
    ),
    () => EkycFirstStep
  );

  Navigation.registerComponent(
    'EkycPersonalInformation',
    () => (props) => (
      <Provider store={store}>
        <EkycPersonalInformation {...props} />
      </Provider>
    ),
    () => EkycPersonalInformation
  );

  Navigation.registerComponent(
    'EkycServiceInformation',
    () => (props) => (
      <Provider store={store}>
        <EkycServiceInformation {...props} />
      </Provider>
    ),
    () => EkycServiceInformation
  );
  Navigation.registerComponent(
    'EkycSuccessfulRegistration',
    () => (props) => (
      <Provider store={store}>
        <EkycSuccessfulRegistration {...props} />
      </Provider>
    ),
    () => EkycSuccessfulRegistration
  );
  Navigation.registerComponent(
    'EkycStepProgress',
    () => (props) => (
      <Provider store={store}>
        <EkycStepProgress {...props} />
      </Provider>
    ),
    () => EkycStepProgress
  );
  Navigation.registerComponent(
    'EkycUploadSignature',
    () => (props) => (
      <Provider store={store}>
        <EkycUploadSignature {...props} />
      </Provider>
    ),
    () => EkycUploadSignature
  );
  Navigation.registerComponent(
    'EkycOTP',
    () => (props) => (
      <Provider store={store}>
        <EkycOTP {...props} />
      </Provider>
    ),
    () => EkycOTP
  );
  Navigation.registerComponent(
    'Portfolio',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <Portfolio {...props} />
        </Provider>
      )),
    () => Portfolio
  );
  Navigation.registerComponent(
    'PositionStatement',
    () =>
      gestureHandlerRootHOC((props) => (
        <Provider store={store}>
          <PositionStatement {...props} />
        </Provider>
      )),
    () => PositionStatement
  );

  if (config.usingNewKisCore) {
    Navigation.registerComponent(
      'ForgotPassword',
      () =>
        gestureHandlerRootHOC((props) => (
          <Provider store={store}>
            <ForgotPassword {...props} />
          </Provider>
        )),
      () => PositionStatement
    );
  }
}
