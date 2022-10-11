import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
  Platform,
  EmitterSubscription,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { TabView, NavigationState, SceneRendererProps } from 'react-native-tab-view';
import { ImageSource } from 'react-native-vector-icons/Icon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { goToSymbolSearch, goToBiz, goToSymbolAlarmDetail } from 'navigations';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import PeriodPicker from 'components/PeriodPicker';
import SymbolHeader from 'components/SymbolHeader';
import BidOfferTab from 'components/SymbolTabs/BidOfferTab';
import { SymbolChartTab } from 'components/SymbolTabs/ChartTab';
import { SymbolQuoteTab } from 'components/SymbolTabs/QuoteTab';
import ForeignerTab from 'components/SymbolTabs/ForeignerTab';
import { SymbolHistoryTab } from 'components/SymbolTabs/HistoryTab';
import NewsTab from 'components/SymbolTabs/NewsTab';
import BusinessInfoTab from 'components/SymbolTabs/BusinessInfoTab';
import SummaryTab from 'components/SymbolTabs/SummaryTab';
import { PERIOD_OPTIONS, SYMBOL_TYPE } from 'global';
import { IState } from 'redux-sagas/reducers';
import { IObject, IFavorite, IFavoriteItem } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { updateFavoriteList } from 'redux-sagas/global-actions';
import { Colors } from 'styles';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

const PERIOD_OPTION_LISTS = [
  { label: 'Daily', value: PERIOD_OPTIONS.DAILY, index: 0 },
  { label: 'Weekly', value: PERIOD_OPTIONS.WEEKLY, index: 1 },
  { label: 'Monthly', value: PERIOD_OPTIONS.MONTHLY, index: 2 },
];

interface ISymbolInfoProps extends React.ClassAttributes<SymbolInfo>, WithTranslation {
  componentId: string;
  parentId?: string;
  selectedFavorite: IFavorite | null;
  currentSymbol: ISymbolInfo | null;

  updateFavoriteList(payload: IObject[]): void;
}

interface ISymbolInfoState extends NavigationState<{ key: string; title: string }> {
  visible: boolean;
  period: PERIOD_OPTIONS;
  refreshTab: boolean;
  isCleanIndex: boolean;
}

class SymbolInfo extends React.Component<ISymbolInfoProps, ISymbolInfoState> {
  private searchIcon: ImageSource;
  private starOutlineIcon: ImageSource;
  private starIcon: ImageSource;
  private alarmIcon: ImageSource;
  private scrollView: ScrollView | null;
  private xLayout: number[];
  private widthLayout: number[];
  private registeredEvent = true;
  private buttonPressedEvent?: EmitterSubscription;

  constructor(props: ISymbolInfoProps) {
    super(props);
    Navigation.events().bindComponent(this);

    const routes = [
      { key: 'SUMMARY', title: 'Summary' },
      { key: 'BID_OFFER', title: 'Bid/Offer' },
      { key: 'CHART', title: 'Chart' },
      { key: 'QUOTE', title: 'Quote' },
      { key: 'HISTORY', title: 'History' },
      { key: 'FOREIGNER', title: 'Foreigner' },
      { key: 'NEWS', title: 'News' },
      { key: 'BIZ_INFO', title: 'Business Info' },
    ];

    this.state = {
      routes,
      visible: false,
      index: 0,
      period: PERIOD_OPTIONS.DAILY,
      refreshTab: false,
      isCleanIndex: true,
    };

    this.xLayout = new Array(this.state.routes.length);
    this.widthLayout = new Array(this.state.routes.length);
  }

  componentDidAppear() {
    this.setState(
      {
        visible: true,
        isCleanIndex: true,
      },
      async () => {
        this.starOutlineIcon = await MaterialIcons.getImageSource('star-border', 25, Colors.WHITE);
        this.starIcon = await MaterialIcons.getImageSource('star', 25, Colors.YELLOW);
        this.searchIcon = await MaterialIcons.getImageSource('search', 25, Colors.WHITE);
        this.alarmIcon = await FontAwesome.getImageSource('bell-o', 22, Colors.WHITE);
        this.updateTopBar(this.props.currentSymbol, this.props.selectedFavorite);
      }
    );
  }

