import React from 'react';
import { View, FlatList, ActivityIndicator, ListRenderItemInfo, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { goToNewsDetail } from 'navigations';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import NewsRow from './NewsRows';
import { INews } from 'interfaces/news';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import UIText from 'components/UiText';

interface INewsListProps extends React.ClassAttributes<NewsList>, WithTranslation {
  list?: INews[] | null;
  next?: boolean;
  refresh?: boolean;
  hasMore?: boolean;
  fromComponent: string;

  onCleanIndex?(isCleanIndex: boolean): void;
  loadMore?(): void;
  onRefreshData?(): void;
}

interface INewsListState {
  refreshing: boolean;
}

class NewsList extends React.Component<INewsListProps, INewsListState> {
  private data: INews[] = [];

  constructor(props: INewsListProps) {
    super(props);

    this.state = {
      refreshing: false,
    };
  }

  componentDidUpdate(prevProps: INewsListProps) {
    if (this.props.list && prevProps.list && this.state.refreshing) {
      this.setState({ refreshing: false });
    }
  }

  private onSelectNewsRow = (news: INews) => {
    this.props.onCleanIndex && this.props.onCleanIndex(false);
    goToNewsDetail(this.props.fromComponent, news);
  };

  private onSelectSymbol = (symbolCode: string) => {};

  private renderRow = ({ item, index }: ListRenderItemInfo<INews>) => {
    return (
      <NewsRow
        key={index}
        data={item}
        onSelectNewsRow={() => this.onSelectNewsRow(item)}
        onSelectSymbol={this.onSelectSymbol}
      />
    );
  };

  private renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  private loadMore = () => {
    if (this.props.hasMore === true && this.props.loadMore) {
      this.props.loadMore();
    }
  };

  private renderFooterComp = () => {
    if (this.props.list === null && !this.state.refreshing) {
      return (
        <View style={styles.containerError}>
          <UIText style={styles.labelError}>{this.props.t('Error while fetching data, pull to refresh')}</UIText>
        </View>
      );
    }

    return null;
  };

  private handleRefreshData = () => {
    this.setState({ refreshing: true });
    this.props?.onRefreshData?.();
  };

  render() {
    if (this.props.list != null) {
      if (this.props.next === true) {
        this.data = this.data.concat(this.props.list);
      } else {
        this.data = this.props.list;
      }
    } else {
      this.data = [];
    }

    return (
      <View style={styles.container}>
        {this.props.refresh === true ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            extraData={this.state}
            data={this.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderRow}
            ItemSeparatorComponent={this.renderSeparator}
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.005}
            ListFooterComponent={this.renderFooterComp}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefreshData} />}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withTranslation()(withErrorBoundary(connect(mapStateToProps, {})(NewsList), Fallback, handleError));
