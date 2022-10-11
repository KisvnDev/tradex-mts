/* tslint:disable */
import React, { ReactNode } from 'react';
import * as scCodecMinBin from 'sc-codec-min-bin';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IObject } from 'interfaces/common';
import styles from 'styles';

export interface IBIZItem {
  name: string;
  title: string;
  icon: ReactNode;
  screenTitle?: string;
  extraProps?: IObject;
  hideWhenLinkingBank?: boolean;
}

export interface IOpenBankAccount {
  name: string;
  title: string;
  screenTitle: string;
  icon: any;
  splashImage: string;
  mainImage: any;
  content: string;
  mainContent: string;
  bankUrl: string;
  bankUrlBefore?: string;
  partnerCode?: string;
}

export interface IConfig {
  usingNewKisCore: boolean;
  domain: string;
  companyInfo: {
    [s: string]: {
      logo?: any;
      launch?: any;
    };
  };
  timeEachResendOTP: number;
  numberOfPushResend: number;
  equityMenu: IBIZItem[];
  derivativesMenu: IBIZItem[];
  apiUrl: {
    baseURI: string;
    domain: {
      clientId?: string;
      clientSecret?: string;
      socketCluster?: {
        hostname?: string;
        path?: string;
        secure?: boolean;
        port?: number;
        codecEngine: any;
        authTokenName?: string;
      };
    };
  };
  rest: {
    enable: boolean;
    baseUri: string;
    baseUriIICA: string;
  };
  fetchCount: number;
  limitNoteCharacters: number;
  alertTimeout: number;
  regex: {
    orderPassword: RegExp;
    HTSPassword: RegExp;
    ForgotPassword: RegExp;
  };
  urls: {
    symbolUrl: string;
    symbolUrlEnv: string;
    versionUrl: string;
  };
  oneSignal: string;
  codePushKey: string;
  releaseMode: boolean;
  appStoreLink: string;
  playStoreLink: string;
  defaultSymbol?: string;
  openBankAccount: IOpenBankAccount[];
}

let config: IConfig = {
  usingNewKisCore: true,
  domain: 'kis',
  companyInfo: {
    kis: {
      logo: require('../../assets/images/kis/logo.png'),
      launch: require('../../assets/images/kis/launch_screen.jpg'),
    },
  },
  timeEachResendOTP: 15,
  numberOfPushResend: 2,
  equityMenu: [
    {
      name: 'Order',
      title: 'Order',
      icon: <FontAwesome5 name="clipboard-check" style={styles.bizIcon} />,
    },
    {
      name: 'OrderHistory',
      title: 'Order History',
      icon: <Fontisto name="clock" style={styles.bizIcon} />,
    },
    {
      name: 'StockBalance',
      title: 'Portfolio',
      icon: <SimpleLineIcons name="bag" style={styles.bizIcon} />,
    },
    {
      name: 'AccountBalance',
      title: 'Asset Information',
      icon: <Fontisto name="line-chart" style={styles.bizIcon} />,
    },
    {
      name: 'WithdrawMoney',
      title: 'Withdraw Money',
      icon: <Fontisto name="wallet" style={styles.bizIcon} />,
      hideWhenLinkingBank: true,
    },
    {
      name: 'StockTransfer',
      title: 'Stock Transfer',
      icon: <MaterialCommunityIcons name="key-change" style={styles.bizIcon} />,
    },
    {
      name: 'SecuredLoan',
      title: 'Cash In Advance',
      icon: <Ionicons name="ios-help-buoy" style={styles.bizIcon} />,
    },
    {
      name: 'RightsSubscription',
      title: 'Rights Exercise',
      icon: <MaterialCommunityIcons name="shield-check-outline" style={styles.bizIcon} />,
    },
    {
      name: 'ChangePassword',
      title: 'Change Password',
      icon: <FontAwesome5 name="user-shield" style={styles.bizIcon} />,
    },
  ],
  derivativesMenu: [
    {
      name: 'Order',
      title: 'Order',
      icon: <FontAwesome5 name="clipboard-check" style={styles.bizIcon} />,
    },
    {
      name: 'DerivativesOrderHistory',
      title: 'Order History',
      screenTitle: 'Derivatives Order History',
      icon: <Fontisto name="clock" style={styles.bizIcon} />,
    },
    {
      name: 'Portfolio',
      title: 'Portfolio',
      icon: <SimpleLineIcons name="bag" style={styles.bizIcon} />,
    },
    {
      name: 'DerivativesAccount',
      title: 'Asset Information',
      icon: <Fontisto name="line-chart" style={styles.bizIcon} />,
    },
    {
      name: 'DerivativesCashStatement',
      title: 'Cash Statement',
      icon: <FontAwesome5 name="wpforms" style={styles.bizIcon} />,
    },
    {
      name: 'PositionStatement',
      title: 'Position Statement',
      icon: <FontAwesome5 name="life-ring" style={styles.bizIcon} />,
    },
    {
      name: 'WithdrawMoney',
      title: 'Withdraw Money',
      icon: <Fontisto name="wallet" style={styles.bizIcon} />,
      hideWhenLinkingBank: true,
    },
    {
      name: 'DerivativesWithdrawIM',
      title: 'Withdraw from VSD',
      icon: <SimpleLineIcons name="note" style={styles.bizIcon} />,
    },
    {
      name: 'DerivativesDepositIM',
      title: 'Deposit to VSD',
      icon: <SimpleLineIcons name="note" style={styles.bizIcon} />,
    },
    {
      name: 'ChangePassword',
      title: 'Change Password',
      icon: <FontAwesome5 name="user-shield" style={styles.bizIcon} />,
    },
  ],
  apiUrl: {
    baseURI: '/api/v1/',
    domain: {
      socketCluster: {
        hostname: 'trading.kisvn.vn',
        port: 443,
        path: '/ws/socketcluster/',
        codecEngine: scCodecMinBin,
        secure: true,
      },
    },
  },
  rest: {
    enable: true,
    baseUri: 'https://trading.kisvn.vn/rest',
    baseUriIICA: 'https://trading.kisvn.vn/restttl/',
  },
  fetchCount: 20,
  limitNoteCharacters: 99,
  alertTimeout: 3000,
  regex: {
    orderPassword: /^\d{4}$/,
    HTSPassword: /^(?=.*[0-9])(?=.*[a-zA-Z])([^-\s]){6,16}$/,
    ForgotPassword: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
  },
  urls: {
    symbolUrl: 'https://trading.kisvn.vn/files/resources/symbol_static_data.json',
    symbolUrlEnv: 'https://tradex-vn.s3.ap-southeast-1.amazonaws.com/mts/symbol.json',
    versionUrl: 'https://trading.kisvn.vn/files/mts-resources/version.json',
  },
  oneSignal: 'a0030245-caea-4aea-b8e9-97cf19b006a2',
  codePushKey: '7Rp3t0eK2rbM6mXdJaHfCDjDchOnpODPLr5rR',
  defaultSymbol: 'BID',
  releaseMode: true,
  openBankAccount: [
    {
      name: '',
      title: '',
      screenTitle: '',
      icon: '',
      splashImage: '',
      mainImage: '',
      content: '',
      mainContent: '',
      bankUrl: '',
      bankUrlBefore: '',
      partnerCode: '',
    },
  ],
  appStoreLink: 'https://itunes.apple.com/app/kis-mts/id1527398001',
  playStoreLink: 'https://play.google.com/store/apps/details?id=com.tradex.kisvn',
};

export default config;
