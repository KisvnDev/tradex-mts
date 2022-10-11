import React from 'react';
import { View, Switch, Modal, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import KeepAwake from 'react-native-keep-awake';
import ReactNativeBiometrics from 'react-native-biometrics';
import { withTranslation, WithTranslation } from 'react-i18next';
import i18next from 'i18next';
import { connect } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ImageSource } from 'react-native-vector-icons/Icon';
import OneSignal from 'react-native-onesignal';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError, isBlank } from 'utils/common';
import { ILoginResult } from 'screens/Login/reducers';
import Fallback from 'components/Fallback';
import Picker from 'components/Picker';
import LanguagePicker from 'components/LanguagePicker';
import UserInactivity from 'components/UserInactivity';
import config from 'config';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { BIOMETRIC_TYPE, PUBLIC_KEY_BIOMETRIC, USERNAME_BIOMETRIC } from 'global';
import { getKey, removeKey, setKey } from 'utils/asyncStorage';
import { IState } from 'redux-sagas/reducers';
import { ISettings, IUserExtraInfo, IObject } from 'interfaces/common';
import { hideLoader } from 'screens/Login/actions';
import { changeAccountSettings, registerBiometric, verifyOTPBiometric, getUsingTouchFaceIdStatus } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface ISettingsProps extends React.ClassAttributes<Settings>, WithTranslation {
  userExtraInfo: IUserExtraInfo;
  registerBiometricResult: ILoginResult;
  registerBiometricSuccess: boolean;
  usingTouchFaceId: boolean;
  registerBiometricTrigger: boolean;
  verifyOTPBiometricTrigger: boolean;

  changeAccountSettings(params: IObject): void;

  registerBiometric(params: IObject): void;

  verifyOTPBiometric(payload: IObject): void;

  getUsingTouchFaceIdStatus(payload: IObject): void;

  hideLoader(): void;
}

interface ISettingsState {
  passwordForm: boolean;
  password: string;
  showOTPModal: boolean;
  errorOTP: boolean;
  errorOTPContent: string;
  warningModalVisible: boolean;
}

class Settings extends React.Component<ISettingsProps, ISettingsState> {
  private settings: ISettings = {};
  private favoriteIcon: ImageSource;
  private rankingIcon: ImageSource;
  private symbolIcon: ImageSource;
  private speedOrderIcon: ImageSource;
  private moreIcon: ImageSource;
  private otpValue = '';
  private publicKey = '';
  private enableButton = true;
  private enableButtonOtp = true;
  private readonly SUB_USERNAME = '057';

  private sessionList = [
    { label: this.props.t('30 minutes'), value: 30 },
    { label: this.props.t('60 minutes'), value: 60 },
    { label: this.props.t('3 hours'), value: 180 },
    { label: this.props.t('8 hours'), value: 480 },
  ];

  constructor(props: ISettingsProps) {
    super(props);

    this.state = {
      passwordForm: false,
      password: '',
      showOTPModal: false,
      errorOTP: false,
      errorOTPContent: '',
      warningModalVisible: false,
    };
  }

  async componentDidMount() {
    this.props.i18n.on('languageChanged', this.updateBottomBar);
    const publicKey = `${await getKey(PUBLIC_KEY_BIOMETRIC)}`;
    const params = {
      publicKey,
    };
    this.props.getUsingTouchFaceIdStatus(params);
  }

  componentWillUnmount() {
    this.props.i18n.off('languageChanged', this.updateBottomBar);
  }

  componentDidAppear() {
    Promise.all([
      MaterialIcons.getImageSource('view-list', 16),
      MaterialIcons.getImageSource('trending-up', 16),
      Fontisto.getImageSource('bar-chart', 14),
      MaterialIcons.getImageSource('flash-on', 16),
      MaterialIcons.getImageSource('settings-applications', 16),
      MaterialIcons.getImageSource('search', 25),
      FontAwesome.getImageSource('bell-o', 22),
    ]).then(([favoriteIcon, rankingIcon, symbolIcon, speedOrderIcon, moreIcon]) => {
      this.favoriteIcon = favoriteIcon;
      this.rankingIcon = rankingIcon;
      this.symbolIcon = symbolIcon;
      this.speedOrderIcon = speedOrderIcon;
      this.moreIcon = moreIcon;
      this.updateBottomBar();
    });
  }

