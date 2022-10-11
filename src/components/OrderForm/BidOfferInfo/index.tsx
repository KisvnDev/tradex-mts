import React, { Component } from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { withErrorBoundary } from 'react-error-boundary';
import { SYMBOL_BID_OFFER_MAX_SIZE, SYMBOL_TYPE, MARKET_STATUS, ORDER_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, ISymbolData, IOrderPrice, IBidOffer } from 'interfaces/market';
import { setOrderPrice } from 'redux-sagas/global-actions';
import globalStyles from 'styles';
import styles from './styles';
import config from 'config';
import UIText from 'components/UiText';

interface IBidOfferInfoProps extends React.ClassAttributes<BidOfferInfo>, WithTranslation {
  currentSymbol: ISymbolInfo;
  symbolData: ISymbolData | null;
  currentOrderType?: ORDER_TYPE;

  onOfferPricePress: (type?: ORDER_TYPE) => void;

  setOrderPrice(payload: IOrderPrice): void;
}

interface IBidOfferInfoState {}

class BidOfferInfo extends Component<IBidOfferInfoProps, IBidOfferInfoState> {
  private symbolData: ISymbolData;

  constructor(props: IBidOfferInfoProps) {
    super(props);

    if (this.props.currentSymbol && global.symbolData[this.props.currentSymbol.s]) {
      this.symbolData = global.symbolData[this.props.currentSymbol.s];
    }
  }

  shouldComponentUpdate(nextProps: IBidOfferInfoProps) {
    if (
      this.props.symbolData !== nextProps.symbolData &&
      nextProps.symbolData &&
      nextProps.symbolData.s === nextProps.currentSymbol.s
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolData };
      return true;
    }

    if (this.props.currentSymbol !== nextProps.currentSymbol && global.symbolData[nextProps.currentSymbol.s]) {
      this.symbolData = global.symbolData[nextProps.currentSymbol.s];
      return true;
    }

