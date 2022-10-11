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
import OrderHistoryComp from 'components/DerivativesOrderHistory';
import OrderTodayUnmatch from 'components/DerivativesOrderTodayUnmatch';
import StopOrderHistory from 'components/DerivativesStopOrderHistory';
import EquityStopOrderHistory from 'components/StopOrderHistory';
import AdvanceOrderHistory from 'components/DerivativesAdvanceOrderHistory';
import TabBar from 'components/TabBar';
import { width } from 'styles';
import styles from './styles';
import config from 'config';
import UIText from 'components/UiText';

interface IOrderHistoryProps extends React.ClassAttributes<OrderHistory>, WithTranslation {
  componentId: string;
  orderKind?: ORDER_KIND;
}

interface IOrderHistoryState extends NavigationState<{ key: string; title: string }> {}

class OrderHistory extends React.Component<IOrderHistoryProps, IOrderHistoryState> {
  constructor(props: IOrderHistoryProps) {
    super(props);
    const isKisCore = config.usingNewKisCore;
    const routes = isKisCore
      ? [
          { key: 'Today Unmatch', title: this.props.t('Order Books') },
          { key: 'Order', title: this.props.t('Order History') },
          { key: 'Stop Order', title: this.props.t('Stop Order') },
        ]
      : [
          { key: 'Order', title: this.props.t('Normal Order') },
          { key: 'Today Unmatch', title: this.props.t('Today Unmatch') },
          { key: 'Stop Order', title: this.props.t('Stop Order') },
          { key: 'Advance Order', title: this.props.t('Advance Order') },
        ];

    let index = 0;
    switch (this.props.orderKind) {
      case ORDER_KIND.NORMAL_ORDER:
        index = 1;
        break;
      case ORDER_KIND.STOP_LIMIT_ORDER:
        index = 2;
        break;
      case ORDER_KIND.ADVANCE_ORDER:
        index = 3;
        break;
      default:
        break;
    }
    this.state = {
      index,
      routes,
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Order':
          return <OrderHistoryComp />;
        case 'Today Unmatch':
          return <OrderTodayUnmatch componentId={this.props.componentId} />;
        case 'Stop Order':
          return config.usingNewKisCore === false ? (
            <StopOrderHistory componentId={this.props.componentId} />
          ) : (
            <EquityStopOrderHistory componentId={this.props.componentId} />
          );
        case 'Advance Order':
          return <AdvanceOrderHistory componentId={this.props.componentId} />;
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

const mapStateToProps = () => ({});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(OrderHistory)), Fallback, handleError);
