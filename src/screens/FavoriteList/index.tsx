import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { goToFavoriteLists, goToSymbolSearch } from 'navigations';
import config from 'config';
import { handleError } from 'utils/common';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import Button from 'components/Button';
import SymbolRow from 'components/SymbolRow';
import FavoriteListPicker from 'components/FavoriteListPicker';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, IQuerySymbolData } from 'interfaces/market';
import { IFavorite, INotification, IObject, IFavoriteItem } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { querySymbolData, updateFavoriteList, showNotification } from 'redux-sagas/global-actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IFavoriteListProps extends React.ClassAttributes<FavoriteList>, WithTranslation {
  favoriteLists: IFavorite[];
  selectedFavorite: IFavorite | null;
  symbolMap: { [s: string]: ISymbolInfo };

  querySymbolData(payload: IQuerySymbolData): void;

  updateFavoriteList(params: IObject[]): void;

  showNotification(payload: INotification): void;
}

interface IFavoriteListState {
  favoriteName: string;
  redraw: boolean;
  modalVisible: boolean;
}

class FavoriteList extends React.Component<IFavoriteListProps, IFavoriteListState> {
  private needToUpdate: boolean;
  private symbolList: ISymbolInfo[] = [];
  private selectedList: string[] = [];
  private selectAll = false;
  private selected = false;
  private favoriteNameValue = '';

