import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { withErrorBoundary } from 'react-error-boundary';
import { goToSymbolInfo } from 'navigations';
import { formatNumber, handleError, getColor } from 'utils/common';
import CandleStick from 'components/CandleStick';
import { SymbolMiniChart } from 'components/Charts/MiniChart';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, ISymbolData, IOrderPrice } from 'interfaces/market';
import { setOrderPrice } from 'redux-sagas/global-actions';
import styles from './styles';
import { MARKET_STATUS } from 'global';
// import config from 'config';
// import globalStyles from 'styles';
import UIText from 'components/UiText';

interface ISymbolSubHeaderProps extends React.ClassAttributes<SymbolSubHeader>, WithTranslation {
  currentSymbol: ISymbolInfo;
  buttonLabel?: string;
  buttonDisabled?: boolean;
  icon?: React.ReactNode;
  symbolData: ISymbolData | null;
  symbolBidOfferData: ISymbolData | null;
  parentId?: string;
  componentId: string;
  hideButton?: boolean;

  onPressButton?(symbol: ISymbolInfo): void;

  setOrderPrice(payload: IOrderPrice): void;
}

interface ISymbolSubHeaderState {}

class SymbolSubHeader extends React.Component<ISymbolSubHeaderProps, ISymbolSubHeaderState> {
  private symbolData: ISymbolData;

  constructor(props: ISymbolSubHeaderProps) {
    super(props);

    this.state = {};

    if (global.symbolData[this.props.currentSymbol.s]) {
      this.symbolData = global.symbolData[this.props.currentSymbol!.s];
    }
  }

  shouldComponentUpdate(nextProps: ISymbolSubHeaderProps, nextState: ISymbolSubHeaderState) {
    if (
      this.props.symbolBidOfferData !== nextProps.symbolBidOfferData &&
      nextProps.symbolBidOfferData?.exp &&
      this.symbolData.exp !== nextProps.symbolBidOfferData?.exp
    ) {
      this.symbolData.exp = nextProps.symbolBidOfferData?.exp;
      return true;
    }

    if (
      this.props.symbolData !== nextProps.symbolData &&
      nextProps.symbolData &&
      nextProps.symbolData.s === nextProps.currentSymbol.s
    ) {
      if (this.symbolData != null) {
        this.symbolData.exp = undefined;
      }
      this.symbolData = { ...this.symbolData, ...nextProps.symbolData };
      return true;
    }

    if (
      this.props.currentSymbol !== nextProps.currentSymbol &&
      this.props.currentSymbol.s !== nextProps.currentSymbol.s &&
      global.symbolData[nextProps.currentSymbol.s]
    ) {
      this.symbolData = global.symbolData[nextProps.currentSymbol.s];
      return true;
    }

    return false;
  }

  private goToSymbolInfo = () => {
    switch (this.props.parentId) {
      case 'SymbolInfo':
      case 'SymbolInfoStack':
        Navigation.pop(this.props.componentId);
        break;
      case undefined:
      case 'Market':
      case 'UpDownRankingDetail':
      case 'More':
        goToSymbolInfo(this.props.componentId);
      default:
        break;
    }
  };

  private onPress = () => {
    if (this.props.currentSymbol) {
      if (this.props.onPressButton) {
        this.props.onPressButton(this.props.currentSymbol);
      } else {
        this.goToSymbolInfo();
      }
    }
  };

  private setOrderPrice = () => {
    this.props.setOrderPrice({
      price: this.symbolData.c!,
      symbol: this.props.currentSymbol,
    });
  };

  render() {
    if (!this.symbolData) {
      return <ActivityIndicator />;
    }

    let textColor = getColor(
      this.symbolData?.c as number,
      this.symbolData?.re as number,
      this.symbolData?.ce as number,
      this.symbolData?.fl as number,
      this.symbolData!
    ).textStyle;

    const estimatedTextColor = getColor(
      this.symbolData?.exp as number,
      this.symbolData?.re as number,
      this.symbolData?.ce as number,
      this.symbolData?.fl as number,
      this.symbolData!
    ).textStyle;

    const status = getColor(
      this.symbolData?.c as number,
      this.symbolData?.re as number,
      this.symbolData?.ce as number,
      this.symbolData?.fl as number,
      this.symbolData!
    ).iconType;

    // if (this.symbolData && config.usingNewKisCore) {
    //   if (this.symbolData.ch != null) {
    //     if (this.symbolData.ch < 0) {
    //       textColor = globalStyles.down;
    //     } else if (this.symbolData.ch > 0) {
    //       textColor = globalStyles.up;
    //     } else {
    //       textColor = globalStyles.reference;
    //     }
    //   }
    // }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.left} onPress={this.setOrderPrice}>
          <UIText allowFontScaling={false} style={[styles.closePrice, textColor]}>
            {formatNumber(this.symbolData.c, 2)}
          </UIText>
          <UIText allowFontScaling={false} style={[styles.change, textColor]}>
            {formatNumber(this.symbolData.ch, 2)}{' '}
            {status !== '' && <FontAwesomeIcon style={styles.icon} name={`caret-${status}`} />}(
            {formatNumber(this.symbolData.ra ?? this.symbolData.r, 2)}%)
          </UIText>
        </TouchableOpacity>

        <View style={styles.right}>
          <View style={styles.candleStick}>
            <CandleStick size={1} height={50} data={this.symbolData} />
          </View>

          {(this.symbolData?.ss === MARKET_STATUS.ATO || this.symbolData?.ss === MARKET_STATUS.ATC) &&
          this.symbolData.exp != null ? (
            <View style={styles.estimatedPriceStyle}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <UIText style={{ fontWeight: 'bold', fontSize: 15 }}>Estimated</UIText>
                <UIText allowFontScaling={false} style={[styles.estimatedPriceText, estimatedTextColor]}>
                  {this.symbolData.exp !== 0
                    ? formatNumber(this.symbolData.exp, 1)
                    : formatNumber(this.symbolData.c, 1)}
                </UIText>
              </View>
            </View>
          ) : (
            <View style={styles.chart}>
              <SymbolMiniChart />
            </View>
          )}

          {this.props.hideButton !== true && (
            <TouchableOpacity
              style={[styles.rightButton, this.props.buttonDisabled === true && styles.disabledButton]}
              onPress={this.onPress}
              disabled={this.props.buttonDisabled}
            >
              <View style={styles.buttonContainer}>
                <UIText allowFontScaling={false} style={styles.buttonText}>
                  {this.props.t(this.props.buttonLabel ? this.props.buttonLabel : 'View Detail')}
                </UIText>
                {this.props.icon ? this.props.icon : <FeatherIcon name="external-link" style={styles.buttonIcon} />}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  symbolData: state.currentSymbolQuote,
  symbolBidOfferData: state.currentSymbolBidOffer,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { setOrderPrice })(SymbolSubHeader)),
  Fallback,
  handleError
);
