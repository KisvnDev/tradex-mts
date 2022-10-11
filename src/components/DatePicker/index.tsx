import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import ErrorBoundary from 'react-error-boundary';
import DateTimePicker from 'react-native-modal-datetime-picker';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Tooltip from 'rn-tooltip';
import { handleError, getCurrentLocale } from 'utils/common';
import Fallback from 'components/Fallback';
import { formatDateToString } from 'utils/datetime';
import { Colors, width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IDatePickerProps extends React.ClassAttributes<DatePicker>, WithTranslation {
  defaultValue?: Date;
  label?: string;
  error?: boolean;
  errorContent?: string;
  disabled?: boolean;
  placeholder?: string;
  maxDate?: Date;
  minDate?: Date;

  onChange?(value: Date): void;
}

interface IDatePickerState extends React.ClassAttributes<DatePicker> {
  value: Date;
  isDateTimePickerVisible?: boolean;
}

export class DatePicker extends React.Component<IDatePickerProps, IDatePickerState> {
  constructor(props: IDatePickerProps) {
    super(props);

    this.state = {
      value: this.props.defaultValue ? this.props.defaultValue : new Date(),
    };
  }

  private showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  private hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  private handleDatePicked = (date: Date) => {
    this.setState(
      {
        value: date,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.value);
        }
      }
    );
    this.hideDateTimePicker();
  };

  setValue = (date: Date) => {
    this.setState({ value: date });
  };

  render() {
    const { t } = this.props;

    return (
      <ErrorBoundary FallbackComponent={Fallback} onError={handleError}>
        <View style={styles.container}>
          <View style={styles.labelSection}>
            {this.props.label && (
              <UIText allowFontScaling={false} style={styles.labelTextBox}>
                {t(this.props.label)}
              </UIText>
            )}
            {this.props.error && this.props.errorContent && (
              <View style={styles.labelErrorSection}>
                <Tooltip
                  width={width - 20}
                  backgroundColor={Colors.PRIMARY_1}
                  popover={
                    <UIText style={styles.popover} allowFontScaling={false} numberOfLines={2}>
                      {t(this.props.errorContent)}{' '}
                    </UIText>
                  }
                >
                  <View>
                    <UIText allowFontScaling={false} style={styles.labelError} ellipsizeMode="tail" numberOfLines={1}>
                      {t(this.props.errorContent)}
                    </UIText>
                    <FontAwesomeIcon name="question-circle" style={styles.errorIcon} />
                  </View>
                </Tooltip>
              </View>
            )}
          </View>
          <View>
            <TouchableOpacity onPress={this.showDateTimePicker}>
              <View style={[styles.readOnlyTextBox, styles.datePicker, this.props.error && styles.textBoxError]}>
                <UIText allowFontScaling={false} style={styles.dateText} numberOfLines={1}>
                  {formatDateToString(this.state.value, 'dd/MM/yyyy')}
                </UIText>
                <FontAwesomeIcon name="calendar" style={styles.dateIcon} />
              </View>
            </TouchableOpacity>

            <DateTimePicker
              {...(this.state.value != null && { date: this.state.value })}
              isVisible={this.state.isDateTimePickerVisible && this.props.disabled !== true}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              maximumDate={this.props.maxDate}
              minimumDate={this.props.minDate}
              locale={getCurrentLocale()}
              cancelTextIOS={t('Cancel')}
              confirmTextIOS={t('Confirm 2')}
              headerTextIOS={t('Pick a date')}
            />
          </View>
        </View>
      </ErrorBoundary>
    );
  }
}

export default withTranslation(undefined, { withRef: true })(DatePicker);
