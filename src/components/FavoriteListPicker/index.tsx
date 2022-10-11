import React from 'react';
import { View, TouchableOpacity, Modal, FlatList, ListRenderItemInfo } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IFavorite } from 'interfaces/common';
import { changeFavoriteList } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IFavoriteListPickerProps extends React.ClassAttributes<FavoriteListPicker>, WithTranslation {
  modalVisible: boolean;
  selectedFavorite: IFavorite;
  favoriteLists: IFavorite[];
  switchSelection?: boolean;

  closeModal(): void;

  changeFavoriteList(payload: IFavorite): void;

  onChange?(item: IFavorite): void;

  onToNoSortType?(): void;
}

interface IFavoriteListPickerState {}

class FavoriteListPicker extends React.Component<IFavoriteListPickerProps, IFavoriteListPickerState> {
  constructor(props: IFavoriteListPickerProps) {
    super(props);
  }

  private closeModal = () => {
    this.props.closeModal();
  };

  private onPress = (item: IFavorite, index: number) => {
    item.index = index;
    if (this.props.switchSelection === true) {
      this.props.changeFavoriteList(item);
    } else {
      if (this.props.onChange) {
        this.props.onChange(item);
      }
    }
    this.closeModal();
  };

  private renderItem = ({ item, index }: ListRenderItemInfo<IFavorite>) => {
    return (
      <TouchableOpacity
        disabled={this.props.selectedFavorite != null && this.props.selectedFavorite.id === item.id}
        key={item.id}
        style={styles.buttonModal}
        onPress={() => {
          this.onPress(item, index);
          this.props.onToNoSortType && this.props.onToNoSortType();
        }}
      >
        <UIText allowFontScaling={false} style={styles.labelTouch}>
          {item.name}
        </UIText>
        <UIText allowFontScaling={false} style={styles.labelChild}>
          ({item.count}/{item.maxCount})
        </UIText>
        {this.props.selectedFavorite && this.props.selectedFavorite.id === item.id && (
          <AntDesignIcon style={styles.iconSelected} name="check" />
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const { t } = this.props;
    return (
      <Modal animationType="fade" transparent={true} visible={this.props.modalVisible}>
        <View style={styles.containerModal}>
          <View style={[styles.bodyModal, styles.buttonSectionModal]}>
            <View style={styles.modalTitleContainer}>
              <UIText allowFontScaling={false} style={styles.modalTitle}>
                {t('Select Favorite List')}
              </UIText>
            </View>
            <FlatList
              data={this.props.favoriteLists}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
              {...(this.props.selectedFavorite && { initialScrollIndex: this.props.selectedFavorite.index })}
              onScrollToIndexFailed={() => {}}
            />

            <TouchableOpacity style={[styles.buttonModal, styles.buttonCancelModal]} onPress={this.closeModal}>
              <UIText allowFontScaling={false} style={styles.buttonTitleCancelModal}>
                {t('Cancel')}
              </UIText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  favoriteLists: state.favoriteLists,
  selectedFavorite: state.selectedFavorite,
});

const FavoriteListPickerRedux = withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      changeFavoriteList,
    })(FavoriteListPicker)
  ),
  Fallback,
  handleError
);

FavoriteListPickerRedux.defaultProps = {
  switchSelection: true,
};

export default FavoriteListPickerRedux;
