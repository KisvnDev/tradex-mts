import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavigationState, TabView, SceneRendererProps } from 'react-native-tab-view';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import TabBar from 'components/TabBar';
import SubscriptionList from './SubscriptionList';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import config from 'config';
import UIText from 'components/UiText';

interface IStockTransferProps extends React.ClassAttributes<StockTransfer>, WithTranslation {}

interface IStockTransferState extends NavigationState<{ key: string; title: string }> {}

class StockTransfer extends React.Component<IStockTransferProps, IStockTransferState> {
  constructor(props: IStockTransferProps) {
    super(props);

    this.state = {
      index: 0,
      routes:
        config.usingNewKisCore === false
          ? [
              { key: 'Additional Stocks', title: this.props.t('Additional Stocks') },
              { key: 'Bonds', title: this.props.t('Bonds') },
            ]
          : [
              { key: 'Additional Stocks', title: this.props.t('Rights Registration') },
              { key: 'Bonds', title: this.props.t('Rights List') },
              { key: 'Rights Exercise History', title: this.props.t('Rights Exercise History') },
            ],
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Additional Stocks':
          return <SubscriptionList rightType="ADDITIONAL_STOCK" />;
        case 'Bonds':
          return <SubscriptionList rightType="BOND" />;
        case 'Rights Exercise History':
          return <SubscriptionList rightType="BOND" isHistory={true} />;
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

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(StockTransfer)), Fallback, handleError);
