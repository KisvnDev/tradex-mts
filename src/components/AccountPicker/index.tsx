import React from 'react';
import {
  View,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import config from 'config';
import Picker from 'components/Picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { IState } from 'redux-sagas/reducers';
import { IAccount } from 'interfaces/common';
import { SYMBOL_TYPE, SYSTEM_TYPE } from 'global';
import { changeAccount } from './actions';
import { Colors } from 'styles';
import styles from './styles';
import { ISymbolInfo } from 'interfaces/market';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { getFuturesList } from 'redux-sagas/global-reducers/SymbolList-reducers';
import store from 'redux-sagas/store';
import UIText from 'components/UiText';

interface IAccountPickerProps extends React.ClassAttributes<AccountPicker>, WithTranslation {
  type: 'ALL' | 'EQUITY' | 'DERIVATIVES';
  accountList: IAccount[];
  selectedAccount: IAccount | null;
  disabled?: boolean;
  buttonPickerStyle?: StyleProp<ViewStyle>;
  Icon?: React.ReactElement | null;
  currentSymbol: ISymbolInfo | null;
  setCurrentSymbol: (payload: ISymbolInfo) => void;

  changeAccount(data: IAccount): void;
}

interface IAccountPickerState {
  isVisible: boolean;
  accountListData: IAccount[];
}

class AccountPicker extends React.Component<IAccountPickerProps, IAccountPickerState> {
  private accountListDefault: IAccount[];
  constructor(props: IAccountPickerProps) {
    super(props);

    this.state = {
      isVisible: false,
      accountListData: [],
    };
  }

  componentDidMount() {
    if (
      this.props.currentSymbol?.t !== SYMBOL_TYPE.FUTURES &&
      this.props.selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES &&
      config.usingNewKisCore
    ) {
      const futureList = getFuturesList(store.getState());

      this.props.setCurrentSymbol(futureList[0]);
    }

    if (this.props.accountList && config.domain === 'kis') {
      const accountList: IAccount[] = [];

      for (let i = 0; i < this.props.accountList.length; i++) {
        const item = this.props.accountList[i];
        if (
          this.props.type === 'ALL' ||
          (this.props.type === 'EQUITY' && item.type === SYSTEM_TYPE.EQUITY) ||
          (this.props.type === 'DERIVATIVES' && item.type === SYSTEM_TYPE.DERIVATIVES)
        ) {
          accountList.push(item);
        }
      }

      this.accountListDefault = accountList;

      this.setState({ accountListData: accountList });
    }
  }

  private onSelect = (index: number, value: IAccount) => {
    this.props.changeAccount(value);
    if (config.domain === 'kis') {
      this.handleVisibleModal(false);
      this.setState({ accountListData: this.accountListDefault });
    }
  };

  private handleSearchAccount = (text: string) => {
    if (!this.accountListDefault) {
      return;
    }

    this.setState({
      accountListData: this.accountListDefault.filter((item: IAccount) => {
        return item.accountDisplay!.includes(text);
      }),
    });
  };

  private handleVisibleModal = (isVisible: boolean) => {
    this.setState({ isVisible: isVisible });
  };

  render() {
    if (this.props.accountList == null || this.props.selectedAccount == null) {
      return <ActivityIndicator />;
    }

    const accountList: {
      label: string;
      value: IAccount;
      color?: string;
    }[] = [];

    if (config.domain !== 'kis') {
      for (let i = 0; i < this.props.accountList.length; i++) {
        const item = this.props.accountList[i];
        if (
          this.props.type === 'ALL' ||
          (this.props.type === 'EQUITY' && item.type === SYSTEM_TYPE.EQUITY) ||
          (this.props.type === 'DERIVATIVES' && item.type === SYSTEM_TYPE.DERIVATIVES)
        ) {
          accountList.push({
            label: item.accountDisplay!,
            value: item,
          });
        }
      }
    }

    const indexSelectedAccount = this.props.accountList.findIndex(
      (item) => item.accountDisplay === this.props.selectedAccount!.accountDisplay
    );

    return this.props.accountList.length === 0 ? (
      <ActivityIndicator />
    ) : (
      <View style={styles.textBox}>
        {config.domain === 'kis' ? (
          <>
            <TouchableOpacity
              onPress={() => this.handleVisibleModal(true)}
              style={[styles.buttonSeleted, this.props.buttonPickerStyle ?? {}]}
              disabled={this.props.disabled}
            >
              <UIText>{this.props.selectedAccount.accountDisplay}</UIText>
              {this.props.Icon ?? <AntDesign name={'caretdown'} />}
            </TouchableOpacity>
            <Modal visible={this.state.isVisible} transparent animationType={'fade'}>
              <TouchableOpacity onPress={() => this.setState({ isVisible: false })} style={styles.backgroundOverlay} />
              <View pointerEvents={'box-none'} style={styles.containerItems}>
                <View style={styles.wrapperItems}>
                  <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    keyExtractor={(_, index) => `account_${index}`}
                    ListHeaderComponent={
                      <View style={styles.wrapperSearchInput}>
                        <TextInput
                          style={styles.inputContainer}
                          defaultValue={this.props.selectedAccount.accountNumber}
                          onChangeText={this.handleSearchAccount}
                          placeholder={`${this.props.t('Select an account')}`}
                        />
                      </View>
                    }
                    style={styles.listItemsStyle}
                    data={this.state.accountListData}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity style={styles.itemStyle} onPress={() => this.onSelect(index, item)}>
                        <UIText
                          style={[
                            this.props.selectedAccount?.accountDisplay === item.accountDisplay &&
                              styles.seletedItemStyle,
                          ]}
                        >
                          {item.accountDisplay!}
                        </UIText>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Picker
            list={accountList}
            disabled={this.props.disabled}
            selectedValue={
              accountList[indexSelectedAccount] ? accountList[indexSelectedAccount].value : this.props.selectedAccount
            }
            onChange={this.onSelect}
            placeholder={{
              label: `${this.props.t('Select an account')}`,
              value: null,
              color: Colors.DARK_GREY,
            }}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  accountList: state.accountList,
  selectedAccount: state.selectedAccount,
  currentSymbol: state.currentSymbol,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      changeAccount,
      setCurrentSymbol,
    })(AccountPicker)
  ),
  Fallback,
  handleError
);
