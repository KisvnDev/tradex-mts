declare module 'socketcluster-client/lib/auth';
declare module 'sc-codec-min-bin';
declare module 'i18next-async-storage-backend';
declare module 'react-native-keyboard-accessory';
declare module 'react-native-slider';
declare module 'i18next-fetch-backend';
declare module 'react-native-animated-splash-screen';
declare module 'react-native-otp-textinput';

declare module NodeJS {
  interface Global {
    lang: LANG;
    username: string;
    symbolData: { [s: string]: ISymbolData };
    symbolRealtimeQuoteData: { [s: string]: ISymbolData };
    symbolRealtimeBidOfferData: { [s: string]: ISymbolData };
    subscribeChannels: { [s: string]: ISubscribeChannel } = {};
    quoteChannel: ISubscribeChannel;
    bidOfferChannel: ISubscribeChannel;
    domainSocket: SCClientSocket;
    triggerData: (IOrderMatch | IAlarmPrice | IStopOrderActivation) & {
      method: 'MATCH_ORDER' | 'STOP_ORDER_ACTIVATION' | 'ALARM_PRICE';
    };
    viewMode: boolean;
    playerId: string;
    mobileOTP: boolean;
    otherNotifications: boolean;
    registerAccountResendOtp: boolean;
    biometricType: BIOMETRIC_TYPE;
    currentComponent: string;
    OTPTokenMatrix: string | null;
    isIicaAccount: boolean;
    sourceIp: string;
  }
}
