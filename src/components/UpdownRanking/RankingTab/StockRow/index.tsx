import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import { IObject } from 'interfaces/common';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import globalStyle from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IStockRowProps extends React.ClassAttributes<StockRow> {
  data: IObject;
  highlight?: boolean;

  onPress?(code: string): void;
}
class StockRow extends Component<IStockRowProps> {
  private onPress = () => {
    if (this.props.onPress && this.props.data && this.props.data.code) {
      this.props.onPress(this.props.data.code as string);
    }
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={[styles.container, this.props.highlight === true && styles.highlight]}>
          <View style={styles.item}>
            <UIText allowFontScaling={false} style={styles.stockCode}>
              {this.props.data.code}
            </UIText>
          </View>
          <View style={styles.item}>
            <UIText
              allowFontScaling={false}
              style={[
                this.props.data && Number(this.props.data.rate) > 0 && globalStyle.up,
                Number(this.props.data.rate) < 0 && globalStyle.down,
                styles.rate,
              ]}
            >
              {formatNumber(Number(this.props.data.rate), 2, 1, true)}%
            </UIText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withErrorBoundary(StockRow, Fallback, handleError);
