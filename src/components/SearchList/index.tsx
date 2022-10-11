import React from 'react';
import { View, FlatList, ListRenderItem, Platform, RefreshControl } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import config from 'config';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IFavorite } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { SYMBOL_TYPE, SYSTEM_TYPE } from 'global';
import SearchRow from './SearchRow';
import { getFilterList } from 'redux-sagas/global-reducers/SymbolList-reducers';
import styles from './styles';
import { reloadMarketData } from 'redux-sagas/global-actions';
import UIText from 'components/UiText';

interface ISearchListProps extends WithTranslation {
  componentId: string;
  symbolList: ISymbolInfo[];
  type: SYMBOL_TYPE[];
  parentId: string;
  favoriteMode?: boolean;
  selectedFavorite: IFavorite;
  accountList: IAccount[];

  reloadMarketData: () => void;
}

interface ISearchListState {}

class SearchList extends React.Component<ISearchListProps, ISearchListState> {
  private symbolList: ISymbolInfo[];
  private isNoAccDerivatives: boolean;
  private refreshing: boolean;

  constructor(props: ISearchListProps) {
    super(props);

    if (props.symbolList) {
      this.setSymbolList(props.symbolList, props.type, props.selectedFavorite, props.favoriteMode);
    }

    if (this.props.type[0]) {
      if (this.props.type[0] === SYMBOL_TYPE.FUTURES && this.props.accountList) {
        this.handleCheckAccount(this.props.accountList);
      } else if (this.isNoAccDerivatives) {
        this.isNoAccDerivatives = false;
      }
    }
  }

  shouldComponentUpdate(nextProps: ISearchListProps) {
    if (
      (nextProps.symbolList && this.props.symbolList !== nextProps.symbolList) ||
      this.props.type !== nextProps.type ||
      this.props.selectedFavorite !== nextProps.selectedFavorite
    ) {
      this.refreshing = false;
      this.setSymbolList(nextProps.symbolList, nextProps.type, nextProps.selectedFavorite, nextProps.favoriteMode);
      return true;
    }
    return false;
  }

  private handleCheckAccount = (accounts: IAccount[]) => {
    const accIndex = accounts.findIndex((item: IAccount) => item.type === SYSTEM_TYPE.DERIVATIVES);

    if (accIndex === -1) {
      this.isNoAccDerivatives = true;
    }
  };

  private renderRow: ListRenderItem<ISymbolInfo> = ({ item, index }) => {
    return (
      <SearchRow
        isDisabledBtn={this.isNoAccDerivatives && this.props.type[0] === SYMBOL_TYPE.FUTURES ? true : false}
        parentId={this.props.parentId}
        key={index}
        symbol={item}
        favoriteMode={this.props.favoriteMode}
        componentId={this.props.componentId}
      />
    );
  };

  private renderKeyExtra = (item: ISymbolInfo) => {
    return item.s;
  };

  private setSymbolList = (
    symbolList: ISymbolInfo[],
    type: SYMBOL_TYPE[],
    selectedFavorite: IFavorite,
    favoriteMode?: boolean
  ) => {
    let newListSymbolList = [];
    if (config.domain === 'vcsc' && this.props.componentId === 'Symbols') {
      newListSymbolList = symbolList.filter((value: ISymbolInfo) => (type.includes(value.t) ? true : false));

      if (selectedFavorite.itemList && favoriteMode === true) {
        newListSymbolList = newListSymbolList.map((item: ISymbolInfo) => {
          const index = selectedFavorite.itemList.findIndex(
            (itemFavorite) => itemFavorite.isNote !== true && itemFavorite.data === item.s
          );

          if (index !== -1) {
            return { ...item, isSelectedFavorite: true };
          }

          return item;
        });
      }
    } else {
      newListSymbolList = symbolList.filter((value: ISymbolInfo) => {
        if (type.includes(value.t)) {
          if (favoriteMode === true && selectedFavorite.itemList) {
            const index = selectedFavorite.itemList.findIndex((item) => item.isNote !== true && item.data === value.s);
            if (index !== -1) {
              return false;
            }
          }
          return true;
        }
        return false;
      });
    }

    this.symbolList = newListSymbolList;
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          scrollEnabled={true}
          data={this.symbolList || []}
          extraData={this.symbolList}
          ListHeaderComponent={
            this.symbolList == null || !this.symbolList?.length ? (
              <View style={[styles.container]}>
                <UIText style={styles.text}>{this.props.t('SYMBOL_NOT_FOUND')}</UIText>
              </View>
            ) : undefined
          }
          refreshControl={<RefreshControl refreshing={this.refreshing} onRefresh={this.props.reloadMarketData} />}
          renderItem={this.renderRow}
          keyExtractor={this.renderKeyExtra}
          initialNumToRender={20}
          updateCellsBatchingPeriod={25}
          {...(Platform.OS === 'android' && { removeClippedSubviews: true })}
          windowSize={8}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  symbolList: getFilterList(state),
  selectedFavorite: state.selectedFavorite,
  accountList: state.accountList,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      reloadMarketData,
    })(SearchList)
  ),
  Fallback,
  handleError
);
