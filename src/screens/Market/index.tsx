import React from 'react';
import { View, Alert, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ImageSource } from 'react-native-vector-icons/Icon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { withErrorBoundary } from 'react-error-boundary';
import { connect } from 'react-redux';
import OneSignal from 'react-native-onesignal';
import store from 'redux-sagas/store';
import { FAVORITE_SORT_TYPE, LANG } from 'global';
import { goToSymbolSearch, goToAlarmList, goToSymbolInfo } from 'navigations';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import IndexSlider from 'components/IndexSlider';
import FavoriteSelect from 'components/FavoriteSelect';
import FavoriteDetail from 'components/FavoriteDetail';
import UserInactivity from 'components/UserInactivity';
import { IState } from 'redux-sagas/reducers';
import { IAccount } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { IAlarmPrice } from 'interfaces/notification';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { backInfoIica, initMarket, setCurrentSymbol } from 'redux-sagas/global-actions';
import { INIT_SOCKET_ERROR } from 'redux-sagas/global-reducers/AppInit-reducers';
import { initMarketExtra, toggleBanner } from './actions';
import { Colors } from 'styles';
import styles from './styles';
import { TBankInfoIica } from 'redux-sagas/global-reducers/bankAccountIica';
import { changeLanguage } from 'components/LanguagePicker/actions';
import { setKey } from 'utils/asyncStorage';
import { REFRESH_TOKEN } from 'redux-sagas/actions';

interface IMarketProps extends React.ClassAttributes<Market>, WithTranslation {
  marketInit: boolean;
  bannerVisible: boolean;
  initSocketError: {
    isError: boolean;
    error: string;
  };

  selectedAccount: IAccount | null;

  bankInfoIica: TBankInfoIica | null;

  accountList: IAccount[];

  initMarket(): void;

  initMarketExtra(): void;

  setCurrentSymbol(payload: ISymbolInfo): void;

  toggleBanner(payload: boolean): void;

  backInfoIica(params: { account: IAccount }): void;

  changeLanguage(lang: { lang: LANG; callApi: boolean }): void;
}

interface IMarketState {
  visible: boolean;
  sortType: FAVORITE_SORT_TYPE;
}

class Market extends React.Component<IMarketProps, IMarketState> {
  private alarmIcon: ImageSource;
  private searchIcon: ImageSource;

  constructor(props: IMarketProps) {
    super(props);
    Navigation.events().bindComponent(this);

    this.state = {
      visible: false,
      sortType: FAVORITE_SORT_TYPE.NO_SORT,
    };
  }

  async componentDidMount() {
    const refreshToken = global.domainSocket?.authToken?.refreshToken;

    if (refreshToken) {
      await setKey(REFRESH_TOKEN, refreshToken);
    }

    if (this.props.initSocketError.isError === true) {
      Alert.alert('Error', this.props.initSocketError.error, [
        {
          text: 'OK',
          onPress: () => {
            store.dispatch({
              type: INIT_SOCKET_ERROR,
              payload: {
                isError: false,
                error: '',
              },
            });
          },
        },
      ]);
    }

    this.props.changeLanguage({ lang: global.lang, callApi: true });
  }