  componentDidDisappear() {
    if (!this.state.isCleanIndex) {
      return;
    }

    if (Platform.OS === 'ios') {
      this.setState({
        // visible: false
        index: 0,
      });
      if (this.props.componentId !== 'SymbolInfo') {
        this.registeredEvent = false;
      }
    } else {
      this.setState({
        visible: false,
        index: 0,
      });
    }
  }

  componentWillUnmount() {
    if (this.buttonPressedEvent) {
      this.buttonPressedEvent.remove();
    }
  }

  shouldComponentUpdate(nextProps: ISymbolInfoProps, nextState: ISymbolInfoState) {
    if (
      (nextProps.currentSymbol !== this.props.currentSymbol ||
        nextProps.selectedFavorite !== this.props.selectedFavorite) &&
      nextState.visible === true
    ) {
      this.updateTopBar(nextProps.currentSymbol, nextProps.selectedFavorite);
      if (this.registeredEvent !== true) {
        this.buttonPressedEvent = Navigation.events().registerNavigationButtonPressedListener(
          this.navigationButtonPressed
        );
        this.registeredEvent = true;
      }
    }

    if (nextState.visible !== this.state.visible || nextState.period !== this.state.period) {
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

    if (this.state.refreshTab !== nextState.refreshTab) {
      return true;
    }

    return false;
  }

  navigationButtonPressed = ({ buttonId }: { buttonId: string }) => {
    switch (buttonId) {
      case 'FavoriteButton':
        this.changeFavorite();
        break;
      case 'SearchButton':
        if (this.props.componentId === 'SymbolInfoStack') {
          switch (this.props.parentId) {
            case 'SpeedOrder':
            case 'Market':
            case 'Order':
            case 'Ranking':
            case 'UpDownRankingDetail':
            case 'SymbolSearchStack':
            case 'OrderStack':
              goToSymbolSearch(this.props.componentId, false, 'SymbolSearchStack');
              break;
            default:
              Navigation.pop('SymbolSearch');
              break;
          }
        } else {
          goToSymbolSearch(this.props.componentId, false, 'SymbolSearchStack');
        }
        break;
      case 'AlarmButton':
        goToSymbolAlarmDetail(this.props.componentId, {
          parentId: this.props.componentId,
        });
        break;
      default:
        break;
    }
  };

  private handleCleanIndex = (isCleanIndex: boolean) => {
    this.setState({ isCleanIndex });
  };

  private updateTopBar = (currentSymbol: ISymbolInfo | null, selectedFavorite: IFavorite | null) => {
    let favoriteIcon: ImageSource;

    if (currentSymbol && selectedFavorite) {
      if (
        selectedFavorite.itemList &&
        selectedFavorite.itemList.find((item) => item.isNote !== true && item.data === currentSymbol.s) != null
      ) {
        favoriteIcon = this.starIcon;
      } else {
        favoriteIcon = this.starOutlineIcon;
      }
    }

    const rightButtons = [
      {
        id: 'AlarmButton',
        icon: this.alarmIcon,
      },
    ];

    if (this.props.parentId !== 'SymbolSearch') {
      rightButtons.unshift({
        id: 'SearchButton',
        icon: this.searchIcon,
      });
    }

    if (favoriteIcon) {
      rightButtons.push({
        id: 'FavoriteButton',
        icon: favoriteIcon,
      });
    }

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: currentSymbol ? currentSymbol.s : this.props.t('Symbol'),
        },
        rightButtons,
      },
    });
  };

  private changeFavorite = () => {
    const currentSymbol = this.props.currentSymbol;

    if (this.props.selectedFavorite && currentSymbol) {
      const selectedFavorite: IFavorite = { ...this.props.selectedFavorite };

      const { id } = selectedFavorite;
      let itemList: IFavoriteItem[] = [];
      const params = [];
      if (selectedFavorite.itemList == null) {
        itemList = [];
      } else {
        itemList = selectedFavorite.itemList.slice(0);
      }
      const index = itemList.findIndex((item) => item.isNote !== true && item.data === currentSymbol.s);

      if (index > -1) {
        itemList.splice(index, 1);
        params.push({
          id,
          itemList,
          showNotification: true,
        });
        this.props.updateFavoriteList(params);
      } else {
        itemList.unshift({
          isNote: false,
          data: currentSymbol.s,
        });
        params.push({
          id,
          itemList,
          showNotification: true,
        });
        this.props.updateFavoriteList(params);
      }
    }
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    if (this.props.currentSymbol && props.route === this.state.routes[this.state.index]) {
      switch (props.route.key) {
        case 'BID_OFFER':
          return <BidOfferTab />;
        case 'CHART':
          return <SymbolChartTab />;
        case 'QUOTE':
          return <SymbolQuoteTab />;
        case 'HISTORY':
          return <SymbolHistoryTab period={this.state.period} />;
        case 'FOREIGNER':
          return <ForeignerTab />;
        case 'NEWS':
          return <NewsTab componentId={this.props.componentId} onCleanIndex={this.handleCleanIndex} />;
        case 'BIZ_INFO':
          return <BusinessInfoTab />;
        case 'SUMMARY':
          return <SummaryTab componentId={this.props.componentId} />;
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
    const routes: React.ReactNode[] = props.navigationState.routes.reduce<React.ReactNode[]>(
      (tabs: React.ReactNode[], route: { key: string; title: string }, i: number) => {
        if (
          (route.key !== 'HISTORY' && route.key !== 'BIZ_INFO') ||
          (route.key === 'BIZ_INFO' && this.props.currentSymbol && this.props.currentSymbol.t === SYMBOL_TYPE.STOCK)
        ) {
          tabs.push(
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
        } else if (route.key === 'HISTORY') {
          tabs.push(
            <PeriodPicker
              {...(props.navigationState.routes[this.state.index].key === 'HISTORY' && { labelStyle: styles.label })}
              key={i}
              list={PERIOD_OPTION_LISTS}
              onChange={(index: number, value: PERIOD_OPTIONS, label: string) =>
                this.onChangePeriod(i, index, value, label)
              }
            />
          );
        }

        return tabs;
      },
      []
    );
    return (
      <View style={styles.tabBarContainer}>
        <ScrollView
          contentContainerStyle={styles.tabBar}
          horizontal={true}
          onLayout={this.onLayoutScrollTab}
          ref={(ref) => (this.scrollView = ref)}
        >
          {routes}
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

  private goToOrder = () => {
    switch (this.props.parentId) {
      case 'Order':
      case 'OrderStack':
        Navigation.pop(this.props.componentId);
        break;
      case undefined:
      case 'Market':
      case 'Ranking':
      case 'UpDownRankingDetail':
      case 'SpeedOrder':
      case 'SymbolSearchStack':
      case 'SymbolSearch':
        goToBiz(
          'Order',
          {
            parentId: this.props.componentId,
          },
          this.props.componentId
        );
        break;
      default:
        break;
    }
  };

  render() {
    return (
      this.state.visible && (
        <UserInactivity>
          <View style={styles.container}>
            <SymbolHeader
              buttonLabel={'Order'}
              buttonDisabled={global.viewMode}
              onPressButton={this.goToOrder}
              componentId={this.props.componentId}
            />
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
      )
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedFavorite: state.selectedFavorite,
  currentSymbol: state.currentSymbol,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      updateFavoriteList,
    })(SymbolInfo)
  ),
  Fallback,
  handleError
);
