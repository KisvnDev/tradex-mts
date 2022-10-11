import React from 'react';
import { View, ActivityIndicator, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import NewsList from 'components/NewsList';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { INewsListData } from 'interfaces/news';
import { ISymbolInfo } from 'interfaces/market';
import { querySymbolNews } from './actions';
import styles from './styles';

interface INewsTabProps extends React.ClassAttributes<NewsTab> {
  componentId: string;
  currentSymbol: ISymbolInfo;
  symbolNewsData: INewsListData | null;

  onCleanIndex?(isCleanIndex: boolean): void;
  querySymbolNews(payload: IObject): void;
}

class NewsTab extends React.Component<INewsTabProps> {
  private refresh = true;

  constructor(props: INewsTabProps) {
    super(props);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.requestData(this.props.currentSymbol);
    });
  }

  shouldComponentUpdate(nextProps: INewsTabProps) {
    if (this.props.currentSymbol !== nextProps.currentSymbol) {
      this.refresh = true;
      this.setState({}, () => this.requestData(nextProps.currentSymbol));
      return true;
    }

    if (
      this.props.symbolNewsData !== nextProps.symbolNewsData &&
      nextProps.symbolNewsData != null &&
      nextProps.symbolNewsData.symbolCode === nextProps.currentSymbol.s
    ) {
      return true;
    }

    return false;
  }

  private requestData = (symbol: ISymbolInfo, loadMore = false) => {
    const params = {
      symbol,
      fetchCount: config.fetchCount,
      loadMore,
    };
    this.props.querySymbolNews(params);
  };

  private loadMore = () => {
    this.requestData(this.props.currentSymbol, true);
  };

  private handleRefreshData = () => {
    this.requestData(this.props.currentSymbol);
  };

  render() {
    const refresh = this.refresh;
    this.refresh = false;

    return (
      <View style={styles.container}>
        {refresh === true || this.props.symbolNewsData == null ? (
          <ActivityIndicator />
        ) : (
          <NewsList
            list={this.props.symbolNewsData.data}
            next={this.props.symbolNewsData.next}
            loadMore={this.loadMore}
            refresh={refresh}
            hasMore={this.props.symbolNewsData.hasMore}
            fromComponent={this.props.componentId}
            onRefreshData={this.handleRefreshData}
            onCleanIndex={this.props.onCleanIndex}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  symbolNewsData: state.symbolNewsData,
});

export default withErrorBoundary(
  connect(mapStateToProps, {
    querySymbolNews,
  })(NewsTab),
  Fallback,
  handleError
);
