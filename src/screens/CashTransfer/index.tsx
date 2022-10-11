import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { NavigationState, TabView, SceneRendererProps } from 'react-native-tab-view';
import { handleError } from 'utils/common';
import UserInactivity from 'components/UserInactivity';
import Fallback from 'components/Fallback';
import AccountPicker from 'components/AccountPicker';
import TabBar from 'components/TabBar';
import CashTransferComp from './CashTransfer';
import TransactionHistory from './TransactionHistory';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ICashTransferProps extends React.ClassAttributes<CashTransfer>, WithTranslation {
  type: 'INTERNAL' | 'EXTERNAL';
}

interface ICashTransferState extends NavigationState<{ key: string; title: string }> {}

class CashTransfer extends React.Component<ICashTransferProps, ICashTransferState> {
  constructor(props: ICashTransferProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        {
          key: 'Cash Transfer',
          title: this.props.type === 'INTERNAL' ? this.props.t('Internal transfer') : this.props.t('External transfer'),
        },
        { key: 'Transaction History', title: this.props.t('Transaction History') },
      ],
    };
  }

  componentDidUpdate(prevProps: ICashTransferProps) {
    if (this.props.type !== prevProps.type) {
      this.setState({
        index: 0,
        routes: [
          {
            key: 'Cash Transfer',
            title:
              this.props.type === 'INTERNAL' ? this.props.t('Internal transfer') : this.props.t('External transfer'),
          },
          { key: 'Transaction History', title: this.props.t('Transaction History') },
        ],
      });
    }
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Cash Transfer':
          return <CashTransferComp type={this.props.type} />;
        case 'Transaction History':
          return <TransactionHistory type={this.props.type} />;
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
                <AccountPicker type="ALL" />
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

export default withErrorBoundary(withTranslation()(CashTransfer), Fallback, handleError);
