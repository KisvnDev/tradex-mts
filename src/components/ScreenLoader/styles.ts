import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.2,
    backgroundColor: Colors.BLACK,
    zIndex: 10000,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