  shouldComponentUpdate(nextProps: ISettingsProps, nextState: ISettingsState) {
    if (this.props.registerBiometricSuccess !== nextProps.registerBiometricSuccess) {
      this.getStatusBios();
      this.setState({
        showOTPModal: false,
      });
    }

    if (this.props.registerBiometricTrigger !== nextProps.registerBiometricTrigger) {
      this.enableButton = true;
    }

    if (this.props.verifyOTPBiometricTrigger !== nextProps.verifyOTPBiometricTrigger) {
      this.enableButtonOtp = true;
    }

    return true;
  }

  componentDidUpdate(prevProps: ISettingsProps) {
    if (this.props.registerBiometricResult !== prevProps.registerBiometricResult) {
      if (!config.usingNewKisCore) {
        this.otpValue = '';
        if (this.props.registerBiometricResult.showOTP === true) {
          this.setState(
            {
              showOTPModal: this.props.registerBiometricResult.showOTP,
              passwordForm: false,
              password: '',
            },
            () => {
              this.props.hideLoader();
            }
          );
        } else {
          this.setState(
            {
              showOTPModal: this.props.registerBiometricResult.showOTP,
            },
            () => {
              this.props.hideLoader();
            }
          );
        }
      } else {
        this.getStatusBios();
        this.setState(
          {
            passwordForm: false,
          },
          () => {
            this.props.hideLoader();
          }
        );
      }
    }
  }

