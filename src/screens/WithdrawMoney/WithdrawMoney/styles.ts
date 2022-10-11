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
  amount: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
  label: {
    flex: 2,
    justifyContent: 'center',
  },
  labelText: {
    color: Colors.LIGHT_GREY,
  },
  data: {
    justifyContent: 'center',
  },
  dataText: {
    alignSelf: 'flex-end',
    color: Colors.LIGHT_GREY,
  },
  labelTouch: {
    alignSelf: 'flex-end',
    color: Colors.PRIMARY_1,
    textDecorationLine: 'underline',
  },
  withdrawable: {
    flex: 1,
    justifyContent: 'center',
  },
  bank: {
    flex: 1,
    padding: 10,
  },
  labelTextBox: {
    color: Colors.LIGHTER_GREY,
    fontSize: 17,
    fontFamily: 'Noto Sans',
    marginLeft: 10,
  },
  bankContainer: {
    borderWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  note: {
    padding: 10,
    flexDirection: 'row',
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
  kisContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kisRightItem: { width: width / 3, flex: 0, maxWidth: width / 3 },
  row: { flexDirection: 'row' },
  leftRowContent: { flex: 0.3, paddingLeft: 0 },
  containerModalOTP: { minHeight: 'auto', aspectRatio: 0.7 },
  containerModalOTPExtend: { minHeight: 'auto', aspectRatio: 0.6 },
  confirmModal: { minHeight: 'auto', aspectRatio: 1.2 },
  confirmModalExtend: { minHeight: 'auto', aspectRatio: 1 },
});
