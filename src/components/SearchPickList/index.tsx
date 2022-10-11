import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import Button from 'components/Button';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo } from 'interfaces/market';
import { IObject, IFavoriteItem } from 'interfaces/common';
import { updateFavoriteList } from 'redux-sagas/global-actions';
import { removeSymbol, clearSymbol } from './actions';
import styles from './styles';
import store from 'redux-sagas/store';
import UIText from 'components/UiText';

interface ISearchPickListProps extends React.ClassAttributes<SearchPickList>, WithTranslation {
  searchPickList: ISymbolInfo[];

  removeSymbol(symbol: ISymbolInfo): void;

  clearSymbol(): void;

  updateFavoriteList(payload: IObject[]): void;
}

class SearchPickList extends React.Component<ISearchPickListProps> {
  private onSubmit = () => {
    const selectedFavorite = store.getState().selectedFavorite;

    if (selectedFavorite) {
      const { id } = selectedFavorite;
      let itemList: IFavoriteItem[] = [];
      const params = [];
      if (selectedFavorite.itemList == null) {
        itemList = [];
      } else {
        itemList = selectedFavorite.itemList.slice(0);
      }

      this.props.searchPickList.forEach((item) => {
        const index = itemList.findIndex(
          (favoriteItem) => favoriteItem.isNote !== true && favoriteItem.data === item.s
        );
        if (index === -1) {
          itemList.push({
            isNote: false,
            data: item.s,
          });
        }
      });

      params.push({
        id,
        itemList,
      });
      this.props.updateFavoriteList(params);
      this.props.clearSymbol();
    }
  };

  private removeSymbol = (symbol: ISymbolInfo) => {
    this.props.removeSymbol(symbol);
  };

  render() {
    const { t } = this.props;
    const selectedSymbols = this.props.searchPickList;
    return (
      <View style={styles.container}>
        <View style={styles.scrollList}>
          <View style={styles.label}>
            <UIText allowFontScaling={false} style={styles.labelText}>
              {t('Chosen Symbol')}{' '}
            </UIText>
            <UIText allowFontScaling={false} style={styles.length}>
              {selectedSymbols.length}
            </UIText>
          </View>
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >
              {selectedSymbols.map((symbol, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.removeSymbol(symbol)}
                  disabled={false}
                  style={styles.symbol}
                >
                  <UIText allowFontScaling={false} style={styles.code}>
                    {symbol.s}
                  </UIText>
                  <View style={styles.icon}>
                    <FontAwesomeIcon color="red" name="minus-circle" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={styles.button}
            disabled={selectedSymbols.length === 0}
            onPress={this.onSubmit}
            title={t('Add')}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  searchPickList: state.searchPickList,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { removeSymbol, clearSymbol, updateFavoriteList })(SearchPickList)),
  Fallback,
  handleError
);
