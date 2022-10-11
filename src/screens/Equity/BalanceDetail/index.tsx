import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { NavigationState, TabView, SceneRendererProps } from 'react-native-tab-view';
import { ORDER_KIND } from 'global';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import AccountBankPicker from 'components/AccountBankPicker';
import CashBalanceDetail from 'components/CashBalanceDetail';
import StockBalanceDetail from 'components/StockBalanceDetail';
import TabBar from 'components/TabBar';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IBalanceDetailProps extends React.ClassAttributes<BalanceDetail>, WithTranslation {
  componentId: string;
  orderKind?: ORDER_KIND;
}

interface IBalanceDetailState extends NavigationState<{ key: string; title: string }> {}

class BalanceDetail extends React.Component<IBalanceDetailProps, IBalanceDetailState> {
  constructor(props: IBalanceDetailProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'Cash Balance', title: this.props.t('Cash Balance') },
        { key: 'Stock Balance', title: this.props.t('Stock Balance') },
      ],
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Cash Balance':
          return <CashBalanceDetail />;
        case 'Stock Balance':
          return <StockBalanceDetail />;
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
                <AccountPicker type="EQUITY" />
              </View>
              <View style={styles.accountBankPicker}>
                <AccountBankPicker />
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

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(BalanceDetail)), Fallback, handleError);
