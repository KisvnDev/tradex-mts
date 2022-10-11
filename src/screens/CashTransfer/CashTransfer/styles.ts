import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

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
  labelTouch: {
    alignSelf: 'flex-end',
    color: Colors.PRIMARY_1,
    textDecorationLine: 'underline',
  },
  data: {
    flex: 1,
    justifyContent: 'center',
  },
  dataText: {
    alignSelf: 'flex-end',
    color: Colors.LIGHT_GREY,
  },
  transferable: {
    flex: 1,
    justifyContent: 'center',
  },
  account: {
    flex: 1,
    padding: 10,
  },
  labelTextBox: {
    color: Colors.LIGHTER_GREY,
    fontSize: 17,
    fontFamily: 'Noto Sans',
    marginLeft: 10,
  },
  accountContainer: {
    height: height > 640 ? 42 : 32,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    padding: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  textInputStyle: {
    height: height > 640 ? 84 : 64,
  },
});
