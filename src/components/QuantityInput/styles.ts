import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  labelSection: {
    height: 17,
    marginBottom: 3,
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'flex-start',
  },

  labelTextBox: {
    color: Colors.LIGHT_GREY,
    fontSize: 12,
    flex: 1,
    fontFamily: 'Noto Sans',
  },

  labelErrorSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  labelError: {
    color: Colors.RED,
    fontSize: 14,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
    marginRight: 17,
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

  textBoxContainer: {
    flexDirection: 'row',
  },
  textBox: {
    flex: 1,
    height: height > 640 ? 34 : 28,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    fontSize: height > 640 ? 14 : 11,
    color: Colors.DARK_GREY,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'Noto Sans',
    textAlign: 'right',
  },

  button: {
    width: height > 640 ? 34 : 28,
    height: height > 640 ? 34 : 28,
    marginLeft: 2,
    backgroundColor: Colors.GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
    color: Colors.DARK_GREY,
  },

  error: {
    borderColor: Colors.RED,
  },
  tooltip: {
    color: Colors.WHITE,
  },
});
