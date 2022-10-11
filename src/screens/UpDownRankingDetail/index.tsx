import React from 'react';
import { ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { TabView, NavigationState, SceneRendererProps, TabBar } from 'react-native-tab-view';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import RankingList from './RankingList';
import { MARKET } from 'global';
import { width, Colors } from 'styles';
import styles from './styles';

interface IUpDownRankingDetailProps extends React.ClassAttributes<UpDownRankingDetail>, WithTranslation {
  upDownType: 'UP' | 'DOWN';
}

interface IUpDownRankingDetailState extends NavigationState<{ key: MARKET; title: string }> {}

class UpDownRankingDetail extends React.Component<IUpDownRankingDetailProps, IUpDownRankingDetailState> {
  constructor(props: IUpDownRankingDetailProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: MARKET.HOSE, title: this.props.t(MARKET.HOSE) },
        { key: MARKET.HNX, title: this.props.t(MARKET.HNX) },
        { key: MARKET.UPCOM, title: this.props.t(MARKET.UPCOM) },
      ],
    };
  }

  componentDidMount() {}

  private renderScene = (props: SceneRendererProps & { route: { key: MARKET; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      return <RankingList market={props.route.key} upDownType={this.props.upDownType} />;
    } else return null;
  };

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  render() {
    return (
      <UserInactivity>
        <TabView
          renderTabBar={(props) => (
            <TabBar
              {...props}
              inactiveColor={Colors.LIGHT_GREY}
              activeColor={Colors.PRIMARY_1}
              style={styles.tabView}
              indicatorStyle={styles.tabViewIndicator}
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
      </UserInactivity>
    );
  }
}

export default withErrorBoundary(withTranslation()(UpDownRankingDetail), Fallback, handleError);