    return false;
  }

  private setOrderPrice = (price?: number, type?: ORDER_TYPE) => {
    if (price != null) {
      this.props.onOfferPricePress(type);
      this.props.setOrderPrice({
        price,
        symbol: this.props.currentSymbol,
      });
    }
  };

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

    const bidOfferList = [];
    const isFutures = this.props.currentSymbol.t === SYMBOL_TYPE.FUTURES;

    for (let index = SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t] - 1; index >= 0; index--) {
      const offerFlex = this.getFlex(totalOffer, this.symbolData.bo[index]);

      if (
        index === 0 &&
        (this.symbolData.ss === MARKET_STATUS.ATC || this.symbolData.ss === MARKET_STATUS.ATO) &&
        this.symbolData.bo[index] &&
        this.symbolData.bo[index].p === 0
      ) {
        bidOfferList.push(
          <View
            style={[styles.item, styles.bidOfferSection]}
            key={SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t] - index - 1}
          >
            <View style={[styles.priceSection, isFutures ? styles.priceSectionFuture : styles.bidOfferSection]}>
              <View style={[styles.offerBackgroundColor, styles.bidOfferSection]}>
                {this.symbolData.bo && this.symbolData.bo[index] && (
                  <TouchableOpacity
                    style={[
                      { ...(isFutures ? styles.item : styles.quantity) },
                      styles.bidOfferSection,
                      styles.justifyContentCenter,
                    ]}
                    onPress={() => this.setOrderPrice(this.symbolData.fl, this.symbolData.ss as ORDER_TYPE)}
                  >
                    <UIText allowFontScaling={false}>{this.symbolData.ss}</UIText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.bidOfferSection}>
              <View style={styles.bidOfferQuantity}>
                <View style={styles.background}>
                  <View style={[styles.offerQuantity, { flex: 100 - offerFlex }]} />
                  <View style={{ flex: offerFlex }} />
                </View>
                <View style={styles.volumeSection}>
                  <UIText allowFontScaling={false}>
                    {' '}
                    {this.symbolData.bo[index] != null ? formatNumber(this.symbolData.bo[index].v) : null}
                  </UIText>
                </View>
              </View>
            </View>
          </View>
        );
      } else {
        bidOfferList.push(
          <View
            style={[styles.item, styles.bidOfferSection]}
            key={SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t] - index - 1}
          >
            <View style={[styles.priceSection, isFutures ? styles.priceSectionFuture : styles.bidOfferSection]}>
              <View style={[styles.offerBackgroundColor, styles.bidOfferSection]}>
                {this.symbolData.bo && this.symbolData.bo[index] && (
                  <TouchableOpacity
                    style={[
                      { ...(isFutures ? styles.item : styles.quantity) },
                      styles.bidOfferSection,
                      styles.justifyContentCenter,
                    ]}
                    onPress={() =>
                      this.setOrderPrice(
                        this.symbolData.bo![index].p,
                        this.props.currentOrderType === ORDER_TYPE.LO ||
                          this.props.currentOrderType === ORDER_TYPE.ODDLOT
                          ? this.props.currentOrderType
                          : undefined
                      )
                    }
                  >
                    <UIText
                      allowFontScaling={false}
                      style={[
                        styles.text,
                        this.symbolData.bo[index].p! > this.symbolData.re!
                          ? globalStyles.up
                          : this.symbolData.bo[index].p! < this.symbolData.re!
                          ? globalStyles.down
                          : globalStyles.reference,
                        isFutures && styles.alignSelfCenter,
                      ]}
                    >
                      {formatNumber(this.symbolData.bo[index].p, 2)}
                    </UIText>
                    <UIText
                      allowFontScaling={false}
                      style={[
                        styles.text,
                        this.symbolData.bo[index].p! > this.symbolData.re!
                          ? globalStyles.up
                          : this.symbolData.bo[index].p! < this.symbolData.re!
                          ? globalStyles.down
                          : globalStyles.reference,
                        isFutures && styles.alignSelfCenter,
                      ]}
                    >
                      {' '}
                      (
                      {this.symbolData.bo[index] &&
                        this.symbolData.bo[index].p != null &&
                        this.symbolData.re &&
                        `${formatNumber(
                          ((this.symbolData.bo[index].p! - this.symbolData.re) * 100) / this.symbolData.re,
                          2
                        )}%`}
                      )
                    </UIText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.bidOfferSection}>
              <View style={styles.bidOfferQuantity}>
                <View style={styles.background}>
                  <View style={[styles.offerQuantity, { flex: 100 - offerFlex }]} />
                  <View style={{ flex: offerFlex }} />
                </View>
                <View style={styles.volumeSection}>
                  <UIText allowFontScaling={false}>
                    {' '}
                    {this.symbolData.bo[index] != null ? formatNumber(this.symbolData.bo[index].v) : null}
                  </UIText>
                </View>
              </View>
            </View>
          </View>
        );
      }
    }

    for (let index = 0; index < SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t]; index++) {
      const bidFlex = this.getFlex(totalBid, this.symbolData.bb[index]);

      if (
        index === 0 &&
        (this.symbolData.ss === MARKET_STATUS.ATC || this.symbolData.ss === MARKET_STATUS.ATO) &&
        this.symbolData.bb[index] &&
        this.symbolData.bb[index].p === 0
      ) {
        bidOfferList.push(
          <View
            style={[styles.item, styles.bidOfferSection]}
            key={SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t] + index}
          >
            <View
              style={[
                styles.priceSection,
                {
                  ...(this.props.currentSymbol.t === SYMBOL_TYPE.FUTURES
                    ? styles.priceSectionFuture
                    : styles.bidOfferSection),
                },
              ]}
            >
              <View style={[styles.bidBackgroundColor, styles.bidOfferSection]}>
                {this.symbolData.bb && this.symbolData.bb[index] && (
                  <TouchableOpacity
                    style={[
                      { ...(isFutures ? styles.item : styles.quantity) },
                      styles.bidOfferSection,
                      styles.justifyContentCenter,
                    ]}
                    onPress={() => this.setOrderPrice(this.symbolData.ce, this.symbolData.ss as ORDER_TYPE)}
                  >
                    <UIText allowFontScaling={false}>{this.symbolData.ss}</UIText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.bidOfferSection}>
              <View style={styles.bidOfferQuantity}>
                <View style={styles.background}>
                  <View style={[styles.bidQuantity, { flex: 100 - bidFlex }]} />
                  <View style={{ flex: bidFlex }} />
                </View>
                <View style={styles.volumeSection}>
                  <UIText allowFontScaling={false}>
                    {' '}
                    {this.symbolData.bb[index] != null ? formatNumber(this.symbolData.bb[index].v) : null}
                  </UIText>
                </View>
              </View>
            </View>
          </View>
        );
      } else {
        bidOfferList.push(
          <View
            style={[styles.item, styles.bidOfferSection]}
            key={SYMBOL_BID_OFFER_MAX_SIZE[this.props.currentSymbol.t] + index}
          >
            <View
              style={[
                styles.priceSection,
                {
                  ...(this.props.currentSymbol.t === SYMBOL_TYPE.FUTURES
                    ? styles.priceSectionFuture
                    : styles.bidOfferSection),
                },
              ]}
            >
              <View style={[styles.bidBackgroundColor, styles.bidOfferSection]}>
                {this.symbolData.bb && this.symbolData.bb[index] && (
                  <TouchableOpacity
                    style={[
                      { ...(isFutures ? styles.item : styles.quantity) },
                      styles.bidOfferSection,
                      styles.justifyContentCenter,
                    ]}
                    onPress={() =>
                      this.setOrderPrice(
                        this.symbolData.bb![index].p,
                        this.props.currentOrderType === ORDER_TYPE.LO ||
                          this.props.currentOrderType === ORDER_TYPE.ODDLOT
                          ? this.props.currentOrderType
                          : undefined
                      )
                    }
                  >
                    <UIText
                      allowFontScaling={false}
                      style={[
                        styles.text,
                        {
                          ...(this.symbolData.bb[index].p! > this.symbolData.re!
                            ? globalStyles.up
                            : this.symbolData.bb[index].p! < this.symbolData.re!
                            ? globalStyles.down
                            : globalStyles.reference),
                        },
                        {
                          ...(isFutures ? styles.alignSelfCenter : null),
                        },
                      ]}
                    >
                      {formatNumber(this.symbolData.bb[index].p, 2)}
                    </UIText>
                    <UIText
                      allowFontScaling={false}
                      style={[
                        styles.text,
                        {
                          ...(this.symbolData.bb[index].p! > this.symbolData.re!
                            ? globalStyles.up
                            : this.symbolData.bb[index].p! < this.symbolData.re!
                            ? globalStyles.down
                            : globalStyles.reference),
                        },
                        {
                          ...(isFutures ? styles.alignSelfCenter : null),
                        },
                      ]}
                    >
                      {' '}
                      (
                      {this.symbolData.bb[index] &&
                        this.symbolData.bb[index].p != null &&
                        this.symbolData.re &&
                        `${formatNumber(
                          ((this.symbolData.bb[index].p! - this.symbolData.re) * 100) / this.symbolData.re,
                          2
                        )}%`}
                      )
                    </UIText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.bidOfferSection}>
              <View style={styles.bidOfferQuantity}>
                <View style={styles.background}>
                  <View style={[styles.bidQuantity, { flex: 100 - bidFlex }]} />
                  <View style={{ flex: bidFlex }} />
                </View>
                <View style={styles.volumeSection}>
                  <UIText allowFontScaling={false}>
                    {' '}
                    {this.symbolData.bb[index] != null ? formatNumber(this.symbolData.bb[index].v) : null}
                  </UIText>
                </View>
              </View>
            </View>
          </View>
        );
      }
    }

    return { bidOfferList };
  };

  render() {
    const isUsingNewKisCore = config.usingNewKisCore;

    if (this.symbolData == null) {
      return <ActivityIndicator />;
    }

    const { bidOfferList } = this.renderBidOffer();

    return (
      <View style={styles.container}>
        <View style={[styles.ceFLSection, styles.offerBackgroundColor]}>
          <TouchableOpacity
            onPress={() =>
              this.setOrderPrice(
                isUsingNewKisCore ? this.props.currentSymbol.ce : this.symbolData.ce,
                this.props.currentOrderType === ORDER_TYPE.LO || this.props.currentOrderType === ORDER_TYPE.ODDLOT
                  ? this.props.currentOrderType
                  : undefined
              )
            }
          >
            <UIText allowFontScaling={false} style={[styles.bold, globalStyles.ceiling]}>
              <MaterialCommunityIcons style={styles.icon} name="arrow-collapse-up" />
              {formatNumber(isUsingNewKisCore ? this.props.currentSymbol.ce : this.symbolData.ce, 2)}
            </UIText>
          </TouchableOpacity>
        </View>
        <View style={styles.bidOfferSection}>{bidOfferList}</View>
        <View style={[styles.ceFLSection, styles.bidBackgroundColor]}>
          <TouchableOpacity
            onPress={() =>
              this.setOrderPrice(
                isUsingNewKisCore ? this.props.currentSymbol.fl : this.symbolData.fl,
                this.props.currentOrderType === ORDER_TYPE.LO || this.props.currentOrderType === ORDER_TYPE.ODDLOT
                  ? this.props.currentOrderType
                  : undefined
              )
            }
          >
            <UIText allowFontScaling={false} style={[styles.bold, globalStyles.floor]}>
              <MaterialCommunityIcons style={styles.icon} name="arrow-collapse-down" />
              {formatNumber(isUsingNewKisCore ? this.props.currentSymbol.fl : this.symbolData.fl, 2)}
            </UIText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  symbolData: state.currentSymbolBidOffer,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      setOrderPrice,
    })(BidOfferInfo)
  ),
  Fallback,
  handleError
);
