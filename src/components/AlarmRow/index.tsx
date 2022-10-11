import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import store from 'redux-sagas/store';
import { withErrorBoundary } from 'react-error-boundary';
import { SYMBOL_TYPE } from 'global';
import { goToSymbolAlarmDetail, goToIndexAlarmDetail } from 'navigations';
import CheckBox from 'components/CheckBox';
import Fallback from 'components/Fallback';
import { formatNumber, handleError, getColor } from 'utils/common';
import { IState } from 'redux-sagas/reducers';
import { ISubscribeSymbol, ISymbolData, ISymbolInfo } from 'interfaces/market';
import { IAlarm } from 'interfaces/common';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { subscribe, unsubscribe, setCurrentSymbol, setCurrentIndex } from 'redux-sagas/global-actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IAlarmRowProps extends React.ClassAttributes<AlarmRow>, WithTranslation {
  index: number;
  data: IAlarm;
  checked?: boolean;
  symbolData: ISymbolData | null;

  onSelectRow(data: IAlarm, index: number, value: boolean): void;

  subscribe(data: ISubscribeSymbol): void;

  unsubscribe(data: ISubscribeSymbol): void;

  setCurrentSymbol(payload: ISymbolInfo): void;

  setCurrentIndex(payload: ISymbolInfo): void;
}

interface IAlarmRowState {}

class AlarmRow extends React.Component<IAlarmRowProps, IAlarmRowState> {
  private optionList = {
    ONCE: this.props.t('Once'),
    MULTIPLE: this.props.t('Multiple'),
  };

  private symbolData?: ISymbolData;

  constructor(props: IAlarmRowProps) {
    super(props);

    if (global.symbolData[this.props.data.code]) {
      this.symbolData = global.symbolData[this.props.data.code];
    }
  }

  componentDidMount(): void {
    this.props.subscribe({
      code: this.props.data.code,
      symbolType: this.props.data.type,
    });
  }

  componentWillUnmount(): void {
    this.props.unsubscribe({
      code: this.props.data.code,
    });
  }

  shouldComponentUpdate(nextProps: IAlarmRowProps) {
    if (
      this.props.symbolData !== nextProps.symbolData &&
      nextProps.symbolData &&
      nextProps.symbolData.s === nextProps.data.code
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolData };
      return true;
    }

    if (this.props.data !== nextProps.data && this.props.data.code !== nextProps.data.code) {
      this.props.unsubscribe({
        code: this.props.data.code,
      });

      this.props.subscribe({
        code: nextProps.data.code,
        symbolType: this.props.data.type,
      });
      return true;
    } else if (this.props.checked !== nextProps.checked) {
      return true;
    }

    return false;
  }

  private onChangeCheckBox = (data: IAlarm, index: number, value: boolean) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(data, index, value);
    }
  };

  private onEdit = () => {
    const symbolMap = getSymbolMap(store.getState());
    if (symbolMap) {
      const symbolInfo = symbolMap[this.props.data.code];

      if (symbolInfo) {
        if (symbolInfo.t !== SYMBOL_TYPE.INDEX) {
          this.props.setCurrentSymbol(symbolInfo);

          goToSymbolAlarmDetail('AlarmList', {
            data: this.props.data,
          });
        } else {
          this.props.setCurrentIndex(symbolInfo);

          goToIndexAlarmDetail('AlarmList', {
            data: this.props.data,
          });
        }
      }
    }
  };

  render() {
    const { data, index } = this.props;

    let textColor = getColor(
      this.symbolData?.c as number,
      this.symbolData?.re as number,
      this.symbolData?.ce as number,
      this.symbolData?.fl as number,
      this.symbolData!
    ).textStyle;

    let status = getColor(
      this.symbolData?.c as number,
      this.symbolData?.re as number,
      this.symbolData?.ce as number,
      this.symbolData?.fl as number,
      this.symbolData!
    ).iconType;

    if (this.symbolData && this.symbolData.t === 'INDEX') {
      if (this.symbolData.ch != null) {
        if (this.symbolData.ch < 0) {
          textColor = globalStyles.down;
          status = 'down';
        } else if (this.symbolData.ch > 0) {
          textColor = globalStyles.up;
          status = 'up';
        } else {
          textColor = globalStyles.reference;
          status = '';
        }
      }
    }

    return (
      <View style={[styles.containerRow, index % 2 === 0 && styles.highlight]}>
        <View style={styles.checkBoxSection}>
          <CheckBox
            checked={this.props.checked}
            onChange={(value: boolean) => this.onChangeCheckBox(data, index, value)}
          />
        </View>

        <View style={styles.codeSection}>
          <UIText allowFontScaling={false} style={styles.code}>
            {data.code}
          </UIText>
        </View>

        <View style={styles.priceSection}>
          <UIText allowFontScaling={false} style={[styles.textPrice, textColor]}>
            {formatNumber(data.value, 2)}
          </UIText>

          {status !== '' ? (
            <FontAwesomeIcon style={[styles.iconChange, textColor]} name={`caret-${status}`} />
          ) : (
            <View style={styles.iconChange} />
          )}
          <UIText allowFontScaling={false} style={[styles.textPrice, textColor]}>
            {this.symbolData != null ? formatNumber(this.symbolData.c, 2) : ''}
          </UIText>
        </View>

        <View style={styles.optionSection}>
          <UIText allowFontScaling={false} style={styles.optionValue}>
            {this.optionList[data.option]}
          </UIText>
        </View>

        <TouchableOpacity style={[styles.buttonRowSection]} onPress={this.onEdit}>
          <FeatherIcon style={[styles.iconEdit]} name="edit" />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  symbolData: state.symbolData,
});

const mapDispatchToProps = {
  subscribe,
  unsubscribe,
  setCurrentSymbol,
  setCurrentIndex,
};

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, mapDispatchToProps)(AlarmRow)),
  Fallback,
  handleError
);
