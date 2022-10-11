import { StyleSheet } from 'react-native';
import { Colors, height, width } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
  form: {
    flex: 1,
    paddingTop: 10,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemOneRow: {
    flexDirection: 'row',
  },
  itemTwoRow: {
    flexDirection: 'column',
  },
  label: {
    flex: 1,
    justifyContent: 'center',
  },
  labelText: {
    color: Colors.LIGHT_GREY,
  },
  labelTouch: {
    alignSelf: 'flex-end',
    color: Colors.PRIMARY_1,
    textDecorationLine: 'underline',
  },
  available: {
    flex: 1,
    justifyContent: 'center',
  },
  data: {
    flex: 2,
    justifyContent: 'center',
  },
  dataText: {
    alignSelf: 'flex-start',
    color: Colors.LIGHT_GREY,
  },
  dataTextOneRow: {
    alignSelf: 'flex-end',
    color: Colors.LIGHT_GREY,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  note: {
    flex: 2,
    padding: 10,
  },
  noteCt: {
    flexDirection: 'row',
    flex: 2,
    padding: 10,
  },
  dataCt: {
    justifyContent: 'center',
    maxWidth: '60%',
  },
  textContent: {
    textAlign: 'right',
  },
  noteBox: {
    paddingLeft: 0,
  },
  button: {
    flex: 1,
    padding: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  textInputStyle: {
    height: height > 640 ? 84 : 64,
  },
  buttonInModal: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonText1: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  buttonText2: {
    fontWeight: 'bold',
    color: Colors.RED,
  },
  confirmCancelButton: {
    flex: 1,
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    height: 50,
    width,
  },
  titleContainerBorder: {
    borderBottomColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  title: {},
  leftRowContent: { flex: 0.3, paddingLeft: 0 },
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
  mgtop10: { marginTop: 10 },
  containerModalOTP: { minHeight: 'auto', aspectRatio: 0.7 },
  confirmModal: { minHeight: 'auto', aspectRatio: 1.2 },
});
