/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  ViewStyle,
  StyleProp,
  KeyboardTypeOptions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import i18next from 'i18next';
import { IObject } from 'interfaces/common';
import UIText from 'components/UiText';

interface Props {
  selectedValue?: any;
  list?: ItemDropdown[];
  onChange: (index: number, value: Object, label?: string) => void;
  defaultTextInput?: string;
  onChangeText?: (text: string) => void;
  placeHolderInput?: string;
  valueContainer?: StyleProp<ViewStyle> | false;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  isInput?: boolean;
  disabled?: boolean;
}

const InputPicker = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const [displaySelected, setDisplaySelected] = useState('');
  const [searchText, setSearchText] = useState('');

  const setSelectedValue = (value: IObject) =>
    setDisplaySelected(props.list?.find((item) => item.value === value)?.label || '');

  useEffect(() => {
    !props.isInput && setSelectedValue(props.selectedValue);
  }, [props.selectedValue, props.isInput]);

  const onChangeText = (text: string) => {
    setSearchText(text);
    // props.onChangeText?.(text);
  };

  return (
    <View style={[styles.textBox, props.valueContainer]}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.buttonSeleted}
        disabled={props.disabled === true}
      >
        <UIText style={[styles.textDisplay, !displaySelected && styles.placeholder]}>
          {displaySelected || props.placeholder || 'Select an item...'}
        </UIText>
        <AntDesign name={'caretdown'} />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType={'fade'}>
        <TouchableOpacity onPressIn={() => setVisible(false)} style={styles.backgroundOverlay} />
        <View pointerEvents={'box-none'} style={styles.containerItems}>
          <View style={[styles.wrapperItems]}>
            <FlatList
              keyboardShouldPersistTaps={'handled'}
              ListHeaderComponent={
                <View style={styles.wrapperSearchInput}>
                  <TextInput
                    keyboardType={props.keyboardType}
                    style={styles.textInput}
                    defaultValue={props.defaultTextInput}
                    onChangeText={onChangeText}
                    placeholder={i18next.t(props.placeHolderInput as string)}
                  />
                </View>
              }
              contentContainerStyle={styles.listItemsStyle}
              data={
                searchText.trim() === ''
                  ? props.list || []
                  : props.list != null
                  ? props.list.filter((item) => item.label.includes(searchText))
                  : []
              }
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => {
                    setVisible(false);
                    setSelectedValue(item.value);
                    props.onChange(index, item.value);
                  }}
                >
                  <UIText style={[props.selectedValue?.value === item.value && styles.seletedItemStyle]}>
                    {item.label!}
                  </UIText>
                </TouchableOpacity>
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(InputPicker);
