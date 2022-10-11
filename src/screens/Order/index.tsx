import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { NavigationState, TabView, SceneRendererProps } from 'react-native-tab-view';
import { ImageSource } from 'react-native-vector-icons/Icon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { goToSymbolSearch, goToBiz } from 'navigations';
import config from 'config';
import { ORDER_KIND, ORDER_FORM_ACTION_MODE, SYSTEM_TYPE, SELL_BUY_TYPE } from 'global';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import AccountBankPicker from 'components/AccountBankPicker';
import SymbolHeader from 'components/SymbolHeader';
import TabBar from 'components/TabBar';
import OrderForm, { IOrderForm } from 'components/OrderForm';
import { IState } from 'redux-sagas/reducers';
import { IAccount } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { width, Colors } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IOrderProps extends React.ClassAttributes<Order>, WithTranslation {
  componentId: string;
  parentId?: string;
  currentSymbol: ISymbolInfo | null;
  selectedAccount: IAccount | null;
  actionMode?: ORDER_FORM_ACTION_MODE;
  orderKind?: ORDER_KIND;
  formData?: IOrderForm;
  sellBuyType?: SELL_BUY_TYPE;
  additionalPPForModify?: number;
}

interface IOrderState extends NavigationState<{ key: ORDER_KIND; title: string }> {
  comeBackTrigger: boolean;
}

class Order extends React.Component<IOrderProps, IOrderState> {
  private searchIcon: ImageSource;
  private historyIcon: ImageSource;
  private visible = true;
  private readonly isUsingNewKisCore = config.usingNewKisCore;

  constructor(props: IOrderProps) {
    super(props);
    Navigation.events().bindComponent(this);

    this.handleSetRoutes();

    this.state = {
      ...this.state,
      comeBackTrigger: false,
    };
  }

  componentDidAppear() {
    Promise.all([
      MaterialIcons.getImageSource('search', 25, Colors.WHITE),
      MaterialCommunityIcons.getImageSource('timetable', 25, Colors.WHITE),
    ]).then(([searchIcon, historyIcon]) => {
      this.searchIcon = searchIcon;
      this.historyIcon = historyIcon;
      this.updateTopBar(this.props.currentSymbol, this.props.orderKind);
    });
  }

  componentDidDisappear() {
    this.visible = false;
  }

  shouldComponentUpdate(nextProps: IOrderProps, nextState: IOrderState) {
    if (this.visible !== true) {
      this.updateTopBar(nextProps.currentSymbol, nextProps.orderKind);
      this.visible = true;
    } else if (nextProps.currentSymbol !== this.props.currentSymbol && nextProps.currentSymbol != null) {
      this.updateTopBar(nextProps.currentSymbol, nextProps.orderKind);
    }

    return true;
  }

  componentDidUpdate(prevProps: IOrderProps) {
    if (
      prevProps.selectedAccount !== this.props.selectedAccount &&
      this.props.selectedAccount &&
      prevProps.selectedAccount
    ) {
      this.handleSetRoutes();
    }
  }

  handleSetRoutes = () => {
    let routes: { key: ORDER_KIND; title: string; abbr?: string; hidden?: boolean }[] = [];

    if (this.props.selectedAccount) {
      if (this.props.selectedAccount.type === SYSTEM_TYPE.EQUITY) {
        if (!this.isUsingNewKisCore) {
          routes = [
            { key: ORDER_KIND.NORMAL_ORDER, title: this.props.t('Normal Order'), abbr: this.props.t('Normal2') },
            {
              key: ORDER_KIND.STOP_ORDER,
              title: config.domain === 'vcsc' ? this.props.t('Conditional Order') : this.props.t('Stop Order MP'),
              abbr: config.domain === 'vcsc' ? this.props.t('Conditional Order') : this.props.t('Stop Order MP'),
            },
            {
              key: ORDER_KIND.STOP_LIMIT_ORDER,
              title: this.props.t('Stop Limit Order'),
              abbr: this.props.t('Stop Limit'),
            },
            { key: ORDER_KIND.ADVANCE_ORDER, title: this.props.t('Advance Order'), abbr: this.props.t('Advance') },
          ];
          if (config.domain !== 'kis' && this.props.orderKind === ORDER_KIND.ODDLOT_ORDER) {
            routes.push({ key: ORDER_KIND.ODDLOT_ORDER, title: this.props.t('Oddlot Order') });
          }
        } else {
          routes = [
            { key: ORDER_KIND.NORMAL_ORDER, title: this.props.t('Normal Order'), abbr: this.props.t('Normal2') },
            {
              key: ORDER_KIND.STOP_LIMIT_ORDER,
              title: this.props.t('Stop Limit Order'),
              abbr: this.props.t('Stop Limit'),
            },
            {
              key: ORDER_KIND.STOP_ORDER,
              title: this.props.t('Stop Order'),
              abbr: this.props.t('Stop'),
              hidden: true,
            },
          ];
        }
      } else {
        if (!this.isUsingNewKisCore) {
          routes = [
            { key: ORDER_KIND.NORMAL_ORDER, title: this.props.t('Normal Order'), abbr: this.props.t('Normal2') },
            {
              key: ORDER_KIND.STOP_LIMIT_ORDER,
              title: this.props.t('Stop Limit Order'),
              abbr: this.props.t('Stop Limit'),
            },
            { key: ORDER_KIND.ADVANCE_ORDER, title: this.props.t('Advance Order'), abbr: this.props.t('Advance') },
          ];
        } else {
          routes = [
            { key: ORDER_KIND.NORMAL_ORDER, title: this.props.t('Normal Order'), abbr: this.props.t('Normal2') },
            {
              key: ORDER_KIND.STOP_LIMIT_ORDER,
              title: this.props.t('Stop Limit Order'),
              abbr: this.props.t('Stop Limit'),
            },
          ];
        }
      }
    }

    let index = 0;

    if (this.props.orderKind) {
      index = routes.findIndex((item) => item.key === this.props.orderKind);
    }

    this.state = {
      ...this.state,
      index,
      routes,
    };
  };

