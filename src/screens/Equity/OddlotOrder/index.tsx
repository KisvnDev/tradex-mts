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
import SellableOddlotStocks from 'components/SellableOddlotStocks';
import OddlotOrderHistory from 'components/OddlotOrderHistory';
import OddlotTodayUnmatch from 'components/OddlotTodayUnmatch';
import TabBar from 'components/TabBar';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IOddlotOrderProps extends React.ClassAttributes<OddlotOrder>, WithTranslation {
  componentId: string;
  orderKind?: ORDER_KIND;
}

interface IOddlotOrderState extends NavigationState<{ key: string; title: string }> {}

class OddlotOrder extends React.Component<IOddlotOrderProps, IOddlotOrderState> {
  constructor(props: IOddlotOrderProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'Sellable Stocks', title: this.props.t('Sellable Stocks') },
        { key: 'Today Unmatch', title: this.props.t('Today Unmatch') },
        { key: 'History', title: this.props.t('History') },
      ],
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Sellable Stocks':
          return <SellableOddlotStocks componentId={this.props.componentId} />;
        case 'Today Unmatch':
          return <OddlotTodayUnmatch componentId={this.props.componentId} />;
        case 'History':
          return <OddlotOrderHistory />;
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

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(OddlotOrder)), Fallback, handleError);
