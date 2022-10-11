import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import StockTransferForm from '../StockTransferForm';
import config from 'config';
import { SYSTEM_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { queryStockTransferAvailable } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IStockBalanceProps extends React.ClassAttributes<StockBalance>, WithTranslation {
  selectedAccount: IAccount | null;
  stockTransferAvailable: IObject | null;
  stockTransferResult: { success: boolean } | null;

  queryStockTransferAvailable(payload: IObject): void;
}

interface IStockBalanceState {
  modalVisible: boolean;
}

class StockBalance extends React.Component<IStockBalanceProps, IStockBalanceState> {
  private stockTransferData: IObject | null = null;
  private refresh = true;
  private configGrid: ISheetDataConfig;

  constructor(props: IStockBalanceProps) {
    super(props);
    const isKisCore = config.usingNewKisCore;
    this.configGrid = {
      columnFrozen: 0,
      header: [
        {
          label: 'Stock Code',
          width: 80,
          element: (_key: string, rowData: IObject, _index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.stockCode, styles.data]}>
              {rowData.stockCode}
            </UIText>
          ),
        },
        {
          label: 'Available Quantity',
          width: 100,
          element: (_key: string, rowData: Stock, _index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(isKisCore ? rowData.availableVolume : rowData.availableQuantity)}
            </UIText>
          ),
        },
        {
          label: isKisCore ? 'Stock Type' : 'Limit Available Quantity',
          width: 140,
          element: (_key: string, rowData: Stock, _index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {isKisCore
                ? this.props.t(rowData.stockType as string)
                : formatNumber(rowData.limitAvailableQuantity as number)}
            </UIText>
          ),
        },
        {
          label: '',
          width: 70,
          element: (_key: string, rowData: IObject, _index: number) => (
            <TouchableOpacity onPress={() => this.onClickTransfer(rowData)}>
              <UIText
                allowFontScaling={false}
                style={[globalStyles.alignCenter, styles.data, styles.transferButtonText]}
              >
                {this.props.t('transfer')}
              </UIText>
            </TouchableOpacity>
          ),
        },
      ],
    };

    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    if (this.props.selectedAccount) {
      this.requestData();
    }
  }

  shouldComponentUpdate(nextProps: IStockBalanceProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData();
    }

    if (this.props.stockTransferResult !== nextProps.stockTransferResult) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private onClickTransfer = (params: IObject) => {
    this.stockTransferData = params;
    this.setState({ modalVisible: true });
  };

  private requestData = (loadMore = false) => {
    const params = {
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.queryStockTransferAvailable(params);
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private closeModal = () => {
    this.stockTransferData = null;
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        {refresh === true || this.props.stockTransferAvailable == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.stockTransferAvailable.data as IObject[]}
            nextData={this.props.stockTransferAvailable.nextData as IObject[]}
            loadMore={this.props.stockTransferAvailable.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
        <Modal visible={this.state.modalVisible && this.stockTransferData != null}>
          <StockTransferForm formData={this.stockTransferData} closeModal={this.closeModal} />
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  stockTransferAvailable: state.stockTransferAvailable,
  stockTransferResult: state.stockTransferResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryStockTransferAvailable,
    })(StockBalance)
  ),
  Fallback,
  handleError
);
