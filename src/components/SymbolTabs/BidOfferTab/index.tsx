import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import MiniQuote from 'components/MiniQuote';
import Fallback from 'components/Fallback';
import { formatNumber, handleError } from 'utils/common';
import { isStockType } from 'utils/market';
import { formatDateToDisplay } from 'utils/datetime';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, ISymbolData, IBidOffer } from 'interfaces/market';
import { SYMBOL_BID_OFFER_MAX_SIZE, SYMBOL_TYPE, MARKET, MARKET_STATUS } from 'global';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IBidOfferTabProps extends React.ClassAttributes<BidOfferTab>, WithTranslation {
  currentSymbol: ISymbolInfo;
  symbolData: ISymbolData | null;
}

class BidOfferTab extends React.Component<IBidOfferTabProps> {
  private symbolData: ISymbolData;

  constructor(props: IBidOfferTabProps) {
    super(props);

    if (this.props.currentSymbol && global.symbolData[this.props.currentSymbol.s]) {
      this.symbolData = global.symbolData[this.props.currentSymbol.s];
    }
  }

  shouldComponentUpdate(nextProps: IBidOfferTabProps) {
    if (
      this.props.symbolData !== nextProps.symbolData &&
      nextProps.symbolData &&
      nextProps.currentSymbol &&
      nextProps.symbolData.s === nextProps.currentSymbol.s
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolData };
      return true;
    }

    if (
      this.props.currentSymbol !== nextProps.currentSymbol &&
      nextProps.currentSymbol &&
      global.symbolData[nextProps.currentSymbol.s]
    ) {
      this.symbolData = global.symbolData[nextProps.currentSymbol.s];
      return true;
    }

