import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { FAVORITE_SORT_TYPE } from 'global';
import styles from './styles';
import UIText from 'components/UiText';

interface ISortSettingProps extends React.ClassAttributes<SortSetting>, WithTranslation {
  selectedValue?: FAVORITE_SORT_TYPE;

  onClose(params: FAVORITE_SORT_TYPE): void;
}

interface ISortSettingState {
  checkedOptions: FAVORITE_SORT_TYPE;
}

class SortSetting extends React.Component<ISortSettingProps, ISortSettingState> {
  private options = [
    {
      key: FAVORITE_SORT_TYPE.NO_SORT,
      text: 'No Sort',
    },
    {
      key: FAVORITE_SORT_TYPE.BY_NAME,
      text: 'By Name',
    },
    {
      key: FAVORITE_SORT_TYPE.BY_PERCENTAGE,
      text: 'By Percentage',
    },
    {
      key: FAVORITE_SORT_TYPE.BY_VOLUMN,
      text: 'By Volume',
    },
    {
      key: FAVORITE_SORT_TYPE.BY_PRICE,
      text: 'By Price',
    },
  ];

  constructor(props: ISortSettingProps) {
    super(props);

    this.state = {
      checkedOptions: this.props.selectedValue ? this.props.selectedValue : FAVORITE_SORT_TYPE.NO_SORT,
    };
  }

  private changeSortOption = (value: FAVORITE_SORT_TYPE) => () => {
    this.setState({
      checkedOptions: value,
    });

    this.props.onClose(value);
  };

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        {this.options.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.containerItem, index !== this.options.length ? styles.borderBottom : {}]}
              onPress={this.changeSortOption(item.key)}
            >
              <View style={styles.item}>
                <View style={styles.itemLeft}>
                  <UIText
                    allowFontScaling={false}
                    style={[styles.itemText, { ...(this.state.checkedOptions === item.key && styles.checked) }]}
                  >
                    {t(item.text)}
                  </UIText>
                </View>
                <View style={styles.iconContainer}>
                  {this.state.checkedOptions === item.key && <AntDesignIcon name="check" style={styles.iconContent} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}
export default withTranslation()(SortSetting);
