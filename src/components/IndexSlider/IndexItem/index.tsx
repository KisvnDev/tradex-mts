import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { withErrorBoundary } from 'react-error-boundary';
import { goToIndexInfo } from 'navigations';
import { formatNumber } from 'utils/common';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, ISubscribeSymbol, ISymbolData } from 'interfaces/market';
import { LANG, SYMBOL_TYPE } from 'global';
import { setCurrentIndex, subscribe, unsubscribe } from 'redux-sagas/global-actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IIndexItemProps extends React.ClassAttributes<IndexItem> {
  data: ISymbolInfo;
  symbolData: ISymbolData | null;

  setCurrentIndex(payload: ISymbolInfo): void;

  subscribe(payload: ISubscribeSymbol): void;

  unsubscribe(payload: ISubscribeSymbol): void;
}

class IndexItem extends React.Component<IIndexItemProps> {
  private symbolData: ISymbolData;

  constructor(props: IIndexItemProps) {
    super(props);

    if (global.symbolData[this.props.data.s]) {
      this.symbolData = global.symbolData[this.props.data.s];
    }
  }

  componentDidMount() {
    this.props.subscribe({
      code: this.props.data.s,
      symbolType: SYMBOL_TYPE.INDEX,
    });
  }

  componentWillUnmount() {
    this.props.unsubscribe({
      code: this.props.data.s,
    });
  }

  shouldComponentUpdate(nextProps: IIndexItemProps) {
    if (
      this.props.symbolData !== nextProps.symbolData &&
      nextProps.symbolData &&
      nextProps.symbolData.s === nextProps.data.s
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolData };
      return true;
    }
    return false;
  }

  private goToSymbolInfo = () => {
    this.props.setCurrentIndex(this.props.data);
    goToIndexInfo('Market');
  };

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
    }

    return (
      <TouchableOpacity onPress={this.goToSymbolInfo}>
        <View style={styles.container}>
          <UIText allowFontScaling={false} style={styles.indexCode}>
            {global.lang === LANG.VI ? this.props.data.n1 : this.props.data.n2}
          </UIText>
          <UIText
            allowFontScaling={false}
            style={[
              styles.indexValue,
              status === 'steady' ? globalStyles.reference : status === 'up' ? globalStyles.up : globalStyles.down,
            ]}
          >
            {this.symbolData && formatNumber(this.symbolData.c, 2)}
          </UIText>
          {this.symbolData ? (
            status === 'up' ? (
              <UIText allowFontScaling={false} style={[styles.indexChange, globalStyles.up]}>
                {formatNumber(this.symbolData.ch, 2)} <FontAwesomeIcon name="caret-up" /> +
                {formatNumber(this.symbolData.ra, 2)}%
              </UIText>
            ) : status === 'down' ? (
              <UIText allowFontScaling={false} style={[styles.indexChange, globalStyles.down]}>
                {formatNumber(this.symbolData.ch, 2)} <FontAwesomeIcon name="caret-down" />{' '}
                {formatNumber(this.symbolData.ra, 2)}%
              </UIText>
            ) : (
              <UIText allowFontScaling={false} style={[styles.indexChange, globalStyles.reference]}>
                {formatNumber(this.symbolData.ch, 2)} {formatNumber(this.symbolData.ra, 2)}%
              </UIText>
            )
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  symbolData: state.symbolData,
});

export default withErrorBoundary(
  connect(mapStateToProps, {
    subscribe,
    unsubscribe,
    setCurrentIndex,
  })(IndexItem),
  Fallback,
  handleError
);
