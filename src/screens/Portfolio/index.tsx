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
import TabPortfolio from './TabPortfolio';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import config from 'config';
import UIText from 'components/UiText';

interface IPortfolioProps extends React.ClassAttributes<Portfolio>, WithTranslation {}

interface IPortfolioState extends NavigationState<{ key: string; title: string }> {}

class Portfolio extends React.Component<IPortfolioProps, IPortfolioState> {
  constructor(props: IPortfolioProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'UNREALIZED_PORTFOLIO', title: this.props.t('Unrealized Portfolio') },
        { key: 'REALIZED_PORTFOLIO', title: this.props.t('Realized Portfolio') },
      ],
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'UNREALIZED_PORTFOLIO':
          return <TabPortfolio />;
        case 'REALIZED_PORTFOLIO':
          return <TabPortfolio isRealizePortfolio />;
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
          <View style={[styles.inputSection, config.usingNewKisCore && styles.kisInputSession]}>
            <View style={styles.itemSection}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('Account')}
                </UIText>
              </View>
              <View style={styles.accountPicker}>
                <AccountPicker type={'DERIVATIVES'} />
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

const mapStateToProps = (_: IState) => ({});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(Portfolio)), Fallback, handleError);
