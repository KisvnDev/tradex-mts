import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  labelErrorSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  labelError: {
    color: Colors.RED,
    fontSize: 15,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
    marginLeft: 3,
  },

  errorIcon: {
    width: 17,
    color: Colors.RED,
    fontSize: 17,
  },

  tooltip: {
    color: Colors.WHITE,
  },
});
