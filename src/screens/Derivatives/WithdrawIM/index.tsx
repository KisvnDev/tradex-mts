import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { NavigationState, TabView, SceneRendererProps } from 'react-native-tab-view';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import TabBar from 'components/TabBar';
import WithdrawIMComp from './WithdrawIM';
import TransactionHistory from './TransactionHistory';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import config from 'config';
import UIText from 'components/UiText';

interface IWithdrawMoneyProps extends React.ClassAttributes<WithdrawMoney>, WithTranslation {}

interface IWithdrawMoneyState extends NavigationState<{ key: string; title: string }> {}

class WithdrawMoney extends React.Component<IWithdrawMoneyProps, IWithdrawMoneyState> {
  constructor(props: IWithdrawMoneyProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'Withdraw IM', title: this.props.t('Withdraw ' + (config.usingNewKisCore ? 'from VSD' : 'IM')) },
        {
          key: 'Transaction History',
          title: this.props.t(config.usingNewKisCore ? 'Cash Transfer History' : 'Cash Transfer History'),
        },
      ],
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Withdraw IM':
          return <WithdrawIMComp />;
        case 'Transaction History':
          return <TransactionHistory />;
        default:
          return null;
      }
    } else {
      return null;
    }
  };

  render() {
    const { t } = this.props;

    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={styles.inputSection}>
            <View style={styles.itemSection}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('Account')}
                </UIText>
              </View>
              <View style={styles.accountPicker}>
                <AccountPicker type="DERIVATIVES" />
              </View>
            </View>
          </View>
          <TabView
            renderTabBar={(props) => (
              <TabBar {...props} index={this.state.index} routes={this.state.routes} onChange={this.onChangeTab} />
            )}
            navigationState={this.state}
            renderScene={this.renderScene}
            onIndexChange={this.onChangeTab}
            initialLayout={{ width }}
            lazy={true}
            renderLazyPlaceholder={() => <ActivityIndicator />}
            swipeEnabled={true}
          />
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(WithdrawMoney)), Fallback, handleError);
