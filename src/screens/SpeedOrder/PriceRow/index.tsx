import React from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle, TouchableWithoutFeedback } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { Big } from 'big.js';
import { formatNumber, handleError } from 'utils/common';
import { SELL_BUY_TYPE, ORDER_KIND } from 'global';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { ISymbolData, ISymbolInfo, IBidOffer } from 'interfaces/market';
import Fallback from 'components/Fallback';
import { ICurrentRow, PROMPT_MODE, IPriceData } from '../reducers';
import { getBidOfferMap } from 'redux-sagas/global-reducers/CurrentSymbol-reducers';
import { setCurrentRow } from '../actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IBidOfferMap {
  s: string | null;
  bb: { [s: string]: IBidOffer } | null;
  bo: { [s: string]: IBidOffer } | null;
}

interface IPriceRowProps extends React.ClassAttributes<PriceRow>, WithTranslation {
  currentSymbol: ISymbolInfo;
  price: Big;
  quote: ISymbolData | null;
  bidOffer: IBidOfferMap;
  rowStyle?: StyleProp<ViewStyle>;
  currentRow: ICurrentRow | null;
  orderHistory: IObject | null;
  stopOrderHistory: IObject | null;

  setCurrentRow(currentRow: ICurrentRow | null): void;

  callPlaceOrder(currentRow: ICurrentRow, stopPriceData: IPriceData): void;

  callCancelOrder(currentRow: ICurrentRow): void;

  callMoveOrder(currentRow: ICurrentRow): void;
}

interface IPriceRowState {}

let prevPriceData: IPriceData = {};
class PriceRow extends React.Component<IPriceRowProps, IPriceRowState> {
  private priceData: IPriceData = {};
  private stopPriceData: IPriceData = {};
  private quote: ISymbolData;
  private bidOffer: IBidOfferMap;

  constructor(props: IPriceRowProps) {
    super(props);

    this.state = {};

    if (global.symbolData[this.props.currentSymbol.s]) {
      this.quote = global.symbolData[this.props.currentSymbol!.s];
    }

    if (this.props.quote && this.props.quote.s === this.props.currentSymbol.s) {
      this.quote = { ...this.quote, ...this.props.quote };
    }

    if (this.props.bidOffer && this.props.bidOffer.s === this.props.currentSymbol.s) {
      this.bidOffer = this.props.bidOffer;
    }

    if (this.props.orderHistory && this.props.orderHistory.code === this.props.currentSymbol.s) {
      this.priceData = this.props.orderHistory[this.props.price.toString()];
    }

    if (this.props.stopOrderHistory && this.props.stopOrderHistory.code === this.props.currentSymbol.s) {
      this.stopPriceData = this.props.stopOrderHistory[this.props.price.toString()];
    }
  }

  shouldComponentUpdate(nextProps: IPriceRowProps, _nextState: IPriceRowState) {
    if (this.props.currentSymbol !== nextProps.currentSymbol || this.props.price !== nextProps.price) {
      if (this.props.price !== nextProps.price && nextProps.orderHistory) {
        this.priceData = nextProps.orderHistory[nextProps.price.toString()];
      } else {
        this.priceData = {};
      }

      if (this.props.price !== nextProps.price && nextProps.stopOrderHistory) {
        this.stopPriceData = nextProps.stopOrderHistory[nextProps.price.toString()];
      } else {
        this.stopPriceData = {};
      }

      return true;
    }

    if (this.props.currentRow == null || this.props.currentRow!.price.cmp(this.props.price) === 0) {
      if (
        this.props.currentRow !== nextProps.currentRow &&
        (nextProps.currentRow == null ||
          nextProps.currentRow.onEditMode === true ||
          (nextProps.currentRow.showModal === true && nextProps.price.cmp(nextProps.currentRow.price) === 0))
      ) {
        return true;
      }
    }

    if (
      this.props.currentRow !== nextProps.currentRow &&
      this.props.currentRow != null &&
      nextProps.currentRow != null &&
      this.props.currentRow.onEditMode !== nextProps.currentRow.onEditMode
    ) {
      return true;
    }

    if (this.props.quote !== nextProps.quote && nextProps.quote && nextProps.quote.s === nextProps.currentSymbol.s) {
      this.quote = { ...this.quote, ...nextProps.quote };
      return true;
    }

    if (
      this.props.bidOffer !== nextProps.bidOffer &&
      nextProps.bidOffer &&
      nextProps.bidOffer.s === nextProps.currentSymbol.s
    ) {
      this.bidOffer = nextProps.bidOffer;
      return true;
    }

    if (
      this.props.orderHistory !== nextProps.orderHistory &&
      nextProps.orderHistory != null &&
      nextProps.orderHistory.code === nextProps.currentSymbol.s
    ) {
      this.priceData = nextProps.orderHistory[nextProps.price.toString()];
      return true;
    }

    if (
      this.props.stopOrderHistory !== nextProps.stopOrderHistory &&
      nextProps.stopOrderHistory != null &&
      nextProps.stopOrderHistory.code === nextProps.currentSymbol.s
    ) {
      this.stopPriceData = nextProps.stopOrderHistory[nextProps.price.toString()];
      return true;
    }

    return false;
  }

