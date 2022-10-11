import { StyleSheet, Platform } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  valueContainer: {
    height: height > 640 ? 42 : 32,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.BORDER,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
  },

  labelSection: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 10,
    alignItems: 'flex-start',
  },

  labelTextBox: {
    color: Colors.LIGHT_GREY,
    fontSize: 14,
    flex: 1,
    fontFamily: 'Noto Sans',
  },
  pickerContainer: {
    flex: 1,
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  inputAndroid: {
    color: Colors.DARK_GREY,
    fontSize: 13,
    height: 42,
  },
  iconContainer: {
    top: Platform.OS !== 'ios' ? (height > 640 ? 12 : 12) : undefined,
  },
});
