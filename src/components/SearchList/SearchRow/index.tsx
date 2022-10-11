import React from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { goToSymbolInfo } from 'navigations';
import { LANG } from 'global';
import config from 'config';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import CheckBox from 'components/CheckBox';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo } from 'interfaces/market';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { addSymbol, removeSymbol } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface ISearchRowProps extends WithTranslation {
  componentId: string;
  symbol: ISymbolInfo;
  searchPickList: ISymbolInfo[];
  parentId: string;
  favoriteMode?: boolean;
  isDisabledBtn?: boolean;

  setCurrentSymbol(payload: ISymbolInfo): void;

  addSymbol(payload: ISymbolInfo): void;

  removeSymbol(payload: ISymbolInfo): void;
}

interface ISearchRowState {
  refresh: boolean;
}

class SearchRow extends React.Component<ISearchRowProps, ISearchRowState> {
  private checked = false;
  constructor(props: ISearchRowProps) {
    super(props);

    this.state = {
      refresh: false,
    };

    const index = this.props.searchPickList.findIndex((item) => item.s === this.props.symbol.s);
    if (index > 0) {
      this.checked = true;
    }
  }

  shouldComponentUpdate(nextProps: ISearchRowProps, nextState: ISearchRowState) {
    if (
      nextProps.symbol !== this.props.symbol &&
      nextProps.symbol.isSelectedFavorite !== this.props.symbol.isSelectedFavorite &&
      config.domain === 'vcsc'
    ) {
      return true;
    }

    if (nextProps.symbol !== this.props.symbol && nextProps.symbol.s !== this.props.symbol.s) {
      return true;
    }

    if (nextState.refresh !== this.state.refresh) {
      return true;
    }

    if (nextProps.searchPickList !== this.props.searchPickList) {
      if (this.checked === true) {
        const index = nextProps.searchPickList.findIndex((item) => item.s === nextProps.symbol.s);
        if (index < 0) {
          this.checked = false;
          return true;
        }
      }
    }
    return false;
  }

  private goToSymbolInfo = () => {
    Keyboard.dismiss();
    if (this.props.favoriteMode === true) {
      return;
    }

    this.props.setCurrentSymbol(this.props.symbol);
    switch (this.props.parentId) {
      case 'SymbolInfo':
      case 'SpeedOrder':
      case 'SymbolInfoStack':
      case 'Order':
      case 'OrderStack':
        Navigation.pop(this.props.componentId);
      case 'Market':
        goToSymbolInfo(this.props.componentId);
        break;
      default:
        break;
    }
  };

  private onSelectRow = () => {
    Keyboard.dismiss();

    this.checked = !this.checked;
    if (this.checked === true) {
      this.props.addSymbol(this.props.symbol);
    } else {
      this.props.removeSymbol(this.props.symbol);
    }

    this.setState({ refresh: !this.state.refresh });
  };

  render() {
    const { favoriteMode, symbol, isDisabledBtn = false } = this.props;

    return (
      <TouchableOpacity onPress={this.goToSymbolInfo} disabled={isDisabledBtn}>
        <View style={styles.container}>
          {favoriteMode === true && (
            <View style={styles.checkbox}>
              {config.domain === 'vcsc' ? (
                !symbol?.isSelectedFavorite && <CheckBox checked={this.checked} onChange={this.onSelectRow} />
              ) : (
                <CheckBox checked={this.checked} onChange={this.onSelectRow} />
              )}
            </View>
          )}
          <View style={styles.code}>
            <UIText allowFontScaling={false} style={styles.textCode}>
              {symbol.s}
            </UIText>
          </View>
          <View style={styles.title}>
            <View>
              <UIText allowFontScaling={false} style={styles.textTitle}>
                {global.lang === LANG.EN ? symbol.n2 : symbol.n1}
              </UIText>
            </View>
            <View style={styles.market}>
              <UIText allowFontScaling={false} style={[styles.textMarket, styles[symbol.m]]}>
                {symbol.m}
              </UIText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  searchPickList: state.searchPickList,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      setCurrentSymbol,
      addSymbol,
      removeSymbol,
    })(SearchRow)
  ),
  Fallback,
  handleError
);
