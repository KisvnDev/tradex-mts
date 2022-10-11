import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Tooltip from 'rn-tooltip';
import { Colors, width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IErrorTooltipProps extends React.ClassAttributes<ErrorTooltip>, WithTranslation {
  errorContent?: string;
  error?: boolean;
  tooltipStyle?: StyleProp<ViewStyle>;
  labelErrorStyle?: StyleProp<ViewStyle>;
}

interface IErrorTooltipState {}

class ErrorTooltip extends React.Component<IErrorTooltipProps, IErrorTooltipState> {
  shouldComponentUpdate(nextProps: IErrorTooltipProps) {
    if (this.props.errorContent !== nextProps.errorContent || this.props.error !== nextProps.error) {
      return true;
    }

    return false;
  }

  render() {
    const { t, error, errorContent, tooltipStyle = {}, labelErrorStyle = {} } = this.props;

    if (error && errorContent) {
      return (
        <View style={styles.container}>
          <Tooltip
            width={width - 20}
            backgroundColor={Colors.PRIMARY_1}
            popover={
              <UIText style={[styles.tooltip, tooltipStyle]} allowFontScaling={false} numberOfLines={2}>
                {t(errorContent)}{' '}
              </UIText>
            }
          >
            <View style={styles.labelErrorSection}>
              <UIText
                allowFontScaling={false}
                style={[styles.labelError, labelErrorStyle]}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {t(errorContent)}
              </UIText>
              <FontAwesomeIcon name="question-circle" style={[styles.errorIcon]} />
            </View>
          </Tooltip>
        </View>
      );
    }

    return null;
  }
}

export const ShowErrorTooltip = withTranslation()(ErrorTooltip);
