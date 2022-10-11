import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
// import FeatherIcon from 'react-native-vector-icons/Feather';
import { handleError } from 'utils/common';
import UnitPicker from 'components/UnitPicker';
import { SymbolChart, IndexChart } from 'components/Charts/Chart';
import TickChart from 'components/Charts/TickChart';
import Fallback from 'components/Fallback';
import { PERIOD_OPTIONS, TypeFocusOn, TypeChartType, TICK_OPTIONS, MINUTE_OPTIONS, SYMBOL_TYPE } from 'global';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { getMinuteSymbolData, getPeriodSymbolData, getTickSymbolData } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IChartTabProps extends React.ClassAttributes<ChartTab>, WithTranslation {
  currentSymbol: ISymbolInfo;
  symbolTickData: IObject | null;
  symbolMinuteData: IObject | null;
  symbolPeriodData: IObject | null;

  getPeriodSymbolData(params: IObject): void;

  getMinuteSymbolData(params: IObject): void;

  getTickSymbolData(params: IObject): void;
}

interface IChartTabState {
  focusOn: TypeFocusOn;
  chartType: TypeChartType;
  tickUnit: number;
  minuteUnit: number;
}

class ChartTab extends React.Component<IChartTabProps, IChartTabState> {
  private fetchCount = 100;
  private refresh = true;
  private chartData: IObject[];

  constructor(props: IChartTabProps) {
    super(props);

    this.state = {
      focusOn: PERIOD_OPTIONS.DAILY,
      chartType: 'period',
      tickUnit: 1,
      minuteUnit: 1,
    };
  }

  componentDidMount() {
    this.getPeriodSymbolData(PERIOD_OPTIONS.DAILY);
  }

  shouldComponentUpdate(nextProps: IChartTabProps, nextState: IChartTabState) {
    if (this.refresh === true) {
      return true;
    }

    if (this.state.focusOn !== nextState.focusOn) {
      if (nextState.focusOn !== 'SETTINGS') {
        this.refresh = true;
      }
      return true;
    }

    if (nextState.focusOn === 'TICKS') {
      if (this.state.tickUnit !== nextState.tickUnit) {
        this.refresh = true;
        return true;
      } else if (
        nextProps.symbolTickData !== this.props.symbolTickData &&
        nextProps.symbolTickData != null &&
        nextProps.symbolTickData.code === nextProps.currentSymbol.s
      ) {
        this.refresh = false;
        return true;
      }
    } else if (nextState.focusOn === 'MINUTES') {
      if (this.state.minuteUnit !== nextState.minuteUnit) {
        this.refresh = true;
        return true;
      } else if (
        nextProps.symbolMinuteData !== this.props.symbolMinuteData &&
        nextProps.symbolMinuteData != null &&
        nextProps.symbolMinuteData.code === nextProps.currentSymbol.s
      ) {
        this.refresh = false;
        return true;
      }
    } else {
      if (
        nextProps.symbolPeriodData !== this.props.symbolPeriodData &&
        nextProps.symbolPeriodData != null &&
        nextProps.symbolPeriodData.code === nextProps.currentSymbol.s
      ) {
        this.refresh = false;
        return true;
      }
    }

    return false;
  }

  private getPeriodSymbolData = (periodType: TypeFocusOn, loadMore = false) => {
    const params = {
      symbol: this.props.currentSymbol,
      periodType: periodType,
      fetchCount: this.fetchCount,
      loadMore,
    };

    this.props.getPeriodSymbolData(params);
  };

  private getTickSymbolData = (tickUnit: number, loadMore = false) => {
    const params = {
      symbol: this.props.currentSymbol,
      tickUnit,
      fetchCount: this.fetchCount,
      loadMore,
    };

    this.props.getTickSymbolData(params);
  };

  private getMinuteSymbolData = (minuteUnit: number, loadMore = false) => {
    const params = {
      symbol: this.props.currentSymbol,
      minuteUnit,
      fetchCount: this.fetchCount,
      loadMore,
    };

    this.props.getMinuteSymbolData(params);
  };

  private onChangeChartType = (chartType: TypeChartType, period: TypeFocusOn) => {
    this.setState({
      focusOn: period,
      chartType,
    });

    this.getPeriodSymbolData(period);
  };

  private onChangeTickUnit = (index: number, value: number, label: string) => {
    this.setState({
      focusOn: 'TICKS',
      chartType: 'ticks',
      tickUnit: value,
    });

    this.getTickSymbolData(value);
  };

  private onChangeMinuteUnit = (index: number, value: number, label: string) => {
    this.setState({
      focusOn: 'MINUTES',
      chartType: 'minutes',
      minuteUnit: value,
    });

    this.getMinuteSymbolData(value);
  };

  // private openIndicatorSelection = () => {
  //   this.setState({ focusOn: 'SETTINGS' });
  // };

  private requestLoadmore = () => {
    if (this.state.focusOn === 'DAILY' || this.state.focusOn === 'WEEKLY' || this.state.focusOn === 'MONTHLY') {
      this.getPeriodSymbolData(this.state.focusOn, true);
    } else if (this.state.focusOn === 'TICKS') {
      this.getTickSymbolData(this.state.tickUnit, true);
    } else if (this.state.focusOn === 'MINUTES') {
      this.getMinuteSymbolData(this.state.minuteUnit, true);
    }
  };

