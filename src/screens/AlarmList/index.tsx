import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, FlatList, ListRenderItemInfo } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import AlarmRow from 'components/AlarmRow';
import UserInactivity from 'components/UserInactivity';
import { IState } from 'redux-sagas/reducers';
import { IAlarm, IObject } from 'interfaces/common';
import { ISymbolInfo, IQuerySymbolData } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { querySymbolData } from 'redux-sagas/global-actions';
import { getAlarmList, deleteAlarmSetting } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IAlarmListProps extends React.ClassAttributes<AlarmList>, WithTranslation {
  alarmList: IAlarm[];
  symbolMap: { [s: string]: ISymbolInfo };

  getAlarmList(): void;

  deleteAlarmSetting(params: IObject): void;

  querySymbolData(payload: IQuerySymbolData): void;
}

interface IAlarmListState {
  refresh: boolean;
}

class AlarmList extends React.Component<IAlarmListProps, IAlarmListState> {
  private refresh = true;
  private selectedList: IAlarm[] = [];
  private selectAll = false;
  private alarmList: IAlarm[];

  constructor(props: IAlarmListProps) {
    super(props);
    this.state = {
      refresh: false,
    };

    if (this.props.symbolMap) {
      this.alarmList = this.props.alarmList.filter((item: IAlarm) => {
        return this.props.symbolMap[item.code] != null;
      });

      this.props.querySymbolData({
        symbolList: this.alarmList.map((item) => item.code),
      });
    }
  }

  componentDidMount() {
    this.props.getAlarmList();
  }

  shouldComponentUpdate(nextProps: IAlarmListProps) {
    if (this.props.alarmList !== nextProps.alarmList) {
      this.selectAll = false;
      this.selectedList = [];

      this.alarmList = nextProps.alarmList.filter((item: IAlarm) => {
        return nextProps.symbolMap[item.code] != null;
      });

      this.props.querySymbolData({
        symbolList: this.alarmList.map((item) => item.code),
      });

      this.setState({});
    }

    if (this.props.symbolMap !== nextProps.symbolMap && nextProps.symbolMap) {
      this.alarmList = nextProps.alarmList.filter((item: IAlarm) => {
        return nextProps.symbolMap[item.code] != null;
      });

      this.props.querySymbolData({
        symbolList: this.alarmList.map((item) => item.code),
      });
    }

    return true;
  }

  private renderRow = ({ item, index }: ListRenderItemInfo<IAlarm>) => {
    return <AlarmRow data={item} checked={item.checked} index={index} onSelectRow={this.onSelectRow} />;
  };

  private onSelectRow = (item: IAlarm, index: number, value: boolean) => {
    this.alarmList[index].checked = value;
    if (value) {
      this.selectedList.push(item);
    } else {
      this.selectedList.splice(this.selectedList.indexOf(item), 1);
    }

    if (this.selectedList.length === this.alarmList.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }

    this.setState({
      refresh: !this.state.refresh,
    });
  };

  private selectAllHandler = () => {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedList = [];
      for (let i = 0; i < this.alarmList.length; i++) {
        this.alarmList[i].checked = true;
        this.selectedList.push(this.alarmList[i]);
      }
    } else {
      for (let i = 0; i < this.alarmList.length; i++) {
        this.alarmList[i].checked = false;
      }
      this.selectedList = [];
    }

    this.setState({
      refresh: !this.state.refresh,
    });
  };

  private deleteAlarmSetting = () => {
    const params = [];
    for (const item of this.selectedList) {
      params.push(item.id);
    }

    this.props.deleteAlarmSetting({
      items: params,
    });
  };

  render() {
    let refresh = this.refresh;
    this.refresh = false;

    const { t } = this.props;

    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={styles.labelContainer}>
            <View style={styles.checkEmpty} />
            <View style={styles.codeLabel}>
              <UIText style={[styles.bothText, styles.codeLabel]}>{t('Code')}</UIText>
            </View>
            <View style={styles.valueLabel}>
              <UIText style={[styles.bothText, styles.valueLabel]}>{t('Value')}</UIText>
            </View>
            <View style={styles.priceLabel}>
              <UIText style={[styles.bothText, styles.priceLabel]}>{t('Current Price')}</UIText>
            </View>
            <View style={styles.optionLabel}>
              <UIText style={[styles.bothText, styles.optionLabel]}>{t('Option')}</UIText>
            </View>
            <View style={styles.editEmpty} />
          </View>
          <View style={styles.listContainer}>
            {refresh === true ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                data={this.alarmList}
                extraData={this.state.refresh}
                renderItem={this.renderRow}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
          <View style={styles.buttonSection}>
            <View style={styles.button}>
              <TouchableOpacity onPress={this.selectAllHandler}>
                <UIText allowFontScaling={false} style={styles.labelButton}>
                  <MaterialCommunityIcons name="check-all" style={[styles.icon]} />
                  {this.selectAll ? t('Deselect all') : t('Select all')}
                </UIText>
              </TouchableOpacity>
            </View>

            <View style={[styles.button, this.selectedList.length === 0 && styles.buttonDisabled]}>
              <TouchableOpacity
                disabled={this.selectedList.length === 0 ? true : false}
                onPress={this.deleteAlarmSetting}
              >
                <UIText allowFontScaling={false} style={styles.labelButton}>
                  <FontAwesomeIcon name="trash-o" style={[styles.icon]} /> {t('Delete')}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  alarmList: state.alarmList,
  symbolMap: getSymbolMap(state),
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      getAlarmList,
      deleteAlarmSetting,
      querySymbolData,
    })(AlarmList)
  ),
  Fallback,
  handleError
);
