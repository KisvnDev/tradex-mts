import React from 'react';
import { View, AppState, AppStateStatus, Alert, BackHandler } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import OneSignal, { NotificationReceivedEvent, OpenedEvent, OSNotification } from 'react-native-onesignal';
import config from 'config';
import { goToAuth, goToHome } from 'navigations';
import Fallback from 'components/Fallback';
import { handleError } from 'utils/common';
import { BIOMETRIC_TYPE, NOTIFICATION_TYPE, OTP_TOKEN_FOR_NEW_KIS_CORE, SESSION_TIME_KEY } from 'global';
import { IState } from 'redux-sagas/reducers';
import { INotification, IUserInfo, IUserExtraInfo } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { IAlarmPrice, IOrderMatch, IStopOrderActivation } from 'interfaces/notification';
import { showNotification, setCurrentSymbol, signOut, initMarket } from 'redux-sagas/global-actions';
import { initSocket } from './actions';
import { getKey, setKey } from 'utils/asyncStorage';
import store from 'redux-sagas/store';

interface IAppProps extends React.ClassAttributes<App> {
  i18n: boolean;
  domainInit: boolean;

  initSocket(): void;

  initMarket(): void;

  showNotification(payload: INotification): void;

  setCurrentSymbol(payload: ISymbolInfo): void;

  signOut(): void;
}

interface IAppState {}

class App extends React.Component<IAppProps, IAppState> {
  private isAppInFocus = true;

