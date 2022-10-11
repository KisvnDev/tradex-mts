import React from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import styles from './styles';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { Item } from 'react-native-picker-select';
import { IObject } from 'interfaces/common';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UIText from 'components/UiText';

interface DataItem extends Item {
  searchKey?: string;
}
interface IEkycPickerProps extends React.ClassAttributes<EkycPicker>, WithTranslation {
  label: string;
  data: DataItem[];
  onSelect: (label: string, value: IObject | any) => void;
  required?: boolean;
  emphasize?: boolean;
}

interface IEkycPickerState {
  modalVisible: boolean;
  listData: DataItem[] | [];
  selectedValue: string;
}

class EkycPicker extends React.Component<IEkycPickerProps, IEkycPickerState> {
  private timmer: any;
  constructor(props: IEkycPickerProps) {
    super(props);
    this.state = {
      modalVisible: false,
      listData: [],
      selectedValue: '',
    };
  }

  componentDidMount() {
    this.setState({ listData: this.props.data });
  }

  componentDidUpdate(prevProps: IEkycPickerProps, preState: IEkycPickerState) {
    if (prevProps.data !== this.props.data) {
      this.setState({ selectedValue: '' });
    }

    if (this.state.modalVisible !== preState.modalVisible) {
      this.setState({ listData: this.props.data });
    }
  }

  renderItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => this.closeModal(item.label, item.value)}>
        <UIText>{item.label}</UIText>
      </TouchableOpacity>
    );
  };

  render() {
    const { t } = this.props;

    return (
      <UserInactivity>
        <TouchableOpacity onPress={this.showModal}>
          <TextBox
            noEditable={true}
            type={TEXTBOX_TYPE.TEXT}
            keyboardType="default"
            placeholder={t('Select')}
            label={this.props.label}
            value={this.state.selectedValue}
            noPointer={true}
            required={this.props.required}
            emphasize={this.props.emphasize}
          />
        </TouchableOpacity>
        <Modal animationType="fade" transparent={false} visible={this.state.modalVisible}>
          <View style={styles.pickerContainer}>
            <TouchableOpacity style={styles.icon} onPress={() => this.setState({ modalVisible: false })}>
              <FontAwesome5 name="times" size={20} color={'#000000'} />
            </TouchableOpacity>
            <View style={styles.search}>
              <TextBox
                type={TEXTBOX_TYPE.TEXT}
                keyboardType="default"
                onChange={this.onFilterValue}
                autoCorrect={false}
                placeholder={t('Search')}
              />
            </View>
            <FlatList
              style={{ marginTop: 15 }}
              data={this.state.listData}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.label + index}
            />
          </View>
        </Modal>
      </UserInactivity>
    );
  }

  private closeModal = (label: string, value: IObject) => {
    this.setState({ modalVisible: false, selectedValue: label }, () => {});
    this.props.onSelect(label, value);
  };

  private showModal = () => {
    this.setState({ modalVisible: true });
  };

  private onFilterValue = (value: string) => {
    const listData = this.props.data.filter((e) => {
      if (e.searchKey) {
        return e.searchKey.toLowerCase().includes(value.toLocaleLowerCase());
      } else {
        return e.label.toLowerCase().includes(value.toLocaleLowerCase());
      }
    });

    if (this.timmer) {
      clearTimeout(this.timmer);
    }

    this.timmer = setTimeout(() => {
      this.setState({ listData });
    }, 100);
  };
}

const mapStateToProps = () => ({});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(EkycPicker)), Fallback, handleError);
