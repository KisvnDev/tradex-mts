import React from 'react';
import { View, StyleProp, TextStyle } from 'react-native';
import { isArray } from 'lodash';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import {
  widthPercentageToDP,
  listenOrientationChange,
  removeOrientationListener,
} from 'react-native-responsive-screen';
import styles from './styles';
import UIText from 'components/UiText';

interface IRowDataProps extends React.ClassAttributes<RowData>, WithTranslation {
  label: string;
  valueStyle?: StyleProp<TextStyle>;
  value: string | string[];
  translateLabel?: boolean;
  isShowRow?: boolean;
  isLabel?: boolean;
  onPressValue?: () => void;
}

class RowData extends React.Component<IRowDataProps> {
  constructor(props: IRowDataProps) {
    super(props);
  }

  componentDidMount() {
    listenOrientationChange(this);
  }

  componentWillUnMount() {
    removeOrientationListener();
  }
  private renderValue = (value: string, width: number) => {
    const { valueStyle, onPressValue, isLabel } = this.props;

    return (
      <View style={[styles.row2, { width }, isLabel && styles.borderBottom]}>
        <UIText allowFontScaling={false} onPress={onPressValue} style={[styles.data, valueStyle && valueStyle]}>
          {this.props.t(value)}
        </UIText>
      </View>
    );
  };

  render() {
    const { t, label, value, valueStyle, isShowRow = true, isLabel = false, onPressValue } = this.props;

    if (!isShowRow) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={[styles.labelContainer, isLabel && styles.borderBottom, { width: widthPercentageToDP(27) }]}>
          <UIText allowFontScaling={false} style={[styles.label]} numberOfLines={2}>
            {t(label)}
          </UIText>
        </View>
        <View
          style={[
            styles.dataContainer,
            {
              width: widthPercentageToDP(64),
            },
          ]}
        >
          {isArray(value) ? (
            <View style={{ flexDirection: 'row' }}>
              {value.map((item) => this.renderValue(item, widthPercentageToDP(64) / value.length))}
            </View>
          ) : (
            <View style={styles.row2}>
              <UIText allowFontScaling={false} onPress={onPressValue} style={[styles.data, valueStyle && valueStyle]}>
                {value}
              </UIText>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default withErrorBoundary(withTranslation()(RowData), Fallback, handleError);
