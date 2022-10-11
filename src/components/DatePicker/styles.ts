import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 10,
  },
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
    fontSize: 17,
    textAlign: 'right',
    fontFamily: 'Noto Sans',
    marginRight: 17,
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
  readOnlyTextBox: {
    height: height > 640 ? 42 : 32,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    color: Colors.DARK_GREY,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'Noto Sans',
  },
  datePicker: {
    flexDirection: 'row',
  },
  textBoxError: {
    borderColor: Colors.RED,
  },
  dateText: {
    fontSize: height > 640 ? 14 : 12,
    color: Colors.DARK_GREY,
    lineHeight: height > 640 ? 40 : 30,
    flex: 4,
    alignSelf: 'flex-start',
  },
  dateIcon: {
    flex: 1,
    fontSize: height > 640 ? 16 : 14,
    color: Colors.PRIMARY_1,
    alignSelf: 'center',
    textAlign: 'right',
  },
});
