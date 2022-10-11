import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter, isBefore } from 'date-fns';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import DatePicker from 'components/DatePicker';
import SubscriptionForm from '../SubscriptionForm';
import config from 'config';
import { SYSTEM_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import { formatDateToDisplay, formatDateToString } from 'utils/datetime';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { queryRightsAvailable, queryRightsExerciseRegistration } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ISubscriptionListProps extends React.ClassAttributes<SubscriptionList>, WithTranslation {
  rightType: 'ADDITIONAL_STOCK' | 'BOND';
  selectedAccount: IAccount | null;
  rightsAvailable: IObject | null;
  rightsRegistrationData: IObject | null;
  rightsRegisterResult: { success: boolean } | null;
  isHistory?: boolean;

  queryRightsAvailable(payload: IObject): void;

  queryRightsExerciseRegistration(payload: IObject): void;
}

interface ISubscriptionListState {
  modalVisible: boolean;
  startDate: Date;
  endDate: Date;
}

class SubscriptionList extends React.Component<ISubscriptionListProps, ISubscriptionListState> {
  private rightsData: IObject | null = null;
  private refresh = true;
  private configGrid: ISheetDataConfig;

  constructor(props: ISubscriptionListProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 2,
      header:
        config.usingNewKisCore === false
          ? [
              {
                label: 'Seq No',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {rowData.sequenceNumber}
                  </UIText>
                ),
              },
              {
                label: 'Code',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <TouchableOpacity onPress={() => this.onClickRegister(rowData)}>
                    <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.code, styles.data]}>
                      {rowData.stockCode}
                    </UIText>
                  </TouchableOpacity>
                ),
              },
              {
                label: 'Base Date',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.baseDate as string)}
                  </UIText>
                ),
              },
              {
                label: 'Right Status',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {props.t(rowData.rightStatus as string)}
                  </UIText>
                ),
              },
              {
                label: 'Start Date',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.startDate as string)}
                  </UIText>
                ),
              },
              {
                label: 'End Date',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.endDate as string)}
                  </UIText>
                ),
              },
              {
                label: 'Issue Price',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.issuePrice as number, 2)}
                  </UIText>
                ),
              },
              {
                label: 'Available Quantity',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.availableQuantity as number)}
                  </UIText>
                ),
              },
              {
                label: 'Note',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {rowData.note}
                  </UIText>
                ),
              },
            ]
          : this.props.rightType !== 'BOND'
          ? [
              {
                label: '',
                width: 65,
                element: (_key: string, rowData: IObject, _index: number) => {
                  if (rowData.availableRightQty === 0) {
                    return null;
                  }
                  return (
                    <TouchableOpacity onPress={() => this.onClickRegister2(rowData)}>
                      <UIText style={styles.code}>{this.props.t('Register')}</UIText>
                    </TouchableOpacity>
                  );
                },
              },
              {
                label: 'Stock',
                width: 40,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <TouchableOpacity onPress={() => this.onClickRegister(rowData)}>
                    <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                      {rowData.symbol}
                    </UIText>
                  </TouchableOpacity>
                ),
              },
              {
                label: 'Ratio',
                width: 45,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {`${formatNumber(rowData.ratioLeft as number)} : ${formatNumber(rowData.ratioRight as number)}`}
                  </UIText>
                ),
              },
              {
                label: 'Offering Price',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatNumber(rowData.offeringPrice as number)}
                  </UIText>
                ),
              },
              {
                label: 'Closed Date',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.closedDate as string)}
                  </UIText>
                ),
              },
              {
                label: 'Time period for transfer',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {`${formatDateToDisplay(rowData.lastTransferDateLeft as string)} - ${formatDateToDisplay(
                      rowData.lastTransferDateRight as string
                    )}`}
                  </UIText>
                ),
              },
              {
                label: 'Time period for subscription',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatDateToDisplay(rowData.lastRegistrationDate as string)}
                  </UIText>
                ),
              },
              {
                label: 'Qty at closed date',
                width: 90,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.qtyAtClosedDate as number)}
                  </UIText>
                ),
              },
              {
                label: 'Initial Right Qty',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.initialRightQty as number)}
                  </UIText>
                ),
              },
              {
                label: 'Available Right Qty',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.availableRightQty as number)}
                  </UIText>
                ),
              },
              {
                label: 'Transaction Amount',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.amount as number)}
                  </UIText>
                ),
              },
              {
                label: 'Registered Qty',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.registeredQty as number)}
                  </UIText>
                ),
              },
              {
                label: 'Purchased Amount',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.purchaseAmount as number)}
                  </UIText>
                ),
              },
              {
                label: 'Status',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {rowData.status}
                  </UIText>
                ),
              },
            ]
          : this.props.isHistory != null
          ? [
              {
                label: 'Registered Time',
                width: 100,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {`${(rowData.registeredTime as string).substring(
                      0,
                      10
                    )}\n${(rowData.registeredTime as string).substring(11)}`}
                  </UIText>
                ),
              },
              {
                label: 'Stock',
                width: 60,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <TouchableOpacity onPress={() => this.onClickRegister(rowData)}>
                    <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                      {rowData.symbol}
                    </UIText>
                  </TouchableOpacity>
                ),
              },
              {
                label: 'Time Period for Subscription',
                width: 90,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {`${(rowData.lastRegistrationDate as string).substring(
                      0,
                      10
                    )}\n${(rowData.lastRegistrationDate as string).substring(11, 19)}`}
                  </UIText>
                ),
              },
              {
                label: 'Registered Quantity',
                width: 100,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.registeredQty as number)}
                  </UIText>
                ),
              },
              {
                label: 'Status',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {this.props.t(rowData.status as string)}
                  </UIText>
                ),
              },
            ]
          : [
              {
                label: 'Stock',
                width: 40,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <TouchableOpacity onPress={() => this.onClickRegister(rowData)}>
                    <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                      {rowData.symbol}
                    </UIText>
                  </TouchableOpacity>
                ),
              },
              {
                label: 'Right Type',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {this.props.t(rowData.rightType as string)}
                  </UIText>
                ),
              },
              {
                label: 'Closed Date',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.closedDate as string)}
                  </UIText>
                ),
              },
              {
                label: 'Exercise Date',
                width: 100,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.exerciseDate as string)}
                  </UIText>
                ),
              },
              {
                label: 'Qty at closed date',
                width: 110,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.qtyAtClosedDate as number)}
                  </UIText>
                ),
              },
              {
                label: 'Ratio',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {rowData.ratio}
                  </UIText>
                ),
              },
              {
                label: 'Receivable Cash',
                width: 100,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.receivableCash as number)}
                  </UIText>
                ),
              },
              {
                label: 'Right Stock',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.rightStock as number)}
                  </UIText>
                ),
              },
              {
                label: 'Receivable Qty',
                width: 100,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.receivableQty as number)}
                  </UIText>
                ),
              },
              {
                label: 'Status',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
                    {this.props.t(rowData.status as string)}
                  </UIText>
                ),
              },
            ],
    };

    this.state = {
      modalVisible: false,
      startDate: new Date(),
      endDate: new Date(),
    };
  }

  componentDidMount() {
    if (this.props.selectedAccount) {
      this.requestData(this.props.rightType);
    }
  }

  shouldComponentUpdate(nextProps: ISubscriptionListProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData(nextProps.rightType);
    }

    if (this.props.rightType !== nextProps.rightType) {
      this.refresh = true;
      this.requestData(nextProps.rightType);
    }

    if (this.props.rightsRegisterResult !== nextProps.rightsRegisterResult) {
      this.refresh = true;
      this.requestData(nextProps.rightType);
    }

    if (
      this.props.rightsRegistrationData !== nextProps.rightsRegistrationData &&
      nextProps.rightsRegistrationData != null
    ) {
      this.rightsData = {
        ...this.rightsData,
        ...nextProps.rightsRegistrationData,
      };

      if (!global.isIicaAccount) {
        this.rightsData.interfaceSeq = '-1';
      }

      this.setState({
        modalVisible: true,
      });
    }

    return true;
  }

  private onClickRegister = (params: IObject) => {
    this.rightsData = params;
    this.setState({ modalVisible: true });
  };

  private onClickRegister2 = (params: IObject) => {
    this.rightsData = {
      ...params,
      cashAvailable: (this.props.rightsAvailable?.dataAvailableExercise as IObject)?.availablePowerToExerciseRight,
    };

    if (!global.isIicaAccount) {
      this.rightsData.interfaceSeq = '-1';
    }

    this.props.queryRightsExerciseRegistration({
      entitlementID: params.entitlementId,
    });
    // this.setState({ modalVisible: true });
  };

  private onChangeStartDate = (value: Date) => {
    this.refresh = true;

    if (this.state.endDate) {
      if (isAfter(value, this.state.endDate)) {
        this.setState(
          {
            startDate: value,
            endDate: value,
          },
          () => this.requestData(this.props.rightType)
        );
      } else {
        this.setState(
          {
            startDate: value,
          },
          () => this.requestData(this.props.rightType)
        );
      }
    } else {
      this.setState(
        {
          startDate: value,
        },
        () => this.requestData(this.props.rightType)
      );
    }
  };

  private onChangeEndDate = (value: Date) => {
    this.refresh = true;

    if (this.state.startDate) {
      if (isBefore(value, this.state.startDate)) {
        this.setState(
          {
            startDate: value,
            endDate: value,
          },
          () => this.requestData(this.props.rightType)
        );
      } else {
        this.setState(
          {
            endDate: value,
          },
          () => this.requestData(this.props.rightType)
        );
      }
    } else {
      this.setState(
        {
          endDate: value,
        },
        () => this.requestData(this.props.rightType)
      );
    }
  };

  private requestData = (rightType: 'ADDITIONAL_STOCK' | 'BOND', loadMore = false) => {
    let params: any;
    if (rightType === 'BOND' && config.usingNewKisCore === true) {
      if (this.props.isHistory === true) {
        params = {
          isRightList: true,
          symbol: 'ALL',
          fromDate: formatDateToString(this.state.startDate, 'yyyyMMdd'),
          toDate: formatDateToString(this.state.endDate, 'yyyyMMdd'),
          fetchCount: config.fetchCount,
          loadMore,
          offset: loadMore === false ? 0 : this.props.rightsAvailable!.offset,
        };
      } else {
        params = {
          isRightList: true,
          symbol: 'ALL',
          fromDate: formatDateToString(this.state.startDate, 'yyyyMMdd'),
          toDate: formatDateToString(this.state.endDate, 'yyyyMMdd'),
          fetchCount: config.fetchCount,
          loadMore,
          offset: loadMore === false ? 0 : this.props.rightsAvailable!.offset,
        };
      }
    } else {
      params = {
        rightType,
        fetchCount: config.fetchCount,
        loadMore,
        offset: loadMore === false ? 0 : this.props.rightsAvailable!.offset,
      };
    }

    this.props.queryRightsAvailable(params);
  };

  private requestLoadMore = () => {
    this.requestData(this.props.rightType, true);
  };

  private closeModal = () => {
    this.rightsData = null;
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { t } = this.props;
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    if (config.usingNewKisCore === false) {
      return (
        <View style={styles.container}>
          {refresh === true || this.props.rightsAvailable == null ? (
            <ActivityIndicator />
          ) : (
            <SheetData
              config={this.configGrid}
              data={this.props.rightsAvailable.data as IObject[]}
              nextData={this.props.rightsAvailable.nextData as IObject[]}
              loadMore={this.props.rightsAvailable.next as boolean}
              requestLoadMore={this.requestLoadMore}
            />
          )}
          <Modal visible={this.state.modalVisible && this.rightsData != null}>
            <SubscriptionForm
              formData={this.rightsData}
              closeModal={this.closeModal}
              rightType={this.props.rightType}
            />
          </Modal>
        </View>
      );
    } else {
      if (this.props.rightType === 'BOND') {
        return (
          <View style={[styles.container]}>
            <View style={[styles.InputSection, globalStyles.marginBottom]}>
              <View style={styles.Item}>
                <DatePicker
                  defaultValue={this.state.startDate}
                  onChange={this.onChangeStartDate}
                  maxDate={new Date()}
                />
              </View>
              <View style={styles.Item}>
                <DatePicker defaultValue={this.state.endDate} onChange={this.onChangeEndDate} maxDate={new Date()} />
              </View>
            </View>
            {refresh === true || this.props.rightsAvailable == null ? (
              <ActivityIndicator />
            ) : (
              <SheetData
                config={this.configGrid}
                data={this.props.rightsAvailable.data as IObject[]}
                nextData={this.props.rightsAvailable.nextData as IObject[]}
                loadMore={this.props.rightsAvailable.next as boolean}
                requestLoadMore={this.requestLoadMore}
              />
            )}
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            {refresh === true || this.props.rightsAvailable == null ? (
              <ActivityIndicator />
            ) : (
              <UIText style={globalStyles.scapingElement}>
                {t('Available power to exercise right:')}{' '}
                {formatNumber(
                  (this.props.rightsAvailable.dataAvailableExercise as IObject).availablePowerToExerciseRight as number,
                  2
                )}
                {'VND'}
              </UIText>
            )}
            {refresh === true || this.props.rightsAvailable == null ? (
              <ActivityIndicator />
            ) : (
              <SheetData
                config={this.configGrid}
                data={this.props.rightsAvailable.data as IObject[]}
                nextData={this.props.rightsAvailable.nextData as IObject[]}
                loadMore={this.props.rightsAvailable.next as boolean}
                requestLoadMore={this.requestLoadMore}
              />
            )}
            <Modal visible={this.state.modalVisible && this.rightsData != null}>
              <SubscriptionForm
                formData={this.rightsData}
                closeModal={this.closeModal}
                rightType={this.props.rightType}
                isNewCore={true}
              />
            </Modal>
          </View>
        );
      }
    }
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  rightsAvailable: state.rightsAvailable,
  rightsRegisterResult: state.rightsRegisterResult,
  rightsRegistrationData: state.rightsRegistrationData,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryRightsAvailable,
      queryRightsExerciseRegistration,
    })(SubscriptionList)
  ),
  Fallback,
  handleError
);