  private placeOrder = (
    orderKind: ORDER_KIND,
    sellBuyType: SELL_BUY_TYPE,
    hasQuantity: boolean,
    isDisabled: boolean
  ) => {
    if (isDisabled === true) {
      this.props.setCurrentRow(null);
      return;
    }
    if (!hasQuantity || (this.props.currentRow && this.props.currentRow.onEditMode === true)) {
      this.props.setCurrentRow({
        onEditMode: false,
        showModal: true,
        orderKind,
        sellBuyType,
        price: this.props.price,
        promptMode: PROMPT_MODE.PLACE,
        stopPriceData: this.stopPriceData,
      });
    } else {
      let quantity = 0;
      if (orderKind === ORDER_KIND.STOP_ORDER) {
        if (this.stopPriceData && this.stopPriceData[sellBuyType]) {
          quantity = this.stopPriceData[sellBuyType]!.orderQuantity;
        }
      } else if (this.priceData && this.priceData[sellBuyType]) {
        quantity = this.priceData[sellBuyType]!.orderQuantity;
      }
      prevPriceData = this.priceData;
      this.props.setCurrentRow({
        onEditMode: true,
        orderKind,
        sellBuyType,
        orderNo: this.priceData?.[sellBuyType]?.orderNo,
        orderGroupNo: this.priceData?.[sellBuyType]?.orderGroupNo,
        stopOrderId: this.stopPriceData?.stopOrderId! as string,
        quantity,
        price: this.props.price,
        showModal: false,
      });
    }
  };

  private moveOrder = (newPrice: Big, isDisabled?: boolean) => {
    if (isDisabled) {
      this.closeEditMode();
      return;
    }

    if (this.props.currentRow) {
      this.props.setCurrentRow({
        onEditMode: false,
        orderKind: this.props.currentRow.orderKind,
        sellBuyType: this.props.currentRow.sellBuyType,
        price: this.props.currentRow.price,
        orderNo: this.priceData?.[this.props.currentRow.sellBuyType]?.['orderNumber'],
        orderGroupNo: this.priceData?.[this.props.currentRow.sellBuyType]?.['orderGroupID'],
        orderInfo:
          this.priceData?.[this.props.currentRow.sellBuyType]?.['orderInfo'] ||
          prevPriceData?.[this.props.currentRow.sellBuyType]?.['orderInfo'],
        stopOrderId: (this.stopPriceData?.stopOrderId! as string) || this.props.currentRow.stopOrderId,
        newPrice,
        quantity: this.props.currentRow.quantity,
        showModal: true,
        promptMode: PROMPT_MODE.MOVE,
      });
    }
  };

  private cancelOrder = () => {
    if (this.props.currentRow) {
      let quantity = 0;
      if (this.props.currentRow.orderKind === ORDER_KIND.STOP_ORDER) {
        if (this.stopPriceData && this.stopPriceData[this.props.currentRow.sellBuyType]) {
          quantity = this.stopPriceData[this.props.currentRow.sellBuyType]!.orderQuantity;
        }
      } else if (this.priceData && this.priceData[this.props.currentRow.sellBuyType]) {
        quantity = this.priceData[this.props.currentRow.sellBuyType]!.orderQuantity;
      }

      this.props.setCurrentRow({
        onEditMode: false,
        orderKind: this.props.currentRow.orderKind,
        sellBuyType: this.props.currentRow.sellBuyType,
        price: this.props.price,
        orderNo: this.priceData?.[this.props.currentRow.sellBuyType]?.['orderNumber'],
        orderGroupNo: this.priceData?.[this.props.currentRow.sellBuyType]?.['orderGroupID'],
        orderInfo: this.priceData?.[this.props.currentRow.sellBuyType]?.['orderInfo'],
        stopOrderId: this.stopPriceData?.stopOrderId! as string,
        quantity,
        showModal: true,
        promptMode: PROMPT_MODE.CANCEL,
      });
    }
  };

