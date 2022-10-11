import React from 'react';
import {
  View,
  TextInput,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Tooltip from 'rn-tooltip';
import config from 'config';
import ErrorBoundary from 'react-error-boundary';
import { formatNumber, handleError } from 'utils/common';
import { roundLot, getOrderLot } from 'utils/market';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo } from 'interfaces/market';
import { width, Colors } from 'styles';
import styles from './styles';
import { INPUT_QUANTIY_ID_KEY } from 'global';
import UIText from 'components/UiText';

interface IQuantityInputProps extends React.ClassAttributes<QuantityInput>, WithTranslation {
  currentSymbol: ISymbolInfo | null;
  label?: string;
  defaultValue?: number;
  error?: boolean;
  errorContent?: string;
  backgroundButton?: string;
  placeholder?: string;
  disabled?: boolean;
  textInputStyle?: StyleProp<TextStyle>;
  reverse?: boolean;
  isOddlotOrder?: boolean;

  onBlur?(): void;

  onFocus?(): void;

  onEndEditing?(value: number): void;

  onChange?(value: number): void;
}

interface IQuantityInputState {}

export class QuantityInput extends React.Component<IQuantityInputProps, IQuantityInputState> {
  private orderLot: number;
  private value: number;
  private updated = false;
  private readonly MAX_VALUE_ODDLOT = 99;

  constructor(props: IQuantityInputProps) {
    super(props);

    if (this.props.currentSymbol) {
      this.orderLot =
        this.props.isOddlotOrder === true ? 1 : getOrderLot(this.props.currentSymbol.m, this.props.currentSymbol.t);
      this.value =
        this.props.isOddlotOrder === true
          ? props.defaultValue
            ? props.defaultValue > this.MAX_VALUE_ODDLOT
              ? this.MAX_VALUE_ODDLOT
              : props.defaultValue
            : 0
          : roundLot(
              props.defaultValue ? props.defaultValue : 0,
              this.props.currentSymbol.m,
              this.props.currentSymbol.t,
              this.props.reverse
            );
    }
  }

  shouldComponentUpdate(nextProps: IQuantityInputProps) {
    if (nextProps.currentSymbol !== this.props.currentSymbol && nextProps.currentSymbol != null) {
      this.orderLot =
        this.props.isOddlotOrder === true && config.usingNewKisCore
          ? 1
          : getOrderLot(nextProps.currentSymbol.m, nextProps.currentSymbol.t);
      this.value =
        this.props.isOddlotOrder === true
          ? this.value
          : roundLot(this.value, nextProps.currentSymbol.m, nextProps.currentSymbol.t, this.props.reverse);
    }

    return true;
  }

  componentDidUpdate(prevProps: IQuantityInputProps) {
    if (this.props.isOddlotOrder !== prevProps.isOddlotOrder && this.props.currentSymbol) {
      this.orderLot =
        this.props.isOddlotOrder === true && config.usingNewKisCore
          ? 1
          : getOrderLot(this.props.currentSymbol.m, this.props.currentSymbol.t);
      const quantity: number = this.value > this.MAX_VALUE_ODDLOT ? this.MAX_VALUE_ODDLOT : this.value;

      this.props.isOddlotOrder && this.onChangeNumber(`${quantity}`);
    }
  }

  private onChangeNumber = (text: string) => {
    try {
      let value = Number(text.replace(/,/g, ''));

      if (this.props.isOddlotOrder) {
        value > this.MAX_VALUE_ODDLOT && (value = this.MAX_VALUE_ODDLOT);
      }

      if (!isNaN(value)) {
        if (this.value !== value) {
          this.value = value;
          this.setState({}, () => {
            if (this.props.onEndEditing != null) {
              this.props.onEndEditing(this.value);
            }
          });
        }
      }
    } catch {
      this.value = 0;
      this.setState({}, () => {
        if (this.props.onEndEditing != null) {
          this.props.onEndEditing(this.value);
        }
      });
    }
  };

  private onEndEditingNumber = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    if (this.updated === true) {
      this.updated = false;
      return;
    }
    let value = Number(e.nativeEvent.text.replace(/,/g, ''));

