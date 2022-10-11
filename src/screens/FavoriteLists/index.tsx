import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import CheckBox from 'components/CheckBox';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { isBlank, handleError } from 'utils/common';
import { IState } from 'redux-sagas/reducers';
import { IFavorite, IObject, INotification } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { updateFavoriteList, showNotification } from 'redux-sagas/global-actions';
import { updateFavoriteListOrder, addFavoriteList, deleteFavoriteList } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IFavoriteListsProps extends React.ClassAttributes<FavoriteLists>, WithTranslation {
  favoriteLists: IFavorite[];

  addFavoriteList(payload: IObject): void;

  updateFavoriteList(payload: IObject[]): void;

  updateFavoriteListOrder(payload: IObject[]): void;

  showNotification(payload: INotification): void;

  deleteFavoriteList(payload: IObject): void;
}

interface IFavoriteListsState {
  redraw: boolean;
  modalVisible: boolean;
  modalTitle?: string;
  favoriteName?: string;
  error?: boolean;
  errorContent?: string;
  mode?: 'ADD' | 'EDIT';
  selectedFavoriteId?: number;
}

class FavoriteLists extends React.Component<IFavoriteListsProps, IFavoriteListsState> {
  private favoriteLists: IFavorite[];
  private selectedList: IFavorite[] = [];
  private selectAll = false;

  constructor(props: IFavoriteListsProps) {
    super(props);

    this.favoriteLists = this.props.favoriteLists;

    this.state = {
      redraw: false,
      modalVisible: false,
    };
  }

  componentDidUpdate(prevProps: IFavoriteListsProps) {
    if (this.props.favoriteLists !== prevProps.favoriteLists) {
      this.favoriteLists = this.props.favoriteLists;
      this.selectAll = false;
      this.selectedList = [];
      for (let i = 0; i < this.favoriteLists.length; i++) {
        if (this.favoriteLists[i].checked === true) {
          this.selectedList.push(this.favoriteLists[i]);
        }
      }
      this.setState({
        redraw: !this.state.redraw,
        modalVisible: false,
      });
    }
  }

  private renderItem = ({
    item,
    index,
    drag,
    isActive,
  }: {
    item: IFavorite;
    index: number;
    drag: () => void;
    isActive: boolean;
  }) => {
    return (
      <View style={[styles.row, index % 2 !== 0 && styles.highlight, isActive && styles.highlight]}>
        <View style={styles.checkbox}>
          <CheckBox checked={item.checked} onChange={this.onSelectRow} index={index} />
        </View>

        <View style={styles.name}>
          <UIText allowFontScaling={false} style={styles.labelName}>
            {item.name}
          </UIText>
          <UIText allowFontScaling={false} style={styles.labelChild}>
            ({item.count}/{item.maxCount})
          </UIText>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => this.onEdit(item.id, item.name)}>
            <FeatherIcon style={[styles.icon]} name="edit" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer} onLongPress={drag}>
            <FontAwesomeIcon style={styles.icon} name="reorder" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  private onSelectRow = (checked: boolean, ref: MaterialIcons, index: number) => {
    this.favoriteLists[index].checked = checked;
    if (checked) {
      this.selectedList.push(this.favoriteLists[index]);
    } else {
      this.selectedList.splice(index, 1);
    }

    if (this.selectedList.length === this.favoriteLists.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }

    this.setState({
      redraw: !this.state.redraw,
    });
  };

  private onEdit = (id: number, name: string) => {
    this.setState({
      modalVisible: true,
      modalTitle: this.props.t('Edit Favorite List'),
      favoriteName: name,
      mode: 'EDIT',
      selectedFavoriteId: id,
    });
  };

  private onAddNewList = () => {
    this.setState({
      modalVisible: true,
      modalTitle: this.props.t('Add new favorite list'),
      favoriteName: '',
      mode: 'ADD',
    });
  };

  private deleteFavoriteList = () => {
    const temp = this.selectedList;
    const params = [];

    for (const item of temp) {
      params.push(item.id);
    }

    if (params.length < this.props.favoriteLists.length) {
      this.props.deleteFavoriteList({
        items: params,
      });
    } else {
      this.props.showNotification({
        type: NOTIFICATION_TYPE.WARN,
        title: 'Favorite list',
        content: 'CANNOT_DELETE_ALL_FAVORITE_LIST',
        time: new Date(),
      });
    }
  };

