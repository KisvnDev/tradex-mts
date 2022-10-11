import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { withErrorBoundary } from 'react-error-boundary';
import { formatNumber, handleError } from 'utils/common';
import CandleStick from 'components/CandleStick';
import { IndexMiniChart } from 'components/Charts/MiniChart';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, ISymbolData } from 'interfaces/market';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IIndexHeaderProps extends React.ClassAttributes<IndexHeader>, WithTranslation {
  componentId: string;
  currentIndex: ISymbolInfo;
  symbolData: ISymbolData | null;
  buttonLabel?: string;
  icon?: React.ReactNode;
  hideButton?: boolean;
}

class IndexHeader extends React.Component<IIndexHeaderProps> {
  private symbolData: ISymbolData;

  constructor(props: IIndexHeaderProps) {
    super(props);

    if (this.props.currentIndex && global.symbolData[this.props.currentIndex.s]) {
      this.symbolData = global.symbolData[this.props.currentIndex!.s];
    }
  }

  shouldComponentUpdate(nextProps: IIndexHeaderProps) {
    if (
      this.props.symbolData !== nextProps.symbolData &&
      nextProps.symbolData &&
      nextProps.currentIndex &&
      nextProps.symbolData.s === nextProps.currentIndex.s
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolData };
      return true;
    }

    if (
      this.props.currentIndex !== nextProps.currentIndex &&
      this.props.currentIndex &&
      nextProps.currentIndex &&
      this.props.currentIndex.s !== nextProps.currentIndex.s &&
      global.symbolData[nextProps.currentIndex.s]
    ) {
      this.symbolData = global.symbolData[nextProps.currentIndex.s];
      return true;
    }

    return false;
  }

  private onPress = () => {};

  render() {
    let status = 'steady';

    if (this.symbolData) {
      if (this.symbolData.ch) {
        if (this.symbolData.ch < 0) {
          status = 'down';
        } else if (this.symbolData.ch > 0) {
          status = 'up';
        }
      }
    } else {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <TouchableOpacity style={styles.left}>
            <UIText allowFontScaling={false} style={[styles.closePrice, globalStyles[status]]}>
              {formatNumber(this.symbolData.c, 2)}
            </UIText>
            <UIText allowFontScaling={false} style={[styles.change, globalStyles[status]]}>
              {formatNumber(this.symbolData.ch, 2)}{' '}
              {status !== 'steady' && <FontAwesomeIcon style={styles.icon} name={`caret-${status}`} />}(
              {formatNumber(this.symbolData.ra, 2)}%)
            </UIText>
          </TouchableOpacity>
          <View style={styles.candleStick}>
            <CandleStick size={1} height={50} data={this.symbolData} />
          </View>

          <View style={styles.right}>
            <View style={styles.chart}>
              <IndexMiniChart />
            </View>
            {this.props.hideButton !== true && (
              <TouchableOpacity style={styles.rightButton} onPress={this.onPress}>
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
        <View style={styles.changeSection}>
          <View style={styles.changeSectionLeft}>
            <View style={styles.item}>
              <UIText allowFontScaling={false}>
                <EntypoIcon style={styles.iconUp} name="arrow-up" />
                {this.symbolData.ic && formatNumber(this.symbolData.ic.ce)}
              </UIText>
            </View>
            <View style={styles.item}>
              <UIText allowFontScaling={false}>
                <FontAwesomeIcon style={styles.iconUp} name="caret-up" />
                {this.symbolData.ic && formatNumber(this.symbolData.ic.up)}
              </UIText>
            </View>
          </View>
          <View style={styles.rec}>
            <View style={styles.recLeft} />
            <View style={styles.recRight} />
            <View style={styles.center}>
              <UIText allowFontScaling={false}>{this.symbolData.ic && formatNumber(this.symbolData.ic.uc)}</UIText>
            </View>
          </View>
          <View style={styles.changeSectionRight}>
            <View style={styles.item}>
              <UIText allowFontScaling={false}>
                <FontAwesomeIcon style={styles.iconDown} name="caret-down" />
                {this.symbolData.ic && formatNumber(this.symbolData.ic.dw)}
              </UIText>
            </View>
            <View style={styles.item}>
              <UIText allowFontScaling={false}>
                <EntypoIcon style={styles.iconDown} name="arrow-down" />
                {this.symbolData.ic && formatNumber(this.symbolData.ic.fl)}
              </UIText>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentIndex: state.currentIndex,
  symbolData: state.currentIndexQuote,
});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(IndexHeader)), Fallback, handleError);
