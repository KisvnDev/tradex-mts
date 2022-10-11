import React, { Component } from 'react';
import { View, ActivityIndicator, FlatList, ListRenderItemInfo, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { goToSymbolInfo } from 'navigations';
import config from 'config';
import store from 'redux-sagas/store';
import { parseMarketData } from 'utils/market';
import SymbolRow from 'components/SymbolRow';
import { MARKET } from 'global';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { IRealTimeSymbolData, ISymbolInfo, IQuerySymbolData } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol, querySymbolData } from 'redux-sagas/global-actions';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { getUpDownStockRanking } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IRankingListProps extends React.ClassAttributes<RankingList>, WithTranslation {
  upDownRankingDetail: IObject | null;
  upDownType: 'UP' | 'DOWN';
  market: MARKET;

  getUpDownStockRanking(payload: IObject): void;

  setCurrentSymbol(payload: ISymbolInfo): void;

  querySymbolData(payload: IQuerySymbolData): void;
}

interface IRankingListState {
  refreshing: boolean;
}

class RankingList extends Component<IRankingListProps, IRankingListState> {
  private loadingMore = false;

  private data: IRealTimeSymbolData[] | null = null;

  private symbolMap = getSymbolMap(store.getState());
  private isUsingNewKisCore = config.usingNewKisCore;

  constructor(props: IRankingListProps) {
    super(props);

    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    this.requestData(this.props.market);
  }

  shouldComponentUpdate(nextProps: IRankingListProps) {
    if (this.props.upDownRankingDetail?.data !== nextProps.upDownRankingDetail?.data && this.state.refreshing) {
      this.setState({ refreshing: false });
      this.props.querySymbolData({
        symbolList: nextProps.upDownRankingDetail!.data[this.props.market].map((item: IObject) => item.code),
      });
      return true;
    }

    if (
      (this.props.upDownRankingDetail !== nextProps.upDownRankingDetail &&
        nextProps.upDownRankingDetail &&
        nextProps.upDownRankingDetail.upDownType === nextProps.upDownType &&
        nextProps.upDownRankingDetail.marketType === nextProps.market) ||
      this.props.upDownType !== nextProps.upDownType ||
      this.props.market !== nextProps.market
    ) {
      this.props.querySymbolData({
        symbolList: nextProps.upDownRankingDetail!.data[this.props.market].map((item: IObject) => item.code),
      });
      return true;
    }
    return false;
  }

  private requestData = (market: MARKET, loadMore = false) => {
    this.props.getUpDownStockRanking({
      marketType: market,
      upDownType: this.props.upDownType,
      fetchCount: config.fetchCount,
      loadMore,
    });
  };

  private goToSymbolInfo = (symbol: ISymbolInfo) => {
    this.props.setCurrentSymbol(symbol);
    goToSymbolInfo('UpDownRankingDetail');
  };

  private loadMore = () => {
    if (!this.loadingMore) {
      this.loadingMore = true;
      this.requestData(this.props.market, true);
    }
  };

  private renderITem = ({ item, index }: ListRenderItemInfo<any>) => {
    if (this.isUsingNewKisCore) {
      return (
        <SymbolRow
          symbol={{ ...this.symbolMap[item.cd!], s: item.cd! }}
          initialData={item}
          index={index}
          rowType="Order"
          isHighlight={index % 2 === 1}
          onPress={this.goToSymbolInfo}
          parentId="UpDownRankingDetail"
          showTrading={true}
        />
      );
    }

    return (
      <SymbolRow
        symbol={this.symbolMap[item.code]}
        initialData={parseMarketData(item as IRealTimeSymbolData)}
        index={index}
        rowType="Order"
        isHighlight={index % 2 === 1}
        onPress={this.goToSymbolInfo}
        parentId="UpDownRankingDetail"
        showTrading={true}
      />
    );
  };

  private handleRefreshData = () => {
    this.loadingMore = true;
    this.requestData(this.props.market);
  };

  private renderFooter = () => {
    if (this.props.upDownRankingDetail?.data === null && !this.state.refreshing) {
      return (
        <View style={styles.containerError}>
          <UIText style={styles.labelError}>{this.props.t('Error while fetching data, pull to refresh')}</UIText>
        </View>
      );
    }

    return null;
  };

  render() {
    const data = this.props.upDownRankingDetail;

    if (data != null && data.upDownType === this.props.upDownType && data.marketType === this.props.market) {
      if (data.next !== true && data.data != null) {
        if (data.data[this.props.market] != null) {
          if (this.data != null) {
            this.data = this.data.concat(data.data[this.props.market]);
          } else {
            this.data = data.data[this.props.market];
          }
        }
      } else if (this.data != null && data.data != null) {
        this.loadingMore = false;

        if (data.data[this.props.market] != null) {
          this.data = this.data.concat(data.data[this.props.market]);
        }
      } else {
        this.data = null;
      }
    } else {
      this.data = null;
    }

    return (
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.headerCode}>
            <UIText allowFontScaling={false} style={styles.headerCodeText}>
              {this.props.t('Code')}
            </UIText>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.headerPrice}>
              <UIText allowFontScaling={false} style={styles.headerPriceText}>
                {this.props.t('Price')}
              </UIText>
            </View>
            <View style={styles.headerChange}>
              <UIText allowFontScaling={false} style={styles.headerChangeText}>
                {this.props.t('Change')}
              </UIText>
            </View>
            <View style={styles.headerTrading}>
              <UIText allowFontScaling={false} style={styles.headerChangeText}>
                {this.props.t('Trading')}
              </UIText>
            </View>
          </View>
        </View>
        {this.data == null && this.props.upDownRankingDetail !== null ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={config.fetchCount}
            extraData={this.state}
            data={this.data}
            onEndReached={this.loadMore}
            style={styles.listStyle}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.005}
            renderItem={this.renderITem}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefreshData} />}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  upDownRankingDetail: state.upDownRankingDetail,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      getUpDownStockRanking,
      setCurrentSymbol,
      querySymbolData,
    })(RankingList)
  ),
  Fallback,
  handleError
);
