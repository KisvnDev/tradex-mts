import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { withErrorBoundary } from 'react-error-boundary';
import store from 'redux-sagas/store';
import { goToSymbolInfo, goToUpDownRankingDetail } from 'navigations';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import StockRow from './StockRow';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { getUpDownStockRanking } from './actions';
import styles from './styles';
import config from 'config';
import { mapDataUpDown } from 'utils/newKisCore';
import UIText from 'components/UiText';

interface IRankingTabProps extends React.ClassAttributes<RankingTab>, WithTranslation {
  upDownRanking: IObject | null;
  upDownType: 'UP' | 'DOWN';

  getUpDownStockRanking(payload: IObject): void;

  setCurrentSymbol(payload: ISymbolInfo): void;
}

class RankingTab extends Component<IRankingTabProps> {
  private symbolMap = getSymbolMap(store.getState());
  private isUsingKisCore = config.usingNewKisCore;

  componentDidMount() {
    this.props.getUpDownStockRanking({
      marketType: 'ALL',
      upDownType: this.props.upDownType,
      fetchCount: 5,
    });
  }

  private goToSymbolInfo = (symbol: string) => {
    const symbolInfo = this.symbolMap[symbol];
    if (symbolInfo) {
      this.props.setCurrentSymbol(symbolInfo);
      goToSymbolInfo('Ranking');
    }
  };

  private goToDetail = () => {
    goToUpDownRankingDetail(this.props.upDownType);
  };

  shouldComponentUpdate(nextProps: IRankingTabProps) {
    if (
      (this.props.upDownRanking !== nextProps.upDownRanking &&
        nextProps.upDownRanking &&
        nextProps.upDownRanking.upDownType === nextProps.upDownType) ||
      this.props.upDownType !== nextProps.upDownType
    ) {
      return true;
    }
    return false;
  }

  render() {
    const itemListHOSE = [];
    const itemListHNX = [];
    const itemListUPCOM = [];

    if (
      this.props.upDownRanking == null ||
      this.props.upDownRanking.data == null ||
      this.props.upDownRanking.upDownType !== this.props.upDownType
    ) {
      return <ActivityIndicator />;
    }

    const data: IObject = this.props.upDownRanking.data as IObject;

    if (data.HOSE && (data.HOSE as IObject[]).length > 0) {
      for (let i = 0; i < 5; i++) {
        itemListHOSE.push(
          <StockRow
            key={i}
            data={this.isUsingKisCore ? mapDataUpDown(data.HOSE[i]) : data.HOSE[i]}
            highlight={i % 2 ? true : false}
            onPress={this.goToSymbolInfo}
          />
        );
      }
    }

    if (data.HNX && (data.HNX as IObject[]).length > 0) {
      for (let i = 0; i < 5; i++) {
        itemListHNX.push(
          <StockRow
            key={i}
            data={this.isUsingKisCore ? mapDataUpDown(data.HNX[i]) : data.HNX[i]}
            highlight={i % 2 ? true : false}
            onPress={this.goToSymbolInfo}
          />
        );
      }
    }

    if (data.UPCOM && (data.UPCOM as IObject[]).length > 0) {
      for (let i = 0; i < 5; i++) {
        itemListUPCOM.push(
          <StockRow
            key={i}
            data={this.isUsingKisCore ? mapDataUpDown(data.UPCOM[i]) : data.UPCOM[i]}
            highlight={i % 2 ? true : false}
            onPress={this.goToSymbolInfo}
          />
        );
      }
    }

    return (
      <View>
        <View style={styles.tabContainer}>
          <View style={styles.marketColumn}>
            <View style={styles.header}>
              <UIText allowFontScaling={false} style={styles.headerText}>
                {this.props.t('HOSE')}
              </UIText>
            </View>
            <View>{itemListHOSE}</View>
          </View>

          <View style={styles.marketColumn}>
            <View style={styles.header}>
              <UIText allowFontScaling={false} style={styles.headerText}>
                {this.props.t('HNX')}
              </UIText>
            </View>
            <View>{itemListHNX}</View>
          </View>

          <View style={styles.marketColumn}>
            <View style={styles.header}>
              <UIText allowFontScaling={false} style={styles.headerText}>
                {this.props.t('UPCOM')}
              </UIText>
            </View>
            <View>{itemListUPCOM}</View>
          </View>
        </View>
        <TouchableOpacity style={styles.viewAllButton} onPress={this.goToDetail}>
          <View style={styles.buttonContainer}>
            <UIText allowFontScaling={false} style={styles.buttonText}>
              {this.props.t('View Detail')}
            </UIText>
          </View>

          <View style={styles.iconContainer}>
            <FeatherIcon style={[styles.icon]} name="chevron-right" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  upDownRanking: state.upDownRanking,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      getUpDownStockRanking,
      setCurrentSymbol,
    })(RankingTab)
  ),
  Fallback,
  handleError
);
