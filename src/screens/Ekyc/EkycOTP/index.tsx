import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Button from 'components/Button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import styles from './styles';
import { METHOD } from 'utils/socketApi';
import { IEkycParams, IObject } from 'interfaces/common';
import OTPTextView from 'react-native-otp-textinput';
import { goToEkycSuccessfulRegistration } from 'navigations';
import { showNoti } from '../action';
import { NOTIFICATION_TYPE } from 'global';
import { Navigation } from 'react-native-navigation';
import config from 'config';
import UIText from 'components/UiText';

const finishRegisterAccount = (data: IEkycParams) => {
  const uri = config.rest.baseUri + '/api/v1/ekyc-admin/ekyc';
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: METHOD.POST,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async (result) => {
        resolve(JSON.parse(await result.text()));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const sendOTP = (params: { id?: string; idType: string; txType: string }) => {
  const uri = config.rest.baseUri + '/api/v1/ekyc-admin/sendOtp';
  let phoneNumber = params.id;
  if (params.id?.[0] === '0') {
    phoneNumber = params.id.replace('0', '+84');
  } else {
    phoneNumber = '+84' + phoneNumber;
  }
  const payload = { ...params, id: phoneNumber };
  console.log('params', payload);

  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: METHOD.POST,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (result) => {
        resolve(JSON.parse(await result.text()));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const verifyOTP = (params: { otpId?: string; otpValue: string }) => {
  const uri = config.rest.baseUri + '/api/v1/ekyc-admin/verifyOtp';

  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: METHOD.POST,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(async (result) => {
        resolve(JSON.parse(await result.text()));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

interface IEkycOTPProps extends React.ClassAttributes<EkycOTP>, WithTranslation {
  params: IEkycParams;
  showNoti: (title: string, content: string, type: NOTIFICATION_TYPE) => void;
}

interface IEkycOTPState {
  otpInput: string;
  minutesTimer: number;
  isWaiting: boolean;
  otpResult: boolean;
  otpId: string;
  ekycErr: boolean;
  ekycErrTxt: string;
}

class EkycOTP extends React.Component<IEkycOTPProps, IEkycOTPState> {
  private timer: any;

  constructor(props: IEkycOTPProps) {
    super(props);
    this.state = {
      otpInput: '',
      minutesTimer: 60,
      isWaiting: false,
      otpResult: true,
      otpId: '',
      ekycErr: false,
      ekycErrTxt: '',
    };
  }

  componentDidMount() {
    this.sendOTP();
  }

  render() {
    const { t } = this.props;
    return (
      <UserInactivity>
        <View style={styles.container}>
          <Image style={styles.card} source={require('../../../../assets/images/kis/OTP.png')} />
          <UIText style={styles.title}>{t('Confirm OTP')}</UIText>
          <UIText style={styles.note}>
            {t('PLEASE_TYPING_OTP_TO_YOUR_PHONE', {
              phone: this.transformNumber(this.props.params.phoneNo as string),
            })}
          </UIText>
          <OTPTextView
            // ref={(e) => (this.input1 = e)}
            containerStyle={styles.textInputContainer}
            handleTextChange={(text: any) => this.handleOTPchange(text)}
            inputCount={6}
            keyboardType="numeric"
            textInputStyle={styles.textInput}
          />

          <TouchableOpacity onPress={this.resendOTPTimer}>
            <UIText style={styles.resend}>
              {t('Resend OTP')}{' '}
              {this.state.isWaiting && <UIText style={styles.timer}>{`(${this.state.minutesTimer})`}</UIText>}
            </UIText>
          </TouchableOpacity>
          {!this.state.otpResult && <UIText style={styles.warning}>{t('Wrong OTP, please try again!')}</UIText>}
          {this.state.ekycErr && <UIText style={styles.warning}>{t(this.state.ekycErrTxt)}</UIText>}
        </View>
        <View style={styles.button}>
          <Button title={this.state.ekycErr ? t('Return') : t('CONFIRM')} onPress={this.onPress} />
        </View>
      </UserInactivity>
    );
  }

  private sendOTP = () => {
    sendOTP({ id: this.props.params.phoneNo, idType: 'PHONE_NO', txType: 'E_KYC' })
      .then((res: any) => {
        this.setState({ isWaiting: true });
        this.setState({ minutesTimer: 60 });
        this.startTimer();
        this.setState({ otpId: res.otpId });
        this.props.showNoti('Send OTP', 'Success', NOTIFICATION_TYPE.SUCCESS);
      })
      .catch(() => {
        this.props.showNoti('Send OTP', 'Failed', NOTIFICATION_TYPE.ERROR);
      });
  };

  private resendOTPTimer = () => {
    if (!this.state.isWaiting) {
      this.sendOTP();
    }
  };

  private startTimer = () => {
    this.timer = setInterval(() => {
      if (this.state.minutesTimer === 0) {
        clearInterval(this.timer);
        this.setState({ isWaiting: false });
      } else {
        this.setState({ minutesTimer: this.state.minutesTimer - 1 });
      }
    }, 1000);
  };

  private transformNumber = (item: string) => {
    const length = item.length;
    let numberToShow = 3;
    if (length < numberToShow) {
      numberToShow = length;
    }
    return '*'.repeat(length - numberToShow) + item.slice(-3);
  };

  private handleOTPchange = (text: any) => {
    this.setState({ otpInput: text, otpResult: true });
  };

  private onPress = () => {
    if (this.state.ekycErr) {
      Navigation.pop('EkycOTP');
    }
    if (this.state.otpInput.length === 6) {
      verifyOTP({ otpId: this.state.otpId, otpValue: this.state.otpInput })
        .then((res: IObject) => {
          if (res.otpKey) {
            console.log('params', this.props.params);
            finishRegisterAccount(this.props.params)
              .then((data: IObject) => {
                console.log('respone from api', data);
                if (data.eKycId) {
                  this.props.showNoti('Ekyc', 'Successfully Register', NOTIFICATION_TYPE.SUCCESS);
                  goToEkycSuccessfulRegistration('EkycOTP');
                } else {
                  this.props.showNoti('Ekyc', data.code as string, NOTIFICATION_TYPE.ERROR);
                  this.setState({ ekycErr: true, ekycErrTxt: data.code as string });
                }
              })
              // Catch err ekyc api
              .catch(() => {
                this.props.showNoti('Ekyc', 'Failed', NOTIFICATION_TYPE.ERROR);
                this.setState({ ekycErr: true, ekycErrTxt: 'Failed' });
              });
            // Check otp
          } else {
            this.setState({ otpResult: false });
          }
        })
        // Catch err OTP api
        .catch((err) => {
          this.setState({ otpResult: false });
          throw err;
        });
    } else {
      this.setState({ otpResult: false });
    }
  };
}

const mapStateToProps = () => ({});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { showNoti })(EkycOTP)),
  Fallback,
  handleError
);