  private getStatusBios = () => {
    const params = {
      publicKey: this.publicKey,
    };
    this.props.getUsingTouchFaceIdStatus(params);
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

  private onSubmitOTP = () => {
    if (this.enableButtonOtp === true) {
      if (this.validateOTP()) {
        this.enableButtonOtp = false;
        this.props.verifyOTPBiometric({
          otpValue: this.otpValue,
        });
      }
    }
  };

  private onChangeOTPValue = (value: string) => {
    this.otpValue = value;
  };

  private onCancelOTP = () => {
    ReactNativeBiometrics.deleteKeys().then(async (resultObject) => {
      const { keysDeleted } = resultObject;

      if (keysDeleted) {
        await removeKey(PUBLIC_KEY_BIOMETRIC);
        await removeKey(USERNAME_BIOMETRIC);
        console.log('Successful deletion');
      } else {
        console.log('Unsuccessful deletion because there were no keys to delete');
      }
    });
    this.setState({
      showOTPModal: false,
    });
  };

  private updateBottomBar = () => {
    this.sessionList = [
      { label: i18next.t('30 minutes'), value: 30 },
      { label: i18next.t('60 minutes'), value: 60 },
      { label: i18next.t('3 hours'), value: 180 },
      { label: i18next.t('8 hours'), value: 480 },
    ];

    Navigation.mergeOptions('Market', {
      bottomTab: {
        text: i18next.t('Market'),
        icon: this.favoriteIcon,
      },
    });

    Navigation.mergeOptions('Ranking', {
      bottomTab: {
        text: i18next.t('Ranking'),
        icon: this.rankingIcon,
      },
    });

    Navigation.mergeOptions('SpeedOrder', {
      bottomTab: {
        text: i18next.t('Speed Order'),
        icon: this.speedOrderIcon,
      },
    });

    Navigation.mergeOptions('SymbolInfo', {
      bottomTab: {
        text: i18next.t('Symbol'),
        icon: this.symbolIcon,
      },
    });

    Navigation.mergeOptions('More', {
      bottomTab: {
        text: i18next.t('More'),
        icon: this.moreIcon,
      },
    });

    Navigation.mergeOptions('Settings', {
      topBar: {
        title: {
          text: i18next.t('Settings'),
        },
      },
    });
  };

  private onChangeAutoLockPrevention = (value: boolean) => {
    this.props.changeAccountSettings({
      autoLockPrevention: value,
    });
    this.changeKeepAwake(value);
  };

  private onChangeUsingTouchFaceId = async (value: boolean) => {
    if (value === true) {
      if (global.biometricType !== BIOMETRIC_TYPE.None) {
        ReactNativeBiometrics.simplePrompt({ promptMessage: this.props.t('Confirm fingerprint') })
          .then((resultObject) => {
            const { success } = resultObject;

            if (success) {
              console.log('successful biometrics provided');
              ReactNativeBiometrics.deleteKeys().then(async (resultObject) => {
                const { keysDeleted } = resultObject;

                if (keysDeleted) {
                  await removeKey(PUBLIC_KEY_BIOMETRIC);
                  await removeKey(USERNAME_BIOMETRIC);
                  console.log('Successful deletion');
                } else {
                  console.log('Unsuccessful deletion because there were no keys to delete');
                }
              });
              this.setState({
                passwordForm: true,
              });
            } else {
              console.log('user cancelled biometric prompt');
            }
          })
          .catch(() => {
            console.log('biometrics failed');
          });
      } else {
        this.setState({
          warningModalVisible: true,
        });
      }
    } else {
      ReactNativeBiometrics.deleteKeys().then(async (resultObject) => {
        const { keysDeleted } = resultObject;

        if (keysDeleted) {
          await removeKey(PUBLIC_KEY_BIOMETRIC);
          await removeKey(USERNAME_BIOMETRIC);
          console.log('Successful deletion');
          const publicKey = `${await getKey(PUBLIC_KEY_BIOMETRIC)}`;
          const params = {
            publicKey,
          };
          this.props.getUsingTouchFaceIdStatus(params);
        } else {
          console.log('Unsuccessful deletion because there were no keys to delete');
        }
      });
    }
  };

  private confirmPasswordForm = async () => {
    if (this.enableButton === true) {
      this.enableButton = false;
      this.setState({});
      ReactNativeBiometrics.createKeys()
        .then(async (resultObject) => {
          const { publicKey } = resultObject;
          await setKey(PUBLIC_KEY_BIOMETRIC, publicKey);
          this.publicKey = `${await getKey(PUBLIC_KEY_BIOMETRIC)}`;
          if (config.usingNewKisCore) {
            await setKey(USERNAME_BIOMETRIC, this.SUB_USERNAME + global.username);
          } else {
            await setKey(USERNAME_BIOMETRIC, global.username);
          }
          const params = {
            password: this.state.password,
            publicKey: `${await getKey(PUBLIC_KEY_BIOMETRIC)}`,
          };
          console.log('params', params, 'success');

          this.props.registerBiometric(params);
        })
        .catch((error) => {
          console.log('error', error);
          this.setState({
            passwordForm: false,
            password: '',
          });
        });
    }
  };

  private closePasswordForm = () => {
    this.setState({
      passwordForm: false,
      password: '',
    });
  };

  private onChangePassword = (data: string) => {
    this.setState({
      password: data,
    });
  };

  private onChangeUsingMobileOTP = (value: boolean) => {
    global.mobileOTP = value;
    OneSignal.sendTag('mobileOTP', value.toString());
    this.setState({});
    if (config.usingNewKisCore) {
      this.props.changeAccountSettings({
        usingMobileOTP: value,
      });
    }
  };

  private onChangeReceiveNotification = (value: boolean) => {
    global.otherNotifications = value;
    OneSignal.sendTag('otherNotifications', value.toString());
    this.setState({});
  };

  private onChangeLoginSession = (index: number, value: number, label: string) => {
    this.props.changeAccountSettings({
      loginSession: value,
    });
  };

  private confirmWarningModal = () => {
    this.setState({
      warningModalVisible: false,
    });
  };

  private changeKeepAwake = (shouldBeAwake: boolean) => {
    if (shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  };

  render() {
    const { t, userExtraInfo } = this.props;

    if (userExtraInfo != null && userExtraInfo.settings) {
      this.settings = userExtraInfo.settings;
    }

    if (this.settings == null) {
      this.settings = {
        autoLockPrevention: false,
        usingTouchFaceId: false,
        loginSession: 30,
        usingMobileOTP: false,
      };
    }

    return (
      <UserInactivity>
        <View style={styles.container}>
          <UIText allowFontScaling={false} style={styles.header}>
            {t('Global Settings')}
          </UIText>

          <View style={styles.item}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Language')}
              </UIText>
            </View>
            <View style={styles.value}>
              <LanguagePicker callApiAfterChange={true} />
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Auto Lock Prevention')}
              </UIText>
            </View>
            <View style={styles.value}>
              <Switch value={this.settings.autoLockPrevention} onValueChange={this.onChangeAutoLockPrevention} />
            </View>
          </View>

          {/* <View style={styles.item}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Using TouchId/FaceId instead of OTP')}
              </UIText>
            </View>
            <View style={styles.value}>
              <Switch value={this.settings.usingTouchFaceId} onValueChange={this.onChangeUsingTouchFaceId} />
            </View>
          </View> */}

          <View style={styles.item}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Login Session Timeout')}
              </UIText>
            </View>
            <View style={styles.value}>
              <Picker
                list={this.sessionList}
                selectedValue={this.settings.loginSession}
                onChange={this.onChangeLoginSession}
              />
            </View>
          </View>

          {global.viewMode !== true && (
            <View style={styles.item}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Using Mobile OTP')}
                </UIText>
              </View>
              <View style={styles.value}>
                <Switch value={global.mobileOTP} onValueChange={this.onChangeUsingMobileOTP} />
              </View>
            </View>
          )}

          {global.viewMode !== true && (
            <View style={styles.item}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Receive Other Notifications')}
                </UIText>
              </View>
              <View style={styles.value}>
                <Switch value={global.otherNotifications} onValueChange={this.onChangeReceiveNotification} />
              </View>
            </View>
          )}

          <View style={styles.item}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Login by fingerprint/face')}
              </UIText>
            </View>
            <View style={styles.value}>
              <Switch value={this.props.usingTouchFaceId} onValueChange={this.onChangeUsingTouchFaceId} />
            </View>
          </View>
        </View>
        <Modal visible={this.state.passwordForm} animationType="fade" transparent={true}>
          <View style={[styles.modalContainer, styles.buttonSectionModal]}>
            <View style={[styles.bodyModal]}>
              <View style={[styles.modalTitleContainer, styles.buttonSectionModal]}>
                <UIText allowFontScaling={false}>{t('Please enter login password')}</UIText>
                <TextBox
                  type={TEXTBOX_TYPE.PASSWORD}
                  onChange={this.onChangePassword}
                  value={this.state.password}
                  textInputStyle={styles.textInputStyle}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.closePasswordForm} style={[styles.buttonSectionModal1, styles.button]}>
                  <UIText allowFontScaling={false} style={styles.buttonText}>
                    {t('Cancel')}
                  </UIText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.confirmPasswordForm}
                  style={[styles.buttonSectionModal, styles.button]}
                  disabled={!this.enableButton}
                >
                  <UIText allowFontScaling={false} style={styles.buttonText1}>
                    {t('OK')}
                  </UIText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* <Modal transparent={true} visible={this.state.showOTPModal} animationType="none">
          <View style={styles.OTPContainer}>
            <View style={styles.OTPBody}>
              <View style={styles.titleSection}>
                <UIText allowFontScaling={false} style={styles.title}>
                  {t('Please enter SMS OTP')}
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
                <View style={styles.OTPResend}>
                  <UIText>{t('Can not receive OTP?')} </UIText>
                  <TouchableOpacity><UIText style={styles.resendOTPButton}>{t('Resend OTP')}</UIText></TouchableOpacity>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.onSubmitOTP} style={[styles.buttonSectionModal1, styles.button]}>
                  <UIText allowFontScaling={false} style={styles.buttonText1}>
                    {t('OK')}
                  </UIText>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onCancelOTP} style={[styles.buttonSectionModal, styles.button]}>
                  <UIText allowFontScaling={false} style={styles.buttonText}>
                    {t('Cancel')}
                  </UIText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> */}
        <Modal transparent={true} visible={this.state.showOTPModal} animationType="none">
          <View style={styles.OTPContainer}>
            <View style={styles.OTPBody}>
              <View style={styles.titleSection}>
                <UIText allowFontScaling={false} style={styles.title}>
                  {t('OTP Card Number')}: {this.props.registerBiometricResult.otpIndex}
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
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.onCancelOTP} style={[styles.buttonSectionModal1, styles.button]}>
                  <UIText allowFontScaling={false} style={styles.buttonText}>
                    {t('Cancel')}
                  </UIText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.onSubmitOTP}
                  style={[styles.buttonSectionModal, styles.button]}
                  disabled={!this.enableButtonOtp}
                >
                  <UIText allowFontScaling={false} style={styles.buttonText1}>
                    {t('OK')}
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
                <TouchableOpacity onPress={this.confirmWarningModal} style={[styles.buttonSectionModal, styles.button]}>
                  <UIText allowFontScaling={false} style={styles.buttonText1}>
                    {t('Confirm 2')}
                  </UIText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  userExtraInfo: state.userExtraInfo,
  registerBiometricResult: state.registerBiometricResult,
  registerBiometricSuccess: state.registerBiometricSuccess,
  registerBiometricTrigger: state.registerBiometricTrigger,
  verifyOTPBiometricTrigger: state.verifyOTPBiometricTrigger,
  usingTouchFaceId: state.usingTouchFaceId,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      changeAccountSettings,
      registerBiometric,
      verifyOTPBiometric,
      hideLoader,
      getUsingTouchFaceIdStatus,
    })(Settings)
  ),
  Fallback,
  handleError
);
