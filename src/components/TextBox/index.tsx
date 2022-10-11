import React from 'react';
import { View, TouchableOpacity, KeyboardTypeOptions, TextInput, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Tooltip from 'rn-tooltip';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { Colors, width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

export enum TEXTBOX_TYPE {
  TEXT = 'text',
  PASSWORD = 'password',
}

interface ITextBoxProps extends React.ClassAttributes<ITextBoxProps>, WithTranslation {
  type: TEXTBOX_TYPE;
  keyboardType?: KeyboardTypeOptions;
  value?: string;
  label?: string;
  error?: boolean;
  noPointer?: boolean;
  errorContent?: string;
  disabled?: boolean;
  noEditable?: boolean;
  textInputStyle?: StyleProp<TextStyle>;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  autoCorrect?: boolean;
  required?: boolean;
  emphasize?: boolean;
  errorTicking?: boolean;
  labelSectionStyle?: StyleProp<ViewStyle>;
  textBoxInnerIconContainerProps?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelErrorSection?: StyleProp<ViewStyle>;
  maxLength?: number;
  isRestrict?: boolean;
  isShowLabelErrorBottom?: boolean;
  regex?: string;

  onChange?(value: string): void;

  onBlur?(): void;

  onFocus?(): void;

  onPressErrorText?(label: string, value: string): void;
}

interface ITextBoxState extends React.ClassAttributes<TextBox> {
  value?: string;
  secureTextEntry: boolean;
}

class TextBox extends React.Component<ITextBoxProps, ITextBoxState> {
  constructor(props: ITextBoxProps) {
    super(props);
    let value = props.value ? props.value : '';

    this.state = {
      value,
      secureTextEntry: this.props.type === TEXTBOX_TYPE.PASSWORD,
    };
  }

  componentDidUpdate(prevProps: ITextBoxProps) {
    if (this.props.value !== prevProps.value) {
      let value = this.props.value ? this.props.value : '';

      this.setState({
        value,
      });
    }
  }

  private changeSecureTextEntry = () => {
    this.setState({ secureTextEntry: !this.state.secureTextEntry });
  };

  private onPressErrorText = () => {
    this.props.onPressErrorText!(this.props.label!, this.props.value!);
  };

  private onChange = (value: string) => {
    this.setState({
      value,
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  private onBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  private onFocus = () => {
    this.props?.onFocus?.();
  };

  render() {
    const {
      t,
      labelSectionStyle = {},
      containerStyle = {},
      labelErrorSection = {},
      isShowLabelErrorBottom = false,
    } = this.props;

    return (
      <>
        <View style={[styles.container, containerStyle]} pointerEvents={this.props.noPointer ? 'none' : 'auto'}>
          <View style={this.props.emphasize ? styles.emphasizelabelSection : [styles.labelSection, labelSectionStyle]}>
            {this.props.label && (
              <>
                <UIText
                  allowFontScaling={false}
                  style={this.props.emphasize ? styles.emphasizeLabelTextBox : styles.labelTextBox}
                >
                  {t(this.props.label)}
                  {this.props.emphasize && <UIText style={styles.requiredField}>*</UIText>}
                </UIText>
              </>
            )}
            {this.props.onPressErrorText != null && (
              <TouchableOpacity style={styles.labelErrorSection2} onPress={this.onPressErrorText}>
                {this.props.errorTicking === false ? (
                  <UIText allowFontScaling={false} style={styles.labelError2} numberOfLines={1}>
                    {t('Click để báo sai')}
                  </UIText>
                ) : (
                  this.props.errorTicking === true && (
                    <UIText allowFontScaling={false} style={styles.labelError} numberOfLines={1}>
                      {t('x Sai thông tin')}
                    </UIText>
                  )
                )}
              </TouchableOpacity>
            )}

            {!isShowLabelErrorBottom && this.props.error && this.props.errorContent && (
              <View style={[styles.labelErrorSection, labelErrorSection]}>
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
                    <UIText allowFontScaling={false} style={styles.labelError} ellipsizeMode="tail" numberOfLines={1}>
                      {t(this.props.errorContent)}
                    </UIText>
                    <FontAwesomeIcon name="question-circle" style={styles.errorIcon} />
                  </View>
                </Tooltip>
              </View>
            )}
          </View>

          <TextInput
            {...(this.props.autoCorrect != null && { autoCorrect: this.props.autoCorrect })}
            autoCapitalize="none"
            keyboardType={this.props.keyboardType}
            underlineColorAndroid="transparent"
            secureTextEntry={this.state.secureTextEntry}
            multiline={this.props.multiline}
            numberOfLines={this.props.numberOfLines}
            style={[
              styles.textBox,
              this.props.error && styles.textBoxError,
              this.props.required && this.state.value?.trim() === '' && styles.textBoxError,
              this.props.textInputStyle && this.props.textInputStyle,
              this.props.multiline && styles.textMultiple,
              { ...(this.props.disabled === true && { backgroundColor: Colors.GREY }) },
            ]}
            onChangeText={this.onChange}
            {...(this.props.placeholder && { placeholder: t(this.props.placeholder) })}
            value={
              this.props.isRestrict
                ? this.state.value!.replace(this.props.regex || /[^a-zA-Z0-9 ]/g, '')
                : this.state.value
            }
            editable={this.props.disabled === true ? false : !this.props.noEditable}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            maxLength={this.props.maxLength ?? undefined}
          />
          {this.props.type === TEXTBOX_TYPE.PASSWORD && (
            <TouchableOpacity
              style={[styles.textBoxInnerIconContainer, this.props.textBoxInnerIconContainerProps]}
              onPress={this.changeSecureTextEntry}
            >
              <IoniconsIcon
                style={styles.textBoxInnerIcon}
                name={this.state.secureTextEntry === true ? 'md-eye-off' : 'md-eye'}
              />
            </TouchableOpacity>
          )}
        </View>
        {isShowLabelErrorBottom && this.props.error && this.props.errorContent && (
          <View style={[styles.labelErrorSection, labelErrorSection]}>
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
                <UIText allowFontScaling={false} style={styles.labelError} ellipsizeMode="tail" numberOfLines={1}>
                  {t(this.props.errorContent)}
                </UIText>
                <FontAwesomeIcon name="question-circle" style={styles.errorIcon} />
              </View>
            </Tooltip>
          </View>
        )}
      </>
    );
  }
}

export default withErrorBoundary(withTranslation()(TextBox), Fallback, handleError);
