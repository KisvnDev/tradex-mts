import React from 'react';
import { StyleSheet, Text, TextProps as TextPropsRN } from 'react-native';

interface TextProps extends TextPropsRN {
  style?: any;
  numberOfLines?: number;
  children?: any;
}

const UIText = (props: TextProps) => {
  const { style, numberOfLines, children } = props;

  return (
    <Text style={[styles.container, style]} allowFontScaling={false} numberOfLines={numberOfLines}>
      {!!children && children}
    </Text>
  );
};

UIText.defaultProps = {
  numberOfLines: 0,
};

export default UIText;

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Roboto-Regular',
    fontStyle: 'normal',
  },
});
