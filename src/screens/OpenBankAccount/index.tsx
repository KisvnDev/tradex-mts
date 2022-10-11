import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import { onClickOpenBankAccountLink } from 'redux-sagas/global-actions';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import config, { IOpenBankAccount } from 'config';
import { goToOpenBankAccountDetail } from 'navigations';
import AdsBanner from 'components/AdsBanner';
import UIText from 'components/UiText';

interface IOpenBankAccountProps extends React.ClassAttributes<OpenBankAccount>, WithTranslation {
  onClickOpenBankAccountLink(payload: IOpenBankAccount): void;
}

interface IOpenBankAccountState {
  visible: boolean;
}

class OpenBankAccount extends React.Component<IOpenBankAccountProps, IOpenBankAccountState> {
  constructor(props: IOpenBankAccountProps) {
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

  private openBankAccountScreen = (item: IOpenBankAccount) => {
    goToOpenBankAccountDetail(item, item.screenTitle);
  };

  render() {
    return (
      this.state.visible && (
        <UserInactivity>
          <View style={styles.container}>
            <View style={styles.adsSliderContainer}>
              <AdsBanner />
            </View>
            <View style={styles.mainSection}>
              <View style={styles.titleSection}>
                <UIText style={styles.openAccountText}>{this.props.t('OPEN ACCOUNT')}</UIText>
                <UIText>{this.props.t('OPEN_ACCOUNT_INSTRUCTION')}</UIText>
              </View>
              <View style={styles.menuSection}>
                {config.openBankAccount.length > 0 &&
                  config.openBankAccount.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                          this.openBankAccountScreen(item);
                        }}
                      >
                        <Image style={styles.iconImage2} resizeMode="contain" source={item.icon} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.itemTextContainer}
                        onPress={() => {
                          this.openBankAccountScreen(item);
                        }}
                      >
                        <UIText>{item.title}</UIText>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
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
    })(OpenBankAccount)
  ),
  Fallback,
  handleError
);
