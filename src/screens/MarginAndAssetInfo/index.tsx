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
import AssetLoanDetail from 'components/AssetLoanInformation';
import DetailLoanInformation from 'components/DetailLoanInformation';
import TabBar from 'components/TabBar';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IMarginAndAssetInfoProps extends React.ClassAttributes<MarginAndAssetInfo>, WithTranslation {
  componentId: string;
  orderKind?: ORDER_KIND;
}

interface IMarginAndAssetInfoState extends NavigationState<{ key: string; title: string }> {}

class MarginAndAssetInfo extends React.Component<IMarginAndAssetInfoProps, IMarginAndAssetInfoState> {
  constructor(props: IMarginAndAssetInfoProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'Asset/Loan Information', title: this.props.t('Asset/Loan Information') },
        { key: 'Margin Information', title: this.props.t('Margin Information') },
        { key: 'Detail Loan Information', title: this.props.t('Detail Loan Information') },
      ],
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Asset/Loan Information':
          return <AssetLoanDetail informationType={'AssetLoan'} />;
        case 'Margin Information':
          return <AssetLoanDetail informationType={'Margin'} />;
        case 'Detail Loan Information':
          return <DetailLoanInformation />;
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
              <TabBar
                {...props}
                index={this.state.index}
                routes={this.state.routes}
                onChange={this.onChangeTab}
                tabItemStyle={styles.tabItemStyle}
              />
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
  withTranslation()(connect(mapStateToProps)(MarginAndAssetInfo)),
  Fallback,
  handleError
);
