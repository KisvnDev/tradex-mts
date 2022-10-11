import React from 'react';
import { View, Modal, TouchableOpacity, StyleProp, TextStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { IObject } from 'interfaces/common';
import styles from './styles';
import UIText from 'components/UiText';

interface IUnitPickerProps extends React.ClassAttributes<UnitPicker>, WithTranslation {
  label: string;
  list: IObject[];
  style: StyleProp<TextStyle>;
  labelStyle: StyleProp<TextStyle>;

  onChange(index: number, value: number, label: string): void;
}

interface IUnitPickerState {
  modalVisible: boolean;
  selectedValue: number;
  selectedLabel: string;
}

class UnitPicker extends React.Component<IUnitPickerProps, IUnitPickerState> {
  constructor(props: IUnitPickerProps) {
    super(props);

    this.state = {
      selectedValue: this.props.list[0].value as number,
      selectedLabel: this.props.list[0].label as string,
      modalVisible: false,
    };
  }

  private onPress = (value: number, label: string, index: number) => {
    this.setState({
      selectedLabel: label,
      selectedValue: value,
      modalVisible: false,
    });

    this.props.onChange(index, value, label);
  };

  private toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  private closeModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { t } = this.props;
    const list = this.props.list.map((item: IObject, index: number) => (
      <TouchableOpacity
        key={index}
        style={styles.button}
        onPress={() => {
          this.onPress(item.value as number, item.label as string, index);
        }}
      >
        <UIText
          allowFontScaling={false}
          style={[styles.labelTouch, styles.item, this.state.selectedValue === item.value && styles.selected]}
        >
          {t(item.label as string)}
        </UIText>
      </TouchableOpacity>
    ));

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.subContainer} onPress={this.toggleModal}>
          <UIText
            allowFontScaling={false}
            style={[styles.title, this.props.labelStyle ? this.props.labelStyle : styles.labelTouch]}
          >
            {t(this.props.label)}
          </UIText>
          <UIText
            allowFontScaling={false}
            style={[styles.label, this.props.style ? this.props.style : styles.labelTouch]}
          >
            {this.state.selectedLabel}
          </UIText>
        </TouchableOpacity>
        <Modal animationType="fade" transparent={true} visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <View style={[styles.body, styles.buttonSection]}>
              {list}

              <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={this.closeModal}>
                <UIText allowFontScaling={false} style={styles.buttonTitleCancel}>
                  {t('Cancel')}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default withErrorBoundary(withTranslation()(UnitPicker), Fallback, handleError);
