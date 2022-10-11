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
import { Big } from 'big.js';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { withErrorBoundary } from 'react-error-boundary';
import { formatNumber, handleError } from 'utils/common';
import { getPriceStep, roundStep, getFuturesPriceStep } from 'utils/market';
import Fallback from 'components/Fallback';
import { ShowErrorTooltip } from 'components/ErrorTooltip';
import { IState } from 'redux-sagas/reducers';
import { getPriceInput, IPriceInput } from './reducers';
import styles from './styles';
import { SYMBOL_TYPE } from 'global';
import { ISymbolInfo } from 'interfaces/market';
import UIText from 'components/UiText';

interface IPriceInputProps extends React.ClassAttributes<PriceInput>, WithTranslation {
  priceInput: IPriceInput;
  label?: string;
  defaultValue?: number;
  error?: boolean;
  errorContent?: string;
  backgroundButton?: string;
  placeholder?: string;
  disabled?: boolean;
  textInputStyle?: StyleProp<TextStyle>;
  updateOnce?: boolean;
  inputText?: string;

  onBlur?(value: number, init?: boolean): void;

  onChange?(value: number): void;
}

interface IPriceInputState {
  refresh: boolean;
}

class PriceInput extends React.Component<IPriceInputProps, IPriceInputState> {
  private priceStep: number;
  private value: number = 0;
  private tempValue: string = '0';
  private needToUpdate: boolean = false;
  private force: boolean = false;

  constructor(props: IPriceInputProps) {
    super(props);
    if (this.props.priceInput.currentSymbol && this.props.priceInput.isValid) {
      if (this.props.defaultValue != null) {
        this.value = this.props.defaultValue;
      } else {
        this.value = this.props.priceInput.quote!.c!;
      }

      this.updatePriceStep(this.props.priceInput.currentSymbol, this.value);

      this.value = roundStep(this.value, this.priceStep);
      if (this.props.onBlur != null) {
        this.props.onBlur(this.value, true);
      }
    }

    this.tempValue = formatNumber(this.value, 2);

    this.state = {
      refresh: false,
    };
  }

  shouldComponentUpdate(nextProps: IPriceInputProps, nextState: IPriceInputState) {
    if (nextProps.priceInput !== this.props.priceInput) {
      if (this.props.priceInput.isValid !== nextProps.priceInput.isValid && nextProps.priceInput.isValid === true) {
        this.needToUpdate = true;
      }

      if (
        this.props.priceInput.currentSymbol == null ||
        nextProps.priceInput.currentSymbol!.s !== this.props.priceInput.currentSymbol.s
      ) {
        this.force = true;
      }

      if (nextProps.priceInput.isValid === true) {
        if (this.needToUpdate) {
          if (nextProps.defaultValue != null && this.force !== true) {
            this.value = nextProps.defaultValue;
          } else {
            this.value = nextProps.priceInput.quote!.c!;
            this.force = false;
          }

          this.tempValue = formatNumber(this.value, 2);

          this.updatePriceStep(nextProps.priceInput.currentSymbol!, this.value);

          if (this.props.onBlur != null) {
            this.props.onBlur(this.value);
          }

          this.needToUpdate = false;
          return true;
        }

        if (
          nextProps.updateOnce !== true &&
          nextProps.priceInput.orderPrice != null &&
          nextProps.priceInput.orderPrice !== this.props.priceInput.orderPrice
        ) {
          this.value = nextProps.priceInput.orderPrice!.price!;
          this.updatePriceStep(nextProps.priceInput.currentSymbol!, this.value);
          if (this.props.onBlur != null) {
            this.props.onBlur(this.value);
          }

          this.tempValue = formatNumber(this.value, 2);
          return true;
        }
      }
    }

    if (
      this.state.refresh !== nextState.refresh ||
      this.props.error !== nextProps.error ||
      this.props.errorContent !== nextProps.errorContent ||
      this.props.disabled !== nextProps.disabled ||
      this.props.inputText !== nextProps.inputText
    ) {
      return true;
    }

    return false;
  }

  private updatePriceStep = (currentSymbol: ISymbolInfo, value: number) => {
    if (currentSymbol.t !== SYMBOL_TYPE.FUTURES) {
      this.priceStep = getPriceStep(Big(this.value), currentSymbol.m, currentSymbol.t);
    } else {
      this.priceStep = getFuturesPriceStep(currentSymbol.bs);
    }
  };

  private onChangeNumber = (text: string) => {
    try {
      this.tempValue = text;
      this.setState({
        refresh: !this.state.refresh,
      });
    } catch {
      this.tempValue = '0';
      this.value = 0;
    }
  };

  private onBlurNumber = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    let value = Number(this.tempValue.replace(/,/g, ''));
    if (!isNaN(value) && this.props.priceInput.isValid) {
      value = roundStep(value, this.priceStep);

      if (this.value !== value) {
        this.value = value;
        this.tempValue = formatNumber(this.value, 2);
        this.updatePriceStep(this.props.priceInput.currentSymbol!, this.value);
        this.setState({ refresh: !this.state.refresh }, () => {
          if (this.props.onBlur != null) {
            this.props.onBlur(this.value);
          }
        });
      }
    } else {
      this.tempValue = formatNumber(this.value, 2);
      this.setState({ refresh: !this.state.refresh });
    }
  };

  private onDecreasePrice = () => {
    if (this.value > this.priceStep && this.props.priceInput.isValid) {
      this.value -= this.priceStep;
      this.value = roundStep(this.value, this.priceStep, true);
      this.tempValue = formatNumber(this.value, 2);
      this.updatePriceStep(this.props.priceInput.currentSymbol!, this.value);

      this.setState(
        {
          refresh: !this.state.refresh,
        },
        () => {
          if (this.props.onBlur != null) {
            this.props.onBlur(this.value);
          }
        }
      );
    }
  };

  private onIncreasePrice = () => {
    if (this.props.priceInput.isValid) {
      this.value += this.priceStep;
      this.value = roundStep(this.value, this.priceStep);
      this.tempValue = formatNumber(this.value, 2);
      this.updatePriceStep(this.props.priceInput.currentSymbol!, this.value);

      this.setState(
        {
          refresh: !this.state.refresh,
        },
        () => {
          if (this.props.onBlur != null) {
            this.props.onBlur(this.value);
          }
        }
      );
    }
  };

  render() {
    const { t } = this.props;

    return (
      <View style={this.props.disabled && styles.disablePrice}>
        <View style={styles.labelSection}>
          {this.props.label && (
            <UIText allowFontScaling={false} style={styles.labelTextBox}>
              {t(this.props.label)}
            </UIText>
          )}
          <ShowErrorTooltip error={this.props.error} errorContent={this.props.errorContent} />
        </View>
        <View style={styles.textBoxContainer}>
          <TextInput
            keyboardType="number-pad"
            placeholder={this.props.placeholder}
            underlineColorAndroid="transparent"
            style={[
              styles.textBox,
              this.props.error && styles.error,
              this.props.textInputStyle && this.props.textInputStyle,
            ]}
            onEndEditing={this.onBlurNumber}
            onChangeText={this.onChangeNumber}
            value={this.props.inputText != null ? this.props.inputText : this.tempValue}
            editable={this.props.disabled === true ? false : true}
          />

          <TouchableOpacity onPress={this.onDecreasePrice} style={styles.button} disabled={this.props.disabled}>
            <FeatherIcon name="minus" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onIncreasePrice} style={styles.button} disabled={this.props.disabled}>
            <FeatherIcon name="plus" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  priceInput: getPriceInput(state),
});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(PriceInput)), Fallback, handleError);
