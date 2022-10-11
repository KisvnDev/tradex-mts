import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import NewsList from 'components/NewsList';
import { IState } from 'redux-sagas/reducers';
import { IFavorite, IFavoriteItem, IObject } from 'interfaces/common';
import { INewsListData } from 'interfaces/news';
import { queryFavoriteNews } from './actions';
import styles from './styles';

interface IFavoriteNewsProps extends React.ClassAttributes<FavoriteNews>, WithTranslation {
  selectedFavorite: IFavorite | null;
  favoriteNewsData: INewsListData | null;
  componentId: string;

  queryFavoriteNews(payload: IObject): void;
}

interface IFavoriteNewsState {}

class FavoriteNews extends React.Component<IFavoriteNewsProps, IFavoriteNewsState> {
  private refresh = true;

  constructor(props: IFavoriteNewsProps) {
    super(props);
  }

  componentDidMount() {
    this.requestData(this.props.selectedFavorite);
  }

  shouldComponentUpdate(nextProps: IFavoriteNewsProps, nextState: IFavoriteNewsState) {
    if (this.props.selectedFavorite !== nextProps.selectedFavorite && nextProps.selectedFavorite) {
      this.refresh = true;
      this.setState({}, () => this.requestData(nextProps.selectedFavorite));
    }

    return true;
  }

  private requestData = (selectedFavorite: IFavorite | null, loadMore = false) => {
    const symbolList =
      selectedFavorite && selectedFavorite.itemList
        ? selectedFavorite.itemList.reduce((symbolList: string[], item: IFavoriteItem) => {
            if (item.isNote !== true) {
              symbolList.push(item.data);
            }

            return symbolList;
          }, [])
        : [];

    const params = {
      symbolList,
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.queryFavoriteNews(params);
  };

  private loadMore = () => {
    this.requestData(this.props.selectedFavorite, true);
  };

  private handleRefreshData = () => {
    this.requestData(this.props.selectedFavorite);
  };

  render() {
    const refresh = this.refresh;
    this.refresh = false;

    return (
      <UserInactivity>
        <View style={styles.container}>
          {refresh === true || this.props.favoriteNewsData == null ? (
            <ActivityIndicator />
          ) : (
            <NewsList
              list={this.props.favoriteNewsData.data}
              next={this.props.favoriteNewsData.next}
              loadMore={this.loadMore}
              refresh={refresh}
              hasMore={this.props.favoriteNewsData.hasMore}
              fromComponent={this.props.componentId}
              onRefreshData={this.handleRefreshData}
            />
          )}
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedFavorite: state.selectedFavorite,
  favoriteNewsData: state.favoriteNewsData,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryFavoriteNews,
    })(FavoriteNews)
  ),
  Fallback,
  handleError
);