  constructor(props: IAppProps) {
    super(props);

    global.registerAccountResendOtp = false;
    global.symbolRealtimeBidOfferData = {};
    global.symbolRealtimeQuoteData = {};
    props.initSocket();
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(config.oneSignal);

    //Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      console.log('Prompt response:', response);
    });

    OneSignal.setNotificationWillShowInForegroundHandler((notifReceivedEvent: NotificationReceivedEvent) => {
      console.log('OneSignal: notification will show in foreground:', notifReceivedEvent);
      let notif = notifReceivedEvent.getNotification();
      console.log('notification: ', notif);
      this.onReceived(notif);
      setTimeout(() => notifReceivedEvent.complete(notif), 0);
    });

    OneSignal.setNotificationOpenedHandler((openedEvent: OpenedEvent) => {
      const { notification } = openedEvent;
      this.onOpened(notification);
    });

    this.onIds();
    AppState.addEventListener('change', this.handleAppStateChange);

    getKey(OTP_TOKEN_FOR_NEW_KIS_CORE).then((token: string | null) => {
      global.OTPTokenMatrix = token;
    });
  }

  componentDidMount() {
    if (this.props.i18n === true && this.props.domainInit === true) {
      this.handleAuth();
    }
    this.props.initMarket();
  }

  shouldComponentUpdate(nextProps: IAppProps) {
    if (nextProps.i18n === true && nextProps.domainInit === true) {
      this.handleAuth();
    }

    return false;
  }

  private async onIds() {
    const deviceState = await OneSignal.getDeviceState();
    if (deviceState != null && deviceState.userId) {
      global.playerId = deviceState.userId;
    }
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      this.isAppInFocus = true;
      const authenticated =
        global.domainSocket.authState === global.domainSocket.AUTHENTICATED && store.getState().userInfo != null;
      if (authenticated === true) {
        let sessionTime = await getKey(SESSION_TIME_KEY);

        if (sessionTime != null) {
          const userExtraInfo = (await getKey(
            `user${
              (store.getState().userInfo as IUserInfo).username != null
                ? (store.getState().userInfo as IUserInfo).username
                : (store.getState().userInfo as IUserInfo).id
            }`
          )) as IUserExtraInfo;

          let loginSession = 30;
          if (userExtraInfo != null && userExtraInfo.settings && userExtraInfo.settings.loginSession != null) {
            loginSession = userExtraInfo.settings.loginSession;
          }

          if (Number(sessionTime) + Number(loginSession) * 60 * 1000 < new Date().getTime()) {
            this.props.signOut();

            this.props.showNotification({
              type: NOTIFICATION_TYPE.WARN,
              title: 'Session Timed Out',
              content: 'Your session is timed out because of no activity!',
              time: new Date(),
            });
          } else {
            await setKey(SESSION_TIME_KEY, new Date().getTime());
          }
        }
      }
      this.props.initMarket();
    } else {
      this.isAppInFocus = false;
    }
  };

  private onReceived = (notification: OSNotification) => {
    if (this.isAppInFocus !== true) {
      if (notification && notification.additionalData) {
        const data = notification.additionalData;
        global.triggerData = data;
      }
    } else {
      if (notification && notification.additionalData) {
        if (
          (notification.additionalData as (IOrderMatch | IAlarmPrice | IStopOrderActivation) & {
            method: 'MATCH_ORDER' | 'STOP_ORDER_ACTIVATION' | 'ALARM_PRICE' | 'MOBILE_OTP';
          }).method === 'MOBILE_OTP' &&
          global.domainSocket &&
          global.domainSocket.authState === global.domainSocket.AUTHENTICATED
        ) {
          this.props.showNotification({
            type: NOTIFICATION_TYPE.INFO,
            title: 'Mobile OTP',
            content: notification.body,
            time: new Date(),
          });
        }
      }
    }
  };

  private onOpened = (openResult: OSNotification) => {
    if (openResult && openResult.additionalData) {
      const data = openResult.additionalData;
      global.triggerData = data;
    }
  };

  handleAuth = async () => {
    await ReactNativeBiometrics.isSensorAvailable()
      .then(async (resultObject) => {
        const { available, biometryType } = resultObject;
        if (available && biometryType === ReactNativeBiometrics.TouchID) {
          global.biometricType = BIOMETRIC_TYPE.TouchID;
        } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
          global.biometricType = BIOMETRIC_TYPE.FaceID;
        } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
          await ReactNativeBiometrics.biometricKeysExist().then(async (resultObject) => {
            const { keysExist } = resultObject;

            if (keysExist) {
              global.biometricType = BIOMETRIC_TYPE.TouchID;
            } else {
              await ReactNativeBiometrics.createKeys()
                .then(async () => {
                  global.biometricType = BIOMETRIC_TYPE.TouchID;
                  await ReactNativeBiometrics.deleteKeys();
                })
                .catch(() => {
                  global.biometricType = BIOMETRIC_TYPE.None;
                });
            }
          });
        } else {
          global.biometricType = BIOMETRIC_TYPE.None;
        }
        if (global.domainSocket != null) {
          const authenticated =
            global.domainSocket.authState === global.domainSocket.AUTHENTICATED && store.getState().userInfo != null;
          if (authenticated === true) {
            let sessionTime = await getKey(SESSION_TIME_KEY);

            if (sessionTime != null) {
              const userExtraInfo = store.getState().userExtraInfo;
              let loginSession = 30;
              if (userExtraInfo != null && userExtraInfo.settings && userExtraInfo.settings.loginSession != null) {
                loginSession = userExtraInfo.settings.loginSession;
              }

              if (Number(sessionTime) + Number(loginSession) * 60 * 1000 < new Date().getTime()) {
                this.props.signOut();

                this.props.showNotification({
                  type: NOTIFICATION_TYPE.WARN,
                  title: 'Session Timed Out',
                  content: 'Your session is timed out because of no activity!',
                  time: new Date(),
                });
              } else {
                await setKey(SESSION_TIME_KEY, new Date().getTime());
                goToHome();
              }
            } else {
              await setKey(SESSION_TIME_KEY, new Date().getTime());
              goToHome();
            }
          } else {
            goToAuth();
          }
        } else {
          Alert.alert('Connection Error', 'Connect failed, please try again later', [
            {
              text: 'OK',
              onPress: () => BackHandler.exitApp(),
            },
          ]);
        }
      })
      .catch(async (error) => {
        console.log('bioMetricError', error);
        global.biometricType = BIOMETRIC_TYPE.None;
        if (global.domainSocket != null) {
          const authenticated =
            global.domainSocket.authState === global.domainSocket.AUTHENTICATED && store.getState().userInfo != null;
          if (authenticated === true) {
            let sessionTime = await getKey(SESSION_TIME_KEY);

            if (sessionTime != null) {
              const userExtraInfo = store.getState().userExtraInfo;
              let loginSession = 30;
              if (userExtraInfo != null && userExtraInfo.settings && userExtraInfo.settings.loginSession != null) {
                loginSession = userExtraInfo.settings.loginSession;
              }

              if (Number(sessionTime) + Number(loginSession) * 60 * 1000 < new Date().getTime()) {
                this.props.signOut();

                this.props.showNotification({
                  type: NOTIFICATION_TYPE.WARN,
                  title: 'Session Timed Out',
                  content: 'Your session is timed out because of no activity!',
                  time: new Date(),
                });
              } else {
                await setKey(SESSION_TIME_KEY, new Date().getTime());
                goToHome();
              }
            } else {
              await setKey(SESSION_TIME_KEY, new Date().getTime());
              goToHome();
            }
          } else {
            goToAuth();
          }
        } else {
          Alert.alert('Connection Error', 'Connect failed, please try again later', [
            {
              text: 'OK',
              onPress: () => BackHandler.exitApp(),
            },
          ]);
        }
      });
  };

  render() {
    return <View />;
  }
}

const mapStateToProps = (state: IState) => ({
  i18n: state.i18n,
  domainInit: state.domainInit,
});

export default withErrorBoundary(
  connect(mapStateToProps, {
    initSocket,
    showNotification,
    setCurrentSymbol,
    signOut,
    initMarket,
  })(App),
  Fallback,
  handleError
);