    if (!isNaN(value) && this.props.currentSymbol) {
      value =
        this.props.isOddlotOrder === true
          ? value
          : roundLot(value, this.props.currentSymbol.m, this.props.currentSymbol.t, this.props.reverse);

      if (this.value !== value) {
        this.value = value;
        this.setState({}, () => {
          if (this.props.onEndEditing != null) {
            this.props.onEndEditing(this.value);
          }
        });
      }
    }
  };

  private onDecreaseQuantity = () => {
    if (this.value > this.orderLot && this.props.currentSymbol) {
      this.value -= this.orderLot;
      this.value =
        this.props.isOddlotOrder === true
          ? this.value
          : roundLot(this.value, this.props.currentSymbol.m, this.props.currentSymbol.t, this.props.reverse);
      this.setState({}, () => {
        if (this.props.onEndEditing != null) {
          this.props.onEndEditing(this.value);
        }
      });
    }
  };

  private onIncreaseQuantity = () => {
    if (this.props.currentSymbol) {
      this.value += this.orderLot;
      this.value = this.value > this.MAX_VALUE_ODDLOT && this.props.isOddlotOrder ? this.MAX_VALUE_ODDLOT : this.value;
      this.value =
        this.props.isOddlotOrder === true
          ? this.value
          : roundLot(this.value, this.props.currentSymbol.m, this.props.currentSymbol.t, this.props.reverse);

      this.setState({}, () => {
        if (this.props.onEndEditing != null) {
          this.props.onEndEditing(this.value);
        }
      });
    }
  };

  setQuantity = (value: number) => {
    if (this.props.currentSymbol && this.props.disabled !== true) {
      this.updated = true;
      this.value = value;
      this.value =
        this.props.isOddlotOrder === true
          ? this.value
          : roundLot(this.value, this.props.currentSymbol.m, this.props.currentSymbol.t, this.props.reverse);

      this.setState({}, () => {
        if (this.props.onEndEditing != null) {
          this.props.onEndEditing(this.value);
        }
      });
    }
  };

  render() {
    const { t } = this.props;

    return (
      <ErrorBoundary FallbackComponent={Fallback} onError={handleError}>
        <View>
          <View style={styles.labelSection}>
            {this.props.label && (
              <UIText allowFontScaling={false} style={styles.labelTextBox}>
                {t(this.props.label)}
              </UIText>
            )}
            {this.props.error && this.props.errorContent != null && (
              <View style={styles.labelErrorSection}>
                <Tooltip
                  width={width - 20}
                  backgroundColor={Colors.PRIMARY_1}
                  popover={
                    <UIText style={styles.tooltip} allowFontScaling={false} numberOfLines={2}>
                      {t(this.props.errorContent)}{' '}
                    </UIText>
                  }
                >
                  <View>
                    <UIText allowFontScaling={false} style={styles.labelError} ellipsizeMode="tail" numberOfLines={1}>
                      {t(this.props.errorContent)}
                    </UIText>
                    <FontAwesomeIcon name="question-circle" style={[styles.errorIcon]} />
                  </View>
                </Tooltip>
              </View>
            )}
          </View>
          <View style={styles.textBoxContainer}>
            <TextInput
              keyboardType="number-pad"
              placeholder={this.props.placeholder}
              underlineColorAndroid="transparent"
              inputAccessoryViewID={INPUT_QUANTIY_ID_KEY}
              style={[
                styles.textBox,
                this.props.error && styles.error,
                this.props.textInputStyle && this.props.textInputStyle,
              ]}
              onEndEditing={this.onEndEditingNumber}
              onChangeText={this.onChangeNumber}
              onBlur={this.props.onBlur}
              onFocus={this.props.onFocus}
              value={formatNumber(this.value)}
              editable={this.props.disabled === true ? false : true}
            />

            <TouchableOpacity onPress={this.onDecreaseQuantity} style={styles.button} disabled={this.props.disabled}>
              <FeatherIcon name="minus" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onIncreaseQuantity} style={styles.button} disabled={this.props.disabled}>
              <FeatherIcon name="plus" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
});

export default withTranslation(undefined, { withRef: true })(
  connect(mapStateToProps, null, null, { forwardRef: true })(QuantityInput)
);