  private closeEditMode = () => {
    if (this.props.currentRow && this.props.currentRow.onEditMode === true) {
      this.props.setCurrentRow(null);
    }
  };

  private renderStopItem = (sellBuyType: SELL_BUY_TYPE) => {
    const { currentRow } = this.props;

    const hasQuantity =
      this.stopPriceData != null &&
      this.stopPriceData[sellBuyType] != null &&
      this.stopPriceData[sellBuyType]!.orderQuantity > 0;

    const disabled =
      this.quote != null &&
      this.quote.c != null &&
      ((this.props.price.cmp(this.quote.c) >= 0 && sellBuyType === SELL_BUY_TYPE.SELL) ||
        (this.props.price.cmp(this.quote.c) <= 0 && sellBuyType === SELL_BUY_TYPE.BUY));
    const disabledOnEditMode =
      currentRow != null &&
      currentRow.onEditMode === true &&
      (currentRow.orderKind !== ORDER_KIND.STOP_ORDER || currentRow.sellBuyType !== sellBuyType);
    const rowStyle = sellBuyType === SELL_BUY_TYPE.SELL ? styles.rowSell : styles.rowBuy;
    const rowTextStopStyle = sellBuyType === SELL_BUY_TYPE.SELL ? styles.rowTextStopSell : styles.rowTextStopBuy;

    const isSelf =
      currentRow != null &&
      currentRow.onEditMode &&
      currentRow.orderKind === ORDER_KIND.STOP_ORDER &&
      currentRow.sellBuyType === sellBuyType &&
      currentRow.price.cmp(this.props.price) === 0;

    return currentRow == null ||
      currentRow.onEditMode === false ||
      currentRow.orderKind !== ORDER_KIND.STOP_ORDER ||
      currentRow.sellBuyType !== sellBuyType ||
      currentRow.price.cmp(this.props.price) === 0 ? (
      <TouchableOpacity
        style={[styles.column, rowStyle, disabled && styles.disabled, isSelf && styles.highlight]}
        activeOpacity={disabledOnEditMode ? 1 : 0.2}
        disabled={(currentRow == null || currentRow.onEditMode === false) && disabled && !hasQuantity}
        onPress={() => this.placeOrder(ORDER_KIND.STOP_ORDER, sellBuyType, hasQuantity, disabledOnEditMode)}
      >
        <UIText allowFontScaling={false} style={rowTextStopStyle}>
          {hasQuantity &&
            !disabled &&
            this.stopPriceData != null &&
            this.stopPriceData[sellBuyType] &&
            formatNumber(this.stopPriceData[sellBuyType]!.orderQuantity)}
        </UIText>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => this.moveOrder(this.props.price, disabled)}
        style={[styles.column, rowStyle, disabled && styles.disabled]}
        activeOpacity={disabled ? 1 : 0.2}
      >
        <UIText allowFontScaling={false} style={styles.rowTextButtonStyle}>
          {!disabled && this.props.t('Move here')}
        </UIText>
      </TouchableOpacity>
    );
  };

  private renderItem = (sellBuyType: SELL_BUY_TYPE) => {
    const { currentRow } = this.props;

    const hasQuantity =
      this.priceData != null && this.priceData[sellBuyType] != null && this.priceData[sellBuyType]!.orderQuantity > 0;

    const rowStyle = sellBuyType === SELL_BUY_TYPE.SELL ? styles.rowSell : styles.rowBuy;
    const rowTextStyle = sellBuyType === SELL_BUY_TYPE.SELL ? styles.rowTextSell : styles.rowTextBuy;
    const disabledOnEditMode =
      currentRow != null &&
      currentRow.onEditMode &&
      (currentRow.orderKind !== ORDER_KIND.NORMAL_ORDER || currentRow.sellBuyType !== sellBuyType);
    const isSelf =
      currentRow != null &&
      currentRow.onEditMode &&
      currentRow.orderKind === ORDER_KIND.NORMAL_ORDER &&
      currentRow.sellBuyType === sellBuyType &&
      currentRow.price.cmp(this.props.price) === 0;

    return currentRow == null ||
      currentRow.onEditMode === false ||
      currentRow.orderKind !== ORDER_KIND.NORMAL_ORDER ||
      currentRow.sellBuyType !== sellBuyType ||
      currentRow.price.cmp(this.props.price) === 0 ? (
      <TouchableOpacity
        style={[styles.column, rowStyle, isSelf && styles.highlight]}
        activeOpacity={disabledOnEditMode ? 1 : 0.2}
        onPress={() => this.placeOrder(ORDER_KIND.NORMAL_ORDER, sellBuyType, hasQuantity, disabledOnEditMode)}
      >
        <UIText allowFontScaling={false} style={rowTextStyle}>
          {hasQuantity &&
            this.priceData[sellBuyType] != null &&
            formatNumber(this.priceData[sellBuyType]!.orderQuantity)}
        </UIText>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => this.moveOrder(this.props.price)} style={[styles.column, rowStyle]}>
        <UIText allowFontScaling={false} style={styles.rowTextButtonStyle}>
          {this.props.t('Move here')}
        </UIText>
      </TouchableOpacity>
    );
  };

  render() {
    const { rowStyle, price, currentRow } = this.props;

    let cancelBtnStyle = null;
    let cancelBtnTriangleStyle = null;

    if (currentRow && currentRow.onEditMode) {
      if (currentRow.sellBuyType === SELL_BUY_TYPE.SELL) {
        cancelBtnTriangleStyle = styles.cancelBtnTriangleLeft;
      } else {
        cancelBtnTriangleStyle = styles.cancelBtnTriangleRight;
      }

      if (currentRow.orderKind === ORDER_KIND.STOP_ORDER) {
        if (currentRow.sellBuyType === SELL_BUY_TYPE.SELL) {
          cancelBtnStyle = styles.leftStop;
        } else {
          cancelBtnStyle = styles.rightStop;
        }
      } else {
        if (currentRow.sellBuyType === SELL_BUY_TYPE.SELL) {
          cancelBtnStyle = styles.leftNormal;
        } else {
          cancelBtnStyle = styles.rightNormal;
        }
      }
    }

    return (
      <View style={rowStyle ? rowStyle : styles.row}>
        {currentRow && currentRow.onEditMode && currentRow.price.cmp(this.props.price) === 0 && (
          <TouchableOpacity style={[styles.cancelBtn, cancelBtnStyle]} onPress={this.cancelOrder}>
            <UIText allowFontScaling={false} style={styles.cancelBtnText}>
              {this.props.t('Cancel')}
            </UIText>
            <View style={cancelBtnTriangleStyle} />
          </TouchableOpacity>
        )}
        {this.renderStopItem(SELL_BUY_TYPE.SELL)}
        {this.renderItem(SELL_BUY_TYPE.SELL)}
        <TouchableWithoutFeedback onPress={this.closeEditMode}>
          <View style={[styles.column, styles.offerQty]}>
            <UIText allowFontScaling={false} style={styles.rowText}>
              {this.bidOffer &&
                this.bidOffer.bo &&
                this.bidOffer.bo[this.props.price.toString()] &&
                formatNumber(this.bidOffer.bo[this.props.price.toString()].v)}
            </UIText>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.closeEditMode}>
          <View
            style={[
              styles.columnBig,
              this.quote != null &&
                this.quote.c != null &&
                (Big(this.quote.c).cmp(price) < 0
                  ? styles.upBackground
                  : Big(this.quote.c).cmp(price) > 0
                  ? styles.downBackground
                  : styles.currentPrice),
            ]}
          >
            <UIText
              allowFontScaling={false}
              style={[
                styles.rowTextPrice,
                this.quote != null &&
                  this.quote.re != null &&
                  (Big(this.quote.re).cmp(price) < 0
                    ? globalStyles.up
                    : Big(this.quote.re).cmp(price) > 0
                    ? globalStyles.down
                    : globalStyles.reference),
              ]}
            >
              {formatNumber(Number(price), 2)}
            </UIText>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.closeEditMode}>
          <View style={[styles.column, styles.bidQty]}>
            <UIText allowFontScaling={false} style={styles.rowText}>
              {this.bidOffer &&
                this.bidOffer.bb &&
                this.bidOffer.bb[this.props.price.toString()] &&
                formatNumber(this.bidOffer.bb[this.props.price.toString()].v)}
            </UIText>
          </View>
        </TouchableWithoutFeedback>
        {this.renderItem(SELL_BUY_TYPE.BUY)}
        {this.renderStopItem(SELL_BUY_TYPE.BUY)}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  quote: state.currentSymbolQuote,
  bidOffer: getBidOfferMap(state),
  currentRow: state.currentRow,
  orderHistory: state.speedOrderHistory,
  stopOrderHistory: state.stopSpeedOrderHistory,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      setCurrentRow,
    })(PriceRow)
  ),
  Fallback,
  handleError
);
