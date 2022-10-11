import React from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator, Alert, BackHandler, Platform, Linking } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import SendIntentAndroid from 'react-native-send-intent';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import config, { IBIZItem } from 'config';
import { goToUserProfile, goToBiz, goToSettings } from 'navigations';
import { SYSTEM_TYPE } from 'global';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import { IState } from 'redux-sagas/reducers';
import { IUserInfo, IAccount, IAccountInfo, IObject } from 'interfaces/common';
import { signOut } from 'redux-sagas/global-actions';
import { queryAccountInfo } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IMoreProps extends React.ClassAttributes<More>, WithTranslation {
  userInfo: IUserInfo | null;
  accountInfo: IAccountInfo | null;
  selectedAccount: IAccount | null;

  signOut(payload?: IObject): void;

  queryAccountInfo(): void;
}

interface IMoreState {
  visible: boolean;
}

class More extends React.Component<IMoreProps, IMoreState> {
  constructor(props: IMoreProps) {
    super(props);

    Navigation.events().bindComponent(this);

    this.state = {
      visible: false,
    };
  }

  componentDidAppear() {
    if (global.isIicaAccount && config.usingNewKisCore) {
      config.equityMenu = config.equityMenu.filter((item) => item.name !== 'WithdrawMoney');
    }

    this.setState(
      {
        visible: true,
      },
      () => {
        this.updateTopBar(this.props.accountInfo);
        if (global.viewMode !== true && this.props.accountInfo == null) {
          this.props.queryAccountInfo();
        }
      }
    );
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  shouldComponentUpdate(nextProps: IMoreProps, nextState: IMoreState) {
    if (nextProps.accountInfo !== this.props.accountInfo) {
      this.updateTopBar(nextProps.accountInfo);
      return true;
    }

    if (nextProps.selectedAccount !== this.props.selectedAccount && global.viewMode !== true) {
      if (global.isIicaAccount && config.usingNewKisCore) {
        config.equityMenu = config.equityMenu.filter((item) => item.name !== 'WithdrawMoney');
      }
      if (nextProps.selectedAccount?.accountNumber !== this.props.selectedAccount?.accountNumber) {
        this.props.queryAccountInfo();
      }
      return true;
    }

    if (nextState.visible !== this.state.visible || nextProps.userInfo !== this.props.userInfo) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  private handleBackButton = () => {
    switch (global.currentComponent) {
      case 'Market':
      case 'Ranking':
      case 'SpeedOrder':
      case 'SymbolInfo':
      case 'More': {
        this.signOut();
        return true;
      }
      default:
        return false;
    }
  };

  private updateTopBar = (accountInfo: IAccountInfo | null) => {
    if (accountInfo != null) {
      Navigation.mergeOptions('More', {
        topBar: {
          title: {
            text: global.viewMode === true ? this.props.t('More') : accountInfo.customerName,
          },
        },
      });
    } else {
      Navigation.mergeOptions('More', {
        topBar: {
          title: {
            text: this.props.t('More'),
          },
        },
      });
    }
  };

  private goToUserProfile = () => {
    goToUserProfile();
  };

  private goToCustomerService = () => {
    const phoneNumber = '+842839148585';
    if (Platform.OS === 'android') {
      SendIntentAndroid.sendPhoneDial(phoneNumber, false);
    } else {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  private goToSettings = () => {
    goToSettings('More');
  };

  private signOut = () => {
    Alert.alert(
      this.props.t('Sign out'),
      this.props.t('Do you want to log out?'),
      [
        {
          text: this.props.t('Cancel'),
          style: 'cancel',
        },
        {
          text: this.props.t('OK'),
          onPress: () => {
            this.props.signOut();
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  private openScreen = (item: IBIZItem) => {
    let title: string | undefined = item.screenTitle ? item.screenTitle : item.title;
    goToBiz(item.name, item.extraProps, 'More', title);
  };

  private renderBizItem = () => {
    if (this.props.selectedAccount) {
      const { t } = this.props;
      let menu = [];
      if (this.props.selectedAccount.type === SYSTEM_TYPE.EQUITY) {
        menu = config.equityMenu;
      } else {
        menu = config.derivativesMenu;
      }

      const items = [];

      for (let index = 0; index < menu.length; index += 3) {
        const itemLeft = menu[index];
        const itemMiddle = menu[index + 1];
        const itemRight = menu[index + 2];

        items.push(
          <View key={index} style={styles.row}>
            {itemLeft && (
              <View style={[styles.menuButton, styles.menuButtonLeft]}>
                <TouchableOpacity
                  style={[
                    styles.menuButton,
                    styles.menuButtonText,
                    ((this.props.selectedAccount &&
                      this.props.selectedAccount.isBankLinkingAccount === true &&
                      itemLeft.hideWhenLinkingBank === true) ||
                      global.viewMode === true) &&
                      styles.disabled,
                  ]}
                  {...((this.props.selectedAccount.isBankLinkingAccount !== true ||
                    itemLeft.hideWhenLinkingBank !== true) && { onPress: () => this.openScreen(itemLeft) })}
                  disabled={
                    (this.props.selectedAccount &&
                      this.props.selectedAccount.isBankLinkingAccount === true &&
                      itemLeft.hideWhenLinkingBank === true) ||
                    global.viewMode === true
                  }
                >
                  {itemLeft.icon}
                  <UIText allowFontScaling={false} style={styles.menuText}>
                    {t(itemLeft.title)}
                  </UIText>
                </TouchableOpacity>
              </View>
            )}
            {itemMiddle && (
              <View
                style={[
                  styles.menuButton,
                  styles.menuButtonMiddle,
                  ((this.props.selectedAccount &&
                    this.props.selectedAccount.isBankLinkingAccount === true &&
                    itemMiddle.hideWhenLinkingBank === true) ||
                    global.viewMode === true) &&
                    styles.disabled,
                ]}
              >
                <TouchableOpacity
                  style={[styles.menuButton, styles.menuButtonText]}
                  {...((this.props.selectedAccount.isBankLinkingAccount !== true ||
                    itemMiddle.hideWhenLinkingBank !== true) && { onPress: () => this.openScreen(itemMiddle) })}
                  disabled={
                    (this.props.selectedAccount &&
                      this.props.selectedAccount.isBankLinkingAccount === true &&
                      itemMiddle.hideWhenLinkingBank === true) ||
                    global.viewMode === true
                  }
                >
                  {itemMiddle.icon}
                  <UIText allowFontScaling={false} style={styles.menuText}>
                    {t(itemMiddle.title)}
                  </UIText>
                </TouchableOpacity>
              </View>
            )}
            {itemRight && (
              <View style={styles.menuButton}>
                <TouchableOpacity
                  style={[
                    styles.menuButton,
                    styles.menuButtonText,
                    ((this.props.selectedAccount &&
                      this.props.selectedAccount.isBankLinkingAccount === true &&
                      itemRight.hideWhenLinkingBank === true) ||
                      global.viewMode === true) &&
                      styles.disabled,
                  ]}
                  {...((this.props.selectedAccount.isBankLinkingAccount !== true ||
                    itemRight.hideWhenLinkingBank !== true) && { onPress: () => this.openScreen(itemRight) })}
                  disabled={
                    (this.props.selectedAccount &&
                      this.props.selectedAccount.isBankLinkingAccount === true &&
                      itemRight.hideWhenLinkingBank === true) ||
                    global.viewMode === true
                  }
                >
                  {itemRight.icon}
                  <UIText allowFontScaling={false} style={styles.menuText}>
                    {t(itemRight.title)}
                  </UIText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      }

      return items;
    }

    return null;
  };

  render() {
    const { t } = this.props;

    if (this.props.userInfo == null || (this.props.selectedAccount == null && global.viewMode !== true)) {
      return <ActivityIndicator />;
    }

    return (
      this.state.visible && (
        <UserInactivity>
          <View style={styles.container}>
            <TouchableOpacity style={styles.topSection} onPress={this.goToUserProfile}>
              <View style={styles.avatar}>
                <Image source={{ uri: `${this.props.userInfo.avatar}?${new Date()}` }} style={styles.avatarImage} />
              </View>

              <View style={styles.account}>
                <UIText allowFontScaling={false} style={styles.accountName}>
                  {this.props.accountInfo && !config.usingNewKisCore && this.props.accountInfo.customerName}
                  {config.usingNewKisCore && this.props.accountInfo?.customerProfile?.userName}
                </UIText>
              </View>

              <View style={styles.buttonNext}>
                <FeatherIcon style={styles.icon} name="chevron-right" />
              </View>
            </TouchableOpacity>
            {global.viewMode !== true && (
              <View style={styles.accountPicker}>
                <AccountPicker type="ALL" />
              </View>
            )}
            <View style={styles.mainSection}>
              <View style={styles.menuSection}>
                {this.renderBizItem()}
                {/* <View style={styles.innerMenuSection}>
                  {this.props.selectedAccount != null &&
                    menu.map((item, index) => {
                      <View key={index} style={{ width: width * 1 / 3, height: width * 1 / 3, borderBottomWidth: 1, borderBottomColor: Colors.GREY, justifyContent: 'center', alignItems: 'center' }}>

                      </View>
                    })
                  }
                </View> */}
              </View>

              <View style={styles.bottomSection}>
                <View style={styles.settingButton}>
                  <TouchableOpacity style={styles.bottomButton} onPress={this.goToCustomerService}>
                    <AntDesign name="customerservice" style={styles.iconBig} />
                    <UIText allowFontScaling={false} style={styles.textBig}>
                      {t('Customer Services')}
                    </UIText>
                  </TouchableOpacity>
                </View>

                <View style={styles.settingButton}>
                  <TouchableOpacity style={styles.bottomButton} onPress={this.goToSettings}>
                    <FeatherIcon name="settings" style={styles.iconBig} />
                    <UIText allowFontScaling={false} style={styles.textBig}>
                      {t('Setting')}
                    </UIText>
                  </TouchableOpacity>
                </View>

                <View style={styles.settingButton}>
                  <TouchableOpacity style={styles.bottomButton} onPress={this.signOut}>
                    <FeatherIcon name="log-out" style={styles.iconBig} />
                    <UIText allowFontScaling={false} style={styles.textBig}>
                      {t('Sign out')}
                    </UIText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </UserInactivity>
      )
    );
  }
}

const mapStateToProps = (state: IState) => ({
  userInfo: state.userInfo,
  selectedAccount: state.selectedAccount,
  accountInfo: state.accountInfo,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      signOut,
      queryAccountInfo,
    })(More)
  ),
  Fallback,
  handleError
);