  componentDidAppear() {
    this.props.initMarket();
    if (this.props.marketInit === true) {
      // this.props.initMarketExtra();

      if (global.triggerData != null) {
        if (global.triggerData.method === 'ALARM_PRICE') {
          this.handleAlarmPrice(global.triggerData as IAlarmPrice);
        }

        global.triggerData = null;
      }
    }

    this.setState(
      {
        visible: true,
      },
      async () => {
        this.alarmIcon = await FontAwesome.getImageSource('bell-o', 22, Colors.WHITE);
        this.searchIcon = await MaterialIcons.getImageSource('search', 25, Colors.WHITE);
        this.updateTopBar();
      }
    );

    // SplashScreen.hide();

    if (store.getState().userInfo) {
      if (global.viewMode !== true) {
        OneSignal.getTags((tags: { [key: string]: string } | null) => {
          let mobileOTP = null;
          let otherNotifications = null;

          if (tags) {
            mobileOTP = tags.mobileOTP;
            otherNotifications = tags.otherNotifications;
          }

          global.mobileOTP = mobileOTP == null ? true : mobileOTP === 'true';
          global.otherNotifications = otherNotifications == null ? true : otherNotifications === 'true';

          OneSignal.sendTags({
            userId: store.getState().userInfo!.id != null ? store.getState().userInfo!.id.toString() : '',
            username: global.username && global.username.toLowerCase(),
            deviceType: 'mobile',
            mobileOTP: mobileOTP == null ? 'true' : (mobileOTP as string),
            otherNotifications: otherNotifications == null ? 'true' : (otherNotifications as string),
          });
        });
      }
    }

    this.checkIica();
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  private readonly checkIica = () => {
    if (this.props.accountList) {
      this.props.accountList.map(async (item) => {
        await this.props.backInfoIica({
          account: item,
        });
      });
    }
  };

  private updateTopBar = () => {
    const rightButtons = [
      {
        id: 'AlarmButton',
        icon: this.alarmIcon,
        color: Colors.WHITE,
      },
      {
        id: 'SearchButton',
        icon: this.searchIcon,
        color: Colors.WHITE,
      },
    ];

    Navigation.mergeOptions('Market', {
      topBar: {
        title: {
          text: this.props.t('Market'),
        },
        rightButtons: Platform.OS === 'ios' ? rightButtons : undefined,
      },
    });
  };

  shouldComponentUpdate(nextProps: IMarketProps) {
    if (this.props.marketInit !== nextProps.marketInit && nextProps.marketInit === true) {
      if (global.triggerData != null) {
        if (global.triggerData.method === 'ALARM_PRICE') {
          this.handleAlarmPrice(global.triggerData as IAlarmPrice);
        }

        global.triggerData = null;
      }
      this.props.initMarketExtra();
    }
    this.updateTopBar();

    if (
      this.props.initSocketError.isError !== nextProps.initSocketError.isError &&
      nextProps.initSocketError.isError === true
    ) {
      Alert.alert('Error', nextProps.initSocketError.error, [
        {
          text: 'OK',
          onPress: () => {
            store.dispatch({
              type: INIT_SOCKET_ERROR,
              payload: {
                isError: false,
                error: '',
              },
            });
          },
        },
      ]);
    }
    return true;
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    switch (buttonId) {
      case 'SearchButton':
        goToSymbolSearch('Market');
        break;
      case 'AlarmButton':
        goToAlarmList('Market');
        break;
      default:
        break;
    }
  }

  private handleAlarmPrice = (data: IAlarmPrice) => {
    const symbolMap = getSymbolMap(store.getState());
    if (symbolMap) {
      const symbolInfo = symbolMap[data.code as string];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);
        goToSymbolInfo('Market');
      }
    }
  };

  private onChangeSortType = (value: FAVORITE_SORT_TYPE) => {
    this.setState({
      sortType: value,
    });
  };

  render() {
    return (
      this.state.visible && (
        <UserInactivity>
          <View style={styles.container}>
            <View style={styles.indexSliderContainer}>
              <IndexSlider />
            </View>
            <View style={[styles.favoriteSection, { ...(this.props.bannerVisible !== true && styles.paddingTop) }]}>
              <FavoriteSelect onChangeSortType={this.onChangeSortType} />
            </View>
            <View style={styles.symbolPriceSection}>
              <FavoriteDetail sortType={this.state.sortType} />
            </View>
          </View>
        </UserInactivity>
      )
    );
  }
}

const mapStateToProps = (state: IState) => ({
  marketInit: state.marketInit,
  bannerVisible: state.bannerVisible,
  initSocketError: state.initSocketError,
  selectedAccount: state.selectedAccount,
  bankInfoIica: state.bankInfoIica,
  accountList: state.accountList,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      initMarket,
      initMarketExtra,
      setCurrentSymbol,
      toggleBanner,
      backInfoIica,
      changeLanguage,
    })(Market)
  ),
  Fallback,
  handleError
);
