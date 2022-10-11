import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
  },
  labelSection: {
    height: 20,
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  labelTextBox: {
    color: Colors.LIGHT_GREY,
    fontSize: 14,
    flex: 1,
    fontFamily: 'Noto Sans',
    textAlignVertical: 'center',
  },
  labelErrorSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelError: {
    color: Colors.RED,
    fontSize: 17,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
    marginRight: 17,
  },
  labelErrorRow: {
    fontSize: 10,
  },
  popover: {
    color: Colors.WHITE,
  },
  errorIcon: {
    position: 'absolute',
    right: 0,
    top: 2,
    marginLeft: 5,
    width: 17,
    color: Colors.RED,
    fontSize: 17,
  },
  textBox: {
    height: height > 640 ? 42 : 32,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    fontSize: height > 640 ? 16 : 14,
    color: Colors.DARK_GREY,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'Noto Sans',
  },
  textBoxError: {
    borderColor: Colors.RED,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centerContent: {
    justifyContent: 'center',
  },
  rowTextBox: {
    flex: 0.42,
  },
});
