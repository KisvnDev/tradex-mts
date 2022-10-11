import React from 'react';
import { View, Image, Linking } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import Button from 'components/Button';
import { onClickOpenBankAccountLink } from 'redux-sagas/global-actions';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import { IOpenBankAccount } from 'config';
import { openBannerURL } from 'components/AdsBanner';
import UIText from 'components/UiText';

interface IOpenBankAccountDetailProps
  extends React.ClassAttributes<OpenBankAccountDetail>,
    WithTranslation,
    IOpenBankAccount {
  onClickOpenBankAccountLink(payload: IOpenBankAccount): void;
}

interface IOpenBankAccountDetailState {
  visible: boolean;
}

class OpenBankAccountDetail extends React.Component<IOpenBankAccountDetailProps, IOpenBankAccountDetailState> {
  constructor(props: IOpenBankAccountDetailProps) {
    super(props);

    Navigation.events().bindComponent(this);

    this.state = {
      visible: false,
    };
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  componentDidAppear() {
    this.setState({
      visible: true,
    });
  }

  private handlePress = () => {
    this.props.bankUrl && Linking.openURL(openBannerURL(this.props.bankUrl));
  };

  render() {
    return (
      this.state.visible && (
        <UserInactivity>
          <View style={styles.container}>
            <View style={styles.mainImageContainer}>
              <Image style={styles.mainImage} resizeMode="contain" source={this.props.mainImage} />
            </View>
            <View style={styles.mainContentContainer}>
              <UIText style={styles.mainContent}>{this.props.t(this.props.mainContent)}</UIText>
            </View>
            <View style={styles.contentContainer}>
              <UIText style={styles.content}>{this.props.t(this.props.content)}</UIText>
            </View>
            <View style={styles.button}>
              <Button onPress={this.handlePress} title={'OPEN ACCOUNT'} />
            </View>
          </View>
        </UserInactivity>
      )
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      onClickOpenBankAccountLink,
    })(OpenBankAccountDetail)
  ),
  Fallback,
  handleError
);
