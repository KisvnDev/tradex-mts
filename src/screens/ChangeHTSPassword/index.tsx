import React from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import config from 'config';
import { isBlank, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import Button from 'components/Button';
import { IObject } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';
import { changeHTSPassword } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IChangeHTSPasswordProps extends React.ClassAttributes<ChangeHTSPassword>, WithTranslation {
  changeHTSPassword(params: IObject): void;
}

interface IChangeHTSPasswordState {
  errorOldPassword: boolean;
  errorNewPassword: boolean;
  errorReconfirmPassword: boolean;
}

class ChangeHTSPassword extends React.Component<IChangeHTSPasswordProps, IChangeHTSPasswordState> {
  private oldPassword: string;
  private errorOldPasswordContent: string;
  private newPassword: string;
  private errorNewPasswordContent: string;
  private reconfirmNewPassword: string;
  private errorReconfirmPasswordContent: string;

  constructor(props: IChangeHTSPasswordProps) {
    super(props);
    this.state = {
      errorOldPassword: false,
      errorNewPassword: false,
      errorReconfirmPassword: false,
    };
  }

  private validateChangeHTSPassword = () => {
    let check = true;
    let errorOldPassword = false;
    let errorNewPassword = false;
    let errorReconfirmPassword = false;

    if (isBlank(this.oldPassword)) {
      errorOldPassword = true;
      this.errorOldPasswordContent = 'Password can not be blank';
      check = false;
    }

    if (!isBlank(this.newPassword)) {
      if (config.regex.HTSPassword.test(this.newPassword)) {
        if (this.newPassword === this.oldPassword) {
          errorNewPassword = true;
          this.errorNewPasswordContent = this.props.t('New password must be different with old password.');
          check = false;
        }
      } else {
        errorNewPassword = true;
        this.errorNewPasswordContent = this.props.t(
          config.domain === 'kis'
            ? 'Password must from 6 - 16 characters without whitespace and must have leter and digit'
            : 'Password must be 8 characters without whitespace'
        );
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
    if (this.validateChangeHTSPassword()) {
      const params = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      };

      this.props.changeHTSPassword(params);
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
              <View style={styles.rowContent}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('HTS ID')}
                </UIText>
                <UIText allowFontScaling={false} style={styles.contentText}>
                  {global.username}
                </UIText>
              </View>
            )}
            <View style={styles.inputItem}>
              <TextBox
                label={isUsingNewKisCore ? 'Current Password' : 'Old Password'}
                type={TEXTBOX_TYPE.PASSWORD}
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
                label="New Password"
                type={TEXTBOX_TYPE.PASSWORD}
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
                label="Reconfirm New Password"
                type={TEXTBOX_TYPE.PASSWORD}
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

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      changeHTSPassword,
    })(ChangeHTSPassword)
  ),
  Fallback,
  handleError
);
