import React from 'react';
import { View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import styles from './styles';
import UIText from 'components/UiText';

interface IRowDataProps extends React.ClassAttributes<RowData>, WithTranslation {
  label: string;
  valueStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showIcon?: boolean;
  value: string;
  translateLabel?: boolean;
  isShowRow?: boolean;
  color?: string;

  onPressValue?: () => void;
}

class RowData extends React.Component<IRowDataProps> {
  constructor(props: IRowDataProps) {
    super(props);
  }

  render() {
    const {
      t,
      translateLabel,
      label,
      value,
      showIcon,
      valueStyle,
      isShowRow = true,
      color,
      containerStyle = {},
      labelStyle = {},
      onPressValue,
    } = this.props;

    if (!isShowRow) {
      return null;
    }

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.labelContainer}>
          <UIText allowFontScaling={false} style={[styles.label, labelStyle]}>
            {translateLabel === false ? label : t(label)}
          </UIText>
        </View>
        <View style={styles.dataContainer}>
          <UIText
            allowFontScaling={false}
            onPress={onPressValue}
            style={[styles.data, valueStyle && valueStyle, color ? { color } : {}]}
          >
            {value}
          </UIText>
        </View>
        <View style={styles.iconContainer}>{showIcon && <FeatherIcon style={styles.icon} name="chevron-right" />}</View>
      </View>
    );
  }
}

export default withErrorBoundary(withTranslation()(RowData), Fallback, handleError);
