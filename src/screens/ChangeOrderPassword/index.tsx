import React from 'react';
import { View, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import config from 'config';
import { isBlank, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import Button from 'components/Button';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { changeOrderPassword } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IChangeOrderPasswordProps extends React.ClassAttributes<ChangeOrderPassword>, WithTranslation {
  selectedAccount: IAccount | null;
  orderPassword: { success: boolean } | null;

  changeOrderPassword(params: IObject): void;
}

interface IChangeOrderPasswordState {
  errorOldPassword: boolean;
  errorNewPassword: boolean;
  errorReconfirmPassword: boolean;
}

class ChangeOrderPassword extends React.Component<IChangeOrderPasswordProps, IChangeOrderPasswordState> {
  oldPassword: string;
  errorOldPasswordContent: string;
  newPassword: string;
  errorNewPasswordContent: string;
  reconfirmNewPassword: string;
  errorReconfirmPasswordContent: string;

  constructor(props: IChangeOrderPasswordProps) {
    super(props);
    this.state = {
      errorOldPassword: false,
      errorNewPassword: false,
      errorReconfirmPassword: false,
    };
  }

  shouldComponentUpdate(nextProps: IChangeOrderPasswordProps) {
    if (this.props.orderPassword !== nextProps.orderPassword) {
      if (nextProps.orderPassword && nextProps.orderPassword.success === true) {
        this.oldPassword = '';
        this.newPassword = '';
        this.reconfirmNewPassword = '';
      }
    }

    return true;
  }

  private validateChangeOrderPassword = () => {
    let check = true;
    let errorOldPassword = false;
    let errorNewPassword = false;
    let errorReconfirmPassword = false;

    if (!isBlank(this.oldPassword)) {
      if (config.regex.orderPassword.test(this.oldPassword) !== true) {
        errorOldPassword = true;
        this.errorOldPasswordContent = 'Password must be 4 digit number';
        check = false;
      }
    } else {
      errorOldPassword = true;
      this.errorOldPasswordContent = 'Password can not be blank';
      check = false;
    }

    if (!isBlank(this.newPassword)) {
      if (config.regex.orderPassword.test(this.newPassword) !== true) {
        errorNewPassword = true;
        this.errorNewPasswordContent = this.props.t('Password must be 4 digit number');
        check = false;
      } else if (this.newPassword === this.oldPassword) {
        errorNewPassword = true;
        this.errorNewPasswordContent = this.props.t('New password must be different with old password.');
        check = false;
      }
    } else {
      errorNewPassword = true;
      this.errorNewPasswordContent = this.props.t('Password can not be blank');
      check = false;
    }

    if (this.reconfirmNewPassword !== this.newPassword) {
      errorReconfirmPassword = true;
      this.errorReconfirmPasswordContent = this.props.t('New password and confirm password must be same');
      check = false;
    }

    this.setState({
      errorOldPassword,
      errorNewPassword,
      errorReconfirmPassword,
    });
    return check;
  };

  private submit = () => {
    if (this.validateChangeOrderPassword()) {
      let params = {};

      if (config.usingNewKisCore) {
        params = {
          currentPassword: this.oldPassword,
          newPassword: this.newPassword,
        };
      } else {
        params = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        };
      }

      this.props.changeOrderPassword(params);
    }
  };

  render() {
    const { t } = this.props;
    const isUsingNewKisCore = config.usingNewKisCore;

    return (
      <UserInactivity>
        <KeyboardAwareScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
            {!isUsingNewKisCore && (
              <View style={styles.inputSection}>
                <View style={styles.itemSection}>
                  <View style={styles.labelContainer}>
                    <UIText allowFontScaling={false} style={styles.labelText}>
                      {t('Account')}
                    </UIText>
                  </View>
                  <View style={styles.accountPicker}>
                    <AccountPicker type="ALL" />
                  </View>
                </View>
              </View>
            )}
            <View style={styles.inputItem}>
              <TextBox
                label={isUsingNewKisCore ? 'Current Pin' : 'Old Password'}
                type={TEXTBOX_TYPE.PASSWORD}
                value={this.oldPassword}
                error={this.state.errorOldPassword}
                errorContent={this.errorOldPasswordContent}
                onChange={(value: string) => (this.oldPassword = value)}
                labelSectionStyle={{
                  paddingLeft: 0,
                }}
              />
            </View>

            <View style={styles.inputItem}>
              <TextBox
                label={isUsingNewKisCore ? 'New Pin' : 'New Password'}
                type={TEXTBOX_TYPE.PASSWORD}
                value={this.newPassword}
                error={this.state.errorNewPassword}
                errorContent={this.errorNewPasswordContent}
                onChange={(value: string) => (this.newPassword = value)}
                labelSectionStyle={{
                  paddingLeft: 0,
                }}
              />
            </View>

            <View style={styles.inputItem}>
              <TextBox
                label={isUsingNewKisCore ? 'Reconfirm New Pin' : 'Reconfirm New Password'}
                type={TEXTBOX_TYPE.PASSWORD}
                value={this.reconfirmNewPassword}
                error={this.state.errorReconfirmPassword}
                errorContent={this.errorReconfirmPasswordContent}
                onChange={(value: string) => (this.reconfirmNewPassword = value)}
                labelSectionStyle={{
                  paddingLeft: 0,
                }}
              />
            </View>

            <View style={styles.button}>
              <Button onPress={this.submit} title={t('Submit 2')} />
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  orderPassword: state.orderPassword,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      changeOrderPassword,
    })(ChangeOrderPassword)
  ),
  Fallback,
  handleError
);
