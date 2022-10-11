import React from 'react';
import { View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { TabView, NavigationState, SceneRendererProps } from 'react-native-tab-view';
import store from 'redux-sagas/store';
import { SYMBOL_TYPE, SYSTEM_TYPE } from 'global';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import SearchList from 'components/SearchList';
import SearchPickList from 'components/SearchPickList';
import TabBar from 'components/TabBar';
import { IState } from 'redux-sagas/reducers';
import { clearSymbol } from './actions';
import { width } from 'styles';
import styles from './styles';

interface ISymbolSearchProps extends React.ClassAttributes<SymbolSearch>, WithTranslation {
  componentId: string;
  parentId: string;
  favoriteMode: boolean;

  clearSymbol(): void;
}

interface ITabViewState {
  key: SYMBOL_TYPE;
  title: string;
  type: SYMBOL_TYPE[];
}

interface ISymbolSearchState extends NavigationState<ITabViewState> {}

class SymbolSearch extends React.Component<ISymbolSearchProps, ISymbolSearchState> {
  constructor(props: ISymbolSearchProps) {
    super(props);

    Navigation.events().bindComponent(this);

    const account = store.getState().selectedAccount;

    this.state = {
      index: account && account.type === SYSTEM_TYPE.DERIVATIVES ? 2 : 0,
      routes: [
        { key: SYMBOL_TYPE.STOCK, title: this.props.t('STOCK_2'), type: [SYMBOL_TYPE.STOCK] },
        { key: SYMBOL_TYPE.CW, title: this.props.t('CW'), type: [SYMBOL_TYPE.CW] },
        { key: SYMBOL_TYPE.FUTURES, title: this.props.t('FUTURES'), type: [SYMBOL_TYPE.FUTURES] },
        { key: SYMBOL_TYPE.FUND, title: this.props.t('FUND/ETF'), type: [SYMBOL_TYPE.FUND, SYMBOL_TYPE.ETF] },
      ],
    };
  }

  componentDidDisappear() {
    this.props.clearSymbol();
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: ITabViewState }) => {
    if (props.route.key !== this.state.routes[this.state.index].key) {
      return null;
    }

    return (
      <SearchList
        type={props.route.type}
        parentId={this.props.parentId}
        favoriteMode={this.props.favoriteMode}
        componentId={this.props.componentId}
      />
    );
  };

  render() {
    return (
      <UserInactivity>
        <View style={styles.container}>
          {this.props.favoriteMode && <SearchPickList />}
          <TabView
            renderTabBar={(props) => (
              <TabBar
                {...props}
                index={this.state.index}
                routes={this.state.routes}
                onChange={this.onChangeTab}
                tabItemStyle={styles.tabItem}
              />
            )}
            navigationState={this.state}
            onIndexChange={this.onChangeTab}
            initialLayout={{ width }}
            renderScene={this.renderScene}
          />
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      clearSymbol,
    })(SymbolSearch)
  ),
  Fallback,
  handleError
);