  private comeBack = () => {
    this.setState({
      comeBackTrigger: !this.state.comeBackTrigger,
    });
  };

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    switch (buttonId) {
      case 'OrderSearchButton':
        goToSymbolSearch(this.props.componentId, false, 'SymbolSearchFromOrder');
        break;
      case 'HistoryButton':
        if (this.props.selectedAccount) {
          if (this.props.selectedAccount.type === SYSTEM_TYPE.EQUITY) {
            if (this.state.routes[this.state.index].key !== ORDER_KIND.ODDLOT_ORDER) {
              goToBiz(
                'OrderHistory',
                {
                  orderKind: this.state.routes[this.state.index].key,
                  goBackAction: this.comeBack,
                },
                this.props.componentId,
                'Order History'
              );
            }
          } else {
            goToBiz(
              'DerivativesOrderHistory',
              {
                orderKind: this.state.routes[this.state.index].key,
              },
              this.props.componentId,
              'Derivatives Order History'
            );
          }
        }
        break;
      default:
        break;
    }
  }

  private updateTopBar = (currentSymbol: ISymbolInfo | null, orderKind?: ORDER_KIND) => {
    const title = `${this.props.t(
      this.props.orderKind !== ORDER_KIND.ODDLOT_ORDER
        ? this.props.actionMode != null && orderKind
          ? `${this.props.actionMode} ${orderKind}`
          : 'Order'
        : 'Oddlot Order'
    )} ${currentSymbol ? `(${currentSymbol.s})` : ''}`;

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: title,
        },
        rightButtons:
          this.props.orderKind !== ORDER_KIND.ODDLOT_ORDER && this.props.actionMode == null
            ? [
                {
                  id: 'HistoryButton',
                  icon: this.historyIcon,
                },
                {
                  id: 'OrderSearchButton',
                  icon: this.searchIcon,
                },
              ]
            : [],
      },
    });
  };

  private onChangeTab = (index: number) => {
    if (this.props.actionMode == null) {
      this.setState({ index });
    }
  };

  private renderScene = (props: SceneRendererProps & { route: { key: ORDER_KIND; title: string } }) => {
    if (this.state.routes[this.state.index] === props.route) {
      return (
        <OrderForm
          orderKind={props.route.key}
          actionMode={this.props.actionMode}
          formData={this.props.formData}
          sellBuyType={this.props.sellBuyType}
          componentId={this.props.componentId}
          additionalPPForModify={this.props.additionalPPForModify}
          comeBackTrigger={this.state.comeBackTrigger}
        />
      );
    } else {
      return null;
    }
  };

  render() {
    const { t, selectedAccount } = this.props;

    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={styles.infoSection}>
            <SymbolHeader
              componentId={this.props.componentId}
              parentId={this.props.parentId ? this.props.parentId : 'More'}
            />
          </View>
          <View style={styles.inputSection}>
            <View style={styles.itemSection}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('Account')}
                </UIText>
              </View>
              <View style={styles.accountPicker}>
                <AccountPicker
                  type="ALL"
                  disabled={this.props.actionMode != null || this.props.orderKind === ORDER_KIND.ODDLOT_ORDER}
                />
              </View>
              {selectedAccount && selectedAccount.type === SYSTEM_TYPE.EQUITY && !this.isUsingNewKisCore && (
                <View style={styles.accountBankPicker}>
                  <AccountBankPicker />
                </View>
              )}
            </View>
          </View>
          {this.props.currentSymbol != null ? (
            <TabView
              renderTabBar={(props) =>
                this.props.orderKind !== ORDER_KIND.ODDLOT_ORDER &&
                this.props.actionMode == null && (
                  <TabBar
                    {...props}
                    index={this.state.index}
                    routes={this.state.routes}
                    onChange={this.onChangeTab}
                    tabItemStyle={styles.tabItem}
                  />
                )
              }
              navigationState={this.state}
              renderScene={this.renderScene}
              onIndexChange={this.onChangeTab}
              initialLayout={{ width }}
              lazy={true}
              renderLazyPlaceholder={() => <ActivityIndicator />}
              {...(this.props.actionMode == null && { swipeEnabled: true })}
            />
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(Order)), Fallback, handleError);