  constructor(props: IFavoriteListProps) {
    super(props);

    Navigation.events().bindComponent(this);

    this.state = {
      favoriteName: this.props.selectedFavorite ? this.props.selectedFavorite.name : '',
      redraw: false,
      modalVisible: false,
    };
    this.favoriteNameValue = this.props.selectedFavorite ? this.props.selectedFavorite.name : '';

    if (this.props.symbolMap && this.props.selectedFavorite && this.props.selectedFavorite!.itemList) {
      this.symbolList = this.props.selectedFavorite!.itemList.reduce(
        (symbolList: ISymbolInfo[], item: IFavoriteItem) => {
          if (item.isNote !== true) {
            const symbolInfo = this.props.symbolMap[item.data];
            if (symbolInfo != null) {
              symbolList.push(symbolInfo);
            }
          }

          return symbolList;
        },
        []
      );

      this.props.querySymbolData({
        symbolList: this.symbolList.map((item) => item.s),
      });

      if (this.symbolList.length !== 0) {
        let isCheckAll = true;
        for (let i = 0; i < this.symbolList.length; i++) {
          if (!this.symbolList[i].checked) {
            isCheckAll = false;
            break;
          }
        }
        this.selectAll = isCheckAll;
      }
    }
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'ManageFavoriteButton') {
      goToFavoriteLists();
    }
  }

  shouldComponentUpdate(nextProps: IFavoriteListProps, nextState: IFavoriteListState) {
    this.favoriteNameValue = nextProps.selectedFavorite ? nextProps.selectedFavorite.name : '';

    if (
      (this.props.symbolMap !== nextProps.symbolMap || this.props.selectedFavorite !== nextProps.selectedFavorite) &&
      nextProps.selectedFavorite &&
      nextProps.selectedFavorite!.itemList
    ) {
      this.symbolList = nextProps.selectedFavorite!.itemList.reduce(
        (symbolList: ISymbolInfo[], item: IFavoriteItem) => {
          if (item.isNote !== true) {
            const symbolInfo = this.props.symbolMap[item.data];
            if (symbolInfo != null) {
              symbolList.push(symbolInfo);
            }
          }

          return symbolList;
        },
        []
      );

      this.props.querySymbolData({
        symbolList: this.symbolList.map((item) => item.s),
      });

      this.selected = false;
      this.selectAll = false;
      this.needToUpdate = false;
      this.selectedList = [];

      return true;
    }

    if (nextState.redraw !== this.state.redraw) {
      return true;
    }

    return false;
  }

  private onChangeFavoriteName = (value: string) => {
    if (this.props.selectedFavorite && this.props.selectedFavorite.name !== value) {
      this.needToUpdate = true;
      this.setState({
        favoriteName: value,
        redraw: !this.state.redraw,
      });
    }
  };

  private goToAddsymbolList = () => {
    config.domain === 'vcsc'
      ? goToSymbolSearch('FavoriteList', true, 'Symbols')
      : goToSymbolSearch('FavoriteList', true);
  };

  private renderItem = ({
    item,
    index,
    drag,
    isActive,
  }: {
    item: ISymbolInfo;
    index: number;
    drag: () => void;
    isActive: boolean;
  }) => {
    return (
      <SymbolRow
        symbol={item}
        index={index}
        isHighlight={isActive}
        checked={item.checked}
        rowType="Favorite"
        onLongPress={drag}
        onSelectRow={this.onSelectRow}
        parentId="FavoriteList"
      />
    );
  };

  private onSelectRow = (index: number, checked: boolean) => {
    this.symbolList[index].checked = checked;
    if (checked) {
      this.selectedList.push(this.symbolList[index].s);
      this.selected = true;
    } else {
      this.selectedList.splice(this.selectedList.indexOf(this.symbolList[index].s), 1);
      if (this.selectedList.length === 0) {
        this.selected = false;
      }
    }

    if (this.selectedList.length === this.symbolList.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }

    this.setState({
      redraw: !this.state.redraw,
    });
  };

  private onDragEnd = ({ data }: { data: ISymbolInfo[]; from: number; to: number }) => {
    if (data) {
      this.symbolList = data;
      this.needToUpdate = true;

      this.setState({
        redraw: !this.state.redraw,
      });
    }
  };

  private moveBottom = () => {
    this.move('bottom');
  };

  private moveTop = () => {
    this.move('top');
  };

  private move = (target: 'top' | 'bottom') => {
    const arr = [];
    const movedArr = [];

    for (let i = 0; i < this.symbolList.length; i++) {
      const item = this.symbolList[i];
      if (item.checked) {
        movedArr.push(item);
      } else {
        arr.push(item);
      }
    }

    if (target === 'top') {
      this.symbolList = movedArr.concat(arr);
    } else {
      this.symbolList = arr.concat(movedArr);
    }

    this.needToUpdate = true;

    this.setState({
      redraw: !this.state.redraw,
    });
  };

  private handleSelectAll = () => {
    this.selectAll = !this.selectAll;
    if (this.symbolList.length !== 0) {
      if (this.selectAll === true) {
        this.selectedList = [];
        for (let i = 0; i < this.symbolList.length; i++) {
          this.symbolList[i].checked = true;
          this.selectedList.push(this.symbolList[i].s);
        }

        this.selected = true;
      } else {
        for (let i = 0; i < this.symbolList.length; i++) {
          this.symbolList[i].checked = false;
        }
        this.selectedList = [];
        this.selected = false;
      }

      this.setState({
        redraw: !this.state.redraw,
      });
    }
  };

  private copyToAnotherList = () => {
    this.setState({
      modalVisible: true,
      redraw: !this.state.redraw,
    });
  };

  private onDeleteSymbol = () => {
    this.symbolList = this.symbolList.filter((item) => item.checked !== true);

    const params: IObject[] = [];
    const itemList: IFavoriteItem[] = [];
    for (let i = 0; i < this.symbolList.length; i++) {
      this.symbolList[i].checked = false;
      itemList.push({
        isNote: false,
        data: this.symbolList[i].s,
      });
    }

    params.push({
      id: this.props.selectedFavorite!.id,
      itemList,
      name: this.state.favoriteName,
      showNotification: true,
    });

    this.props.updateFavoriteList(params);
  };

  private validateFavoriteName = () => {
    let isExistsFavoriteName = false;
    this.props.favoriteLists.forEach((element) => {
      if (element.id !== this.props.selectedFavorite?.id && element.name === this.state.favoriteName) {
        isExistsFavoriteName = true;
        return;
      }
    });
    return isExistsFavoriteName;
  };

  private onUpdate = () => {
    if (this.validateFavoriteName()) {
      this.props.showNotification({
        type: NOTIFICATION_TYPE.WARN,
        title: 'Favorite list',
        content: 'The favorite name already exists in this favorite lists',
        time: new Date(),
      });
    } else {
      if (this.needToUpdate === true) {
        const params: IObject[] = [];
        const itemList: IFavoriteItem[] = [];
        for (let i = 0; i < this.symbolList.length; i++) {
          this.symbolList[i].checked = false;
          itemList.push({
            isNote: false,
            data: this.symbolList[i].s,
          });
        }

        params.push({
          id: this.props.selectedFavorite!.id,
          itemList,
          name: this.state.favoriteName,
        });

        this.props.updateFavoriteList(params);

        this.needToUpdate = false;
        this.selectedList = [];
        this.selectAll = false;
        this.selected = false;

        this.setState({
          redraw: !this.state.redraw,
        });
      }
    }
  };

  private closeModal = () => {
    this.setState({
      modalVisible: false,
      redraw: !this.state.redraw,
    });
  };

  private copyTo = (item: IFavorite) => {
    const params: IObject[] = [];
    const { maxCount } = item;

    for (let i = 0; i < this.symbolList.length; i++) {
      this.symbolList[i].checked = false;
    }

    //update symbols to new list
    let currentsymbolListOfNewList: IFavoriteItem[] = [];

    if (item.itemList != null) {
      currentsymbolListOfNewList = item.itemList;
    }

    for (const item of this.selectedList) {
      const index = currentsymbolListOfNewList.findIndex(
        (favoriteItem) => favoriteItem.isNote !== true && favoriteItem.data === item
      );

      if (index === -1) {
        currentsymbolListOfNewList.push({
          isNote: false,
          data: item,
        });
      }
    }

    if (item.itemList.length > maxCount!) {
      this.props.showNotification({
        type: NOTIFICATION_TYPE.WARN,
        title: 'Favorite list',
        content: 'DESTINATION_FAVORITE_LIST_IS_FULL',
        contentParams: {
          destinationList: item.name,
          maxCount,
        },
        time: new Date(),
      });
      return;
    }

    params.push({
      id: item.id,
      name: item.name,
      itemList: currentsymbolListOfNewList,
      showNotification: true,
    });

    //update
    this.props.updateFavoriteList(params);

    this.selectedList = [];
    this.selectAll = false;
    this.selected = false;
    this.needToUpdate = false;

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
          <TextBox
            label="Name"
            type={TEXTBOX_TYPE.TEXT}
            keyboardType="default"
            value={this.favoriteNameValue}
            onChange={this.onChangeFavoriteName}
            textInputStyle={styles.favoriteNameInput}
          />
          <Button
            buttonStyle={styles.favoriteButton}
            textStyle={styles.favoriteButtonText}
            onPress={this.goToAddsymbolList}
            title={`+ ${t('Add Symbols Into List')}`}
          />
          <View style={styles.favortieList}>
            {this.props.symbolMap == null ? (
              <ActivityIndicator />
            ) : (
              <GestureHandlerRootView style={styles.gestureStyle}>
                <DraggableFlatList
                  extraData={this.state.redraw}
                  data={this.symbolList}
                  renderItem={this.renderItem}
                  keyExtractor={(item: ISymbolInfo, index: number) => `draggable-item-${index}`}
                  onDragEnd={this.onDragEnd}
                />
              </GestureHandlerRootView>
            )}
          </View>
          {!this.selectAll && this.selected && (
            <View style={styles.moveButtonSection}>
              <TouchableOpacity onPress={this.moveBottom}>
                <View style={[styles.moveButton]}>
                  <FeatherIcon style={[styles.moveIcon]} name="chevron-down" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.moveTop}>
                <View style={[styles.moveButton]}>
                  <FeatherIcon style={[styles.moveIcon]} name="chevron-up" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonSection}>
            <View style={styles.button}>
              <TouchableOpacity onPress={this.handleSelectAll}>
                <UIText allowFontScaling={false} style={styles.labelButton}>
                  <MaterialCommunityIcons name="check-all" style={[styles.icon]} />{' '}
                  {this.selectAll ? t('Deselect all') : t('Select all')}
                </UIText>
              </TouchableOpacity>
            </View>

            <View style={[styles.button, this.selectedList.length === 0 && { opacity: 0.3 }]}>
              <TouchableOpacity
                onPress={this.copyToAnotherList}
                disabled={this.selectedList.length === 0 ? true : false}
              >
                <UIText allowFontScaling={false} style={styles.labelButton}>
                  <FeatherIcon name="move" style={[styles.icon]} /> {t('Copy to')}
                </UIText>
              </TouchableOpacity>
            </View>

            <View style={[styles.button, this.selectedList.length === 0 && { opacity: 0.3 }]}>
              <TouchableOpacity disabled={this.selectedList.length === 0 ? true : false} onPress={this.onDeleteSymbol}>
                <UIText allowFontScaling={false} style={styles.labelButton}>
                  <FontAwesomeIcon name="trash-o" style={[styles.icon]} /> {t('Delete')}
                </UIText>
              </TouchableOpacity>
            </View>

            <View style={[styles.button, this.needToUpdate !== true && { opacity: 0.3 }]}>
              <TouchableOpacity disabled={this.needToUpdate !== true ? true : false} onPress={this.onUpdate}>
                <UIText allowFontScaling={false} style={styles.labelButton}>
                  <FontAwesomeIcon name="save" style={[styles.icon]} /> {t('Save')}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
          <FavoriteListPicker
            modalVisible={this.state.modalVisible}
            switchSelection={false}
            onChange={this.copyTo}
            closeModal={this.closeModal}
          />
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedFavorite: state.selectedFavorite,
  favoriteLists: state.favoriteLists,
  symbolMap: getSymbolMap(state),
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      querySymbolData,
      updateFavoriteList,
      showNotification,
    })(FavoriteList)
  ),
  Fallback,
  handleError
);
