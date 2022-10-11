import React from 'react';
import { View, TouchableOpacity, GestureResponderEvent, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { withErrorBoundary } from 'react-error-boundary';
import { goToBiz } from 'navigations';
import CheckBox from 'components/CheckBox';
import CandleStick from 'components/CandleStick';
import Fallback from 'components/Fallback';
import { formatNumber, handleError, getColor } from 'utils/common';
import { IState } from 'redux-sagas/reducers';
import { ISubscribeSymbol, ISymbolData, ISymbolInfo } from 'interfaces/market';
import { setCurrentSymbol, subscribe, unsubscribe } from 'redux-sagas/global-actions';
import globalStyles from 'styles';
import styles from './styles';
import config from 'config';
import UIText from 'components/UiText';

interface ISymbolRowProps extends React.ClassAttributes<SymbolRow>, WithTranslation {
  symbol: ISymbolInfo;
  symbolData: ISymbolData | null;
  initialData?: ISymbolData;
  rowType?: 'Favorite' | 'Order';
  isHighlight?: boolean;
  checked?: boolean;
  index: number;
  parentId: string;
  showTrading?: boolean;
  isDisabledBtn?: boolean;

  onSelectRow?(index: number, checked: boolean): void;

  onPress?(symbol: ISymbolInfo): void;

  onLongPress?(event: GestureResponderEvent): void;

  onPressOut?(event: GestureResponderEvent): void;

  subscribe(payload: ISubscribeSymbol): void;

  unsubscribe(payload: ISubscribeSymbol): void;

  setCurrentSymbol(payload: ISymbolInfo): void;
}

class SymbolRow extends React.Component<ISymbolRowProps> {
  private symbolData?: ISymbolData = this.props.initialData;

  constructor(props: ISymbolRowProps) {
    super(props);

    if (global.symbolData[this.props.symbol.s]) {
      this.symbolData = global.symbolData[this.props.symbol.s];
    }
  }

  componentDidMount(): void {
    if (config.usingNewKisCore) {
      this.symbolData = { ...this.props.symbol };
    }
    this.props.subscribe({
      code: this.props.symbol.s,
      symbolType: this.props.symbol.t,
    });
  }

  componentWillUnmount(): void {
    this.props.unsubscribe({
      code: this.props.symbol.s,
    });
  }

  shouldComponentUpdate(nextProps: ISymbolRowProps) {
    if (this.props.symbol !== nextProps.symbol && this.props.symbol.s !== nextProps.symbol.s) {
      this.symbolData = global.symbolData[nextProps.symbol.s];
      return true;
    }

    if (
      this.props.symbolData !== nextProps.symbolData &&
      nextProps.symbolData &&
      nextProps.symbolData.s === nextProps.symbol.s
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolData };
      return true;
    }

    if (nextProps.checked !== this.props.checked) {
      return true;
    }

    return false;
  }

  private onSelectRow = (checked: boolean) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(this.props.index, checked);
    }
  };

  private onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.symbol);
    }
  };

  private onPressGoToOrder = () => {
    switch (this.props.parentId) {
      case 'UpDownRankingDetail':
      case 'Market':
        this.props.setCurrentSymbol(this.props.symbol);
        goToBiz('Order', {}, this.props.parentId, undefined, 'OrderStack');
        break;
      default:
        break;
    }
  };

  render() {
    const { t, isDisabledBtn = false } = this.props;

    let textColor = getColor(
      this.symbolData?.c as number,
      this.symbolData?.re as number,
      this.symbolData?.ce as number,
      this.symbolData?.fl as number,
      this.symbolData!
    ).textStyle;

    let status = getColor(
      this.symbolData?.c as number,
      this.symbolData?.re as number,
      this.symbolData?.ce as number,
      this.symbolData?.fl as number,
      this.symbolData!
    ).iconType;

    if (this.symbolData && this.symbolData.t === 'INDEX') {
      if (this.symbolData.ch != null) {
        if (this.symbolData.ch < 0) {
          textColor = globalStyles.down;
          status = 'down';
        } else if (this.symbolData.ch > 0) {
          textColor = globalStyles.up;
          status = 'up';
        } else {
          textColor = globalStyles.reference;
          status = '';
        }
      }
    }

    return (
      <TouchableOpacity
        style={[styles.container, styles.fill, this.props.isHighlight === true && styles.highlight]}
        onPress={this.onPress}
        disabled={isDisabledBtn}
      >
        {this.props.rowType === 'Favorite' && (
          <View style={styles.checkBoxSection}>
            <CheckBox checked={this.props.checked} onChange={this.onSelectRow} />
          </View>
        )}
        <View style={this.props.showTrading === true ? styles.fill : styles.symbolCodeSection}>
          <UIText allowFontScaling={false} style={styles.symbolCode}>
            {this.props.symbol.s}
          </UIText>
        </View>
        {this.symbolData ? (
          <View style={[styles.dataContainer, { ...(this.props.rowType === 'Order' && styles.rowDataHeight) }]}>
            <View style={styles.priceSection}>
              <UIText
                allowFontScaling={false}
                style={[styles.price, textColor, this.props.showTrading === true && styles.rankingPrice]}
              >
                {formatNumber(this.symbolData.c, 2)}
              </UIText>
              {this.props.showTrading !== true && (
                <UIText allowFontScaling={false} style={styles.tradingVolume}>
                  {formatNumber(this.symbolData.vo)}
                </UIText>
              )}
            </View>
            <View style={[styles.changeSection, this.props.showTrading === true && styles.rankingChange]}>
              <View style={styles.content}>
                {status !== '' && (
                  <View style={styles.fill}>
                    <FontAwesomeIcon style={[styles.caretIcon, textColor]} name={`caret-${status}`} />
                  </View>
                )}

                <View style={[styles.fill, this.props.showTrading === true && styles.rankingChangeData]}>
                  <UIText allowFontScaling={false} style={[styles.change, textColor]}>
                    {formatNumber(this.symbolData.ch, 2)}
                  </UIText>
                  <UIText allowFontScaling={false} style={[styles.change, textColor]}>
                    {formatNumber(this.symbolData.ra ?? this.symbolData.r, 2)}%
                  </UIText>
                </View>
              </View>
            </View>
            {this.props.showTrading === true && (
              <View style={styles.tradingSection}>
                <View style={styles.fill}>
                  <UIText allowFontScaling={false} style={[styles.tradingSectionLabel]}>
                    {formatNumber(this.symbolData.vo ?? this.symbolData.tv)}
                  </UIText>
                </View>
              </View>
            )}
            {this.props.rowType === 'Order' && (
              <View style={styles.candleStick}>
                <CandleStick size={1} height={35} data={this.symbolData} />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.dataContainer}>
            <ActivityIndicator />
          </View>
        )}
        {this.props.rowType === 'Order' ? (
          <TouchableOpacity
            style={[styles.buttonSection, (global.viewMode === true || isDisabledBtn) && styles.buttonDisabled]}
            onPress={this.onPressGoToOrder}
            disabled={global.viewMode || isDisabledBtn}
          >
            <UIText allowFontScaling={false} style={styles.orderButtonText}>
              {t('Order')}
            </UIText>
          </TouchableOpacity>
        ) : (
          this.props.rowType === 'Favorite' && (
            <TouchableOpacity
              style={[styles.buttonSection]}
              onLongPress={this.props.onLongPress}
              onPressOut={this.props.onPressOut}
            >
              <FontAwesomeIcon style={styles.iconReorder} name="reorder" />
            </TouchableOpacity>
          )
        )}
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  symbolData: state.symbolData,
});

const mapDispatchToProps = {
  subscribe,
  unsubscribe,
  setCurrentSymbol,
};

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SymbolRow)),
  Fallback,
  handleError
);
