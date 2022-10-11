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
import MarginCall from './MarginCall';
import PositionHistory from './PositionHistory';
import SettlementHistory from './SettlementHistory';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IHistoryProps extends React.ClassAttributes<History>, WithTranslation {}

interface IHistoryState extends NavigationState<{ key: string; title: string }> {}

class History extends React.Component<IHistoryProps, IHistoryState> {
  constructor(props: IHistoryProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'Margin Call', title: this.props.t('Margin Call') },
        { key: 'Position History', title: this.props.t('Position History') },
        { key: 'Settlement History', title: this.props.t('Settlement History') },
      ],
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Margin Call':
          return <MarginCall />;
        case 'Position History':
          return <PositionHistory />;
        case 'Settlement History':
          return <SettlementHistory />;
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

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(History)), Fallback, handleError);
