import React from 'react';
import { View, TextInput, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Slider from 'react-native-slider';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Big } from 'big.js';
import { formatNumber } from 'utils/common';
import { getPriceStep } from 'utils/market';
import { SYMBOL_TYPE, ALARMS_NOTIFICATION_OPTION_LIST, ALARMS_NOTIFICATION_METHODS } from 'global';
import UserInactivity from 'components/UserInactivity';
import SymbolHeader from 'components/SymbolHeader';
import IndexHeader from 'components/IndexHeader';
import Button from 'components/Button';
import Picker from 'components/Picker';
import { ShowErrorTooltip } from 'components/ErrorTooltip';
import { IState } from 'redux-sagas/reducers';
import { ISymbolData, ISymbolInfo } from 'interfaces/market';
import { IAlarm } from 'interfaces/common';
import { updateAlarmSetting, addAlarmSetting } from './actions';
import { Colors } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IAlarmDetailProps extends React.ClassAttributes<AlarmDetail>, WithTranslation {
  componentId: string;
  parentId?: string;
  currentSymbol: ISymbolInfo | null;
  symbolData: ISymbolData | null;
  data?: IAlarm;

  updateAlarmSetting(params: IAlarm): void;

  addAlarmSetting(params: IAlarm): void;
}

interface IAlarmDetailState {
  errorPrice?: boolean;
  errorPriceContent?: string;
  errorRate?: boolean;
  errorRateContent?: string;
}

class AlarmDetail extends React.Component<IAlarmDetailProps, IAlarmDetailState> {
  private data: IAlarm;
  private priceInput: TextInput;
  private rateInput: TextInput;
  private price = 0;
  private rate = 0;
  private symbolData: ISymbolData;
  private refSlider: typeof Slider;

  constructor(props: IAlarmDetailProps) {
    super(props);
    Navigation.events().bindComponent(this);

    this.state = {};

    if (this.props.currentSymbol && global.symbolData[this.props.currentSymbol.s]) {
      this.symbolData = global.symbolData[this.props.currentSymbol.s];
    }

    if (this.props.data) {
      this.data = this.props.data;
      this.price = this.data.value;
      if (this.symbolData != null && this.symbolData.c != null) {
        this.rate = ((this.price - this.symbolData.c) / this.symbolData.c) * 100;
      }
    } else if (this.props.currentSymbol) {
      this.data = {
        value: this.symbolData && this.symbolData.c != null ? this.symbolData.c : 0,
        code: this.props.currentSymbol.s,
        type: this.props.currentSymbol.t,
        option: ALARMS_NOTIFICATION_OPTION_LIST[0].value,
        notificationMethod: ALARMS_NOTIFICATION_METHODS[0].value,
      };

      this.price = this.data.value;
      this.rate = 0;
    }
  }

  componentDidMount() {
    this.updateTopBar();
  }

  shouldComponentUpdate(nextProps: IAlarmDetailProps, nextState: IAlarmDetailState) {
    if (this.props.currentSymbol !== nextProps.currentSymbol) {
      this.updateTopBar();
    }

    if (
      this.props.symbolData !== nextProps.symbolData &&
      nextProps.symbolData &&
      nextProps.currentSymbol &&
      nextProps.symbolData.s === nextProps.currentSymbol.s
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolData };
      if (this.data == null) {
        this.data = {
          value: this.symbolData && this.symbolData.c != null ? this.symbolData.c : 0,
          code: nextProps.currentSymbol.s,
          type: nextProps.currentSymbol.t,
          option: ALARMS_NOTIFICATION_OPTION_LIST[0].value,
          notificationMethod: ALARMS_NOTIFICATION_METHODS[0].value,
        };
      } else if (this.data.value === 0 && this.symbolData && this.symbolData.c != null) {
        this.data.value = this.symbolData.c;
      }

      this.price = this.data.value;
      if (this.symbolData && this.symbolData.c != null && this.symbolData.c > 0) {
        this.rate = ((this.price - this.symbolData.c) / this.symbolData.c) * 100;
      }

      return true;
    }