  render() {
    const { t } = this.props;

    let refresh = this.refresh;
    this.refresh = false;
    let frequency = 0;
    let next: boolean | undefined = false;

    if (this.state.focusOn === 'TICKS') {
      if (
        this.props.symbolTickData &&
        this.props.symbolTickData.data &&
        this.props.symbolTickData.code === this.props.currentSymbol.s
      ) {
        this.chartData = this.props.symbolTickData.data as IObject[];
        next = this.props.symbolTickData.next as boolean;
        frequency = this.state.tickUnit * 60 * 1000;
      }
    } else if (this.state.focusOn === 'MINUTES') {
      if (
        this.props.symbolMinuteData &&
        this.props.symbolMinuteData.data &&
        this.props.symbolMinuteData.code === this.props.currentSymbol.s
      ) {
        this.chartData = this.props.symbolMinuteData.data as IObject[];
        next = this.props.symbolMinuteData.next as boolean;
        frequency = this.state.minuteUnit * 60 * 1000;
      }
    } else {
      if (
        this.props.symbolPeriodData &&
        this.props.symbolPeriodData.data &&
        this.props.symbolPeriodData.code === this.props.currentSymbol.s
      ) {
        this.chartData = this.props.symbolPeriodData.data as IObject[];
        next = this.props.symbolPeriodData.next as boolean;

        if (this.state.focusOn === PERIOD_OPTIONS.DAILY) {
          frequency = 24 * 60 * 60 * 1000 * 30; //show latest 30 days
        } else if (this.state.focusOn === PERIOD_OPTIONS.WEEKLY) {
          frequency = 7 * 24 * 60 * 60 * 1000 * 12; //show latest 3 quarters
        } else if (this.state.focusOn === PERIOD_OPTIONS.MONTHLY) {
          frequency = 30 * 24 * 60 * 60 * 1000 * 12; //show latest 1 year
        }
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.buttonSection}>
          <View style={styles.button}>
            <UnitPicker
              style={[this.state.focusOn === 'TICKS' ? styles.pickerActive : styles.pickerInactive, styles.tabTitle]}
              list={TICK_OPTIONS}
              label="Ticks"
              labelStyle={[styles.labelButton, this.state.focusOn === 'TICKS' && styles.active]}
              onChange={this.onChangeTickUnit}
            />
          </View>

          <View style={styles.button}>
            <UnitPicker
              style={[this.state.focusOn === 'MINUTES' ? styles.pickerActive : styles.pickerInactive, styles.tabTitle]}
              list={MINUTE_OPTIONS}
              label="Minutes"
              labelStyle={[styles.labelButton, this.state.focusOn === 'MINUTES' && styles.active]}
              onChange={this.onChangeMinuteUnit}
            />
          </View>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => this.onChangeChartType('period', PERIOD_OPTIONS.DAILY)}
          >
            <UIText
              allowFontScaling={false}
              style={[styles.labelButton, this.state.focusOn === PERIOD_OPTIONS.DAILY && styles.active]}
            >
              {t('Daily')}
            </UIText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onChangeChartType('period', PERIOD_OPTIONS.WEEKLY)}
          >
            <UIText
              allowFontScaling={false}
              style={[styles.labelButton, this.state.focusOn === PERIOD_OPTIONS.WEEKLY && styles.active]}
            >
              {t('Weekly')}
            </UIText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rightMostButton]}
            onPress={() => this.onChangeChartType('period', PERIOD_OPTIONS.MONTHLY)}
          >
            <UIText
              allowFontScaling={false}
              style={[styles.labelButton, this.state.focusOn === PERIOD_OPTIONS.MONTHLY && styles.active]}
            >
              {t('Monthly')}
            </UIText>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.settingButton} onPress={this.openIndicatorSelection}>
            <FeatherIcon
              style={[styles.labelButton, this.state.focusOn === 'SETTINGS' && styles.active]}
              name="settings"
            />
          </TouchableOpacity> */}
        </View>
        <View style={styles.chartSection}>
          {this.chartData == null || refresh ? (
            <ActivityIndicator />
          ) : this.state.focusOn === 'TICKS' ? (
            this.props.symbolTickData && (
              <TickChart
                code={this.props.currentSymbol.s}
                data={this.chartData}
                next={next}
                frequency={frequency}
                loadMore={this.requestLoadmore}
              />
            )
          ) : (
            ((this.props.symbolMinuteData && this.state.chartType === 'minutes') ||
              (this.props.symbolPeriodData && this.state.chartType === 'period')) &&
            (this.props.currentSymbol.t !== SYMBOL_TYPE.INDEX ? (
              <SymbolChart
                code={this.props.currentSymbol.s}
                data={this.chartData}
                next={next}
                type={this.state.chartType}
                frequency={frequency}
                loadMore={this.requestLoadmore}
              />
            ) : (
              <IndexChart
                code={this.props.currentSymbol.s}
                data={this.chartData}
                next={next}
                type={this.state.chartType}
                frequency={frequency}
                loadMore={this.requestLoadmore}
              />
            ))
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  symbolTickData: state.symbolChartTickData,
  symbolMinuteData: state.symbolChartMinuteData,
  symbolPeriodData: state.symbolChartPeriodData,
});

const mapStateToIndexProps = (state: IState) => ({
  currentSymbol: state.currentIndex,
  symbolTickData: state.symbolChartTickData,
  symbolMinuteData: state.symbolChartMinuteData,
  symbolPeriodData: state.symbolChartPeriodData,
});

const mapDispatchToProps = { getMinuteSymbolData, getPeriodSymbolData, getTickSymbolData };

export const SymbolChartTab = withErrorBoundary(
  withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ChartTab)),
  Fallback,
  handleError
);

export const IndexChartTab = withErrorBoundary(
  withTranslation()(connect(mapStateToIndexProps, mapDispatchToProps)(ChartTab)),
  Fallback,
  handleError
);
