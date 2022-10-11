import React from 'react';
import { Modal, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { handleError, isBlank } from 'utils/common';
import Fallback from 'components/Fallback';
import CheckBox from 'components/CheckBox';
import Button from 'components/Button';
import ScreenLoader from 'components/ScreenLoader';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { IObject } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';
import { goToAuth } from 'navigations';
import { sendSupport } from './actions';
import styles from './styles';
import Svg, { Path } from 'react-native-svg';
import UIText from 'components/UiText';

interface IIdSupportProps extends React.ClassAttributes<IdSupport>, WithTranslation {
  isIdSupport: boolean;
  registerAccountForm: IObject | null;
  sendIdSupportSuccess: boolean;
  sendIdSupportFailed: boolean;

  sendSupport(params: IObject): void;
}

interface IIdSupportState {
  idIssue1: boolean;
  idIssue2: boolean;
  idIssue3: boolean;
  idIssueOther: boolean;
  note: string;
  successNotifyModalVisible: boolean;
  errorNoteContent: string;
  errorNote: boolean;
}

class IdSupport extends React.Component<IIdSupportProps, IIdSupportState> {
  constructor(props: IIdSupportProps) {
    super(props);

    this.state = {
      idIssue1: false,
      idIssue2: false,
      idIssue3: false,
      idIssueOther: true,
      successNotifyModalVisible: false,
      note: '',
      errorNoteContent: '',
      errorNote: false,
    };
  }

  componentDidUpdate(prevProps: IIdSupportProps) {
    if (this.props.sendIdSupportSuccess !== prevProps.sendIdSupportSuccess) {
      this.setState({
        successNotifyModalVisible: true,
      });
    }
  }

  private onChangeIdIssue1 = (value: boolean) => {
    if (value === true) {
      this.setState({
        idIssue1: value,
        idIssue3: false,
        idIssue2: false,
        idIssueOther: false,
      });
    }
  };

  private onChangeIdIssue2 = (value: boolean) => {
    if (value === true) {
      this.setState({
        idIssue2: value,
        idIssue1: false,
        idIssue3: false,
        idIssueOther: false,
      });
    }
  };

  private onChangeIdIssue3 = (value: boolean) => {
    if (value === true) {
      this.setState({
        idIssue3: value,
        idIssue1: false,
        idIssue2: false,
        idIssueOther: false,
      });
    }
  };

  private onChangeIdIssueOther = (value: boolean) => {
    if (value === true) {
      this.setState({
        idIssueOther: value,
        idIssue1: false,
        idIssue2: false,
        idIssue3: false,
      });
    }
  };

  private onChangeNote = (data: string) => {
    this.setState({
      note: data,
    });
  };

  private validate() {
    if (isBlank(this.state.note) && this.state.idIssueOther === true) {
      this.setState({
        errorNote: true,
        errorNoteContent: 'Please insert support content',
      });
      return false;
    }
    return true;
  }

  private handleSend = () => {
    if (this.validate() === true) {
      let message = '';
      if (this.props.isIdSupport === true) {
        if (this.state.idIssue1 === true) {
          message = 'Tôi không cầm CMND/CCCD bên cạnh';
        } else if (this.state.idIssue2 === true) {
          message = 'Tôi không đi được đến bước tiếp theo (do CMND/CCCD quá cũ hoặc ảnh chụp bị mờ, ...)';
        } else if (this.state.idIssue3 === true) {
          message = 'Tôi nhận được thông tin CMND/CCCD của tôi đã được dùng để mở tài khoản';
        } else {
          message = this.state.note;
        }
      } else {
        if (this.state.idIssue1 === true) {
          message = 'Tôi không thực hiện được các hành động được yêu cầu';
        } else {
          message = this.state.note;
        }
      }
      const params = {
        draftId: this.props.registerAccountForm!.draft_id,
        message,
      };
      this.props.sendSupport(params);
    }
  };

  private onClickOK = () => {
    this.setState(
      {
        successNotifyModalVisible: false,
      },
      () => {
        goToAuth();
      }
    );
  };

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          {/* <View style={styles.titleContainer}>
            <UIText style={styles.mainTextTitle}>{t('Confirm Information')}</UIText>
          </View> */}
          <View style={styles.iconContainer}>
            <Svg width={64} height={64} fill="none" viewBox="0 0 64 64">
              <Path fill="#00ACDF" d="M47.5 59l16 4-4-12.5-12 8.5z" />
              <Path fill="#00ACDF" d="M64 43c0 11.598-9.402 21-21 21s-21-9.402-21-21 9.402-21 21-21 21 9.402 21 21z" />
              <Path fill="#003778" d="M7.5 28C5 34.833 0 48.7 0 49.5L19 44 7.5 28z" />
              <Path fill="#003778" d="M50 25c0 13.807-11.193 25-25 25S0 38.807 0 25 11.193 0 25 0s25 11.193 25 25z" />
            </Svg>
          </View>
          <View style={styles.checkBoxSection}>
            <CheckBox
              label={this.props.isIdSupport === true ? 'ID_ISSUE1' : 'FACE_ISSUE1'}
              checked={this.state.idIssue1}
              onChange={this.onChangeIdIssue1}
              textWrapping={true}
            />
          </View>
          {this.props.isIdSupport === true && (
            <View style={styles.checkBoxSection}>
              <CheckBox
                label="ID_ISSUE2"
                checked={this.state.idIssue2}
                onChange={this.onChangeIdIssue2}
                textWrapping={true}
              />
            </View>
          )}
          {this.props.isIdSupport === true && (
            <View style={styles.checkBoxSection}>
              <CheckBox
                label="ID_ISSUE3"
                checked={this.state.idIssue3}
                onChange={this.onChangeIdIssue3}
                textWrapping={true}
              />
            </View>
          )}
          <View style={styles.checkBoxSection}>
            <CheckBox
              label="OTHER_ISSUE"
              checked={this.state.idIssueOther}
              onChange={this.onChangeIdIssueOther}
              textWrapping={true}
            />
          </View>
          <View style={styles.note}>
            <TextBox
              type={TEXTBOX_TYPE.TEXT}
              value={this.state.note}
              onChange={this.onChangeNote}
              multiline={true}
              numberOfLines={3}
              textInputStyle={styles.textInputStyle}
              placeholder={'SUPPORT_CONTENT'}
              error={this.state.errorNote}
              errorContent={this.state.errorNoteContent}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this.handleSend} title={'SEND'} buttonStyle={styles.buttonUnderstood} />
          </View>
        </KeyboardAwareScrollView>
        <ScreenLoader />
        <Modal transparent={true} visible={this.state.successNotifyModalVisible} animationType="none">
          <View style={styles.OTPContainer}>
            <View style={styles.OTPBody}>
              {/* <View style={styles.titleSection}>
                <UIText allowFontScaling={false} style={styles.title}>
                  {t('OTP Card Number')}: {this.props.loginResult.otpIndex}
                </UIText>
              </View> */}
              <View style={styles.iconContainer}>
                <Svg width={64} height={64} fill="none" viewBox="0 0 64 64">
                  <Path fill="#00ACDF" d="M47.5 59l16 4-4-12.5-12 8.5z" />
                  <Path
                    fill="#00ACDF"
                    d="M64 43c0 11.598-9.402 21-21 21s-21-9.402-21-21 9.402-21 21-21 21 9.402 21 21z"
                  />
                  <Path fill="#003778" d="M7.5 28C5 34.833 0 48.7 0 49.5L19 44 7.5 28z" />
                  <Path
                    fill="#003778"
                    d="M50 25c0 13.807-11.193 25-25 25S0 38.807 0 25 11.193 0 25 0s25 11.193 25 25z"
                  />
                </Svg>
              </View>
              <View style={styles.note}>
                <UIText style={styles.modalContent}>{t('SEND_SUPPORT_SUCCESS')}</UIText>
              </View>
              <Button onPress={this.onClickOK} title={t('confirm').toUpperCase()} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  registerAccountForm: state.registerAccountForm,
  sendIdSupportSuccess: state.sendIdSupportSuccess,
  sendIdSupportFailed: state.sendIdSupportFailed,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      sendSupport,
    })(IdSupport)
  ),
  Fallback,
  handleError
);
