import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
    flex: 1,
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
    flex: 2,
    padding: 10,
  },
  button: {
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY_1,
    alignItems: 'center',
  },
  colorButton: {
    color: Colors.WHITE,
  },
});
