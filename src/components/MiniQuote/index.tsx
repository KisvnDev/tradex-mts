import React from 'react';
import { View, ActivityIndicator, FlatList, ListRenderItemInfo } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { connect } from 'react-redux';
import config from 'config';
import { formatNumber, handleError } from 'utils/common';
import { reverseMarketData } from 'utils/market';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { ISymbolData, ISymbolInfo } from 'interfaces/market';
import { getQuoteSymbolData } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IMiniQuoteProps extends React.ClassAttributes<MiniQuote>, WithTranslation {
  miniQuoteData: IObject | null;
  currentSymbol: ISymbolInfo;
  currentSymbolQuote: ISymbolData | null;

  getQuoteSymbolData(payload: IObject): void;
}

class MiniQuote extends React.Component<IMiniQuoteProps> {
  private miniQuotes: IObject[] = [];

  constructor(props: IMiniQuoteProps) {
    super(props);
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: IMiniQuoteProps) {
    if (
      this.props.currentSymbolQuote !== nextProps.currentSymbolQuote &&
      nextProps.currentSymbolQuote &&
      nextProps.currentSymbolQuote.s === nextProps.currentSymbol.s
    ) {
      this.miniQuotes.unshift((reverseMarketData(nextProps.currentSymbolQuote) as unknown) as IObject);
      return true;
    }

    if (this.props.currentSymbol !== nextProps.currentSymbol) {
      this.miniQuotes = [];
      return true;
    }

    if (
      this.props.miniQuoteData !== nextProps.miniQuoteData &&
      nextProps.miniQuoteData &&
      nextProps.miniQuoteData.code === this.props.currentSymbol.s
    ) {
      return true;
    }

    return false;
  }

  private requestData = (loadMore = false) => {
    const params = {
      symbol: this.props.currentSymbol,
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.getQuoteSymbolData(params);
  };

  private loadMore = () => {
    this.requestData(true);
  };

  private handleScrollEndReached = () => {
    if (this.props.miniQuoteData && this.props.miniQuoteData.hasMore === true) {
      this.setState({}, () => {
        this.loadMore();
      });
    }
  };

  private renderItem = ({ item, index }: ListRenderItemInfo<IObject>) => {
    if (config.usingNewKisCore) {
      return (
        <View key={index} style={styles.row}>
          <View style={styles.column}>
            <UIText
              allowFontScaling={false}
              style={[
                styles.priceText,
                ((item.ch ?? item.change) as number) > 0
                  ? globalStyles.up
                  : ((item.ch ?? item.change) as number) < 0
                  ? globalStyles.down
                  : globalStyles.reference,
              ]}
            >
              {formatNumber((item.c ?? item.last) as number, 2)}
            </UIText>
          </View>
          <View style={styles.column}>
            <UIText
              allowFontScaling={false}
              style={[styles.volumeText, (item.mb ?? item.matchedBy) === 'BID' ? globalStyles.down : globalStyles.up]}
            >
              {formatNumber((item.mv ?? item.matchingVolume) as number)}
            </UIText>
          </View>
        </View>
      );
    }
    return (
      <View key={index} style={styles.row}>
        <View style={styles.column}>
          <UIText
            allowFontScaling={false}
            style={[
              styles.priceText,
              (item.change as number) > 0
                ? globalStyles.up
                : (item.change as number) < 0
                ? globalStyles.down
                : globalStyles.reference,
            ]}
          >
            {formatNumber(item.last as number, 2)}
          </UIText>
        </View>
        <View style={styles.column}>
          <UIText
            allowFontScaling={false}
            style={[styles.volumeText, item.matchedBy === 'BID' ? globalStyles.down : globalStyles.up]}
          >
            {formatNumber(item.matchingVolume as number)}
          </UIText>
        </View>
      </View>
    );
  };

  render() {
    const { t } = this.props;

    if (this.props.miniQuoteData && this.props.miniQuoteData.code === this.props.currentSymbol.s) {
      if (this.props.miniQuoteData.next === false) {
        this.miniQuotes = this.props.miniQuoteData.data as IObject[];
      } else {
        this.miniQuotes = this.miniQuotes.concat(this.props.miniQuoteData.nextData as IObject[]);
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <UIText allowFontScaling={false} style={styles.labelTable}>
              {t('Last')}
            </UIText>
          </View>
          <View style={styles.header}>
            <UIText allowFontScaling={false} style={styles.labelTable}>
              {t('Matching')}
            </UIText>
          </View>
        </View>
        <View style={styles.data}>
          {this.miniQuotes == null ||
          (this.props.miniQuoteData && this.props.miniQuoteData.code !== this.props.currentSymbol.s) ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <FlatList
              scrollEnabled={true}
              extraData={this.props.currentSymbolQuote}
              data={this.miniQuotes}
              onEndReached={this.handleScrollEndReached}
              onEndReachedThreshold={0.01}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  currentSymbolQuote: state.currentSymbolQuote,
  miniQuoteData: state.miniQuoteData,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      getQuoteSymbolData,
    })(MiniQuote)
  ),
  Fallback,
  handleError
);
