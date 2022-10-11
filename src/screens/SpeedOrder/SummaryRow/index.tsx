import React from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { Big } from 'big.js';
import { SELL_BUY_TYPE, ORDER_KIND } from 'global';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { ICurrentRow, PROMPT_MODE } from '../reducers';
import { setCurrentRow } from '../actions';
import styles from './styles';
import UIText from 'components/UiText';

interface ISummaryRowProps extends React.ClassAttributes<SummaryRow>, WithTranslation {
  currentSymbol: ISymbolInfo;
  currentRow: ICurrentRow | null;
  orderHistory: IObject | null;
  stopOrderHistory: IObject | null;

  setCurrentRow(currentRow: ICurrentRow | null): void;

  callCancelAllOrders(currentRow: ICurrentRow): void;
}

interface ISummaryRowState {}

export interface ISummaryData {
  totalBid: number;
  totalOffer: number;
  totalStopBid: number;
  totalStopOffer: number;
}

class SummaryRow extends React.Component<ISummaryRowProps, ISummaryRowState> {
  private summaryData: ISummaryData = {
    totalBid: 0,
    totalOffer: 0,
    totalStopBid: 0,
    totalStopOffer: 0,
  };

  constructor(props: ISummaryRowProps) {
    super(props);

    this.state = {};
  }

  shouldComponentUpdate(nextProps: ISummaryRowProps, nextState: ISummaryRowState) {
    if (this.props.currentSymbol !== nextProps.currentSymbol) {
      return true;
    }

    if (this.props.currentRow == null || this.props.currentRow!.price.cmp(0) === 0) {
      if (
        this.props.currentRow !== nextProps.currentRow &&
        (nextProps.currentRow == null ||
          nextProps.currentRow.onEditMode === true ||
          (nextProps.currentRow.showModal === true && nextProps.currentRow.price.cmp(0) === 0))
      ) {
        return true;
      }
    }

    if (
      this.props.orderHistory !== nextProps.orderHistory &&
      nextProps.orderHistory != null &&
      nextProps.orderHistory.code === nextProps.currentSymbol.s
    ) {
      this.summaryData.totalBid = nextProps.orderHistory.totalBid as number;
      this.summaryData.totalOffer = nextProps.orderHistory.totalOffer as number;
      return true;
    }

    if (
      this.props.stopOrderHistory !== nextProps.stopOrderHistory &&
      nextProps.stopOrderHistory != null &&
      nextProps.stopOrderHistory.code === nextProps.currentSymbol.s
    ) {
      this.summaryData.totalStopBid = nextProps.stopOrderHistory.totalBid as number;
      this.summaryData.totalStopOffer = nextProps.stopOrderHistory.totalOffer as number;
      return true;
    }

    return false;
  }

  private closeEditMode = () => {
    if (this.props.currentRow && this.props.currentRow.onEditMode === true) {
      this.props.setCurrentRow(null);
    }
  };

  private cancelAllOrders = (orderKind: ORDER_KIND, sellBuyType: SELL_BUY_TYPE) => {
    if (this.props.currentRow && this.props.currentRow.onEditMode) {
      this.closeEditMode();
      return;
    }

    this.props.setCurrentRow({
      onEditMode: false,
      orderKind,
      sellBuyType,
      price: Big(0),
      showModal: true,
      promptMode: PROMPT_MODE.CANCEL_ALL,
    });
  };

  render() {
    const { currentRow } = this.props;

    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.column}
          activeOpacity={
            (currentRow && currentRow.onEditMode === true) || this.summaryData.totalStopOffer === 0 ? 1 : 0.2
          }
          onPress={() => {
            if (this.summaryData.totalStopOffer === 0 || this.summaryData.totalStopOffer == null) {
              this.closeEditMode();
            } else {
              this.cancelAllOrders(ORDER_KIND.STOP_ORDER, SELL_BUY_TYPE.SELL);
            }
          }}
        >
          <UIText allowFontScaling={false} style={styles.rowTextSell}>
            {this.summaryData.totalStopOffer ? this.summaryData.totalStopOffer : 0}
          </UIText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.column}
          activeOpacity={(currentRow && currentRow.onEditMode === true) || this.summaryData.totalOffer === 0 ? 1 : 0.2}
          onPress={() => {
            if (this.summaryData.totalOffer === 0 || this.summaryData.totalOffer == null) {
              this.closeEditMode();
            } else {
              this.cancelAllOrders(ORDER_KIND.NORMAL_ORDER, SELL_BUY_TYPE.SELL);
            }
          }}
        >
          <UIText allowFontScaling={false} style={styles.rowTextSell}>
            {this.summaryData.totalOffer ? this.summaryData.totalOffer : 0}
          </UIText>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={this.closeEditMode}>
          <View style={styles.totalOrder}>
            <UIText allowFontScaling={false} style={styles.totalOrderText}>
              {this.props.t('Total Orders')}
            </UIText>
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          style={styles.column}
          activeOpacity={(currentRow && currentRow.onEditMode === true) || this.summaryData.totalBid === 0 ? 1 : 0.2}
          onPress={() => {
            if (this.summaryData.totalBid === 0 || this.summaryData.totalBid == null) {
              this.closeEditMode();
            } else {
              this.cancelAllOrders(ORDER_KIND.NORMAL_ORDER, SELL_BUY_TYPE.BUY);
            }
          }}
        >
          <UIText allowFontScaling={false} style={styles.rowTextBuy}>
            {this.summaryData.totalBid ? this.summaryData.totalBid : 0}
          </UIText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.column}
          activeOpacity={
            (currentRow && currentRow.onEditMode === true) || this.summaryData.totalStopBid === 0 ? 1 : 0.2
          }
          onPress={() => {
            if (this.summaryData.totalStopBid === 0 || this.summaryData.totalStopBid == null) {
              this.closeEditMode();
            } else {
              this.cancelAllOrders(ORDER_KIND.STOP_ORDER, SELL_BUY_TYPE.BUY);
            }
          }}
        >
          <UIText allowFontScaling={false} style={styles.rowTextBuy}>
            {this.summaryData.totalStopBid ? this.summaryData.totalStopBid : 0}
          </UIText>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentRow: state.currentRow,
  currentSymbol: state.currentSymbol,
  orderHistory: state.speedOrderHistory,
  stopOrderHistory: state.stopSpeedOrderHistory,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      setCurrentRow,
    })(SummaryRow)
  ),
  Fallback,
  handleError
);
