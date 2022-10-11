import React from 'react';
import { View, Image, Keyboard, EmitterSubscription, Modal, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import Svg, { Path } from 'react-native-svg';
import DeviceInfo from 'react-native-device-info';
import { Navigation } from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import config, { IOpenBankAccount } from 'config';
import { isBlank, handleError } from 'utils/common';
import { getKey, removeKey } from 'utils/asyncStorage';
import Fallback from 'components/Fallback';
import ScreenLoader from 'components/ScreenLoader';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import CheckBox from 'components/CheckBox';
import Button from 'components/Button';
import AdsBanner from 'components/AdsBanner';
import OneSignal from 'react-native-onesignal';
import { goToForgotPassword, goToRegisterAccount } from 'navigations';
import LanguagePicker from 'components/LanguagePicker';
import { BIOMETRIC_TYPE, PUBLIC_KEY_BIOMETRIC, USERNAME_BIOMETRIC } from 'global';
import store from 'redux-sagas/store';
import { INIT_SOCKET_ERROR } from 'redux-sagas/global-reducers/AppInit-reducers';
import { IObject, IRememberUsername } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';
import { ILoginResult } from './reducers';
import { reduceUsername } from 'redux-sagas/sagas/Authentication/LoginDomain';
import { initMarket, onClickOpenBankAccountLink } from 'redux-sagas/global-actions';
import { loginDomain, verifyOTP, loginViewMode, hideLoader, loginBiometric, resendLoginOtp } from './actions';
import { goToEkyc } from 'navigations';
import styles from './styles';
import UIText from 'components/UiText';

interface ILoginProps extends React.ClassAttributes<Login>, WithTranslation {
  loginResult: ILoginResult;
  generateKisCardResult: IObject | null;
  biometricVerificationFailedTrigger: boolean;
  biometricVerificationFailedType: string;
  initSocketError: {
    isError: boolean;
    error: string;
  };
  resendLoginOTPSuccessTrigger: boolean;

  loginDomain(payload: IObject): void;

  verifyOTP(payload: IObject): void;

  loginViewMode(payload: IObject): void;

  loginBiometric(payload: IObject): void;

  resendLoginOtp(payload: IObject): void;

  initMarket(): void;

  hideLoader(): void;

  onClickOpenBankAccountLink(payload: IOpenBankAccount): void;
}

interface ILoginState {
  errorUsername: boolean;
  errorUsernameContent: string;
  errorPassword: boolean;
  errorPasswordContent: string;
  errorOTP: boolean;
  errorOTPContent: string;
  rememberUsername: boolean;
  showSetting: boolean;
  showOTPModal: boolean;
  fingerprintModalVisible: boolean;
  warningModalVisible: boolean;
  showBiometricFailedModal: boolean;
  timer: number;
}

class Login extends React.Component<ILoginProps, ILoginState> {
  private username: string = '';
  private password: string = '';
  private otpValue = '';
  private keyboardDidShowListener: EmitterSubscription | null = null;
  private keyboardDidHideListener: EmitterSubscription | null = null;
  private interval: NodeJS.Timeout;
  private forceSmsByTag: boolean = true;
  private forceSMSForResend: boolean = false;
  private countPushResend: number = 0;

  constructor(props: ILoginProps) {
    super(props);

    Navigation.events().bindComponent(this);

    this.state = {
      errorUsername: false,
      errorUsernameContent: '',
      errorPassword: false,
      errorPasswordContent: '',
      errorOTP: false,
      errorOTPContent: '',
      rememberUsername: true,
      showSetting: true,
      showOTPModal: false,
      fingerprintModalVisible: false,
      warningModalVisible: false,
      showBiometricFailedModal: false,
      timer: config.timeEachResendOTP,
    };

    if (config.usingNewKisCore) {
      this.username = '057C';
    }
  }

  componentDidDisappear() {
    this.setState({
      showOTPModal: false,
    });
  }

  componentDidMount() {
    // SplashScreen.hide();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

    getKey<IRememberUsername>('rememberUsername').then((rememberUsername: IRememberUsername) => {
      if (rememberUsername && rememberUsername.isStored === true) {
        this.username = '057' + rememberUsername.username;
        this.setState({
          rememberUsername: true,
        });
      }
    });

    this.props.initMarket();
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
  }

  shouldComponentUpdate(nextProps: ILoginProps, nextState: ILoginState) {
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
    if (this.state.timer !== nextState.timer && nextState.timer === 0) {
      if (this.countPushResend === config.numberOfPushResend) {
        this.forceSMSForResend = true;
      }
    }
    if (this.props.resendLoginOTPSuccessTrigger !== nextProps.resendLoginOTPSuccessTrigger) {
      this.countPushResend++;
    }
    return true;
  }

  componentWillUnmount() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }

    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }

    this.setState({
      showOTPModal: false,
    });
  }

  componentDidUpdate(prevProps: ILoginProps, prevState: ILoginState) {
    if (this.state.showOTPModal !== prevState.showOTPModal && this.state.showOTPModal === true) {
      this.countPushResend = 1;
    }
    if (this.props.loginResult !== prevProps.loginResult) {
      this.otpValue = '';

      this.forceSMSForResend = false;
      this.setState(
        {
          showOTPModal: this.props.loginResult.showOTP,
        },
        () => {
          this.props.hideLoader();
        }
      );
    }
    if (this.props.biometricVerificationFailedTrigger !== prevProps.biometricVerificationFailedTrigger) {
      this.otpValue = '';

      this.setState({
        showBiometricFailedModal: true,
      });
    }
    if (
      (this.state.showOTPModal !== prevState.showOTPModal && this.state.showOTPModal === true) ||
      this.props.resendLoginOTPSuccessTrigger !== prevProps.resendLoginOTPSuccessTrigger
    ) {
      this.setState(
        {
          timer: config.timeEachResendOTP,
        },
        () => {
          clearInterval(this.interval);
          this.interval = setInterval(() => this.setState((prevState) => ({ timer: prevState.timer - 1 })), 1000);
        }
      );
    }
    if (this.state.timer === 0) {
      clearInterval(this.interval);
    }
  }

  private _keyboardDidShow() {
    this.setState({ showSetting: false });
  }

  private _keyboardDidHide() {
    this.setState({ showSetting: true });
  }

  private changeRememberUsername = (value: boolean) => {
    this.setState({
      rememberUsername: value,
    });
  };

  private onChangeUsername = (value: string) => {
    this.username = value;
  };

  private onChangePassword = (value: string) => {
    this.password = value;
  };

  private onChangeOTPValue = (value: string) => {
    this.otpValue = value;
  };

  private validate() {
    if (isBlank(this.username)) {
      this.setState({
        errorUsername: true,
        errorUsernameContent: 'Please insert username',
      });
      return false;
    } else {
      this.setState({
        errorUsername: false,
        errorUsernameContent: '',
      });
    }

    if (isBlank(this.password)) {
      this.setState({
        errorPassword: true,
        errorPasswordContent: 'Please insert password',
      });
      return false;
    } else {
      this.setState({
        errorPassword: false,
        errorPasswordContent: '',
      });
    }
    return true;
  }

  private validateUsername() {
    if (isBlank(this.username)) {
      this.setState({
        errorUsername: true,
        errorUsernameContent: 'Please insert username',
      });
      return false;
    } else {
      this.setState({
        errorUsername: false,
        errorUsernameContent: '',
      });
    }
    return true;
  }

  private handleLogin = () => {
    OneSignal.getTags((tags: { [key: string]: string } | null) => {
      if (tags) {
        this.forceSmsByTag = tags.username !== this.username.toLowerCase();
      } else {
        this.forceSmsByTag = true;
      }
    });
    if (this.validate()) {
      this.props.loginDomain({
        username: this.username.toUpperCase(),
        password: this.password,
        rememberUsername: this.state.rememberUsername,
        appVersion: DeviceInfo.getVersion(),
        osVersion: DeviceInfo.getSystemVersion(),
      });
    }
  };

  private handleLoginBiometric = async () => {
    if (global.biometricType !== BIOMETRIC_TYPE.None) {
      // this.props.initMarket();
      if (this.validateUsername()) {
        //   this.props.loginDomain({
        //     username: this.username,
        //     password: this.password,
        //     rememberUsername: this.state.rememberUsername,
        //   });
        // console.log('ReactNativeBiometrics', ReactNativeBiometrics.simplePrompt);

        // ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
        //   .then((resultObject) => {
        //     const { success } = resultObject

        //     if (success) {
        //       console.log('successful biometrics provided');

        //     } else {
        //       console.log('user cancelled biometric prompt');
        //     }
        //   })
        //   .catch(() => {
        //     console.log('biometrics failed');
        //   })

        if (this.username.toUpperCase() === `${await getKey(USERNAME_BIOMETRIC)}`.toUpperCase()) {
          let newUsername = config.usingNewKisCore ? reduceUsername(this.username) : this.username;

          ReactNativeBiometrics.biometricKeysExist().then((resultObject) => {
            const { keysExist } = resultObject;

            if (keysExist) {
              ReactNativeBiometrics.createSignature({
                promptMessage: 'Sign in',
                payload: newUsername.toUpperCase(),
              })
                .then((resultObject) => {
                  const { success, signature } = resultObject;

                  if (success && signature != null) {
                    const params = {
                      signatureValue: signature,
                      username: newUsername,
                    };
                    this.props.loginBiometric(params);
                  }
                })
                .catch(async (error) => {
                  console.log('error', error);
                  if (`${error.code}`.includes('Error')) {
                    this.setState({
                      fingerprintModalVisible: true,
                    });
                    await removeKey(PUBLIC_KEY_BIOMETRIC);
                    await removeKey(USERNAME_BIOMETRIC);
                  }
                });
            } else {
              console.log('Keys do not exist or were deleted');
              this.setState({
                fingerprintModalVisible: true,
              });
            }
          });
        } else {
          this.setState({
            fingerprintModalVisible: true,
          });
        }
      }
    } else {
      this.setState({
        warningModalVisible: true,
      });
    }
  };

  private onSubmitOTP = () => {
    if (this.validateOTP()) {
      this.setState(
        {
          showOTPModal: false,
        },
        () => {
          this.props.initMarket();
          this.props.verifyOTP({
            username: this.username,
            otpValue: this.otpValue,
          });
        }
      );
    }
  };

  private validateOTP = () => {
    if (isBlank(this.otpValue)) {
      this.setState({
        errorOTP: true,
        errorOTPContent: this.props.t('Please insert OTP'),
      });
      return false;
    } else {
      this.setState({
        errorOTP: false,
        errorOTPContent: '',
      });
    }

    return true;
  };

  private onCancelOTP = () => {
    this.password = '';
    this.setState({
      showOTPModal: false,
    });
  };

  private confirmFingerprintModal = () => {
    this.setState({
      fingerprintModalVisible: false,
    });
  };

  private confirmWarningModal = () => {
    this.setState({
      warningModalVisible: false,
    });
  };

  private confirmBiometricFailedModal = () => {
    this.setState({
      showBiometricFailedModal: false,
    });
  };

  private onPressRegisterAccount = () => {
    goToRegisterAccount();
  };

  private loginViewMode = () => {
    this.setState(
      {
        showOTPModal: false,
      },
      () => {
        this.props.initMarket();
        this.props.loginViewMode({
          username: this.username,
        });
      }
    );
  };

  private resendOTP = () => {
    Keyboard.dismiss();
    const params = {
      username: this.username,
      forceSMS: this.forceSmsByTag === true ? true : this.forceSMSForResend,
    };
    this.props.resendLoginOtp(params);
  };

  private handleToForgotPassword = () => {
    goToForgotPassword();
  };

  private onNavigateToEkyc = () => {
    goToEkyc('Login');
  };

  render() {
    const { t } = this.props;
    if (config.domain === 'vcsc') {
      return (
        <SafeAreaView style={styles.container2}>
          <View style={styles.container}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="always"
              scrollEnabled={true}
              contentContainerStyle={styles.button}
            >
              <View style={styles.settingSection2}>
                <View style={styles.settingButton3}>
                  <LanguagePicker callApiAfterChange={false} alternateForm={true} />
                </View>
              </View>
              <View style={styles.logoSection2}>
                <Image style={styles.item2} resizeMode="contain" source={config.companyInfo[config.domain].logo} />
              </View>
              <TextBox
                label="Username"
                type={TEXTBOX_TYPE.TEXT}
                keyboardType="default"
                value={this.username && this.username}
                error={this.state.errorUsername}
                errorContent={this.state.errorUsernameContent}
                onChange={this.onChangeUsername}
                autoCorrect={false}
                labelSectionStyle={styles.noPaddingLeft}
              />

              <TextBox
                label="Password"
                type={TEXTBOX_TYPE.PASSWORD}
                keyboardType="default"
                value={this.password && this.password}
                error={this.state.errorPassword}
                errorContent={this.state.errorPasswordContent}
                onChange={this.onChangePassword}
                labelSectionStyle={styles.noPaddingLeft}
              />

              <View style={styles.checkBoxSection}>
                <CheckBox
                  label="Remember me"
                  checked={this.state.rememberUsername}
                  onChange={this.changeRememberUsername}
                />
              </View>

              <View style={styles.loginArea}>
                <Button onPress={this.handleLogin} title={'LOGIN'} buttonStyle={styles.buttonLogin} />
                <TouchableOpacity onPress={this.handleLoginBiometric} style={styles.fingerPrintIcon}>
                  {global.biometricType === BIOMETRIC_TYPE.TouchID ? (
                    <Ionicons name="ios-finger-print" size={48} />
                  ) : global.biometricType === BIOMETRIC_TYPE.FaceID ? (
                    <Svg width={48} height={48} fill="none" viewBox="0 0 62 63">
                      <Path
                        fill="#000"
                        d="M58.937 20.727c1.656 0 2.531-.937 2.531-2.562v-7.656c0-6.438-3.281-9.657-9.812-9.657h-7.657c-1.625 0-2.53.875-2.53 2.5s.905 2.532 2.53 2.532h7.563c3.094 0 4.875 1.656 4.875 4.906v7.375c0 1.625.906 2.562 2.5 2.562zm-56.156 0c1.656 0 2.531-.937 2.531-2.562V10.79c0-3.25 1.719-4.906 4.844-4.906h7.562c1.657 0 2.563-.907 2.563-2.532s-.906-2.5-2.563-2.5h-7.625C3.562.852.281 4.072.281 10.51v7.656c0 1.625.906 2.562 2.5 2.562zm25.594 15.97h.25c3.156 0 4.874-1.72 4.874-4.876v-9.844c0-1.218-.812-2-2-2-1.25 0-2.062.782-2.062 2v10.125c0 .313-.188.47-.469.47h-1.093c-1.125 0-2 .874-2 2 0 1.343.906 2.124 2.5 2.124zm-9.407-7.376c1.469 0 2.532-1.031 2.532-2.531v-4.25c0-1.5-1.063-2.531-2.532-2.531-1.468 0-2.5 1.03-2.5 2.53v4.25c0 1.5 1.032 2.532 2.5 2.532zm23.719 0c1.438 0 2.469-1.031 2.469-2.531v-4.25c0-1.5-1.032-2.531-2.469-2.531-1.5 0-2.531 1.03-2.531 2.53v4.25c0 1.5 1.031 2.532 2.531 2.532zm-12 17.875c3.781 0 7.594-1.625 10.312-4.344.375-.343.563-.875.563-1.5 0-1.187-.875-2.03-2.031-2.03-.594 0-1.032.218-1.625.843-1.719 1.781-4.438 3-7.219 3-2.625 0-5.375-1.156-7.188-3-.5-.469-.906-.844-1.656-.844-1.156 0-2.031.844-2.031 2.031 0 .532.188 1.032.594 1.47 2.531 2.874 6.5 4.374 10.281 4.374zM10.093 62.01h7.625c1.657 0 2.563-.907 2.563-2.5 0-1.625-.906-2.532-2.563-2.532h-7.562c-3.125 0-4.844-1.656-4.844-4.906v-7.375c0-1.656-.906-2.562-2.531-2.562s-2.5.906-2.5 2.562v7.625c0 6.469 3.281 9.688 9.812 9.688zm33.906 0h7.657c6.531 0 9.812-3.25 9.812-9.688v-7.625c0-1.656-.906-2.562-2.531-2.562s-2.5.906-2.5 2.562v7.375c0 3.25-1.781 4.906-4.875 4.906h-7.563c-1.625 0-2.53.907-2.53 2.532 0 1.593.905 2.5 2.53 2.5z"
                      />
                    </Svg>
                  ) : (
                    <MaterialCommunityIcons name="fingerprint-off" size={48} />
                  )}
                </TouchableOpacity>
              </View>
              {this.state.showSetting && (
                <View style={styles.registeringSection}>
                  <View style={styles.settingButton2}>
                    <UIText style={styles.registeringTitleButtonText}>{t('Don’t have an account?')}</UIText>
                  </View>
                  <View style={[styles.settingButton2, styles.paddingTop]}>
                    <TouchableOpacity onPress={this.onPressRegisterAccount} style={styles.openAccountTextIcon}>
                      <UIText style={styles.registeringButtonText}>{`${t('Open account2')} `}</UIText>
                      <View style={styles.newContainer}>
                        <UIText style={styles.newText}>{`${t('NEW_2')}`}</UIText>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {this.state.showSetting && (
                <View style={styles.adsContainer}>
                  <View style={styles.adsSliderContainer}>
                    <AdsBanner />
                  </View>
                </View>
              )}
              {/* {this.state.showSetting && (
                <UIText allowFontScaling={false} style={styles.deviceInfo2}>
                  {t('Version')}: {DeviceInfo.getVersion()}
                </UIText>
              )} */}
            </KeyboardAwareScrollView>
            <Modal transparent={true} visible={this.state.showOTPModal} animationType="none">
              <View style={styles.OTPContainer}>
                <View style={styles.OTPBody}>
                  <View style={styles.titleSection}>
                    <UIText allowFontScaling={false} style={styles.title}>
                      {t('OTP Card Number')}: {this.props.loginResult.otpIndex}
                    </UIText>
                  </View>

                  <View style={styles.OTPContent}>
                    <TextBox
                      label="OTP number"
                      type={TEXTBOX_TYPE.TEXT}
                      keyboardType="numeric"
                      error={this.state.errorOTP}
                      errorContent={this.state.errorOTPContent}
                      onChange={this.onChangeOTPValue}
                    />
                    <View style={styles.retryArea}>
                      {this.state.timer < 1 ? (
                        <UIText>{`${t('NO_RECEIVE_OTP')} `}</UIText>
                      ) : (
                        <UIText style={styles.otpResendText}>{`${t(
                          this.forceSmsByTag === true
                            ? 'TRY_AGAIN_SMS'
                            : this.forceSMSForResend === true
                            ? 'TRY_AGAIN_SMS'
                            : 'TRY_AGAIN_PUSH'
                        )} (${this.state.timer} ${this.state.timer < 2 ? t('SECOND') : t('SECONDS')})`}</UIText>
                      )}
                      {this.state.timer < 1 && (
                        <UIText style={styles.resendText} onPress={this.resendOTP}>{`${t('RESEND')} (${
                          this.forceSmsByTag === true ? 'SMS' : this.forceSMSForResend === true ? 'SMS' : 'Push'
                        })`}</UIText>
                      )}
                    </View>
                  </View>

                  <Button onPress={this.onSubmitOTP} title={t('confirm').toUpperCase()} />

                  <Button
                    buttonStyle={styles.loginViewModeBtn}
                    textStyle={styles.loginViewModeText}
                    onPress={this.loginViewMode}
                    title={t('Login View Mode')}
                  />

                  <TouchableOpacity style={styles.buttonCancel} onPress={this.onCancelOTP}>
                    <UIText allowFontScaling={false} style={[styles.labelTouch]}>
                      {' '}
                      {t('Cancel')}
                    </UIText>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal visible={this.state.fingerprintModalVisible} animationType="fade" transparent={true}>
              <View style={[styles.modalContainer, styles.buttonSectionModal]}>
                <View style={[styles.bodyModal]}>
                  <View style={[styles.modalTitleContainer, styles.buttonSectionModal]}>
                    <UIText style={{ textAlign: 'center', fontWeight: 'bold' }} allowFontScaling={false}>
                      {t('Biometric Authentication')}
                    </UIText>
                    <UIText style={{ textAlign: 'center' }} allowFontScaling={false}>
                      {t('Please log in and set up fingerprint/face recognition in Setting to activate this function')}
                    </UIText>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={this.confirmFingerprintModal}
                      style={[styles.buttonSectionModal, styles.button]}
                    >
                      <UIText allowFontScaling={false} style={styles.buttonText1}>
                        {t('Confirm')}
                      </UIText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal visible={this.state.warningModalVisible} animationType="fade" transparent={true}>
              <View style={[styles.modalContainer, styles.buttonSectionModal]}>
                <View style={[styles.warningBodyModal]}>
                  <View style={[styles.modalTitleContainer, styles.buttonSectionModal]}>
                    <UIText style={{ textAlign: 'center', fontWeight: 'bold' }} allowFontScaling={false}>
                      {t('Warning')}
                    </UIText>
                    <Ionicons name="ios-finger-print" size={50} />
                    <UIText style={{ textAlign: 'center' }} allowFontScaling={false}>
                      {t(
                        'Fingerprint/Face ID has not been setup or supported on your device. Please check in Settings and set up fngerprint/face ID on your device to use this function'
                      )}
                    </UIText>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={this.confirmWarningModal}
                      style={[styles.buttonSectionModal, styles.button]}
                    >
                      <UIText allowFontScaling={false} style={styles.buttonText1}>
                        {t('Confirm')}
                      </UIText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal visible={this.state.showBiometricFailedModal} animationType="fade" transparent={true}>
              <View style={[styles.modalContainer, styles.buttonSectionModal]}>
                <View style={[styles.warningBodyModal]}>
                  <View style={[styles.modalTitleContainer, styles.buttonSectionModal]}>
                    <UIText style={{ textAlign: 'center', fontWeight: 'bold' }} allowFontScaling={false}>
                      {t('Warning')}
                    </UIText>
                    <Ionicons name="ios-finger-print" size={50} />
                    <UIText style={{ textAlign: 'center' }} allowFontScaling={false}>
                      {t(this.props.biometricVerificationFailedType)}
                    </UIText>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={this.confirmBiometricFailedModal}
                      style={[styles.buttonSectionModal, styles.button]}
                    >
                      <UIText allowFontScaling={false} style={styles.buttonText1}>
                        {t('Confirm')}
                      </UIText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <ScreenLoader />
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={styles.container}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" scrollEnabled={true}>
            <View style={styles.logoSection}>
              <Image style={styles.item} resizeMode="contain" source={config.companyInfo[config.domain].logo} />
            </View>
            <TextBox
              label="Username"
              type={TEXTBOX_TYPE.TEXT}
              keyboardType="default"
              value={this.username && this.username}
              error={this.state.errorUsername}
              errorContent={this.state.errorUsernameContent}
              onChange={this.onChangeUsername}
              autoCorrect={false}
            />
            <TextBox
              label="Password"
              type={TEXTBOX_TYPE.PASSWORD}
              keyboardType="default"
              value={this.password && this.password}
              error={this.state.errorPassword}
              errorContent={this.state.errorPasswordContent}
              onChange={this.onChangePassword}
            />
            <View style={styles.checkBoxSection2}>
              <CheckBox
                label="Remember me"
                checked={this.state.rememberUsername}
                onChange={this.changeRememberUsername}
              />
            </View>
            {config.domain === 'kis' ? (
              <>
                <View style={styles.loginContainer}>
                  <View style={styles.loginButton}>
                    <Button onPress={this.handleLogin} title={'LOGIN'} />
                  </View>
                  <TouchableOpacity onPress={this.handleLoginBiometric} style={styles.fingerPrintIconUp}>
                    {global.biometricType === BIOMETRIC_TYPE.TouchID ? (
                      <Ionicons name="ios-finger-print" size={40} color={'white'} />
                    ) : global.biometricType === BIOMETRIC_TYPE.FaceID ? (
                      <Svg width={42} height={42} fill="none" viewBox="0 0 62 63">
                        <Path
                          fill="white"
                          d="M58.937 20.727c1.656 0 2.531-.937 2.531-2.562v-7.656c0-6.438-3.281-9.657-9.812-9.657h-7.657c-1.625 0-2.53.875-2.53 2.5s.905 2.532 2.53 2.532h7.563c3.094 0 4.875 1.656 4.875 4.906v7.375c0 1.625.906 2.562 2.5 2.562zm-56.156 0c1.656 0 2.531-.937 2.531-2.562V10.79c0-3.25 1.719-4.906 4.844-4.906h7.562c1.657 0 2.563-.907 2.563-2.532s-.906-2.5-2.563-2.5h-7.625C3.562.852.281 4.072.281 10.51v7.656c0 1.625.906 2.562 2.5 2.562zm25.594 15.97h.25c3.156 0 4.874-1.72 4.874-4.876v-9.844c0-1.218-.812-2-2-2-1.25 0-2.062.782-2.062 2v10.125c0 .313-.188.47-.469.47h-1.093c-1.125 0-2 .874-2 2 0 1.343.906 2.124 2.5 2.124zm-9.407-7.376c1.469 0 2.532-1.031 2.532-2.531v-4.25c0-1.5-1.063-2.531-2.532-2.531-1.468 0-2.5 1.03-2.5 2.53v4.25c0 1.5 1.032 2.532 2.5 2.532zm23.719 0c1.438 0 2.469-1.031 2.469-2.531v-4.25c0-1.5-1.032-2.531-2.469-2.531-1.5 0-2.531 1.03-2.531 2.53v4.25c0 1.5 1.031 2.532 2.531 2.532zm-12 17.875c3.781 0 7.594-1.625 10.312-4.344.375-.343.563-.875.563-1.5 0-1.187-.875-2.03-2.031-2.03-.594 0-1.032.218-1.625.843-1.719 1.781-4.438 3-7.219 3-2.625 0-5.375-1.156-7.188-3-.5-.469-.906-.844-1.656-.844-1.156 0-2.031.844-2.031 2.031 0 .532.188 1.032.594 1.47 2.531 2.874 6.5 4.374 10.281 4.374zM10.093 62.01h7.625c1.657 0 2.563-.907 2.563-2.5 0-1.625-.906-2.532-2.563-2.532h-7.562c-3.125 0-4.844-1.656-4.844-4.906v-7.375c0-1.656-.906-2.562-2.531-2.562s-2.5.906-2.5 2.562v7.625c0 6.469 3.281 9.688 9.812 9.688zm33.906 0h7.657c6.531 0 9.812-3.25 9.812-9.688v-7.625c0-1.656-.906-2.562-2.531-2.562s-2.5.906-2.5 2.562v7.375c0 3.25-1.781 4.906-4.875 4.906h-7.563c-1.625 0-2.53.907-2.53 2.532 0 1.593.905 2.5 2.53 2.5z"
                        />
                      </Svg>
                    ) : (
                      <MaterialCommunityIcons name="fingerprint-off" size={41} color={'white'} />
                    )}
                  </TouchableOpacity>
                </View>
                {config.usingNewKisCore ? (
                  <TouchableOpacity style={styles.forgotPass} onPress={this.handleToForgotPassword}>
                    <UIText style={styles.openAccount}>{t('Forgot password?')}</UIText>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <>
                <Button onPress={this.handleLogin} title={'LOGIN'} />
                <TouchableOpacity onPress={this.handleLoginBiometric} style={styles.fingerPrintIconDown}>
                  {global.biometricType === BIOMETRIC_TYPE.TouchID ? (
                    <Ionicons name="ios-finger-print" size={50} />
                  ) : global.biometricType === BIOMETRIC_TYPE.FaceID ? (
                    <Svg width={50} height={50} fill="none" viewBox="0 0 62 63">
                      <Path
                        fill="#000"
                        d="M58.937 20.727c1.656 0 2.531-.937 2.531-2.562v-7.656c0-6.438-3.281-9.657-9.812-9.657h-7.657c-1.625 0-2.53.875-2.53 2.5s.905 2.532 2.53 2.532h7.563c3.094 0 4.875 1.656 4.875 4.906v7.375c0 1.625.906 2.562 2.5 2.562zm-56.156 0c1.656 0 2.531-.937 2.531-2.562V10.79c0-3.25 1.719-4.906 4.844-4.906h7.562c1.657 0 2.563-.907 2.563-2.532s-.906-2.5-2.563-2.5h-7.625C3.562.852.281 4.072.281 10.51v7.656c0 1.625.906 2.562 2.5 2.562zm25.594 15.97h.25c3.156 0 4.874-1.72 4.874-4.876v-9.844c0-1.218-.812-2-2-2-1.25 0-2.062.782-2.062 2v10.125c0 .313-.188.47-.469.47h-1.093c-1.125 0-2 .874-2 2 0 1.343.906 2.124 2.5 2.124zm-9.407-7.376c1.469 0 2.532-1.031 2.532-2.531v-4.25c0-1.5-1.063-2.531-2.532-2.531-1.468 0-2.5 1.03-2.5 2.53v4.25c0 1.5 1.032 2.532 2.5 2.532zm23.719 0c1.438 0 2.469-1.031 2.469-2.531v-4.25c0-1.5-1.032-2.531-2.469-2.531-1.5 0-2.531 1.03-2.531 2.53v4.25c0 1.5 1.031 2.532 2.531 2.532zm-12 17.875c3.781 0 7.594-1.625 10.312-4.344.375-.343.563-.875.563-1.5 0-1.187-.875-2.03-2.031-2.03-.594 0-1.032.218-1.625.843-1.719 1.781-4.438 3-7.219 3-2.625 0-5.375-1.156-7.188-3-.5-.469-.906-.844-1.656-.844-1.156 0-2.031.844-2.031 2.031 0 .532.188 1.032.594 1.47 2.531 2.874 6.5 4.374 10.281 4.374zM10.093 62.01h7.625c1.657 0 2.563-.907 2.563-2.5 0-1.625-.906-2.532-2.563-2.532h-7.562c-3.125 0-4.844-1.656-4.844-4.906v-7.375c0-1.656-.906-2.562-2.531-2.562s-2.5.906-2.5 2.562v7.625c0 6.469 3.281 9.688 9.812 9.688zm33.906 0h7.657c6.531 0 9.812-3.25 9.812-9.688v-7.625c0-1.656-.906-2.562-2.531-2.562s-2.5.906-2.5 2.562v7.375c0 3.25-1.781 4.906-4.875 4.906h-7.563c-1.625 0-2.53.907-2.53 2.532 0 1.593.905 2.5 2.53 2.5z"
                      />
                    </Svg>
                  ) : (
                    <MaterialCommunityIcons name="fingerprint-off" size={50} />
                  )}
                </TouchableOpacity>
              </>
            )}

            {config.domain === 'kis' && (
              <TouchableOpacity style={styles.ekycRegister} onPress={this.onNavigateToEkyc}>
                <View style={styles.textContainer}>
                  <UIText>{t('Do not have an account yet?')}</UIText>
                  <UIText style={styles.openAccount}>{t('Open an account')}</UIText>
                </View>
              </TouchableOpacity>
            )}
          </KeyboardAwareScrollView>
          {this.state.showSetting && (
            <View style={styles.settingSection}>
              <View style={styles.settingButton}>
                <LanguagePicker callApiAfterChange={false} />
              </View>
            </View>
          )}
          {this.state.showSetting && (
            <UIText allowFontScaling={false} style={styles.deviceInfo}>
              {t('Version')}: {DeviceInfo.getVersion()}
            </UIText>
          )}
          <Modal transparent={true} visible={this.state.showOTPModal} animationType="none">
            <View style={styles.OTPContainer}>
              <View style={styles.OTPBody}>
                <View style={styles.titleSection}>
                  <UIText allowFontScaling={false} style={styles.title}>
                    {t('OTP Card Number')}: {this.props.loginResult.otpIndex}
                  </UIText>
                </View>

                <View style={styles.OTPContent}>
                  <TextBox
                    label="OTP number"
                    type={TEXTBOX_TYPE.TEXT}
                    keyboardType="numeric"
                    error={this.state.errorOTP}
                    errorContent={this.state.errorOTPContent}
                    onChange={this.onChangeOTPValue}
                  />
                  <View style={styles.retryArea}>
                    {this.state.timer < 1 ? (
                      <UIText>{`${t('NO_RECEIVE_OTP')} `}</UIText>
                    ) : (
                      <UIText style={styles.otpResendText}>{`${t(
                        this.forceSmsByTag === true
                          ? 'TRY_AGAIN_SMS'
                          : this.forceSMSForResend === true
                          ? 'TRY_AGAIN_SMS'
                          : 'TRY_AGAIN_PUSH'
                      )} (${this.state.timer} ${this.state.timer < 2 ? t('SECOND') : t('SECONDS')})`}</UIText>
                    )}
                    {this.state.timer < 1 && (
                      <UIText style={styles.resendText} onPress={this.resendOTP}>{`${t('RESEND')} (${
                        this.forceSmsByTag === true ? 'SMS' : this.forceSMSForResend === true ? 'SMS' : 'Push'
                      })`}</UIText>
                    )}
                  </View>
                </View>

                <Button onPress={this.onSubmitOTP} title={t('confirm').toUpperCase()} />

                <Button
                  buttonStyle={styles.loginViewModeBtn}
                  textStyle={styles.loginViewModeText}
                  onPress={this.loginViewMode}
                  title={t('Login View Mode')}
                />

                <TouchableOpacity style={styles.buttonCancel} onPress={this.onCancelOTP}>
                  <UIText allowFontScaling={false} style={[styles.labelTouch]}>
                    {' '}
                    {t('Cancel')}
                  </UIText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal visible={this.state.fingerprintModalVisible} animationType="fade" transparent={true}>
            <View style={[styles.modalContainer, styles.buttonSectionModal]}>
              <View style={[styles.bodyModal]}>
                <View style={[styles.modalTitleContainer, styles.buttonSectionModal]}>
                  <UIText style={{ textAlign: 'center', fontWeight: 'bold' }} allowFontScaling={false}>
                    {t('Biometric Authentication')}
                  </UIText>
                  <UIText style={{ textAlign: 'center' }} allowFontScaling={false}>
                    {t('Please log in and set up fingerprint/face recognition in Setting to activate this function')}
                  </UIText>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={this.confirmFingerprintModal}
                    style={[styles.buttonSectionModal, styles.button]}
                  >
                    <UIText allowFontScaling={false} style={styles.buttonText1}>
                      {t('Confirm')}
                    </UIText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal visible={this.state.warningModalVisible} animationType="fade" transparent={true}>
            <View style={[styles.modalContainer, styles.buttonSectionModal]}>
              <View style={[styles.warningBodyModal]}>
                <View style={[styles.modalTitleContainer, styles.buttonSectionModal]}>
                  <UIText style={{ textAlign: 'center', fontWeight: 'bold' }} allowFontScaling={false}>
                    {t('Warning')}
                  </UIText>
                  <Ionicons name="ios-finger-print" size={50} />
                  <UIText style={{ textAlign: 'center' }} allowFontScaling={false}>
                    {t(
                      'Fingerprint/Face ID has not been setup or supported on your device. Please check in Settings and set up fngerprint/face ID on your device to use this function'
                    )}
                  </UIText>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={this.confirmWarningModal}
                    style={[styles.buttonSectionModal, styles.button]}
                  >
                    <UIText allowFontScaling={false} style={styles.buttonText1}>
                      {t('Confirm 2')}
                    </UIText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal visible={this.state.showBiometricFailedModal} animationType="fade" transparent={true}>
            <View style={[styles.modalContainer, styles.buttonSectionModal]}>
              <View style={[styles.warningBodyModal]}>
                <View style={[styles.modalTitleContainer, styles.buttonSectionModal]}>
                  <UIText style={{ textAlign: 'center', fontWeight: 'bold' }} allowFontScaling={false}>
                    {t('Warning')}
                  </UIText>
                  <Ionicons name="ios-finger-print" size={50} />
                  <UIText style={{ textAlign: 'center' }} allowFontScaling={false}>
                    {t(this.props.biometricVerificationFailedType)}
                  </UIText>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={this.confirmBiometricFailedModal}
                    style={[styles.buttonSectionModal, styles.button]}
                  >
                    <UIText allowFontScaling={false} style={styles.buttonText1}>
                      {t('Confirm 2')}
                    </UIText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <ScreenLoader />
        </View>
      );
    }
  }
}

const mapStateToProps = (state: IState) => ({
  loginResult: state.loginResult,
  biometricVerificationFailedTrigger: state.biometricVerificationFailedTrigger,
  biometricVerificationFailedType: state.biometricVerificationFailedType,
  initSocketError: state.initSocketError,
  resendLoginOTPSuccessTrigger: state.resendLoginOTPSuccessTrigger,
  generateKisCardResult: state.generateKisCardResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      loginDomain,
      verifyOTP,
      loginViewMode,
      initMarket,
      hideLoader,
      loginBiometric,
      resendLoginOtp,
      onClickOpenBankAccountLink,
    })(Login)
  ),
  Fallback,
  handleError
);
