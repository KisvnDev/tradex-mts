import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import Button from 'components/Button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
// import { NavigationState } from 'react-native-tab-view';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import styles from './styles';
import { goToAuth } from 'navigations';
import UIText from 'components/UiText';

interface IEkycSuccessfulRegistrationProps extends React.ClassAttributes<EkycSuccessfulRegistration>, WithTranslation {}

interface IEkycSuccessfulRegistrationState {}

class EkycSuccessfulRegistration extends React.Component<
  IEkycSuccessfulRegistrationProps,
  IEkycSuccessfulRegistrationState
> {
  constructor(props: IEkycSuccessfulRegistrationProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { t } = this.props;
    return (
      <UserInactivity>
        <ScrollView style={styles.container}>
          <Image style={styles.icon} source={require('../../../../assets/images/kis/done-icon.png')} />
          <UIText style={styles.title}>{t('We have received your information')}</UIText>
          <UIText style={styles.content}>
            {t(
              'Please checking your email to complete the account opening request and receiving instructions on completing the securities account opening contract.'
            )}
          </UIText>

          <View style={styles.buttonContainer}>
            <Button title={t('FINISH')} onPress={this.onPressButton} />
          </View>
        </ScrollView>
      </UserInactivity>
    );
  }

  private onPressButton = () => {
    goToAuth();
  };
}

const mapStateToProps = () => ({});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps)(EkycSuccessfulRegistration)),
  Fallback,
  handleError
);
