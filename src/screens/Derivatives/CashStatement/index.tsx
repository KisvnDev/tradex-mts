import React, { useEffect, useMemo, useRef, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AccountPicker from 'components/AccountPicker';
import { View } from 'react-native';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import UserInactivity from 'components/UserInactivity';
import { formatDateToDisplay, formatDateToString, substractMonth } from 'utils/datetime';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import { queryCashStatement } from './action';
import { getBalance, getSelectedAccount, getSheetCashStatement } from './reducer';
import { isAfter, isBefore } from 'date-fns';
import styles from './styles';
import globalStyles from 'styles';
import { formatNumber } from 'utils/common';
import { IObject } from 'interfaces/common';
import config from 'config';
import UIText from 'components/UiText';

interface Props extends WithTranslation {}

const DerivativesCashStatement = ({ t }: Props) => {
  const dispatch = useDispatch();
  const selectedAccount = useSelector(getSelectedAccount);
  const sheetData = useSelector(getSheetCashStatement);
  const balance = useSelector(getBalance);
  const [fromDate, setFromDate] = useState(substractMonth(new Date()));
  const [toDate, setToDate] = useState(new Date());
  const offsetRef = useRef(0).current;

  const fromDataRef = useRef<DatePickerComp | undefined>();
  const toDataRef = useRef<DatePickerComp | undefined>();

  useEffect(() => {
    dispatch(
      queryCashStatement({
        subAccountID: selectedAccount?.accountNumber,
        fromDate: formatDateToString(fromDate)!,
        toDate: formatDateToString(toDate),
        fetchCount: config.fetchCount,
        offset: offsetRef,
      })
    );
  }, [dispatch, selectedAccount, fromDate, toDate, offsetRef]);

  const onChangeDateFrom = (value: Date) => {
    setFromDate(value);

    if (isAfter(value, toDate)) {
      setToDate(value);
      toDataRef.current?.setValue(value);
    }
  };
  const onChangeDateTo = (value: Date) => {
    setToDate(value);

    if (isBefore(value, fromDate)) {
      setFromDate(value);
      fromDataRef.current?.setValue(value);
    }
  };

  const gridDataConfig: ISheetDataConfig = useMemo(() => {
    return {
      columnFrozen: 2,
      header: [
        {
          label: 'Date',
          width: 80,
          element: (key: string, rowData: CashStatement) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatDateToDisplay(rowData.valueDate)}
            </UIText>
          ),
        },
        {
          label: 'Details',
          width: 170,
          element: (key: string, rowData: CashStatement) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.remarks}
            </UIText>
          ),
        },
        {
          label: 'Debit (Cash at KIS)',
          width: 120,
          element: (key: string, rowData: CashStatement) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.clientDebit, 2)}
            </UIText>
          ),
        },
        {
          label: 'Credit (Cash at KIS)',
          width: 120,
          element: (key: string, rowData: CashStatement) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.clientCredit, 2)}
            </UIText>
          ),
        },
        {
          label: 'Debit (Cash at VSD)',
          width: 120,
          element: (key: string, rowData: CashStatement) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.brokerDebit, 2)}
            </UIText>
          ),
        },
        {
          label: 'Credit (Cash at VSD)',
          width: 90,
          element: (key: string, rowData: CashStatement) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.brokerCredit)}
            </UIText>
          ),
        },
        {
          label: 'Total Balance',
          width: 120,
          element: () => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(balance.endingBalance, 2)}
            </UIText>
          ),
        },
      ],
    };
  }, [balance.endingBalance]);

  return (
    <UserInactivity>
      <View style={styles.container}>
        <View style={styles.inputSection}>
          <View style={styles.itemSection}>
            <View style={styles.labelContainer}>
              <UIText allowFontScaling={false} style={styles.label}>
                {t('Account')}
              </UIText>
            </View>
            <View style={styles.accountPicker}>
              <AccountPicker type="DERIVATIVES" />
            </View>
          </View>
        </View>
        <View style={styles.inputSection}>
          <View style={styles.itemSection}>
            <View style={styles.item}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('From')}
                </UIText>
              </View>
              <View style={styles.dataContainer}>
                <DatePicker ref={fromDataRef as any} onChange={onChangeDateFrom} defaultValue={fromDate} />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('To')}
                </UIText>
              </View>
              <View style={styles.dataContainer}>
                <DatePicker ref={toDataRef as any} onChange={onChangeDateTo} />
              </View>
            </View>
          </View>
        </View>
        <SheetData config={gridDataConfig} data={sheetData as IObject[]} nextData={[]} />
      </View>
    </UserInactivity>
  );
};

export default withTranslation()(DerivativesCashStatement);
