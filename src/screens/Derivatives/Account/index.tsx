import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavigationState, TabView, SceneRendererProps } from 'react-native-tab-view';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import config from 'config';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import TabBar from 'components/TabBar';
import AccountSummary from './AccountSummary';
import SummaryDetail from './AssetInfomation/AccountSummary';
import PortfolioAssessment from './AssetInfomation/PortfolioAssessment';
import CashInformation from './AssetInfomation/CashInformation';
import DailyBalance from './DailyBalance';
import RiskRatio from './RiskRatio';
import { IState } from 'redux-sagas/reducers';
import { queryAccountCashBalance } from './actions';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IAccountProps extends React.ClassAttributes<Account>, WithTranslation {
  queryAccountCashBalance(): void;
}

interface IAccountState extends NavigationState<{ key: string; title: string }> {}

class Account extends React.Component<IAccountProps, IAccountState> {
  private readonly isUsingNewKisCore = config.usingNewKisCore;

  constructor(props: IAccountProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'Account Summary', title: this.props.t('Account Summary') },
        {
          key: this.isUsingNewKisCore ? 'Portfolio Assessment' : 'Daily Balance',
          title: this.props.t(this.isUsingNewKisCore ? 'Portfolio Assessment' : 'Daily Balance'),
        },
        {
          key: this.isUsingNewKisCore ? 'Cash Information' : 'Risk Ratio',
          title: this.props.t(this.isUsingNewKisCore ? 'Cash Information' : 'Risk Ratio'),
        },
      ],
    };
  }

  componentDidMount() {
    this.isUsingNewKisCore && this.props.queryAccountCashBalance();
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Account Summary':
          return this.isUsingNewKisCore ? <SummaryDetail /> : <AccountSummary />;
        case 'Daily Balance':
          return <DailyBalance />;
        case 'Portfolio Assessment':
          return <PortfolioAssessment />;
        case 'Cash Information':
          return <CashInformation />;
        case 'Risk Ratio':
          return <RiskRatio />;
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

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryAccountCashBalance })(Account)),
  Fallback,
  handleError
);