  private onDragEnd = ({ data }: { data: IFavorite[]; from: number; to: number }) => {
    if (data) {
      this.favoriteLists = data as IFavorite[];
      const params: IObject[] = [];

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        params.push({
          id: item.id,
          order: i,
        });
      }
      this.props.updateFavoriteListOrder(params);

      this.setState({
        redraw: !this.state.redraw,
      });
    }
  };

  private handleSelectAll = () => {
    this.selectAll = !this.selectAll;
    if (this.selectAll === true) {
      this.selectedList = [];
      for (let i = 0; i < this.favoriteLists.length; i++) {
        this.favoriteLists[i].checked = true;
        this.selectedList.push(this.favoriteLists[i]);
      }
    } else {
      for (let i = 0; i < this.favoriteLists.length; i++) {
        this.favoriteLists[i].checked = false;
      }
      this.selectedList = [];
    }

    this.setState({
      redraw: !this.state.redraw,
    });
  };

  private onChangeFavoriteName = (value: string) => {
    this.setState({
      favoriteName: value,
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

    this.setState({ modalVisible: false });

    if (this.state.mode === 'ADD') {
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
    } else if (this.state.mode === 'EDIT') {
      let isExisted = false;
      const params: IObject[] = [
        {
          id: this.state.selectedFavoriteId!,
          name: this.state.favoriteName!.trim(),
          isShowNotification: true,
        },
      ];

      for (let index = 0; index < this.props.favoriteLists.length; index++) {
        if (
          this.props.favoriteLists[index].name.trim() === params[0].name &&
          this.props.favoriteLists[index].id !== params[0].id
        ) {
          isExisted = true;
          break;
        }
      }

      if (isExisted !== true) {
        this.props.updateFavoriteList(params);
      } else {
        this.props.showNotification({
          type: NOTIFICATION_TYPE.WARN,
          title: 'Favorite list',
          content: 'The favorite name already exists in this favorite lists',
          time: new Date(),
        });
      }
    }
  };

  private onCancel = () => {
    this.setState({
      modalVisible: false,
      redraw: !this.state.redraw,
    });
  };

  render() {
    const { t } = this.props;

    return (
      <UserInactivity>
        <View style={styles.container}>
          <GestureHandlerRootView style={styles.gestureStyle}>
            <DraggableFlatList
              extraData={this.state.redraw}
              data={this.favoriteLists}
              renderItem={this.renderItem}
              keyExtractor={(item: IFavorite, index: number) => `draggable-item-${index}`}
              onDragEnd={this.onDragEnd}
            />
            <View style={styles.buttonSection}>
              <View style={styles.button}>
                <TouchableOpacity onPress={this.handleSelectAll}>
                  <UIText allowFontScaling={false} style={styles.labelButton}>
                    <MaterialCommunityIcons name="check-all" style={styles.icon} />
                    {this.selectAll ? t('Deselect all') : t('Select all')}
                  </UIText>
                </TouchableOpacity>
              </View>
              <View style={[styles.button]}>
                <TouchableOpacity onPress={this.onAddNewList}>
                  <UIText allowFontScaling={false} style={styles.labelButton}>
                    <FeatherIcon name="plus-circle" style={styles.icon} /> {t('Add new list')}
                  </UIText>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.button,
                  (this.selectedList.length === 0 || this.selectedList.length === this.favoriteLists.length) &&
                    styles.blurButton,
                ]}
              >
                <TouchableOpacity
                  disabled={
                    this.selectedList.length === 0 || this.selectedList.length === this.favoriteLists.length
                      ? true
                      : false
                  }
                  onPress={this.deleteFavoriteList}
                >
                  <UIText allowFontScaling={false} style={styles.labelButton}>
                    <FontAwesomeIcon name="trash-o" style={styles.icon} /> {t('Delete')}
                  </UIText>
                </TouchableOpacity>
              </View>
            </View>
          </GestureHandlerRootView>
          <Modal animationType="slide" transparent={true} visible={this.state.modalVisible}>
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
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  favoriteLists: state.favoriteLists,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      showNotification,
      updateFavoriteList,
      updateFavoriteListOrder,
      addFavoriteList,
      deleteFavoriteList,
    })(FavoriteLists)
  ),
  Fallback,
  handleError
);
