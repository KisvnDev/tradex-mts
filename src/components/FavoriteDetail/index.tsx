import React from 'react';
import { View, FlatList, ActivityIndicator, ListRenderItemInfo, RefreshControl } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { goToSymbolInfo } from 'navigations';
import { handleError } from 'utils/common';
import { FAVORITE_SORT_TYPE, SYMBOL_TYPE, SYSTEM_TYPE } from 'global';
import Fallback from 'components/Fallback';
import SymbolRow from 'components/SymbolRow';
import { getFavoriteLists } from 'components/FavoriteSelect/actions';
import { IGetFavoriteState } from 'screens/Market/reducers';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo, IQuerySymbolData } from 'interfaces/market';
import { IAccount, IFavorite, IFavoriteItem } from 'interfaces/common';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol, querySymbolData } from 'redux-sagas/global-actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IFavoriteDetailProps extends React.ClassAttributes<FavoriteDetail>, WithTranslation {
  selectedFavorite: IFavorite | null;
  symbolMap: { [s: string]: ISymbolInfo };
  sortType: FAVORITE_SORT_TYPE;
  favoriteState: IGetFavoriteState;
  accountList: IAccount[];
  currentSymbol: ISymbolInfo;

  querySymbolData(payload: IQuerySymbolData): void;

  setCurrentSymbol(payload: ISymbolInfo): void;
  getFavoriteLists(): void;
}

interface IFavoriteDetailState {}

class FavoriteDetail extends React.Component<IFavoriteDetailProps, IFavoriteDetailState> {
  private symbolList: ISymbolInfo[] = [];
  private isNoAccDerivatives: boolean;

  constructor(props: IFavoriteDetailProps) {
    super(props);

    this.state = {};

    if (this.props.accountList) {
      this.handleCheckAccount(this.props.accountList);
    } else if (this.isNoAccDerivatives) {
      this.isNoAccDerivatives = false;
    }

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
    }
  }

  // private getFirstItemObject<T>(Objs: { [s: string]: T }): T {
  //   let firstItem: any = null;

  //   for (let key in Objs) {
  //     firstItem = Objs[key];
  //     break;
  //   }
  //   return firstItem;
  // }

  shouldComponentUpdate(nextProps: IFavoriteDetailProps) {
    // if (!isEmpty(nextProps.symbolMap) && isEmpty(this.props.currentSymbol) && !this.isMoused) {
    //   this.isMoused = true;
    //   if (this.getFirstItemObject<ISymbolInfo>(nextProps.symbolMap)) {
    //     this.props.setCurrentSymbol(this.getFirstItemObject<ISymbolInfo>(nextProps.symbolMap));
    //   }
    // }

    if (this.props.favoriteState !== nextProps.favoriteState) {
      return true;
    }

    if (
      (this.props.symbolMap !== nextProps.symbolMap || this.props.selectedFavorite !== nextProps.selectedFavorite) &&
      nextProps.selectedFavorite &&
      nextProps.symbolMap &&
      nextProps.selectedFavorite!.itemList
    ) {
      this.symbolList = nextProps.selectedFavorite!.itemList.reduce(
        (symbolList: ISymbolInfo[], item: IFavoriteItem) => {
          if (item.isNote !== true) {
            const symbolInfo = nextProps.symbolMap[item.data];
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

      return true;
    }

    if (this.props.sortType !== nextProps.sortType) {
      this.getSortedSymbolList(nextProps.sortType, nextProps.selectedFavorite, nextProps.symbolMap);
      return true;
    }

    return false;
  }

  private getSortedSymbolList = (
    sortType: FAVORITE_SORT_TYPE,
    selectedFavorite: IFavorite | null,
    symbolMap: { [s: string]: ISymbolInfo }
  ) => {
    let type: string | undefined;
    switch (sortType) {
      case FAVORITE_SORT_TYPE.NO_SORT:
        type = undefined;
        break;
      case FAVORITE_SORT_TYPE.BY_NAME:
        type = 's';
        break;
      case FAVORITE_SORT_TYPE.BY_PERCENTAGE:
        type = 'ra';
        break;
      case FAVORITE_SORT_TYPE.BY_PRICE:
        type = 'c';
        break;
      case FAVORITE_SORT_TYPE.BY_VOLUMN:
        type = 'vo';
        break;
      default:
        type = undefined;
        break;
    }

    if (type == null) {
      this.symbolList = selectedFavorite!.itemList.reduce((symbolList: ISymbolInfo[], item: IFavoriteItem) => {
        if (item.isNote !== true) {
          const symbolInfo = symbolMap[item.data];
          if (symbolInfo != null) {
            symbolList.push(symbolInfo);
          }
        }

        return symbolList;
      }, []);
      return;
    } else if (type === 's') {
      this.symbolList = this.symbolList.sort((a, b) => {
        if (a.s > b.s) {
          return 1;
        }
        if (a.s < b.s) {
          return -1;
        }
        return 0;
      });
    } else {
      this.symbolList.sort((a, b) => {
        const dataA = global.symbolData[a.s];
        const dataB = global.symbolData[b.s];
        if (dataA && dataB) {
          return dataB[type] - dataA[type];
        } else {
          return 0;
        }
      });
    }
  };

  private goToSymbolInfo = (symbol: ISymbolInfo) => {
    this.props.setCurrentSymbol(symbol);
    goToSymbolInfo('Market');
  };

  private handleRefreshData = () => {
    this.props.getFavoriteLists();
  };

  private handleCheckAccount = (accounts: IAccount[]) => {
    const accIndex = accounts.findIndex((item: IAccount) => item.type === SYSTEM_TYPE.DERIVATIVES);

    if (accIndex === -1) {
      this.isNoAccDerivatives = true;
    }
  };

  private renderItem = ({ item, index }: ListRenderItemInfo<ISymbolInfo>) => {
    return (
      <SymbolRow
        isDisabledBtn={this.isNoAccDerivatives && item.t === SYMBOL_TYPE.FUTURES ? true : false}
        symbol={item}
        index={index}
        rowType="Order"
        isHighlight={index % 2 === 1}
        onPress={this.goToSymbolInfo}
        parentId="Market"
      />
    );
  };

  render() {
    const {
      favoriteState: { error, loading },
      t,
    } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          data={this.symbolList}
          renderItem={this.renderItem}
          keyExtractor={(item: ISymbolInfo, index: number) => index.toString()}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={this.handleRefreshData} />}
          ListFooterComponent={
            <React.Fragment>
              {loading && !this.props.selectedFavorite ? <ActivityIndicator /> : null}
              {error && (
                <View style={styles.containerError}>
                  <UIText style={styles.labelError}>{t('Error while fetching data, pull to refresh')}</UIText>
                </View>
              )}
            </React.Fragment>
          }
        />
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedFavorite: state.selectedFavorite,
  symbolMap: getSymbolMap(state),
  favoriteState: state.favoriteState,
  accountList: state.accountList,
  currentSymbol: state.currentSymbol,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      querySymbolData,
      setCurrentSymbol,
      getFavoriteLists,
    })(FavoriteDetail)
  ),
  Fallback,
  handleError
);
