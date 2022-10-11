import React from 'react';
import { FlatList, ListRenderItemInfo, ActivityIndicator, RefreshControl } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TabView, NavigationState, SceneRendererProps } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { goToIndexInfo } from 'navigations';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import TabBar from 'components/TabBar';
import SymbolRow from 'components/SymbolRow';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, IQuerySymbolData } from 'interfaces/market';
import { getIndexList } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { SYMBOL_TYPE, MARKET, MARKET_NEW_KIS } from 'global';
import { setCurrentIndex, querySymbolData } from 'redux-sagas/global-actions';
import { width } from 'styles';
import config from 'config';

interface IIndexListProps extends React.ClassAttributes<IndexList>, WithTranslation {
  indexList: ISymbolInfo[];

  setCurrentIndex(payload: ISymbolInfo): void;

  querySymbolData(payload: IQuerySymbolData): void;
}

interface IIndexListState extends NavigationState<{ key: MARKET | MARKET_NEW_KIS; title: string }> {
  refreshing: boolean;
}

class IndexList extends React.Component<IIndexListProps, IIndexListState> {
  private indexList: ISymbolInfo[] = [];

  constructor(props: IIndexListProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: MARKET.HOSE, title: this.props.t(MARKET.HOSE) },
        { key: MARKET.HNX, title: this.props.t(MARKET.HNX) },
        { key: MARKET.UPCOM, title: this.props.t(MARKET.UPCOM) },
      ],
      refreshing: false,
    };
  }

  componentDidMount() {
    if (this.props.indexList) {
      this.indexList = config.usingNewKisCore
        ? this.props.indexList.filter(
            (item) => item.t === SYMBOL_TYPE.INDEX && (item?.m || item?.s)?.includes(MARKET.HOSE)
          )
        : this.props.indexList.filter((item) => item.t === SYMBOL_TYPE.INDEX && item.m === MARKET.HOSE);

      this.props.querySymbolData({
        symbolList: this.indexList.map((item) => item.s),
      });
    }
  }

  componentDidUpdate(prevProps: IIndexListProps) {
    if (
      this.props.indexList !== null &&
      prevProps.indexList !== null &&
      prevProps.indexList === this.props.indexList &&
      this.state.refreshing
    ) {
      this.setState({ refreshing: false });
    }
  }

  private onChangeTab = (index: number) => {
    if (this.props.indexList) {
      this.indexList = config.usingNewKisCore
        ? this.props.indexList.filter(
            (item) => item.t === SYMBOL_TYPE.INDEX && (item?.m || item?.s)?.includes(this.state.routes[index].key)
          )
        : this.props.indexList.filter(
            (item) => item.t === SYMBOL_TYPE.INDEX && item.m === this.state.routes[index].key
          );

      this.props.querySymbolData({
        symbolList: this.indexList.map((item) => item.s),
      });
    }

    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: MARKET | MARKET_NEW_KIS; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      return this.renderIndexList(this.indexList);
    } else {
      return null;
    }
  };

  private goToIndexInfo = (symbol: ISymbolInfo) => {
    this.props.setCurrentIndex(symbol);
    goToIndexInfo('IndexList');
  };

  private renderItem = ({ item, index }: ListRenderItemInfo<ISymbolInfo>) => {
    return (
      <SymbolRow
        symbol={item}
        index={index}
        isHighlight={index % 2 === 1}
        onPress={this.goToIndexInfo}
        parentId="IndexList"
      />
    );
  };

  private handleRefreshData = () => {
    this.setState({ refreshing: true });
    this.props.querySymbolData({
      symbolList: this.indexList.map((item) => item.s),
    });
  };

  private renderIndexList = (indexList: ISymbolInfo[]) => {
    return (
      <FlatList
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        data={indexList}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.s}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefreshData} />}
      />
    );
  };

  render() {
    return (
      <UserInactivity>
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
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  indexList: getIndexList(state),
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      querySymbolData,
      setCurrentIndex,
    })(IndexList)
  ),
  Fallback,
  handleError
);