    if (
      this.state.errorPrice !== nextState.errorPrice ||
      this.state.errorPriceContent !== nextState.errorPriceContent ||
      this.state.errorRate !== nextState.errorRate ||
      this.state.errorRateContent !== nextState.errorRateContent
    ) {
      return true;
    }

    return false;
  }

  private updateTopBar = () => {
    const title = this.props.data ? this.props.t('Update Alarm') : this.props.t('Add New Alarm');

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: this.props.currentSymbol ? `${title} (${this.props.currentSymbol.s})` : title,
        },
      },
    });
  };

  private onChangePrice = (priceTemp: string) => {
    priceTemp = priceTemp.toString().replace(',', '');
    const price = Number(priceTemp);

    let errorPrice = false;
    let errorPriceContent = '';

    if (!isNaN(price)) {
      if (price <= 0) {
        errorPrice = true;
        errorPriceContent = 'Price must be greater than 0';
      } else if (this.symbolData != null && this.symbolData.c != null) {
        let rateTemp = this.rate;
        rateTemp = ((price - this.symbolData.c) / this.symbolData.c) * 100;
        errorPrice = false;
        errorPriceContent = '';

        this.refSlider?._setCurrentValue(price);
        this.price = price;
        this.rate = rateTemp;
      }
    } else {
      errorPrice = true;
      errorPriceContent = 'Price must be a number';
    }
    this.setState({
      errorPrice,
      errorPriceContent,
    });
  };

  private onChangeRate = (rateTemp: string) => {
    rateTemp = rateTemp.toString().replace(',', '');
    const rate = Number(rateTemp);

    let errorRate = false;
    let errorRateContent = '';

    if (!isNaN(rate)) {
      if (this.symbolData != null && this.symbolData.c != null) {
        let priceTemp = this.price;
        priceTemp = this.symbolData.c + (this.symbolData.c * rate) / 100;

        errorRate = false;
        errorRateContent = '';

        this.refSlider?._setCurrentValue(priceTemp);
        this.price = priceTemp;
        this.rate = rate;
      }
    } else {
      errorRate = true;
      errorRateContent = 'Rate must be a number';
    }

    this.setState({
      errorRate,
      errorRateContent,
    });
  };

  private updatePrice = () => {
    this.rateInput.setNativeProps({ text: formatNumber(this.rate, 2) });
    this.priceInput.setNativeProps({ text: formatNumber(this.price, 2) });
  };

  private onSlideChange = (value: number) => {
    this.price = value;
    if (this.symbolData != null && this.symbolData.c != null) {
      this.rate = ((this.price - this.symbolData.c) / this.symbolData.c) * 100;
    }
    this.updatePrice();
  };

  private setOption = (index: number, value: string) => {
    this.data.option = value;
  };

  private validatePrice = () => {
    let errorPrice = false;
    let errorPriceContent = '';

    if (!isNaN(this.price)) {
      if (this.price <= 0) {
        errorPriceContent = 'Price must be greater than 0';
        errorPrice = true;
      }
    } else {
      errorPriceContent = 'Price must be number';
      errorPrice = true;
    }

    return { errorPrice, errorPriceContent };
  };

  private submitAlarm = () => {
    const { errorPrice, errorPriceContent } = this.validatePrice();
    if (errorPrice === true) {
      this.setState({
        errorPrice,
        errorPriceContent,
      });
      return;
    } else {
      this.data.value = this.price;
      this.data.alarmId = this.data.id;
      this.data.currentValue = this.symbolData.c;
      if (this.props.data) {
        this.props.updateAlarmSetting(this.data);
      } else {
        this.props.addAlarmSetting(this.data);
      }
    }
  };

  render() {
    const { t } = this.props;

    return (
      <UserInactivity>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, flex: 1 }} keyboardShouldPersistTaps="handled">
          <ScrollView style={styles.container}>
            {this.props.currentSymbol && this.props.currentSymbol.t !== SYMBOL_TYPE.INDEX ? (
              <SymbolHeader componentId={this.props.componentId} parentId={this.props.parentId} hideButton={true} />
            ) : (
              <IndexHeader componentId={this.props.componentId} hideButton={true} />
            )}
            <View style={styles.inputSection}>
              <View style={styles.priceInput}>
                <View style={styles.inputItem}>
                  <View style={styles.textBoxContainer}>
                    <View style={styles.labelSection}>
                      <UIText allowFontScaling={false} style={styles.labelTextBox}>
                        {t('Price')}
                      </UIText>
                      <ShowErrorTooltip error={this.state.errorPrice} errorContent={this.state.errorPriceContent} />
                    </View>

                    <TextInput
                      keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'number-pad'}
                      ref={(component: TextInput) => (this.priceInput = component)}
                      underlineColorAndroid="transparent"
                      style={[styles.textBox, styles.textBoxNumber, this.state.errorPrice && styles.errorTextBox]}
                      onChangeText={this.onChangePrice}
                      onEndEditing={this.updatePrice}
                      defaultValue={`${formatNumber(this.price, 2)}`}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View style={styles.inputItem}>
                  <View style={styles.textBoxContainer}>
                    <View style={styles.labelSection}>
                      <UIText allowFontScaling={false} style={styles.labelTextBox} numberOfLines={1}>
                        {t('Change Rate')} (%)
                      </UIText>
                      <ShowErrorTooltip error={this.state.errorRate} errorContent={this.state.errorRateContent} />
                    </View>

                    <TextInput
                      keyboardType="number-pad"
                      ref={(component: TextInput) => (this.rateInput = component)}
                      underlineColorAndroid="transparent"
                      style={[styles.textBox, styles.textBoxNumber, this.state.errorRate && styles.errorTextBox]}
                      onChangeText={this.onChangeRate}
                      onEndEditing={this.updatePrice}
                      defaultValue={`${formatNumber(this.rate, 2)}`}
                    />
                  </View>
                </View>
              </View>
              {this.props.currentSymbol && this.symbolData && this.symbolData.c != null ? (
                <View style={styles.sliderInput}>
                  <UIText allowFontScaling={false} style={styles.minValue}>
                    0
                  </UIText>
                  <Slider
                    ref={(component: typeof Slider) => (this.refSlider = component)}
                    maximumValue={this.symbolData.c * 2}
                    value={this.price}
                    step={
                      this.props.currentSymbol.t !== SYMBOL_TYPE.INDEX
                        ? getPriceStep(Big(this.price), this.props.currentSymbol.m, this.props.currentSymbol.t)
                        : 0.1
                    }
                    onValueChange={this.onSlideChange}
                    style={styles.slider}
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumTrackTintColor={Colors.PRIMARY_1}
                  />
                  <UIText allowFontScaling={false} style={styles.maxValue}>
                    {formatNumber(this.symbolData.c * 2, 2)}
                  </UIText>
                </View>
              ) : (
                <ActivityIndicator />
              )}
              <View style={styles.optionInput}>
                <View style={styles.inputItem}>
                  <Picker
                    label="Option"
                    list={ALARMS_NOTIFICATION_OPTION_LIST}
                    selectedValue={this.data && this.data.option}
                    onChange={this.setOption}
                  />
                </View>
              </View>
              <View style={styles.buttonInput}>
                <Button title={this.props.data ? t('Update Alarm') : t('Add New Alarm')} onPress={this.submitAlarm} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  symbolData: state.symbolData,
  currentSymbol: state.currentSymbol,
});

const mapStateToIndexProps = (state: IState) => ({
  symbolData: state.symbolData,
  currentSymbol: state.currentIndex,
});

export const SymbolAlarmDetail = withTranslation()(
  connect(mapStateToProps, {
    updateAlarmSetting,
    addAlarmSetting,
  })(AlarmDetail)
);

export const IndexAlarmDetail = withTranslation()(
  connect(mapStateToIndexProps, {
    updateAlarmSetting,
    addAlarmSetting,
  })(AlarmDetail)
);