    return false;
  }

  componentDidMount() {}

  private getFlex = (total: number, bidOffer?: IBidOffer) => {
    if (total === 0 || bidOffer == null || bidOffer.v == null) {
      return 0;
    }
    return 100 - Number((bidOffer.v / total).toFixed(2)) * 100;
  };

  private renderBidOffer = () => {
    if (this.symbolData.bb == null) {
      this.symbolData.bb = [];
    }

    if (this.symbolData.bo == null) {
      this.symbolData.bo = [];
    }

    let totalBid = this.symbolData.bb.reduce((a: number, b: IBidOffer): number => {
      return a + (b.v ? b.v : 0);
    }, 0);

    let totalOffer = this.symbolData.bo.reduce((a: number, b: IBidOffer): number => {
      return a + (b.v ? b.v : 0);
    }, 0);

    const offerVolumeList = [];
    const bidVolumeList = [];
    const offerPriceList = [];
    const bidPriceList = [];

    for (let index = 0; index < SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t]; index++) {
      const bidFlex = this.getFlex(totalBid, this.symbolData.bb[index]);

      const reverseIndex = SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t] - index - 1;
      const offerFlex = this.getFlex(totalOffer, this.symbolData.bo[reverseIndex]);

      const offerColorStyle =
        this.symbolData.bo[reverseIndex] &&
        this.symbolData.bo[reverseIndex].p != null &&
        (this.symbolData.bo[reverseIndex].p! > this.symbolData.re!
          ? globalStyles.up
          : this.symbolData.bo[reverseIndex].p! < this.symbolData.re!
          ? globalStyles.down
          : globalStyles.reference);

      const bidColorStyle =
        this.symbolData.bb[index] &&
        this.symbolData.bb[index].p != null &&
        (this.symbolData.bb[index].p! > this.symbolData.re!
          ? globalStyles.up
          : this.symbolData.bb[index].p! < this.symbolData.re!
          ? globalStyles.down
          : globalStyles.reference);

      offerVolumeList.push(
        <View style={styles.bidOfferContainer} key={index}>
          <View style={styles.bidOfferQuantity}>
            <View style={[{ flex: offerFlex }]} />
            <View style={[styles.offerQuantity, { flex: 100 - offerFlex }]} />
          </View>
          <View style={[styles.bidOfferVolumeSection, styles.offerVolumeSection]}>
            <UIText allowFontScaling={false}>
              {this.symbolData.bo[reverseIndex] != null ? formatNumber(this.symbolData.bo[reverseIndex].v) : null}
            </UIText>
          </View>
        </View>
      );

      if (
        index === SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t] - 1 &&
        (this.symbolData.ss === MARKET_STATUS.ATC || this.symbolData.ss === MARKET_STATUS.ATO) &&
        this.symbolData.bo[reverseIndex] &&
        this.symbolData.bo[reverseIndex].p === 0
      ) {
        offerPriceList.push(
          <View style={[styles.bidOfferPrice, styles.offerPrice]} key={index}>
            <UIText allowFontScaling={false} style={styles.offerPriceText}>
              {this.symbolData.ss}
            </UIText>
          </View>
        );
      } else {
        offerPriceList.push(
          <View style={styles.bidOfferPriceContainer} key={index}>
            {this.symbolData.ss !== 'CONTINUOUS' &&
            this.symbolData.bo[reverseIndex] &&
            this.symbolData.bo[reverseIndex].p === 0 ? (
              <UIText allowFontScaling={false} style={styles.offerPriceText}>
                {this.symbolData.ss !== 'CONTINUOUS'}
              </UIText>
            ) : (
              <View style={[styles.bidOfferPrice, styles.offerPrice]}>
                <View style={styles.price}>
                  {this.symbolData.bo[reverseIndex] ? (
                    <UIText allowFontScaling={false} style={[styles.offerPriceText, offerColorStyle]}>
                      {formatNumber(this.symbolData.bo[reverseIndex].p, 2)}
                    </UIText>
                  ) : null}
                </View>
                <View style={styles.change}>
                  <UIText allowFontScaling={false} style={[styles.offerChangeText, offerColorStyle]}>
                    {this.symbolData.bo[reverseIndex] &&
                      this.symbolData.bo[reverseIndex].p != null &&
                      this.symbolData.re &&
                      `${formatNumber(
                        ((this.symbolData.bo[reverseIndex].p! - this.symbolData.re) * 100) / this.symbolData.re,
                        2
                      )}%`}
                  </UIText>
                </View>
              </View>
            )}
          </View>
        );
      }

      bidVolumeList.push(
        <View style={[styles.bidOfferContainer]} key={index}>
          <View style={[styles.bidOfferQuantity]}>
            <View style={[styles.bidQuantity, { flex: 100 - bidFlex }]} />
            <View style={[{ flex: bidFlex }]} />
          </View>
          <View style={[styles.bidOfferVolumeSection, styles.bidVolumeSection]}>
            <UIText allowFontScaling={false}>
              {this.symbolData.bb[index] != null ? formatNumber(this.symbolData.bb[index].v) : null}
            </UIText>
          </View>
        </View>
      );

      if (
        index === 0 &&
        (this.symbolData.ss === MARKET_STATUS.ATC || this.symbolData.ss === MARKET_STATUS.ATO) &&
        this.symbolData.bb[index] &&
        this.symbolData.bb[index].p === 0
      ) {
        bidPriceList.push(
          <View style={styles.bidOfferPriceContainer} key={index}>
            <View style={[styles.bidOfferPrice, styles.bidPrice]}>
              <UIText allowFontScaling={false} style={styles.bidPriceText}>
                {this.symbolData.ss}
              </UIText>
            </View>
          </View>
        );
      } else {
        bidPriceList.push(
          <View style={styles.bidOfferPriceContainer} key={index}>
            {this.symbolData.ss !== 'CONTINUOUS' && this.symbolData.bb[index] && this.symbolData.bb[index].p === 0 ? (
              <UIText allowFontScaling={false} style={styles.bidPriceText}>
                {this.symbolData.ss !== 'CONTINUOUS'}
              </UIText>
            ) : (
              <View style={[styles.bidOfferPrice, styles.bidPrice]}>
                <View style={styles.price}>
                  {this.symbolData.bb[index] ? (
                    <UIText allowFontScaling={false} style={[styles.bidPriceText, bidColorStyle]}>
                      {formatNumber(this.symbolData.bb[index].p, 2)}
                    </UIText>
                  ) : null}
                </View>
                <View style={styles.change}>
                  <UIText allowFontScaling={false} style={[styles.bidChangeText, bidColorStyle]}>
                    {this.symbolData.bb[index] &&
                      this.symbolData.bb[index].p != null &&
                      this.symbolData.re &&
                      `${formatNumber(
                        ((this.symbolData.bb[index].p! - this.symbolData.re) * 100) / this.symbolData.re,
                        2
                      )}%`}
                  </UIText>
                </View>
              </View>
            )}
          </View>
        );
      }
    }

    return { offerVolumeList, bidVolumeList, offerPriceList, bidPriceList };
  };

  // private renderStockHistory = () => {
  //   return [
  //     <View style={styles.historyDataRow} key={'52WHigh'}>
  //       <View style={styles.historyLabel}>
  //         <UIText allowFontScaling={false} style={[styles.historyDataLabel]}>
  //           {this.props.t('52w High')}
  //         </UIText>
  //       </View>
  //       <View style={styles.historyData}>
  //         <UIText allowFontScaling={false} style={[styles.historyDataValue]}>
  //           {this.symbolData.w52 && formatNumber(this.symbolData.w52.h, 2)}
  //         </UIText>
  //       </View>
  //     </View>,
  //     <View style={styles.historyDataRow} key={'52WLow'}>
  //       <View style={styles.historyLabel}>
  //         <UIText allowFontScaling={false} style={[styles.historyDataLabel]}>
  //           {this.props.t('52w Low')}
  //         </UIText>
  //       </View>
  //       <View style={styles.historyData}>
  //         <UIText allowFontScaling={false} style={[styles.historyDataValue]}>
  //           {this.symbolData.w52 && formatNumber(this.symbolData.w52.l, 2)}
  //         </UIText>
  //       </View>
  //     </View>,
  //   ];
  // };

  private renderFuturesHistory = () => {
    return [
      <View style={styles.historyDataRow} key={'firstTradeDate'}>
        <View style={styles.historyLabel}>
          <UIText allowFontScaling={false} style={styles.historyDataLabel}>
            {this.props.t('Start At')}
          </UIText>
        </View>
        <View style={styles.historyData}>
          <UIText allowFontScaling={false} style={[styles.historyDataValue]}>
            {formatDateToDisplay(this.symbolData.ftd, 'dd/MM/yy', 'yyyyMMdd')}
          </UIText>
        </View>
      </View>,
      <View style={styles.historyDataRow} key={'lastTradeDate'}>
        <View style={styles.historyLabel}>
          <UIText allowFontScaling={false} style={styles.historyDataLabel}>
            {this.props.t('End At')}
          </UIText>
        </View>
        <View style={styles.historyData}>
          <UIText allowFontScaling={false} style={[styles.historyDataValue]}>
            {formatDateToDisplay(this.symbolData.ltd, 'dd/MM/yy', 'yyyyMMdd')}
          </UIText>
        </View>
      </View>,
    ];
  };

  private renderCWHistory = () => {
    return [
      <View style={styles.historyDataRow} key={'lastTradeDate'}>
        <View style={styles.historyLabel}>
          <UIText allowFontScaling={false} style={styles.historyDataLabel}>
            {this.props.t('Last Trade')}
          </UIText>
        </View>
        <View style={styles.historyData}>
          <UIText allowFontScaling={false} style={[styles.historyDataValue]}>
            {formatDateToDisplay(this.symbolData.ltd, 'dd/MM/yy', 'yyyyMMdd')}
          </UIText>
        </View>
      </View>,
      <View style={styles.historyDataRow} key={'maturityDate'}>
        <View style={styles.historyLabel}>
          <UIText allowFontScaling={false} style={styles.historyDataLabel}>
            {this.props.t('Maturity')}
          </UIText>
        </View>
        <View style={styles.historyData}>
          <UIText allowFontScaling={false} style={[styles.historyDataValue]}>
            {formatDateToDisplay(this.symbolData.md, 'dd/MM/yy', 'yyyyMMdd')}
          </UIText>
        </View>
      </View>,
    ];
  };

  render() {
    const { t } = this.props;

    if (this.symbolData == null) {
      return <ActivityIndicator />;
    }

    const { offerVolumeList, bidVolumeList, offerPriceList, bidPriceList } = this.renderBidOffer();

    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.left}>{offerVolumeList}</View>
          <View style={styles.middle}>{offerPriceList}</View>
          <View style={styles.right}>
            <View style={styles.historySection}>
              {isStockType(this.props.currentSymbol.t) ? (
                <View />
              ) : this.props.currentSymbol.t === SYMBOL_TYPE.FUTURES ? (
                this.renderFuturesHistory()
              ) : (
                this.props.currentSymbol.t === SYMBOL_TYPE.CW && this.renderCWHistory()
              )}

              <View style={styles.historyDataRow}>
                <View style={styles.historyLabel}>
                  <UIText allowFontScaling={false} style={[styles.historyDataLabel]}>
                    {t('Ceiling')}
                  </UIText>
                </View>
                <View style={styles.historyData}>
                  <UIText
                    allowFontScaling={false}
                    style={[styles.historyDataValue, globalStyles.ceiling, styles.boldText]}
                  >
                    {formatNumber(this.symbolData.ce, 2)}
                  </UIText>
                </View>
              </View>

              <View style={styles.historyDataRow}>
                <View style={styles.historyLabel}>
                  <UIText allowFontScaling={false} style={[styles.historyDataLabel]}>
                    {t('Floor')}
                  </UIText>
                </View>
                <View style={styles.historyData}>
                  <UIText
                    allowFontScaling={false}
                    style={[styles.historyDataValue, globalStyles.floor, styles.boldText]}
                  >
                    {formatNumber(this.symbolData.fl, 2)}
                  </UIText>
                </View>
              </View>

              <View style={styles.historyDataRow}>
                <View style={styles.historyLabel}>
                  <UIText allowFontScaling={false} style={[styles.historyDataLabel]}>
                    {t('High')}
                  </UIText>
                </View>
                <View style={styles.historyData}>
                  <UIText
                    allowFontScaling={false}
                    style={[
                      styles.historyDataValue,
                      this.symbolData.h != null &&
                        (this.symbolData.h > this.symbolData.re!
                          ? globalStyles.up
                          : this.symbolData.h < this.symbolData.re!
                          ? globalStyles.down
                          : globalStyles.reference),
                    ]}
                  >
                    {formatNumber(this.symbolData.h, 2)}
                  </UIText>
                </View>
              </View>

              <View style={styles.historyDataRow}>
                <View style={styles.historyLabel}>
                  <UIText allowFontScaling={false} style={[styles.historyDataLabel]}>
                    {t('Low')}
                  </UIText>
                </View>
                <View style={styles.historyData}>
                  <UIText
                    allowFontScaling={false}
                    style={[
                      styles.historyDataValue,
                      this.symbolData.l != null &&
                        (this.symbolData.l > this.symbolData.re!
                          ? globalStyles.up
                          : this.symbolData.l < this.symbolData.re!
                          ? globalStyles.down
                          : globalStyles.reference),
                    ]}
                  >
                    {formatNumber(this.symbolData.l, 2)}
                  </UIText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.middleSection}>
          <View style={styles.left}>
            <MiniQuote />
          </View>
          <View style={styles.middle}>{bidPriceList}</View>
          <View style={styles.right}>{bidVolumeList}</View>
        </View>
        {this.props.currentSymbol.m !== MARKET.HOSE && (
          <View style={styles.bottomSection}>
            <View style={styles.bottomItem}>
              <UIText allowFontScaling={false} style={styles.bottomData}>
                {formatNumber(this.symbolData.to)}
              </UIText>
              <UIText allowFontScaling={false} style={styles.bottomLabel}>
                {t('Total Offer')}
              </UIText>
            </View>
            <View style={styles.bottomItem}>
              <UIText allowFontScaling={false} style={styles.bottomData}>
                {formatNumber(this.symbolData.tb)}
              </UIText>
              <UIText allowFontScaling={false} style={styles.bottomLabel}>
                {t('Total Bid')}
              </UIText>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  symbolData: state.currentSymbolBidOffer,
});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps, {})(BidOfferTab)), Fallback, handleError);
