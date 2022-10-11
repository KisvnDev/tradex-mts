import React from 'react';
import i18next from 'i18next';
import { StyleSheet, View } from 'react-native';
import { width } from 'styles';
import UIText from 'components/UiText';

type RowContentProps = { left: string; right: string | Object | number | undefined; notScaping?: boolean };
const RowContent = ({ left, right, notScaping }: RowContentProps) => (
  <View style={[styles.contentModal, !notScaping && styles.paddingContent]}>
    <UIText style={styles.fontTitle}>{i18next.t(left)}</UIText>
    <UIText>{right}</UIText>
  </View>
);

const styles = StyleSheet.create({
  fontTitle: { fontWeight: '700' },
  contentModal: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
  },
  paddingContent: {
    paddingHorizontal: width * 0.1,
  },
});

export default RowContent;
