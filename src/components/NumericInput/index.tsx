import React from 'react';
import { View, TextInput, StyleProp, TextStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Tooltip from 'rn-tooltip';
import { withErrorBoundary } from 'react-error-boundary';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { Colors, width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface INumericInputProps extends React.ClassAttributes<INumericInputProps>, WithTranslation {
  value?: number;
  label?: string;
  error?: boolean;
  errorContent?: string;
  disabled?: boolean;
  textInputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  placeholder?: string;
  isRow?: boolean;

  onChange?(value: number): void;
}

interface INumericInputState extends React.ClassAttributes<NumericInput> {
  value: number;
}

class NumericInput extends React.Component<INumericInputProps, INumericInputState> {
  constructor(props: INumericInputProps) {
    super(props);
    let value = props.value ? props.value : 0;

    this.state = {
      value,
    };
  }

  componentDidUpdate(prevProps: INumericInputProps) {
    if (this.props.value !== prevProps.value) {
      let value = this.props.value ? this.props.value : 0;

      this.setState({
        value,
      });
    }
  }

  private onChange = (text: string) => {
    text = text.replace(/,/g, '');
    const value = Number(text);

    this.setState({
      value: isNaN(value) ? 0 : value,
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    const { t, isRow, labelStyle } = this.props;

    return (
      <View style={[styles.container, isRow && styles.rowItem]}>
        <View style={!isRow ? styles.labelSection : styles.centerContent}>
          {this.props.label && (
            <UIText allowFontScaling={false} style={[styles.labelTextBox, labelStyle]}>
              {t(this.props.label as string)}
            </UIText>
          )}
          {this.props.error && this.props.errorContent ? (
            <View style={styles.labelErrorSection}>
              <Tooltip
                width={width - 20}
                backgroundColor={Colors.PRIMARY_1}
                popover={
                  <UIText style={styles.popover} allowFontScaling={false} numberOfLines={2}>
                    {t(this.props.errorContent)}{' '}
                  </UIText>
                }
              >
                <View>
                  <UIText
                    allowFontScaling={false}
                    style={[styles.labelError, isRow && styles.labelErrorRow]}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {t(this.props.errorContent)}
                  </UIText>
                  <FontAwesomeIcon name="question-circle" style={styles.errorIcon} />
                </View>
              </Tooltip>
            </View>
          ) : null}
        </View>
        <TextInput
          autoCapitalize="none"
          keyboardType="number-pad"
          underlineColorAndroid="transparent"
          style={[
            styles.textBox,
            this.props.error && styles.textBoxError,
            isRow && styles.rowTextBox,
            this.props.textInputStyle && this.props.textInputStyle,
          ]}
          onChangeText={this.onChange}
          {...(this.props.placeholder && { placeholder: t(this.props.placeholder) })}
          value={formatNumber(this.state.value, 2)}
        />
      </View>
    );
  }
}

export default withErrorBoundary(withTranslation()(NumericInput), Fallback, handleError);
