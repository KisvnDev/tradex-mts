import React, { ReactNode } from 'react';
import { View, Linking, Modal, Platform, EmitterSubscription, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { Item } from 'react-native-picker-select';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { withErrorBoundary } from 'react-error-boundary';
import { goToIdPhase } from 'navigations';
import { withTranslation, WithTranslation } from 'react-i18next';
import { handleError, isBlank, maskingNumber } from 'utils/common';
import Fallback from 'components/Fallback';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import Button from 'components/Button';
import Picker from 'components/Picker';
import ScreenLoader from 'components/ScreenLoader';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import config from 'config';
import { LANG } from 'global';
import { Colors } from 'styles';
import { registerAccount, resendRegisterAccountOtp, registerAccountConfirmOTP, checkReferralCode } from './actions';
import styles from './styles';
import Svg, { Path } from 'react-native-svg';
import UIText from 'components/UiText';

interface IRegisterAccountProps extends React.ClassAttributes<RegisterAccount>, WithTranslation {
  registerAccountForm: IObject | null;
  registerAccountResendOTPData: IObject | null;
  registerAccountFormSuccessTrigger: boolean;
  registerAccountResendOTPSuccessTrigger: boolean;
  registerAccountConfirmOTPSuccessTrigger: boolean;
  registerAccountConfirmOTPFailedTrigger: boolean;
  referralCodeResponse: { displayName: string; status: boolean };
  referralCodeResponseTrigger: false;

  registerAccount(params: IObject): void;

  resendRegisterAccountOtp(params: IObject): void;

  registerAccountConfirmOTP(params: IObject): void;

  checkReferralCode(params: IObject): void;
}

interface IRegisterAccountState {
  errorFullname: boolean;
  errorFullnameContent: string;
  fullname: string;
  errorPhoneNumber: boolean;
  errorPhoneNumberContent: string;
  phoneNumber: string;
  errorEmail: boolean;
  errorEmailContent: string;
  email: string;
  errorReferral: boolean;
  errorReferralContent: string;
  referral: string;
  otpCode: string;
  otpFormVisible: boolean;
  keyboardShowed: boolean;
  timer: number;
}

const listGenders: Item[] = [
  {
    value: 'MALE',
    label: 'Mr',
  },
  {
    value: 'FEMALE',
    label: 'Mrs',
  },
];
const listTransactionOffice: Item[] = [
  {
    value: 'HOCHIMINH',
    label: 'Ho Chi Minh City',
  },
  {
    value: 'HANOI',
    label: 'Ha Noi',
  },
];
let gender = listGenders[0].value;
let transactionOffice = listTransactionOffice[0].value;

class RegisterAccount extends React.Component<IRegisterAccountProps, IRegisterAccountState> {
  private interval: NodeJS.Timeout;
  private keyboardDidShowListener: EmitterSubscription | null = null;
  private keyboardDidHideListener: EmitterSubscription | null = null;
  private referralEditing: boolean = true;

  constructor(props: IRegisterAccountProps) {
    super(props);

    this.state = {
      errorReferral: false,
      errorReferralContent: '',
      referral: '',
      errorEmail: false,
      errorEmailContent: '',
      email: '',
      errorPhoneNumber: false,
      errorPhoneNumberContent: '',
      phoneNumber: '',
      errorFullname: false,
      errorFullnameContent: '',
      fullname: '',
      otpCode: '',
      otpFormVisible: false,
      keyboardShowed: false,
      timer: ((config as unknown) as IObject).timeoutResendOTP as number,
    };
  }

  shouldComponentUpdate(nextProps: IRegisterAccountProps, nextState: IRegisterAccountState) {
    if (this.state.otpFormVisible !== nextState.otpFormVisible && nextState.otpFormVisible === false) {
      clearInterval(this.interval);
    }
    return true;
  }

  componentDidUpdate(prevProps: IRegisterAccountProps) {
    if (this.props.registerAccountFormSuccessTrigger !== prevProps.registerAccountFormSuccessTrigger) {
      Keyboard.dismiss();
      this.setState(
        {
          otpFormVisible: true,
          timer: ((config as unknown) as IObject).timeoutResendOTP as number,
        },
        () => {
          this.interval = setInterval(() => this.setState((prevState) => ({ timer: prevState.timer - 1 })), 1000);
        }
      );
    }
    if (this.props.registerAccountResendOTPSuccessTrigger !== prevProps.registerAccountResendOTPSuccessTrigger) {
      this.setState(
        {
          otpFormVisible: true,
          timer: ((config as unknown) as IObject).timeoutResendOTP as number,
        },
        () => {
          this.interval = setInterval(() => this.setState((prevState) => ({ timer: prevState.timer - 1 })), 1000);
        }
      );
    }
    if (this.state.timer === 0) {
      clearInterval(this.interval);
    }
    if (this.props.registerAccountConfirmOTPSuccessTrigger !== prevProps.registerAccountConfirmOTPSuccessTrigger) {
      this.setState(
        {
          otpFormVisible: false,
          otpCode: '',
        },
        () => {
          goToIdPhase();
        }
      );
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  private _keyboardDidShow() {
    this.setState({ keyboardShowed: true });
  }

  private _keyboardDidHide() {
    this.setState({ keyboardShowed: false });
  }

  private clickHere = (lang: LANG) => {
    if (lang === LANG.VI) {
      Linking.openURL('https://www.vcsc.com.vn/mo-tai-khoan?language=vi');
    } else {
      Linking.openURL('https://www.vcsc.com.vn/mo-tai-khoan?language=en');
    }
  };

  private onChangeFullname = (data: string) => {
    this.setState({
      fullname: data,
    });
  };

  private onChangePhoneNumber = (data: string) => {
    this.setState({
      phoneNumber: data,
    });
  };

  private onChangeEmail = (data: string) => {
    this.setState({
      email: data,
    });
  };

  private onChangeReferral = (data: string) => {
    this.referralEditing = true;
    this.setState({
      referral: data,
    });
  };

  private handleRegister = () => {
    if (this.validateRegisterForm()) {
      const params = {
        brand: transactionOffice,
        country: 'VIETNAM',
        email: this.state.email,
        name: this.state.fullname,
        phone: this.state.phoneNumber,
        sex: gender,
      };
      this.props.registerAccount(params);
    }
  };

  private validateRegisterForm() {
    if (isBlank(this.state.fullname)) {
      this.setState({
        errorFullname: true,
        errorFullnameContent: 'Full name can not be blank',
      });
      return false;
    } else {
      this.setState({
        errorFullname: false,
        errorFullnameContent: '',
      });
    }

    if (!isBlank(this.state.email)) {
      if (((config.regex as IObject).email as RegExp).test(this.state.email)) {
        this.setState({
          errorEmail: false,
          errorEmailContent: '',
        });
      } else {
        this.setState({
          errorEmail: true,
          errorEmailContent: this.props.t('Email is not validate'),
        });
        return false;
      }
    } else {
      this.setState({
        errorEmail: true,
        errorEmailContent: 'Email can not be blank',
      });
      return false;
    }

    if (!isBlank(this.state.phoneNumber)) {
      if (((config.regex as IObject).phoneNumber as RegExp).test(this.state.phoneNumber)) {
        this.setState({
          errorPhoneNumber: false,
          errorPhoneNumberContent: '',
        });
      } else {
        this.setState({
          errorPhoneNumber: true,
          errorPhoneNumberContent: this.props.t('Phone number is not validate'),
        });
        return false;
      }
    } else {
      this.setState({
        errorPhoneNumber: true,
        errorPhoneNumberContent: 'Phone number can not be blank',
      });
      return false;
    }
    return true;
  }

  private handleRegisterOTP = () => {
    Keyboard.dismiss();
    const params = {
      code: this.state.otpCode,
      draft_id: this.props.registerAccountForm!.draft_id,
      key:
        global.registerAccountResendOtp === false
          ? this.props.registerAccountForm!.otpKey
          : this.props.registerAccountResendOTPData != null
          ? this.props.registerAccountResendOTPData.otpKey
          : this.props.registerAccountForm!.otpKey,
    };
    this.props.registerAccountConfirmOTP(params);
  };

  private resendOTP = () => {
    Keyboard.dismiss();
    const params = {
      key:
        global.registerAccountResendOtp === false
          ? this.props.registerAccountForm!.otpKey
          : this.props.registerAccountResendOTPData != null
          ? this.props.registerAccountResendOTPData.otpKey
          : this.props.registerAccountForm!.otpKey,
      phone: this.state.phoneNumber,
    };
    this.props.resendRegisterAccountOtp(params);
  };

  private closeOTPModal = () => {
    this.setState({
      otpFormVisible: false,
      otpCode: '',
    });
  };

  private onChangeOTPInput = (code: string) => {
    this.setState({
      otpCode: code,
    });
  };

  private onChangeGender = (index: number, value: string, label: string) => {
    gender = value;
  };

  private onBlurReferralCode = () => {
    if (this.state.referral.trim() !== '') {
      this.referralEditing = false;
      const params = {
        ref: this.state.referral,
        brand: transactionOffice,
        country: 'VIETNAM',
        email: this.state.email,
        name: this.state.fullname,
        phone: this.state.phoneNumber,
        sex: gender,
      };
      this.props.checkReferralCode(params);
    }
  };

  private onChangeTransactionOffice = (index: number, value: string, label: string) => {
    transactionOffice = value;
  };

  render() {
    const { t } = this.props;
    let instructionTitle: ReactNode;
    let modalContent: ReactNode;

    if (global.lang === LANG.VI) {
      instructionTitle = (
        <UIText style={styles.instructionTitleText}>
          Đây là tính năng Mở tài khoản dành cho{' '}
          <UIText style={styles.boldText}>nhà đầu tư cá nhân người Việt Nam</UIText>. Với các nhà đầu tư khác, vui lòng
          liên hệ <UIText style={styles.boldText}>Tổng đài (+84 8) 3821 6636 (giờ hành chính)</UIText> hoặc để lại thông
          tin{' '}
          <UIText style={styles.clickableText} onPress={() => this.clickHere(global.lang)}>
            tại đây
          </UIText>
          .
        </UIText>
      );
    } else {
      instructionTitle = (
        <UIText style={styles.instructionTitleText}>
          This is a feature to open accounts for <UIText style={styles.boldText}>Vietnamese individual investor</UIText>
          . For other investors, please contact{' '}
          <UIText style={styles.boldText}>our Call center (+84 8) 3821 6636 (in office hours)</UIText> or leave us
          information{' '}
          <UIText style={styles.clickableText} onPress={() => this.clickHere(global.lang)}>
            here
          </UIText>
          .
        </UIText>
      );
    }

    if (this.state.otpFormVisible === true) {
      if (global.lang === LANG.VI) {
        modalContent = (
          <UIText style={styles.modalContent}>
            Vui lòng nhập mã xác thực OTP được gửi đến số điện thoại{' '}
            <UIText style={styles.boldText}>{maskingNumber(this.state.phoneNumber)}</UIText> của Quý khách để xác thực
          </UIText>
        );
      } else {
        modalContent = (
          <UIText style={styles.modalContent}>
            Please enter the OTP authentication code sent to your phone number{' '}
            <UIText style={styles.boldText}>{maskingNumber(this.state.phoneNumber)}</UIText> for verification
          </UIText>
        );
      }
    } else {
      modalContent = <UIText />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.instructionTitle}>{instructionTitle}</View>
        <KeyboardAwareScrollView>
          <View style={styles.formSection}>
            <View style={styles.formItem}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('MR_MRS')}
              </UIText>

              <View style={styles.bankContainer}>
                <Picker
                  placeholder={{}}
                  list={listGenders}
                  selectedValue={gender}
                  onChange={this.onChangeGender}
                  allowPlaceHolderSelect={false}
                />
              </View>
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="Full name"
                type={TEXTBOX_TYPE.TEXT}
                onChange={this.onChangeFullname}
                error={this.state.errorFullname}
                errorContent={this.state.errorFullnameContent}
                value={this.state.fullname}
                autoCorrect={false}
              />
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="Phone Number"
                type={TEXTBOX_TYPE.TEXT}
                onChange={this.onChangePhoneNumber}
                error={this.state.errorPhoneNumber}
                errorContent={this.state.errorPhoneNumberContent}
                value={this.state.phoneNumber}
                keyboardType={'phone-pad'}
                autoCorrect={false}
              />
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="Email"
                type={TEXTBOX_TYPE.TEXT}
                onChange={this.onChangeEmail}
                error={this.state.errorEmail}
                errorContent={this.state.errorEmailContent}
                value={this.state.email}
                keyboardType={'email-address'}
                autoCorrect={false}
              />
            </View>
            <View style={styles.formItem}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Transaction office')}
              </UIText>

              <View style={styles.bankContainer}>
                <Picker
                  placeholder={{}}
                  list={listTransactionOffice}
                  selectedValue={transactionOffice}
                  onChange={this.onChangeTransactionOffice}
                  allowPlaceHolderSelect={false}
                />
              </View>
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="Referral"
                type={TEXTBOX_TYPE.TEXT}
                onChange={this.onChangeReferral}
                error={this.state.errorReferral}
                errorContent={this.state.errorReferralContent}
                value={this.state.referral}
                autoCorrect={false}
                onBlur={this.onBlurReferralCode}
              />
            </View>
            {this.state.referral.trim() !== '' && this.referralEditing === false && (
              <View style={styles.formItem}>
                {this.props.referralCodeResponse.status === true ? (
                  <UIText style={styles.referralSuccessText}>{`${t('Referral name')}: ${
                    this.props.referralCodeResponse.displayName
                  }`}</UIText>
                ) : (
                  <UIText style={styles.referralFailedText}>{`${t('Referral code is invalid')}`}</UIText>
                )}
              </View>
            )}
            <View style={styles.registerArea}>
              <Button onPress={this.handleRegister} title={'REGISTER_NOW'} buttonStyle={styles.buttonRegister} />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Modal visible={this.state.otpFormVisible} animationType="fade" transparent={true}>
          <View
            style={[
              styles.modalContainer,
              Platform.OS === 'android'
                ? styles.buttonSectionModal
                : this.state.keyboardShowed === true
                ? styles.buttonSectionModal2
                : styles.buttonSectionModal,
            ]}
          >
            <View style={[styles.bodyModal]}>
              {/* <View style={[styles.modalTitleContainer, styles.buttonSectionModal]}>
                <UIText style={{ textAlign: 'center', fontWeight: 'bold' }} allowFontScaling={false}>{t('Biometric Authentication')}</UIText>
                <UIText style={{ textAlign: 'center' }} allowFontScaling={false}>{t('Please log in and set up fingerprint/face recognition in Setting to activate this function')}</UIText>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.confirmFingerprintModal} style={[styles.buttonSectionModal, styles.button]}>
                  <UIText allowFontScaling={false} style={styles.buttonText1}>
                    {t('Confirm')}
                  </UIText>
                </TouchableOpacity>
              </View> */}
              <View style={styles.iconPhoneArea}>
                <View style={styles.closeArea}>
                  <EntypoIcon name={'circle-with-cross'} size={25} color={Colors.BORDER} onPress={this.closeOTPModal} />
                </View>
                <View style={styles.iconPhone}>
                  <Svg width={64} height={64} fill="none" viewBox="0 0 64 64">
                    <Path
                      fill="#0161BD"
                      d="M42.874 57.35A6.65 6.65 0 0136.223 64H11.651A6.65 6.65 0 015 57.35V6.65A6.65 6.65 0 0111.65 0h24.573a6.65 6.65 0 016.65 6.65v50.7z"
                    />
                    <Path
                      fill="#5DC7F3"
                      d="M39.02 57.35a2.797 2.797 0 01-2.797 2.797H11.651a2.797 2.797 0 01-2.798-2.798V6.651a2.797 2.797 0 012.798-2.798h1.59c.344 0 .652.214.773.536l.379 1.008a2.85 2.85 0 002.668 1.848h13.752a2.85 2.85 0 002.668-1.848l.378-1.008a.826.826 0 01.774-.536h1.59a2.797 2.797 0 012.797 2.798v50.698z"
                    />
                    <Path
                      fill="#FFBC00"
                      d="M53.401 44.686H28.642l-2.94 2.993c-.67.681-1.827.208-1.827-.747V30.05a5.675 5.675 0 015.675-5.675h23.851a5.675 5.675 0 015.675 5.675v8.961a5.675 5.675 0 01-5.675 5.675z"
                    />
                    <Path
                      fill="#FCFCFC"
                      d="M54.673 31.708H29.736a.963.963 0 110-1.926h24.937a.963.963 0 110 1.926zm0 5.443H35.347a.963.963 0 110-1.927h19.326a.963.963 0 110 1.927zm-23.613 0h-1.324a.963.963 0 110-1.927h1.325a.963.963 0 110 1.927z"
                    />
                  </Svg>
                </View>
                <View style={styles.titleContent}>
                  <View style={styles.titleContainer}>
                    <UIText style={styles.titleText}>{t('CONFIRM_OTP_CODE')}</UIText>
                  </View>
                  <View style={styles.contentContainer}>{modalContent}</View>
                </View>
              </View>
              <View style={styles.otpInputArea}>
                {Platform.OS === 'android' ? (
                  <OTPInputView
                    pinCount={((config as unknown) as IObject).otpCodeLength as number}
                    style={styles.otpInput2}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    code={this.state.otpCode}
                    onCodeChanged={this.onChangeOTPInput}
                  />
                ) : (
                  <OTPInputView
                    pinCount={((config as unknown) as IObject).otpCodeLength as number}
                    style={styles.otpInput2}
                    autoFocusOnLoad={true}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    code={this.state.otpCode}
                    onCodeChanged={this.onChangeOTPInput}
                  />
                )}
              </View>
              <View style={styles.sendOTPArea}>
                <View style={styles.sendOTPButtonArea}>
                  <Button
                    onPress={this.handleRegisterOTP}
                    title={'REGISTER_NOW_2'}
                    buttonStyle={styles.buttonSendOTP}
                  />
                </View>
              </View>
              <View style={styles.retryArea}>
                {this.state.timer < 1 ? (
                  <UIText>{`${t('NO_RECEIVE_OTP')} `}</UIText>
                ) : (
                  <UIText>{`${t('TRY_AGAIN_AFTER')} ${this.state.timer} ${
                    this.state.timer < 2 ? t('SECOND') : t('SECONDS')
                  }`}</UIText>
                )}
                {this.state.timer < 1 && (
                  <UIText style={styles.resendText} onPress={this.resendOTP}>
                    {t('RESEND')}
                  </UIText>
                )}
              </View>
            </View>
          </View>
          <ScreenLoader />
        </Modal>
        <ScreenLoader />
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  registerAccountForm: state.registerAccountForm,
  registerAccountFormSuccessTrigger: state.registerAccountFormSuccessTrigger,
  registerAccountResendOTPSuccessTrigger: state.registerAccountResendOTPSuccessTrigger,
  registerAccountConfirmOTPSuccessTrigger: state.registerAccountConfirmOTPSuccessTrigger,
  registerAccountConfirmOTPFailedTrigger: state.registerAccountConfirmOTPFailedTrigger,
  referralCodeResponse: state.referralCodeResponse,
  referralCodeResponseTrigger: state.referralCodeResponseTrigger,
  registerAccountResendOTPData: state.registerAccountResendOTPData,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      registerAccount,
      resendRegisterAccountOtp,
      registerAccountConfirmOTP,
      checkReferralCode,
    })(RegisterAccount)
  ),
  Fallback,
  handleError
);
