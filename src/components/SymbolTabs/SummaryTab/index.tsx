import React from 'react';
import { View, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import Fallback from 'components/Fallback';
import Button from 'components/Button';
import { handleError, formatNumber, getColor } from 'utils/common';
import { formatDateToDisplay } from 'utils/datetime';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, ISymbolData, IQuerySymbolData } from 'interfaces/market';
import { IObject } from 'interfaces/common';
import { goToBiz } from 'navigations';
import { SYMBOL_BID_OFFER_MAX_SIZE, SYMBOL_TYPE, MARKET_STATUS } from 'global';
import { queryBusinessInfo } from '../BusinessInfoTab/actions';
import globalStyles from 'styles';
import styles from './styles';
import config from 'config';
import UIText from 'components/UiText';
import { querySymbolData, reloadMarketData } from 'redux-sagas/global-actions';

interface ISummaryTabProps extends React.ClassAttributes<SummaryTab>, WithTranslation {
  componentId: string;
  currentSymbol: ISymbolInfo;
  symbolDataBidOffer: ISymbolData | null;
  symbolDataQuote: ISymbolData | null;
  businessInfo: IObject | null;

  queryBusinessInfo(params: IObject): void;

  reloadMarketData(): void;

  querySymbolData(payload: IQuerySymbolData): void;
}

interface ISummaryTabState {
  refreshing: boolean;
}

class SummaryTab extends React.Component<ISummaryTabProps, ISummaryTabState> {
  private symbolData: ISymbolData;

  constructor(props: ISummaryTabProps) {
    super(props);

    if (this.props.currentSymbol && global.symbolData[this.props.currentSymbol.s]) {
      this.symbolData = global.symbolData[this.props.currentSymbol.s];
    }

    this.state = {
      refreshing: false,
    };
  }

  shouldComponentUpdate(nextProps: ISummaryTabProps) {
    if (
      this.props.symbolDataBidOffer !== nextProps.symbolDataBidOffer &&
      nextProps.symbolDataBidOffer &&
      nextProps.currentSymbol &&
      nextProps.symbolDataBidOffer.s === nextProps.currentSymbol.s
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolDataBidOffer };
      return true;
    }

