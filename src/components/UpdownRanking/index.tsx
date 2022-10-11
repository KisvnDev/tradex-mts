import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TabView, NavigationState, SceneRendererProps } from 'react-native-tab-view';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import TabBar from 'components/TabBar';
import RankingTab from './RankingTab';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IUpDownRankingProps extends React.ClassAttributes<UpDownRanking>, WithTranslation {
  onSetUpDownType?: (type: 'UP' | 'DOWN') => void;
}

interface IUpDownRankingState extends NavigationState<{ key: 'UP' | 'DOWN'; title: string }> {}

class UpDownRanking extends React.Component<IUpDownRankingProps, IUpDownRankingState> {
  constructor(props: IUpDownRankingProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'UP', title: this.props.t('UP') },
        { key: 'DOWN', title: this.props.t('DOWN') },
      ],
    };
  }

  componentDidMount() {}

  private renderScene = (props: SceneRendererProps & { route: { key: 'UP' | 'DOWN'; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      this.props.onSetUpDownType && this.props.onSetUpDownType(props.route.key);
      return <RankingTab upDownType={props.route.key} />;
    } else {
      return null;
    }
  };

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <UIText allowFontScaling={false} style={styles.headerSectionText}>
            {this.props.t('Up/Down Stock')}
          </UIText>
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
    );
  }
}

export default withErrorBoundary(withTranslation()(UpDownRanking), Fallback, handleError);
