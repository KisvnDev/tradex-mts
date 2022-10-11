import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { withErrorBoundary } from 'react-error-boundary';
import { goToFavoriteList, goToSymbolSearch, goToFavoriteNews } from 'navigations';
import config from 'config';
import { isBlank } from 'utils/common';
import { handleError } from 'utils/common';
import { NOTIFICATION_TYPE, FAVORITE_SORT_TYPE } from 'global';
import Fallback from 'components/Fallback';
import FavoriteListPicker from 'components/FavoriteListPicker';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { IState } from 'redux-sagas/reducers';
import { IFavorite, IObject, INotification } from 'interfaces/common';
import { showNotification } from 'redux-sagas/global-actions';
import { getFavoriteLists, addFavoriteList } from './actions';
import { Colors } from 'styles';
import styles from './styles';
import PopupModal from 'components/PopupModal';
import SortSetting from './SortSetting';
import UIText from 'components/UiText';

interface IFavoriteSelectProps extends React.ClassAttributes<FavoriteSelect>, WithTranslation {
  selectedFavorite: IFavorite | null;
  favoriteLists: IFavorite[];

  getFavoriteLists(): void;

  addFavoriteList(payload: IObject): void;

  showNotification(payload: INotification): void;

  onChangeSortType?(sortType: FAVORITE_SORT_TYPE): void;
}

interface IFavoriteSelectState {
  modalVisible: boolean;
  addModalVisible: boolean;
  modalTitle?: string;
  favoriteName?: string;
  error?: boolean;
  errorContent?: string;
  showSort: boolean;
  sortType?: FAVORITE_SORT_TYPE;
}

class FavoriteSelect extends React.Component<IFavoriteSelectProps, IFavoriteSelectState> {
  constructor(props: IFavoriteSelectProps) {
    super(props);

    this.state = {
      modalVisible: false,
      addModalVisible: false,
      showSort: false,
      sortType: FAVORITE_SORT_TYPE.NO_SORT,
    };
  }

  componentDidMount() {
    if (this.props.favoriteLists == null || this.props.favoriteLists.length === 0) {
      this.props.getFavoriteLists();
    }
  }

  private openPicker = () => {
    this.setState({
      modalVisible: true,
    });
  };

  private closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  private goToFavoriteList = () => {
    goToFavoriteList();
  };

  private goToSymbolSearch = () => {
    config.domain === 'vcsc' ? goToSymbolSearch('Market', true, 'Symbols') : goToSymbolSearch('Market', true);
  };

  private addNewFavoriteList = () => {
    this.setState({
      addModalVisible: true,
      modalTitle: this.props.t('Add new favorite list'),
      favoriteName: '',
    });
  };

  private onChangeFavoriteName = (value: string) => {
    this.setState({
      favoriteName: value,
    });
  };

  private onCancel = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  private onSubmit = () => {
    if (isBlank(this.state.favoriteName)) {
      this.setState({
        error: true,
        errorContent: 'Favorite name cannot be blank',
      });

      return;
    }

    this.setState({ addModalVisible: false });

    let isExisted = false;
    const params = {
      name: this.state.favoriteName!.trim(),
    };

    for (let index = 0; index < this.props.favoriteLists.length; index++) {
      if (this.props.favoriteLists[index].name.trim() === params!.name) {
        isExisted = true;
        break;
      }
    }

    if (isExisted === false) {
      this.props.addFavoriteList(params);
    } else {
      this.props.showNotification({
        type: NOTIFICATION_TYPE.WARN,
        title: 'Favorite list',
        content: 'The favorite name already exists in this favorite lists',
        time: new Date(),
      });
    }
  };

  private goToFavoriteNews = () => {
    goToFavoriteNews();
  };

  private openShowSortType = () => {
    this.setState({
      showSort: true,
    });
  };

  private closeShowSortType = () => {
    this.setState({
      showSort: false,
    });
  };

  private onChangeSortType = (value: FAVORITE_SORT_TYPE) => {
    if (this.props.onChangeSortType) {
      this.props.onChangeSortType(value);
    }

    this.setState({
      showSort: false,
      sortType: value,
    });
  };

