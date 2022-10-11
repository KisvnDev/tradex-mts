import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Modal, View, TouchableOpacity, StyleProp, ViewStyle, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { IState } from 'redux-sagas/reducers';
import { IAccountInfo, IObject } from 'interfaces/common';
import { ILoginResult } from 'screens/Login/reducers';
import FormOTP from './FormOTP';
import {
  resendLoginOtp,
  changeAccountSettings,
  generateNewKisCard,
  resetGenerateNewKisCard,
  verifyOTP,
  IPayloadVerifyOTP,
  notificationMobileOTP,
} from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IModalVerifyOtpProps extends React.ClassAttributes<ModalVerifyOtp>, WithTranslation {
  generateKisCardResult: IObject | null;
  isOpenModalVerify: boolean;
  accountInfo: IAccountInfo;
  checkVerifySuccess: ILoginResult;
  ListContentComponent?: React.ComponentType<any> | React.ReactElement | null;
  StyleOTPBody?: StyleProp<ViewStyle>;
  globalStyleOTPBody?: StyleProp<ViewStyle>;
  childrenTop?: React.ReactNode;
  notShowAccount?: boolean;
  titleModal?: string;
  isAlwayVerify?: boolean;

  onSubmit(): void;
  resendLoginOtp(params: IObject): void;
  closeModal(): void;
  changeAccountSettings(parmas: { loginSession: number }): void;
  generateNewKisCard(): void;
  resetGenerateNewKisCard(): void;
  verifyOTP(payload: IPayloadVerifyOTP): void;
  notificationMobileOTP(payload: IObject): void;
}

interface IModalVerifyOtpState {
  isSubmitedOtpMatrix: boolean;
}

class ModalVerifyOtp extends React.Component<IModalVerifyOtpProps, IModalVerifyOtpState> {
  private interval: NodeJS.Timeout;
  private wordMatrixValue = '';
  private timeSession = 0.5;
  private isRemember = true;

  constructor(props: IModalVerifyOtpProps) {
    super(props);

    this.state = {
      isSubmitedOtpMatrix: !!global.OTPTokenMatrix,
    };
  }

  shouldComponentUpdate(nextProps: IModalVerifyOtpProps, _nextState: IModalVerifyOtpState) {
    if (
      this.props.checkVerifySuccess !== nextProps.checkVerifySuccess &&
      nextProps.checkVerifySuccess.isVerifySuccess
    ) {
      this.props.onSubmit();
      this.setState({ isSubmitedOtpMatrix: true });
      return true;
    }

    return true;
  }

  private onSubmitOTP = () => {
    if (global.OTPTokenMatrix && !this.props.isAlwayVerify) {
      this.props.onSubmit();
      return;
    }

    clearInterval(this.interval);
    const payload: IPayloadVerifyOTP = {
      wordMatrixValue: this.wordMatrixValue,
      verifyType: 'MATRIX_CARD',
      wordMatrixId: this.props.generateKisCardResult?.wordMatrixId,
    };
    this.isRemember && (payload.expireTime = this.timeSession);

    this.props.verifyOTP(payload);
  };

  private onCancelOTP = () => {
    this.props.closeModal();
  };

  private onChangeOTPValue = (value: string) => {
    this.wordMatrixValue = value;
  };
  private onSetRemember = (isRemember: boolean) => (this.isRemember = isRemember);

  private onSetTimeSession = (time: number) => (this.timeSession = time);

  render() {
    const {
      t,
      ListContentComponent,
      StyleOTPBody,
      childrenTop,
      globalStyleOTPBody,
      isAlwayVerify = false,
    } = this.props;
    const isLineTop = !global.OTPTokenMatrix && childrenTop;

    return (
      <Modal transparent={true} visible={this.props.isOpenModalVerify} animationType="none">
        <View style={styles.OTPContainer}>
          <View style={[styles.OTPBody, this.state.isSubmitedOtpMatrix && (StyleOTPBody ?? {}), globalStyleOTPBody]}>
            <View style={styles.titleSection}>
              <UIText allowFontScaling={false} style={styles.title}>
                {this.state.isSubmitedOtpMatrix
                  ? this.props.titleModal ?? t('Confirmation OTP')
                  : t('Confirmation OTP')}
              </UIText>
            </View>
            <ScrollView keyboardShouldPersistTaps={'handled'} scrollEnabled={false} style={[styles.scapingContent]}>
              <View style={styles.OTPContent}>
                <View style={styles.headerContainer}>
                  {childrenTop}
                  {this.state.isSubmitedOtpMatrix && (ListContentComponent ?? null)}
                  {isLineTop && <View style={styles.bottomContent} />}
                </View>
                <FormOTP
                  styleContainer={isLineTop ? styles.borderTop : undefined}
                  onSetWordMatrixValue={this.onChangeOTPValue}
                  onSetRemember={this.onSetRemember}
                  onSetSession={this.onSetTimeSession}
                  isAlwayVerify={isAlwayVerify}
                />
              </View>
            </ScrollView>
            <View style={styles.OTPFooter}>
              <View style={styles.wrapperBtn}>
                <TouchableOpacity style={[styles.footerBtn, styles.cancelStyle]} onPress={this.onCancelOTP}>
                  <UIText style={styles.textCancel}>{t('Cancel')}</UIText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerBtn, styles.confirmStyle]} onPress={this.onSubmitOTP}>
                  <UIText style={styles.textConfirm}>{t('Confirm 2')}</UIText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    resendLoginOtp,
    changeAccountSettings,
    generateNewKisCard,
    resetGenerateNewKisCard,
    verifyOTP,
    notificationMobileOTP,
  })(ModalVerifyOtp)
);
