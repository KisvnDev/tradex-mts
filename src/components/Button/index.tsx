import React from 'react';
import { TouchableOpacity, GestureResponderEvent, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import styles from './styles';
import UIText from 'components/UiText';

interface IButtonProps extends React.ClassAttributes<Button>, WithTranslation {
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;

  onPress?(event: GestureResponderEvent): void;
}

class Button extends React.Component<IButtonProps> {
  render() {
    return (
      <TouchableOpacity
        style={[styles.button, this.props.buttonStyle && this.props.buttonStyle]}
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        <UIText allowFontScaling={false} style={[styles.buttonText, this.props.textStyle && this.props.textStyle]}>
          {this.props.t(this.props.title)}
        </UIText>
      </TouchableOpacity>
    );
  }
}

export default withErrorBoundary(withTranslation()(Button), Fallback, handleError);
