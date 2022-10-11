import { useToggleAnimate } from 'components/ToggleAnimation';
import UIText from 'components/UiText';
import i18next from 'i18next';
import React from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { Colors } from 'styles';

interface Props {
  children?: React.ReactNode;
  maxHeight?: number;
  title?: any;
}

const Collapse = ({ children, maxHeight = 40, title }: Props) => {
  const { interpolate, onToggle } = useToggleAnimate({ outputRange: [40, maxHeight] });
  const { interpolate: interChevron, onToggle: toggleChevron } = useToggleAnimate({
    outputRange: ['0deg', '180deg'],
    config: { useNativeDriver: true, duration: 200 },
  });
  return (
    <Animated.View style={{ maxHeight: interpolate, overflow: 'hidden' }}>
      <TouchableOpacity
        onPress={() => {
          onToggle();
          toggleChevron();
        }}
        style={styles.touchTitle}
      >
        <UIText style={styles.title} allowFontScaling={false}>
          {i18next.t(title)}
        </UIText>
        <Animated.View style={{ transform: [{ rotate: interChevron }] }}>
          <ArrowIcon width={25} height={18} />
        </Animated.View>
      </TouchableOpacity>
      {children}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  touchTitle: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
const ArrowIcon = (props: SvgProps) => (
  <Svg width="20pt" height="20pt" viewBox="0 0 20 20" {...props}>
    <Path
      d="M18.277 4.79L10 13.07 1.723 4.79a1.007 1.007 0 00-1.426 0 1.011 1.011 0 000 1.429l8.988 8.992a1.011 1.011 0 001.43 0l8.988-8.992a1.011 1.011 0 000-1.43 1.007 1.007 0 00-1.426 0zm0 0"
      stroke="none"
      fillRule="nonzero"
      fill="#000"
      fillOpacity={1}
    />
  </Svg>
);

export default Collapse;
