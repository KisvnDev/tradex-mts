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
import AntDesign from 'react-native-vector-icons/AntDesign';
import SecuredLoanBankPicker from 'components/SecuredLoanBankPicker';
import CashInAdvance from 'components/CashInAdvance';
import TabBar from 'components/TabBar';
import config from 'config';
import AvailableSecuredLoan from './AvailableSecuredLoan';
import CashInAdvanceTab from './CashInAdvance';
import TransactionHistory from './TransactionHistory';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IStockTransferProps extends React.ClassAttributes<StockTransfer>, WithTranslation {}

interface IStockTransferState extends NavigationState<{ key: string; title: string }> {}

class StockTransfer extends React.Component<IStockTransferProps, IStockTransferState> {
  constructor(props: IStockTransferProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        config.usingNewKisCore === false
          ? { key: 'Available Secured Loan', title: this.props.t('Available Secured Loan') }
          : { key: 'Cash In Advance', title: this.props.t('Cash In Advance') },
        { key: 'Transaction History', title: this.props.t('Transaction History') },
      ],
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Cash In Advance':
          return <CashInAdvanceTab />;
        case 'Available Secured Loan':
          return <AvailableSecuredLoan />;
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
    const isUsingNewKisCore = config.usingNewKisCore;

    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={[styles.inputSection]}>
            <View style={[styles.itemSection, isUsingNewKisCore && styles.headerStyle]}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('Account')}
                </UIText>
              </View>
              <View style={styles.picker}>
                {isUsingNewKisCore ? (
                  <AccountPicker
                    type="EQUITY"
                    buttonPickerStyle={{
                      borderWidth: 0,
                    }}
                    Icon={<AntDesign name={'down'} size={14} />}
                  />
                ) : (
                  <AccountPicker type="EQUITY" />
                )}
              </View>
            </View>
            {config.usingNewKisCore === false ? (
              <View style={styles.itemSection}>
                <View style={styles.labelContainer}>
                  <UIText allowFontScaling={false} style={styles.label}>
                    {t('Loan Bank')}
                  </UIText>
                </View>
                <View style={styles.picker}>
                  <SecuredLoanBankPicker />
                </View>
              </View>
            ) : (
              <CashInAdvance />
            )}
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