  private handleChangeToNoSort = () => {
    this.setState({ sortType: FAVORITE_SORT_TYPE.NO_SORT });

    if (this.props.onChangeSortType) {
      this.props.onChangeSortType(FAVORITE_SORT_TYPE.NO_SORT);
    }
  };

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.favoriteHeader}>
          <View style={styles.favoriteTitle}>
            <UIText allowFontScaling={false} style={styles.favoriteTitleText}>
              {t('Favorite')}
            </UIText>
          </View>
          <View style={styles.favoriteName}>
            <TouchableOpacity style={styles.favoriteNameTouch} onPress={this.openPicker}>
              <UIText allowFontScaling={false} style={styles.labelTouch}>
                {this.props.selectedFavorite && this.props.selectedFavorite.name}
              </UIText>
              <FeatherIcon style={styles.icon} name="chevron-down" color={Colors.PRIMARY_1} />
            </TouchableOpacity>
          </View>
          <View style={styles.favoriteButton}>
            <TouchableOpacity style={styles.newsButton} onPress={this.goToFavoriteNews}>
              <UIText allowFontScaling={false} style={styles.newsButtonText}>
                {t('News')}
              </UIText>
              <FontAwesomeIcon name="newspaper-o" style={styles.newsButtonIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonSectionFav}>
          <TouchableOpacity style={styles.buttonFav} onPress={this.addNewFavoriteList}>
            <UIText allowFontScaling={false} style={styles.labelButtonFav}>
              <FontAwesomeIcon name="plus" style={[styles.iconFav]} /> {t('New')}
            </UIText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFav} onPress={this.goToFavoriteList}>
            <View style={styles.editButtonFav}>
              <UIText allowFontScaling={false} style={styles.labelButtonFav}>
                <FontAwesomeIcon name="edit" style={[styles.iconFav]} /> {t('Edit')}
              </UIText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFav} onPress={this.goToSymbolSearch}>
            <View style={styles.addButtonFav}>
              <UIText allowFontScaling={false} style={styles.labelButtonFav}>
                <FontAwesomeIcon name="plus-square-o" style={[styles.iconFav]} /> {t('Symbols')}
              </UIText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFav} onPress={this.openShowSortType}>
            <UIText allowFontScaling={false} style={styles.labelButtonFav}>
              <MaterialCommunityIcons name="sort" style={[styles.iconFav]} /> {t('Sort by')}
            </UIText>
          </TouchableOpacity>
        </View>
        <FavoriteListPicker
          modalVisible={this.state.modalVisible}
          closeModal={this.closeModal}
          onToNoSortType={this.handleChangeToNoSort}
        />
        <Modal animationType="fade" transparent={true} visible={this.state.addModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBody}>
              <View style={styles.modalContent}>
                <View style={styles.modalTitleContainer}>
                  <UIText allowFontScaling={false} style={styles.modalTitle}>
                    {this.state.modalTitle && t(this.state.modalTitle)}
                  </UIText>
                  <UIText allowFontScaling={false} style={styles.content}>
                    {t('Please, type the updated name below')}
                  </UIText>
                </View>
                <View style={styles.textBoxContainer}>
                  <View style={styles.textBox}>
                    <TextBox
                      placeholder={t('Name')}
                      type={TEXTBOX_TYPE.TEXT}
                      keyboardType="default"
                      value={this.state.favoriteName}
                      error={this.state.error}
                      errorContent={this.state.errorContent}
                      textInputStyle={styles.modalInput}
                      onChange={this.onChangeFavoriteName}
                    />
                  </View>
                </View>
                <View style={[styles.modalButtonSection]}>
                  <TouchableOpacity style={[styles.modalButton, styles.modalSubmitButton]} onPress={this.onCancel}>
                    <UIText allowFontScaling={false} style={styles.buttonTitleCancel}>
                      {t('Cancel')}
                    </UIText>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.modalButton} onPress={this.onSubmit}>
                    <UIText allowFontScaling={false} style={styles.buttonTitle}>
                      {t('Submit')}
                    </UIText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <PopupModal
          modalVisible={this.state.showSort}
          animationType={'fade'}
          header="Sort Type"
          closeModal={this.closeShowSortType}
          modalContainerStyle={styles.modal}
        >
          <View style={styles.sortSettings}>
            <TouchableOpacity style={styles.modalSort}>
              <SortSetting onClose={this.onChangeSortType} selectedValue={this.state.sortType} />
            </TouchableOpacity>
          </View>
        </PopupModal>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  favoriteLists: state.favoriteLists,
  selectedFavorite: state.selectedFavorite,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      getFavoriteLists,
      addFavoriteList,
      showNotification,
    })(FavoriteSelect)
  ),
  Fallback,
  handleError
);
