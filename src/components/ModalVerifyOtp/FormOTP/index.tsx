/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react-native/no-inline-styles */
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import config from 'config';
import { View, TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import Picker from 'components/Picker';
import CheckBox from 'components/CheckBox';
import { IObject } from 'interfaces/common';
import { ILoginResult } from 'screens/Login/reducers';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import { generateNewKisCard, changeAccountSettings, notificationMobileOTP, resetErrorVerifyOtp } from './actions';
import { getKey, setKey } from 'utils/asyncStorage';
import Button from 'components/Button';
import UIText from 'components/UiText';

interface IFormOtpProps extends React.ClassAttributes<FormOTP>, WithTranslation {
  generateKisCardResult: IObject | null;
  checkVerifySuccess: ILoginResult;
  styleContainer?: ViewStyle;
  isNotModal?: boolean;
  isAlwayVerify?: boolean;

  resetErrorVerifyOtp(): void;
  generateNewKisCard(): void;
  changeAccountSettings(parmas: { loginSession: number }): void;
  notificationMobileOTP(payload: IObject): void;
  onSetWordMatrixValue(value: string): void;
  onSetSession?(value: number): void;
  onSetRemember?(value: boolean): void;
  finishLoadOtpIndex?(): void;
}

interface IFormOtpState {
  timer: number;
  isStartCountTime: boolean;
  errorOTP: boolean;
  errorOTPContent: string;
  isRemember: boolean;
  isSubmitedOtpMatrix: boolean;
  isShowTypeSendOtp: boolean;
  typeSend: string;
  isSendFirstTime: boolean;
}

enum TypeSend {
  PUSH = 'PUSH',
  SMS = 'SMS',
}

const TIME_SESSEION = 60;
class FormOTP extends React.Component<IFormOtpProps, IFormOtpState> {
  private interval: NodeJS.Timeout;
  private otpIndex: number | null = null;
  private sessionList = [
    { label: this.props.t('30 minutes'), value: 0.5 },
    { label: this.props.t('60 minutes'), value: 1 },
    { label: this.props.t('3 hours'), value: 3 },
    { label: this.props.t('8 hours'), value: 8 },
  ];
  private timeSession = TIME_SESSEION;

  constructor(props: IFormOtpProps) {
    super(props);

    this.state = {
      timer: 0,
      errorOTP: false,
      errorOTPContent: '',
      isStartCountTime: false,
      isRemember: true,
      isSubmitedOtpMatrix: !!global.OTPTokenMatrix,
      isShowTypeSendOtp: false,
      typeSend: TypeSend.PUSH,
      isSendFirstTime: false,
    };
  }

  componentDidMount() {
    this.handleSendOtp();
    if (global.mobileOTP) {
      (() => {
        this.setState({
          typeSend: TypeSend.PUSH,
        });
      })();
    } else {
      getKey('SEND_OTP_TYPE').then((type: string) => {
        if (type) {
          this.setState({ typeSend: type });
        } else {
          this.setState({
            typeSend: TypeSend.SMS,
          });
        }
      });
    }
  }

  shouldComponentUpdate(nextProps: IFormOtpProps, _nextState: IFormOtpState) {
    if (
      this.props.checkVerifySuccess !== nextProps.checkVerifySuccess &&
      nextProps.checkVerifySuccess.isVerifySuccess
    ) {
      this.setState({ isSubmitedOtpMatrix: true });
      return true;
    }

    if (
      this.props.generateKisCardResult !== nextProps.generateKisCardResult &&
      nextProps.generateKisCardResult != null
    ) {
      this.otpIndex = Number(nextProps.generateKisCardResult.wordMatrixKey);
      if (nextProps.finishLoadOtpIndex != null) {
        nextProps.finishLoadOtpIndex();
      }
    }
    return true;
  }

  componentDidUpdate(prevProps: IFormOtpProps, prevState: IFormOtpState) {
    if (this.props.checkVerifySuccess !== prevProps.checkVerifySuccess && this.props.checkVerifySuccess.error) {
      this.setState({ errorOTP: true, errorOTPContent: 'Invalid OTP' });
    }

    if (this.props.checkVerifySuccess !== prevProps.checkVerifySuccess && !this.props.checkVerifySuccess.error) {
      this.setState({ errorOTP: false, errorOTPContent: '' });
    }

    if (this.props.generateKisCardResult !== prevProps.generateKisCardResult && this.props.generateKisCardResult) {
      this.props.notificationMobileOTP({
        matrixId: this.props.generateKisCardResult.wordMatrixId,
        forceSMS: this.state.typeSend === 'SMS',
      });
    }

    if (
      this.state.isStartCountTime !== prevState.isStartCountTime &&
      this.state.isStartCountTime === true &&
      !global.OTPTokenMatrix &&
      !this.props.isAlwayVerify
    ) {
      this.setState(
        {
          timer: config.timeEachResendOTP,
        },
        () => {
          clearInterval(this.interval);
          // eslint-disable-next-line no-shadow
          this.interval = setInterval(() => this.setState((prevState) => ({ timer: prevState.timer - 1 })), 1000);
        }
      );
    }
    if (this.state.timer === 0 && this.state.isStartCountTime === true) {
      clearInterval(this.interval);
      this.setState({ isStartCountTime: false });
    }
  }

  private handleSendOtp = () => {
    if (global.OTPTokenMatrix && !this.props.isAlwayVerify) {
      return;
    }

    this.props.generateNewKisCard();
  };

  private handleSendClick = () => {
    if (this.state.isSendFirstTime) {
      this.resendOTP();
      return;
    }

    this.handleSendOtp();
    this.setState({ isStartCountTime: true, timer: config.timeEachResendOTP, isSendFirstTime: true });
  };

  private handleTickTypeSendOtp = async (type: string) => {
    this.setState({
      typeSend: type,
      isShowTypeSendOtp: false,
    });
    await setKey('SEND_OTP_TYPE', type);
  };

  private onChangeTimeSession = (_index: number, value: number, _label: string) => {
    this.timeSession = value * TIME_SESSEION;

    this.props.onSetSession?.(this.timeSession);

    this.props.changeAccountSettings({
      loginSession: this.timeSession,
    });
  };

  private resendOTP = () => {
    this.handleSendOtp();
    this.setState({ isStartCountTime: true, timer: config.timeEachResendOTP, isSendFirstTime: true });
  };

  private onChangeOTPValue = (value: string) => {
    if (this.props.checkVerifySuccess?.error) {
      this.props.resetErrorVerifyOtp();
    }
    this.props.onSetWordMatrixValue(value);
  };

  private toggleRemember = (isRemember: boolean) => {
    this.setState({ isRemember });
    this.props.onSetRemember?.(isRemember);
  };

  render() {
    const { t, styleContainer, isAlwayVerify = false } = this.props;

    if (this.state.isSubmitedOtpMatrix && !isAlwayVerify) {
      return null;
    } else if (this.otpIndex == null) {
      return <ActivityIndicator />;
    }

    const isDisabledTypeSend = this.state.timer >= 1;

    return (
      <View style={[styleContainer]}>
        <View style={[styles.itemContentStyle]}>
          <UIText style={styles.boldText}>{t('OTP')}</UIText>
          <View style={styles.wrapper}>
            <View style={styles.labelOtp}>
              {this.props.generateKisCardResult?.wordMatrixKey && (
                <View style={styles.boxMatrix}>
                  <UIText style={styles.labelTouch}>{this.otpIndex}</UIText>
                </View>
              )}
            </View>
            <View style={styles.OTPContent}>
              <TextBox
                type={TEXTBOX_TYPE.PASSWORD}
                keyboardType="numeric"
                error={this.state.errorOTP}
                errorContent={this.state.errorOTPContent}
                onChange={this.onChangeOTPValue}
                textInputStyle={{
                  height: 40,
                }}
                labelErrorSection={{ top: -20 }}
                textBoxInnerIconContainerProps={styles.iconEye}
                containerStyle={{
                  paddingBottom: 0,
                }}
                labelSectionStyle={{
                  height: 0,
                  marginBottom: 0,
                }}
              />
            </View>
          </View>
        </View>

        <View style={[styles.itemContentStyle]}>
          <View style={styles.row}>
            <CheckBox checked={this.state.isRemember} onChange={this.toggleRemember} />
            <UIText style={styles.left5}>{t('Remember')}</UIText>
          </View>

          <View style={styles.selectTimeSession}>
            <Picker
              list={this.sessionList}
              selectedValue={this.timeSession / TIME_SESSEION}
              onChange={this.onChangeTimeSession}
            />
          </View>
        </View>
        <View style={styles.btn}>
          <View style={styles.wrapperSelected}>
            <View style={styles.selectStyle}>
              <TouchableOpacity
                style={[
                  styles.btnSelect,
                  isDisabledTypeSend && {
                    opacity: 0.4,
                  },
                ]}
                onPress={() => this.handleTickTypeSendOtp('SMS')}
                disabled={isDisabledTypeSend}
              >
                {this.state.typeSend === 'SMS' && <View style={styles.selectedStyle} />}
              </TouchableOpacity>
              <UIText style={styles.textSelected}>{'SMS'}</UIText>
            </View>
            <View style={styles.selectStyle}>
              <TouchableOpacity
                style={[
                  styles.btnSelect,
                  isDisabledTypeSend && {
                    opacity: 0.4,
                  },
                ]}
                onPress={() => this.handleTickTypeSendOtp('PUSH')}
                disabled={isDisabledTypeSend}
              >
                {this.state.typeSend === 'PUSH' && <View style={styles.selectedStyle} />}
              </TouchableOpacity>
              <UIText style={styles.textSelected}>{'PUSH'}</UIText>
            </View>
          </View>
          <Button
            title={`${this.state.isSendFirstTime ? `${t('RESEND OTP')} ` : t('Send OTP')}`}
            buttonStyle={[
              styles.sendOtpBtn,
              isDisabledTypeSend && {
                opacity: 0.4,
              },
            ]}
            onPress={this.handleSendClick}
            disabled={isDisabledTypeSend}
          />
          <View style={styles.wrapperText}>
            {!this.state.isSendFirstTime ? null : (
              <UIText style={styles.otpResendText}>{`${t(
                this.state.typeSend === 'SMS' ? 'TRY_AGAIN_SMS' : 'TRY_AGAIN_PUSH'
              )} (${this.state.timer} ${this.state.timer < 2 ? t('SECOND') : t('SECONDS')})`}</UIText>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  accountInfo: state.accountInfo,
  generateKisCardResult: state.generateKisCardResult,
  checkVerifySuccess: state.loginResult,
});

export default withTranslation()(
  connect(mapStateToProps, {
    generateNewKisCard,
    changeAccountSettings,
    notificationMobileOTP,
    resetErrorVerifyOtp,
  })(FormOTP)
);
