import React, { Component } from 'react';
import { View } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { ISymbolData } from 'interfaces/market';
import styles from './styles';

interface ICandleStickProps extends React.ClassAttributes<CandleStick> {
  data: ISymbolData;
  size?: number;
  height?: number;
  width?: number;
}

class CandleStick extends Component<ICandleStickProps> {
  static defaultProps = {
    size: 1,
    height: 20,
    width: 8,
  };

  constructor(props: ICandleStickProps) {
    super(props);
  }

  render() {
    const { size, width, height } = this.props;
    const { o, h, l, c } = this.props.data;

    if (o == null || h == null || l == null || c == null) {
      return null;
    }

    let above = 0;
    let below = 0;
    let candleStyle = null;

    const candleWidth = size! * width!;

    if (o > c) {
      above = o;
      below = c;
      candleStyle = styles.down;
    } else {
      above = c;
      below = o;
      candleStyle = styles.up;
    }
    let section1Height = Math.round(((h - above) / (h - l)) * 100);
    let candleHeight = Math.round(((above - below) / (h - l)) * 100);

    if (!isFinite(section1Height)) {
      section1Height = 0;
    }

    if (!isFinite(candleHeight)) {
      candleHeight = 0;
    }

    const section2Height = 100 - section1Height - candleHeight;

    return (
      <View style={{ height: this.props.height }}>
        <View style={[styles.container, { width: candleWidth }]}>
          <View style={[{ height, width: candleWidth }, styles.candleStick]}>
            <View
              style={[
                {
                  flex: 1,
                  width: candleWidth,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                { backgroundColor: 'transparent' },
              ]}
            >
              <View style={[{ flex: section1Height, width: 1 }, candleStyle]} />
              <View style={[{ flex: candleHeight, width: candleWidth }, candleStyle]} />
              <View style={[{ flex: section2Height, width: 1 }, candleStyle]} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default withErrorBoundary(CandleStick, Fallback, handleError);
