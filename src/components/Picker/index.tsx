import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { withErrorBoundary } from 'react-error-boundary';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { handleError, isBlank } from 'utils/common';
import Fallback from 'components/Fallback';
import { Colors } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';
import { IObject } from 'interfaces/common';

interface IPickerProps extends React.ClassAttributes<Picker>, WithTranslation {
  label?: string;
  list: Item[];
  selectedValue?: Object;
  placeholder?: {} | Item;
  allowPlaceHolderSelect?: boolean;
  disabled?: boolean;

  placeHolderStyles?: TextStyle;
  valueContainer?: StyleProp<ViewStyle>;
  compareKey?: string;
  onChange?(index: number, value: Object, label: string): void;
}

interface IPickerState {
  selectedIndex: number;
  selectedValue?: Object;
}

class Picker extends React.Component<IPickerProps, IPickerState> {
  constructor(props: IPickerProps) {
    super(props);

    this.state = {
      selectedIndex: 0,
      selectedValue: this.props.selectedValue ? this.props.selectedValue : undefined,
    };
  }

  componentDidUpdate(prevProps: IPickerProps) {
    if (this.props.list !== prevProps.list) {
      this.handleChangeSelected(this.props.list, this.props.selectedValue);
    }

    if (this.props.selectedValue !== prevProps.selectedValue) {
      this.handleChangeSelected(this.props.list, this.props.selectedValue);
    }
  }

  componentDidMount() {
    this.handleChangeSelected(this.props.list, this.props.selectedValue);
  }

  private handleChangeSelected = (listValue: Item[], selectedValue?: Object) => {
    let selectedIndex =
      this.props.compareKey != null
        ? listValue.findIndex(
            (item) =>
              (item.value as IObject)[this.props.compareKey!] ===
              (selectedValue != null ? selectedValue[this.props.compareKey!] : selectedValue)
          )
        : listValue.findIndex((item) => item.value === selectedValue);

    selectedIndex = selectedIndex === -1 ? 0 : selectedIndex;

    this.setState({
      selectedIndex,
      selectedValue: listValue[selectedIndex]
        ? listValue[selectedIndex].value
        : selectedValue || this.state.selectedValue,
    });
  };

  private onSelect = (value: Object, index: number) => {
    if (
      (value != null && value !== this.state.selectedValue) ||
      (value == null && index === 0 && this.props.allowPlaceHolderSelect === true)
    ) {
      const label =
        this.props.list.find((item) => item.value === value) != null
          ? this.props.list.find((item) => item.value === value)!.label
          : '';

      this.setState(
        {
          selectedIndex: index,
          selectedValue: value,
        },
        () => {
          if (this.props.onChange) {
            this.props.onChange(
              this.props.list.findIndex((item) => item.label === label),
              value,
              label
            );
          }
        }
      );
    }
  };

  render() {
    const { t, valueContainer = {} } = this.props;
    const list = this.props.list;

    if (list) {
      for (let i = 0; i < list.length; i++) {
        list[i].label = t(list[i].label);
        if (this.state.selectedIndex != null && list[this.state.selectedIndex] != null) {
          if (isBlank(list[i].value)) {
            list[this.state.selectedIndex].color = Colors.LIGHT_GREY;
          } else if (i === this.state.selectedIndex) {
            list[i].color = Colors.PRIMARY_1;
          } else {
            list[i].color = undefined;
          }
        }
      }
    }

    return (
      <View>
        {this.props.label && (
          <View style={styles.labelSection}>
            <UIText allowFontScaling={false} style={styles.labelTextBox}>
              {t(this.props.label)}
            </UIText>
          </View>
        )}

        <View style={[styles.valueContainer, valueContainer]}>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              placeholder={
                this.props.placeholder
                  ? this.props.placeholder
                  : { label: this.props.t('Select an item...'), value: null, color: Colors.DARK_GREY }
              }
              items={list}
              useNativeAndroidPickerStyle={false}
              style={{
                placeholder: this.props.placeHolderStyles,
                inputAndroid: styles.inputAndroid,
                iconContainer: styles.iconContainer,
              }}
              textInputProps={{
                selection: {
                  start: 0,
                  end: 0,
                },
              }}
              onValueChange={this.onSelect}
              value={this.state.selectedValue}
              disabled={this.props.disabled}
              Icon={() => {
                return <FontAwesomeIcon name="caret-down" color={Colors.DARK_GREY} size={15} />;
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default withErrorBoundary(withTranslation()(Picker), Fallback, handleError);
