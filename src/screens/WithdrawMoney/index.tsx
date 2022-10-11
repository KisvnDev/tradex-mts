import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { NavigationState, TabView, SceneRendererProps } from 'react-native-tab-view';
import { SYSTEM_TYPE } from 'global';
import { handleError } from 'utils/common';
import config from 'config';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import TabBar from 'components/TabBar';
import WithdrawMoneyComp from './WithdrawMoney';
import WithdrawMoneyComp3 from './WithdrawMoney/index3';
import WithdrawMoneyComp2 from './WithdrawMoney/index2';
import TransactionHistory from './TransactionHistory';
import Picker from 'components/Picker';
import { IState } from 'redux-sagas/reducers';
import { width } from 'styles';
import styles from './styles';
import { IAccount } from 'interfaces/common';
import UIText from 'components/UiText';

interface IWithdrawMoneyProps extends React.ClassAttributes<WithdrawMoney>, WithTranslation {
  type?: SYSTEM_TYPE;

  selectedAccount: IAccount | null;
}
export enum TransferType {
  INTERNAL = 'TO_SUB',
  EXTEND = 'TO_BANK',
}
interface IWithdrawMoneyState extends NavigationState<{ key: string; title: string }> {
  transferType: TransferType;
}

const listTransferType: ItemDropdown[] = [
  {
    label: 'Internal transfer',
    value: TransferType.INTERNAL,
  },
  {
    label: 'To Bank Transfer',
    value: TransferType.EXTEND,
  },
];

class WithdrawMoney extends React.Component<IWithdrawMoneyProps, IWithdrawMoneyState> {
  private preTransferType = TransferType.INTERNAL;
  constructor(props: IWithdrawMoneyProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'Withdraw Money', title: this.props.t(config.usingNewKisCore ? 'Internal transfer' : 'Withdraw Money') },
        { key: 'Transaction History', title: this.props.t('Transaction History') },
      ],
      transferType: this.preTransferType,
    };
  }

  private onChangeTab = (index: number) => {
    this.setState({ index });
  };
  private onChangeTabType = (_: Object, _valuePicker: Object) => {
    const isKisCore = config.usingNewKisCore;
    const value = _valuePicker as TransferType;
    this.preTransferType = value;

    const { routes } = this.state;

    const route = isKisCore
      ? routes.map((item) =>
          item.key === 'Withdraw Money'
            ? {
                key: item.key,
                title: this.props.t(value === TransferType.INTERNAL ? 'Internal transfer' : 'To Bank Transfer'),
              }
            : item
        )
      : routes;
    this.setState({ transferType: value as TransferType, routes: route });
  };

  private renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
    const switchScene = () => {
      if (
        this.props?.selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES &&
        global.isIicaAccount &&
        config.usingNewKisCore
      ) {
        return <WithdrawMoneyComp3 transferType={config.usingNewKisCore ? this.state.transferType : undefined} />;
      }

      return config.usingNewKisCore === false ? (
        <WithdrawMoneyComp />
      ) : this.state.transferType === TransferType.INTERNAL ? (
        <WithdrawMoneyComp2 transferType={config.usingNewKisCore ? this.state.transferType : undefined} />
      ) : (
        <WithdrawMoneyComp3 transferType={config.usingNewKisCore ? this.state.transferType : undefined} />
      );
    };

    if (this.state.routes[this.state.index] === props.route) {
      switch (props.route.key) {
        case 'Withdraw Money':
          return switchScene();
        case 'Transaction History':
          return <TransactionHistory transferType={config.usingNewKisCore ? this.state.transferType : undefined} />;
        default:
          return null;
      }
    } else {
      return null;
    }
  };

  render() {
    const { t } = this.props;

    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={[styles.inputSection, config.usingNewKisCore && styles.kisInputSession]}>
            <View style={styles.itemSection}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('Account')}
                </UIText>
              </View>
              <View style={styles.accountPicker}>
                <AccountPicker type={this.props.type ? this.props.type : 'ALL'} />
              </View>
            </View>
            {config.usingNewKisCore && (
              <View style={styles.itemSection}>
                <View style={styles.labelContainer}>
                  <UIText allowFontScaling={false} style={styles.label}>
                    {t('Type')}
                  </UIText>
                </View>
                <View style={styles.accountPicker}>
                  <Picker
                    list={listTransferType}
                    onChange={this.onChangeTabType}
                    selectedValue={this.state.transferType}
                  />
                </View>
              </View>
            )}
          </View>

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

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(WithdrawMoney)), Fallback, handleError);
