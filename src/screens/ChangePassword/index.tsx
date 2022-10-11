import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { NavigationState, TabView, SceneRendererProps } from 'react-native-tab-view';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import TabBar from 'components/TabBar';
import config from 'config';
import ChangeOrderPassword from 'screens/ChangeOrderPassword';
import ChangeHTSPassword from 'screens/ChangeHTSPassword';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IChangePasswordProps extends React.ClassAttributes<ChangePassword>, WithTranslation {
  componentId: string;
}

interface IChangePasswordState extends NavigationState<{ key: string; title: string }> {}

class ChangePassword extends React.Component<IChangePasswordProps, IChangePasswordState> {
  constructor(props: IChangePasswordProps) {
    super(props);

    const routes = [
      { key: 'ChangeHTSPassword', title: this.props.t('Change HTS Password') },
      {
        key: 'ChangeOrderPassword',
        title: config.usingNewKisCore ? this.props.t('Change Pin') : this.props.t('Change Order Password'),
      },
    ];

    let index = 0;

    this.state = {
      index,
      routes,
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    switch (props.route.key) {
      case 'ChangeHTSPassword':
        return <ChangeHTSPassword />;
      case 'ChangeOrderPassword':
        return <ChangeOrderPassword />;
      default:
        return null;
    }
  };

  render() {
    const { t } = this.props;
    const isUsingNewKisCore = config.usingNewKisCore;

    return (
      <UserInactivity>
        <View style={[styles.container, isUsingNewKisCore && styles.containerNewKis]}>
          {isUsingNewKisCore && (
            <View style={styles.containerItem}>
              <View style={styles.account}>
                <UIText style={styles.textStyle}>{t('Account')}</UIText>
              </View>
              <View style={styles.accountNum}>
                <UIText style={[styles.textStyle, styles.bothText]}>{global.username}</UIText>
              </View>
            </View>
          )}
          <TabView
            renderTabBar={(props) => (
              <TabBar {...props} index={this.state.index} routes={this.state.routes} onChange={this.onChangeTab} />
            )}
            navigationState={this.state}
            renderScene={this.renderScene}
            onIndexChange={this.onChangeTab}
            initialLayout={{ width }}
            lazy={true}
            renderLazyPlaceholder={() => <ActivityIndicator />}
            swipeEnabled={true}
          />
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(ChangePassword)), Fallback, handleError);
