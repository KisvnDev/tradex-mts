import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import UpdownRanking from 'components/UpdownRanking';
import { IObject } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';
import { getUpDownStockRanking } from 'components/UpdownRanking/RankingTab/actions';
import styles from './styles';

interface IRankingProps extends React.ClassAttributes<Ranking>, WithTranslation {
  upDownRanking: IObject | null;
  getUpDownStockRanking(payload: IObject): void;
}

interface IRankingState {
  visible: boolean;
  refreshing: boolean;
  upDownType: 'UP' | 'DOWN';
}

class Ranking extends React.Component<IRankingProps, IRankingState> {
  constructor(props: IRankingProps) {
    super(props);

    Navigation.events().bindComponent(this);

    this.state = {
      visible: false,
      refreshing: false,
      upDownType: 'UP',
    };

    Navigation.mergeOptions('Ranking', {
      topBar: {
        title: {
          text: this.props.t('Ranking'),
        },
      },
    });
  }

  shouldComponentUpdate(nextProps: IRankingProps) {
    this.updateTopBar();
    return true;
  }

  componentDidUpdate(prevProps: IRankingProps) {
    if (
      this.props.upDownRanking?.data &&
      prevProps.upDownRanking?.data &&
      this.props.upDownRanking?.data === prevProps.upDownRanking?.data &&
      this.state.refreshing
    ) {
      this.setState({ refreshing: false });
    }
  }

  componentDidAppear() {
    this.setState(
      {
        visible: true,
      },
      () => {
        this.updateTopBar();
      }
    );
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  private updateTopBar = () => {
    Navigation.mergeOptions('Ranking', {
      topBar: {
        title: {
          text: this.props.t('Ranking'),
        },
      },
    });
  };

  private handleSetUpDownType = (type: 'UP' | 'DOWN') => {
    this.state.upDownType !== type && this.setState({ upDownType: type });
  };

  private handleRefreshData = () => {
    this.setState({ refreshing: true });

    this.props.getUpDownStockRanking({
      marketType: 'ALL',
      upDownType: this.state.upDownType,
      fetchCount: 5,
    });
  };

  render() {
    return (
      this.state.visible && (
        <UserInactivity>
          <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefreshData} />}
          >
            <UpdownRanking onSetUpDownType={this.handleSetUpDownType} />
          </ScrollView>
        </UserInactivity>
      )
    );
  }
}

const mapStateToProps = (state: IState) => ({
  upDownRanking: state.upDownRanking,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { getUpDownStockRanking })(Ranking)),
  Fallback,
  handleError
);
