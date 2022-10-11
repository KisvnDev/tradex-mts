import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { PERIOD_OPTIONS } from 'global';
import { IObject } from 'interfaces/common';
import styles from './styles';
import UIText from 'components/UiText';

interface IPeriodPickerProps extends React.ClassAttributes<PeriodPicker>, WithTranslation {
  list: IObject[];
  labelStyle?: any;

  onChange(index: number, value: PERIOD_OPTIONS, label: string): void;
}

interface IPeriodPickerState {
  modalVisible: boolean;
  selectedValue: PERIOD_OPTIONS;
  selectedLabel: string;
}

class PeriodPicker extends React.Component<IPeriodPickerProps, IPeriodPickerState> {
  constructor(props: IPeriodPickerProps) {
    super(props);

    this.state = {
      selectedValue: this.props.list[0].value as PERIOD_OPTIONS,
      selectedLabel: this.props.list[0].label as string,
      modalVisible: false,
    };
  }

  private onPress = (value: PERIOD_OPTIONS, label: string, index: number) => {
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
          this.onPress(item.value as PERIOD_OPTIONS, item.label as string, index);
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
      <View style={[styles.container, { ...(this.props.labelStyle && styles.selectedBorder) }]}>
        <TouchableOpacity style={styles.subContainer} onPress={this.toggleModal}>
          <UIText
            allowFontScaling={false}
            style={[styles.title, styles.titleSize, this.props.labelStyle ? this.props.labelStyle : styles.labelTouch]}
          >
            {t(this.state.selectedLabel)}
          </UIText>
          <AntDesignIcon
            style={[
              styles.title,
              styles.iconSize,
              this.props.labelStyle != null ? this.props.labelStyle : styles.labelTouch,
              styles.icon,
            ]}
            name="down"
          />
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
export default withErrorBoundary(withTranslation()(PeriodPicker), Fallback, handleError);
