import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, ScrollView, LayoutChangeEvent } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { TabView, NavigationState, SceneRendererProps } from 'react-native-tab-view';
import { goToIndexAlarmDetail } from 'navigations';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import PeriodPicker from 'components/PeriodPicker';
import IndexHeader from 'components/IndexHeader';
import { IndexChartTab } from 'components/SymbolTabs/ChartTab';
import { IndexQuoteTab } from 'components/SymbolTabs/QuoteTab';
import { IndexHistoryTab } from 'components/SymbolTabs/HistoryTab';
import { PERIOD_OPTIONS } from 'global';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo } from 'interfaces/market';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

const PERIOD_OPTION_LISTS = [
  { label: 'Daily', value: PERIOD_OPTIONS.DAILY, index: 0 },
  { label: 'Weekly', value: PERIOD_OPTIONS.WEEKLY, index: 1 },
  { label: 'Monthly', value: PERIOD_OPTIONS.MONTHLY, index: 2 },
];

interface IIndexInfoProps extends React.ClassAttributes<IndexInfo>, WithTranslation {
  componentId: string;
  parentId?: string;
  currentIndex: ISymbolInfo | null;
}

interface IIndexInfoState extends NavigationState<{ key: string; title: string }> {
  period: PERIOD_OPTIONS;
}

class IndexInfo extends React.Component<IIndexInfoProps, IIndexInfoState> {
  private scrollView: ScrollView | null;
  private xLayout: number[];
  private widthLayout: number[];

  constructor(props: IIndexInfoProps) {
    super(props);
    Navigation.events().bindComponent(this);

    this.state = {
      index: 0,
      routes: [
        { key: 'CHART', title: 'Chart' },
        { key: 'QUOTE', title: 'Quote' },
        { key: 'HISTORY', title: 'History' },
      ],
      period: PERIOD_OPTIONS.DAILY,
    };

    this.xLayout = new Array(this.state.routes.length);
    this.widthLayout = new Array(this.state.routes.length);
  }

  componentDidMount() {
    this.updateTopBar(this.props.currentIndex);
  }

  shouldComponentUpdate(nextProps: IIndexInfoProps, nextState: IIndexInfoState) {
    if (nextState.period !== this.state.period) {
      return true;
    }

    if (nextState.index !== this.state.index) {
      if (this.scrollView && this.xLayout[nextState.index] != null && this.widthLayout[nextState.index] != null) {
        let x = this.xLayout[nextState.index];
        if (x > width / 2 - this.widthLayout[nextState.index] / 2) {
          x = x - (width / 2 - this.widthLayout[nextState.index] / 2);
        } else {
          x = 0;
        }
        this.scrollView.scrollTo({ x, y: 0, animated: true });
      }
      return true;
    }
    return false;
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'AlarmButton') {
      goToIndexAlarmDetail(this.props.componentId);
    }
  }

  private updateTopBar = (currentIndex: ISymbolInfo | null) => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: currentIndex ? currentIndex.s : this.props.t('Index'),
        },
      },
    });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.props.currentIndex && props.route === this.state.routes[this.state.index]) {
      switch (props.route.key) {
        case 'CHART':
          return <IndexChartTab />;
        case 'QUOTE':
          return <IndexQuoteTab />;
        case 'HISTORY':
          return <IndexHistoryTab period={this.state.period} />;
        default:
          return null;
      }
    } else {
      return <ActivityIndicator />;
    }
  };

  private onLayout = (event: LayoutChangeEvent, index: number) => {
    this.xLayout[index] = event.nativeEvent.layout.x;
    this.widthLayout[index] = event.nativeEvent.layout.width;
  };

  private onLayoutScrollTab = (event: LayoutChangeEvent) => {
    if (this.scrollView && this.xLayout[this.state.index] != null) {
      this.scrollView.scrollTo({ x: this.xLayout[this.state.index], y: 0, animated: true });
    }
  };

  private renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<{ key: string; title: string }>;
    }
  ) => {
    return (
      <View style={styles.tabBarContainer}>
        <ScrollView
          contentContainerStyle={styles.tabBar}
          horizontal={true}
          onLayout={this.onLayoutScrollTab}
          ref={(ref) => (this.scrollView = ref)}
        >
          {props.navigationState.routes.map((route, i) => {
            if (route.key !== 'HISTORY') {
              return (
                <TouchableOpacity
                  style={[styles.tabItem, this.state.index === i && styles.tabActive]}
                  onLayout={(event: LayoutChangeEvent) => this.onLayout(event, i)}
                  key={i}
                  onPress={() => this.setState({ index: i })}
                >
                  <UIText allowFontScaling={false} style={i === this.state.index && styles.label}>
                    {this.props.t(route.title)}
                  </UIText>
                </TouchableOpacity>
              );
            } else {
              return (
                <PeriodPicker
                  {...(this.state.routes[this.state.index].key === 'HISTORY' && { labelStyle: styles.label })}
                  key={i}
                  list={PERIOD_OPTION_LISTS}
                  onChange={(index: number, value: PERIOD_OPTIONS, label: string) =>
                    this.onChangePeriod(i, index, value, label)
                  }
                />
              );
            }
          })}
        </ScrollView>
      </View>
    );
  };

  private onChangePeriod = (tabIndex: number, index: number, value: PERIOD_OPTIONS, label: string) => {
    this.setState({
      index: tabIndex,
      period: value,
    });
  };

  private onChangeTab = (index: number) => {
    this.setState({
      index,
    });
  };

  render() {
    return (
      <UserInactivity>
        <View style={styles.container}>
          <IndexHeader componentId={this.props.componentId} hideButton={true} />
          <TabView
            navigationState={this.state}
            renderScene={this.renderScene}
            onIndexChange={this.onChangeTab}
            initialLayout={{ width }}
            lazy={true}
            renderTabBar={this.renderTabBar}
            renderLazyPlaceholder={() => <ActivityIndicator />}
          />
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentIndex: state.currentIndex,
});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps, {})(IndexInfo)), Fallback, handleError);