    if (
      this.props.symbolDataQuote !== nextProps.symbolDataQuote &&
      nextProps.symbolDataQuote &&
      nextProps.currentSymbol &&
      nextProps.symbolDataQuote.s === nextProps.currentSymbol.s
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolDataQuote };
      return true;
    }

    if (this.props.businessInfo !== nextProps.businessInfo) {
      return true;
    }

    if (this.props.currentSymbol !== nextProps.currentSymbol) {
      if (nextProps.currentSymbol) {
        if (global.symbolData[nextProps.currentSymbol.s]) {
          this.symbolData = global.symbolData[nextProps.currentSymbol.s];
        }

        this.requestData(nextProps.currentSymbol.s);
      } else {
        delete this.symbolData;
      }
      return true;
    }

    return false;
  }

  componentDidMount() {
    if (this.props.currentSymbol) {
      this.requestData(this.props.currentSymbol.s);
    }
  }

  private renderBidAsk = () => {
    const list = [];
    for (let index = 0; index < SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t]; index++) {
      list.push(
        <View style={styles.bidOfferContainer} key={index}>
          <View style={styles.bidOfferContent}>
            <View style={styles.labelContainerLeft}>
              <UIText allowFontScaling={false} style={[styles.left, globalStyles.up]}>
                {this.props.t('BID')} {index + 1}
              </UIText>
            </View>
            <View style={styles.valueContainerRight}>
              <UIText allowFontScaling={false} style={[styles.right, globalStyles.up]}>
                {this.symbolData.bb![index] != null ? formatNumber(this.symbolData.bb![index].v) : 0} x{' '}
                {index === 0 &&
                (this.symbolData.ss === MARKET_STATUS.ATC || this.symbolData.ss === MARKET_STATUS.ATO) &&
                this.symbolData.bb![index].p === 0
                  ? this.symbolData.ss
                  : this.symbolData.bb![index] != null
                  ? formatNumber(this.symbolData.bb![index].p, 2)
                  : 0}
              </UIText>
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.bidOfferContent}>
              <View style={styles.valueContainerLeft}>
                <UIText allowFontScaling={false} style={[styles.left, globalStyles.down]}>
                  {index === 0 &&
                  (this.symbolData.ss === MARKET_STATUS.ATC || this.symbolData.ss === MARKET_STATUS.ATO) &&
                  this.symbolData.bo![index].p === 0
                    ? this.symbolData.ss
                    : this.symbolData.bo![index] != null
                    ? formatNumber(this.symbolData.bo![index].p, 2)
                    : 0}{' '}
                  x {this.symbolData.bo![index] != null ? formatNumber(this.symbolData.bo![index].v) : 0}
                </UIText>
              </View>
              <View style={styles.labelContainerRight}>
                <UIText allowFontScaling={false} style={[styles.right, globalStyles.down]}>
                  {this.props.t('ASK')} {index + 1}
                </UIText>
              </View>
            </View>
          </View>
        </View>
      );
    }
    return list;
  };

  private renderInfo = () => {
    const { businessInfo, currentSymbol, t } = this.props;
    let listData: Array<{ title: string; content: string; textColor?: string }> = [];
    switch (currentSymbol.t) {
      case SYMBOL_TYPE.STOCK: {
        listData = [
          {
            title: 'Ceiling',
            content: this.symbolData ? formatNumber(this.symbolData.ce, 2) : '',
            textColor: 'ce',
          },
          {
            title: 'Trading Volume',
            content: this.symbolData ? formatNumber(this.symbolData.vo, 2) : '',
          },
          {
            title: 'Floor',
            content: this.symbolData ? formatNumber(this.symbolData.fl, 2) : '',
            textColor: 'fl',
          },
          {
            title: 'Trading Value',
            content: this.symbolData
              ? config.usingNewKisCore
                ? `${formatNumber(Number(this.symbolData.va) / 1000000, 2)}M`
                : `${formatNumber(Number(this.symbolData.va), 2)}M`
              : '',
          },
          // {
          //   title: '52w High',
          //   content: this.symbolData.w52 ? formatNumber(this.symbolData.w52.h, 2) : '',
          // },
          {
            title: 'EPS',
            content: businessInfo ? formatNumber(businessInfo.eps as number, 2) : '',
          },
          // {
          //   title: '52w Low',
          //   content: this.symbolData.w52 ? formatNumber(this.symbolData.w52.l, 2) : '',
          // },
          {
            title: 'PBR',
            content: businessInfo ? formatNumber(businessInfo.pbr as number, 2) : '',
          },
          {
            title: 'High',
            content: formatNumber(this.symbolData.h, 2),
            textColor: getColor(
              this.symbolData.h as number,
              this.symbolData.re as number,
              this.symbolData.ce as number,
              this.symbolData.fl as number,
              this.symbolData
            ).iconType,
          },
          {
            title: 'ROA',
            content: businessInfo ? `${formatNumber((businessInfo.roa as number) * 100, 2)}%` : '',
          },
          {
            title: 'Low',
            content: formatNumber(this.symbolData.l, 2),
            textColor: getColor(
              this.symbolData.l as number,
              this.symbolData.re as number,
              this.symbolData.ce as number,
              this.symbolData.fl as number,
              this.symbolData
            ).iconType,
          },
          {
            title: 'ROE',
            content: businessInfo ? `${formatNumber((businessInfo.roe as number) * 100, 2)}%` : '',
          },
        ];
        break;
      }
      case SYMBOL_TYPE.CW: {
        listData = [
          {
            title: 'Ceiling',
            content: this.symbolData ? formatNumber(this.symbolData.ce, 2) : '',
            textColor: 'ce',
          },
          {
            title: 'Underlying Asset',
            content: currentSymbol.b as string,
          },
          {
            title: 'Floor',
            content: this.symbolData ? formatNumber(this.symbolData.fl, 2) : '',
            textColor: 'fl',
          },
          {
            title: 'Exercise Price',
            content: this.symbolData ? formatNumber(this.symbolData.ep, 2) : '',
          },
          {
            title: 'High',
            content: this.symbolData ? formatNumber(this.symbolData.h, 2) : '',
            textColor: getColor(
              this.symbolData.h as number,
              this.symbolData.re as number,
              this.symbolData.ce as number,
              this.symbolData.fl as number,
              this.symbolData
            ).iconType,
          },
          {
            title: 'Exercise Ratio',
            content: this.symbolData && this.symbolData.er ? this.symbolData.er : '',
          },
          {
            title: 'Low',
            content: this.symbolData ? formatNumber(this.symbolData.l, 2) : '',
            textColor: getColor(
              this.symbolData.l as number,
              this.symbolData.re as number,
              this.symbolData.ce as number,
              this.symbolData.fl as number,
              this.symbolData
            ).iconType,
          },
          {
            title: 'Maturity Date',
            content: this.symbolData ? (formatDateToDisplay(this.symbolData.md) as string) : '',
          },
          {
            title: 'Trading Volume',
            content: this.symbolData ? formatNumber(this.symbolData.vo, 2) : '',
          },
          {
            title: 'Implied Volatility',
            content: this.symbolData ? `${formatNumber((this.symbolData.iv as number) * 100, 2)}%` : '',
          },
          {
            title: 'Trading Value',
            content: this.symbolData ? `${formatNumber(this.symbolData.va, 2)}M` : '',
          },
          {
            title: 'Delta',
            content: this.symbolData ? formatNumber(this.symbolData.de, 2) : '',
          },
        ];
        break;
      }
      case SYMBOL_TYPE.ETF:
      case SYMBOL_TYPE.FUND:
      case SYMBOL_TYPE.BOND: {
        listData = [
          {
            title: 'Ceiling',
            content: this.symbolData ? formatNumber(this.symbolData.ce, 2) : '',
            textColor: 'ce',
          },
          {
            title: 'Trading Volume',
            content: this.symbolData ? formatNumber(this.symbolData.vo, 2) : '',
          },
          {
            title: 'Floor',
            content: this.symbolData ? formatNumber(this.symbolData.fl, 2) : '',
            textColor: 'fl',
          },
          {
            title: 'Trading Value',
            content: this.symbolData ? `${formatNumber(this.symbolData.va, 2)}M` : '',
          },
          // {
          //   title: '52w High',
          //   content: this.symbolData.w52 ? formatNumber(this.symbolData.w52.h, 2) : '',
          // },
          {
            title: 'EPS',
            content: businessInfo ? formatNumber(businessInfo.eps as number, 2) : '',
          },
          // {
          //   title: '52w Low',
          //   content: this.symbolData.w52 ? formatNumber(this.symbolData.w52.l, 2) : '',
          // },
          {
            title: 'PBR',
            content: businessInfo ? formatNumber(businessInfo.pbr as number, 2) : '',
          },
          {
            title: 'High',
            content: this.symbolData ? formatNumber(this.symbolData.h, 2) : '',
            textColor: getColor(
              this.symbolData.h as number,
              this.symbolData.re as number,
              this.symbolData.ce as number,
              this.symbolData.fl as number,
              this.symbolData
            ).iconType,
          },
          {
            title: 'ROA',
            content: businessInfo ? `${formatNumber((businessInfo.roa as number) * 100, 2)}%` : '',
          },
          {
            title: 'Low',
            content: this.symbolData ? formatNumber(this.symbolData.l, 2) : '',
            textColor: getColor(
              this.symbolData.l as number,
              this.symbolData.re as number,
              this.symbolData.ce as number,
              this.symbolData.fl as number,
              this.symbolData
            ).iconType,
          },
          {
            title: 'ROE',
            content: businessInfo ? `${formatNumber((businessInfo.roe as number) * 100, 2)}%` : '',
          },
        ];
        break;
      }
      case SYMBOL_TYPE.FUTURES: {
        listData = [
          {
            title: 'Ceiling',
            content: this.symbolData ? formatNumber(this.symbolData.ce, 2) : '',
            textColor: 'ce',
          },
          {
            title: 'Trading Volume',
            content: this.symbolData ? formatNumber(this.symbolData.vo, 2) : '',
          },
          {
            title: 'Floor',
            content: this.symbolData ? formatNumber(this.symbolData.fl, 2) : '',
            textColor: 'fl',
          },
          {
            title: 'Trading Value',
            content: this.symbolData ? `${formatNumber(this.symbolData.va, 2)}M` : '',
          },
          {
            title: 'High',
            content: this.symbolData ? formatNumber(this.symbolData.h, 2) : '',
            textColor: getColor(
              this.symbolData.h as number,
              this.symbolData.re as number,
              this.symbolData.ce as number,
              this.symbolData.fl as number,
              this.symbolData
            ).iconType,
          },
          {
            title: 'Start Date',
            content: this.symbolData && this.symbolData.ftd ? (formatDateToDisplay(this.symbolData.ftd) as string) : '',
          },
          {
            title: 'Low',
            content: this.symbolData ? formatNumber(this.symbolData.l, 2) : '',
            textColor: getColor(
              this.symbolData.l as number,
              this.symbolData.re as number,
              this.symbolData.ce as number,
              this.symbolData.fl as number,
              this.symbolData
            ).iconType,
          },
          {
            title: 'End Date',
            content: this.symbolData && this.symbolData.ltd ? (formatDateToDisplay(this.symbolData.ltd) as string) : '',
          },
        ];
        break;
      }
      default: {
        break;
      }
    }
    const listDisplay = [];
    for (let index = 0; index < listData.length; index += 2) {
      const textStyle =
        listData[index].textColor === 'ce'
          ? globalStyles.ceiling
          : listData[index].textColor === 'fl'
          ? globalStyles.floor
          : listData[index].textColor === 'up'
          ? globalStyles.up
          : listData[index].textColor === 'down'
          ? globalStyles.down
          : {};
      listDisplay.push(
        <View style={styles.InfoContainer} key={index}>
          <View style={[styles.bidOfferContent, styles.borderRight]}>
            <View style={styles.columnContentLabel}>
              <UIText allowFontScaling={false} style={[styles.left]}>
                {t(listData[index].title)}
              </UIText>
            </View>
            <View style={styles.columnContentValue}>
              <UIText allowFontScaling={false} style={[styles.right, textStyle]}>
                {listData[index].content}
              </UIText>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.bidOfferContent}>
              <View style={styles.columnContentLabel}>
                <UIText allowFontScaling={false} style={[styles.left]}>
                  {t(listData[index + 1] && listData[index + 1].title)}
                </UIText>
              </View>
              <View style={styles.columnContentValue}>
                <UIText allowFontScaling={false} style={[styles.right]}>
                  {listData[index + 1] && listData[index + 1].content}
                </UIText>
              </View>
            </View>
          </View>
        </View>
      );
    }
    return listDisplay;
  };

  private requestData = (s: string) => {
    const params = {
      code: s,
    };
    this.props.queryBusinessInfo(params);
  };

  private goToOrder = (sellBuyType: string) => {
    goToBiz(
      'Order',
      {
        parentId: this.props.componentId,
        sellBuyType,
      },
      this.props.componentId
    );
  };

  private handleRefreshData = () => {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });

    this.props.reloadMarketData();
    if (this.props.currentSymbol != null) {
      this.props.querySymbolData({
        symbolList: [this.props.currentSymbol.s],
      });
    }
  };

  render() {
    const { t, currentSymbol } = this.props;

    if (this.symbolData == null) {
      return <ActivityIndicator />;
    }

    if (this.symbolData.bb == null) {
      this.symbolData.bb = [];
    }

    if (this.symbolData.bo == null) {
      this.symbolData.bo = [];
    }

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefreshData} />}
        >
          <View
            style={[
              styles.topSection,
              { ...(currentSymbol.t !== SYMBOL_TYPE.FUTURES ? styles.topSection3Item : styles.topSection5Item) },
            ]}
          >
            {this.renderBidAsk()}
          </View>
          <View style={styles.bottomSection}>{this.renderInfo()}</View>
          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={[styles.sellButton, styles.button]}
              title={t('Sell').toUpperCase()}
              onPress={() => this.goToOrder('SELL')}
            />
            <Button
              buttonStyle={[styles.buyButton, styles.button]}
              title={t('Buy').toUpperCase()}
              onPress={() => this.goToOrder('BUY')}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  symbolDataBidOffer: state.currentSymbolBidOffer,
  symbolDataQuote: state.currentSymbolQuote,
  businessInfo: state.businessInfo,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryBusinessInfo, reloadMarketData, querySymbolData })(SummaryTab)),
  Fallback,
  handleError
);
