import { StyleSheet } from 'react-native';
import { height, Colors, width } from 'styles';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
  },
  form: {
    flex: 1,
    paddingTop: 10,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  label: {
    flex: 1,
    justifyContent: 'center',
  },
  labelText: {
    color: Colors.LIGHT_GREY,
    fontWeight: 'bold',
  },
  data: {
    flex: 1,
    justifyContent: 'center',
  },
  dataText: {
    alignSelf: 'flex-end',
    color: Colors.LIGHT_GREY,
  },
  dataTouch: {
    alignSelf: 'flex-end',
    color: Colors.PRIMARY_1,
    textDecorationLine: 'underline',
  },
  formItem: {
    height: 60,
    paddingLeft: 10,
    paddingRight: 10,
  },
  labelTextBox: {
    color: Colors.LIGHT_GREY,
    fontSize: 17,
    fontFamily: 'Noto Sans',
    marginLeft: 10,
  },
  picker: {
    height: height > 640 ? 42 : 32,
    borderWidth: 1,
    borderColor: Colors.LIGHTER_GREY,
    paddingLeft: 5,
    paddingRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  note: {
    flex: 2,
    padding: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContainer: {
    height: 50,
    flexDirection: 'row',
    borderTopColor: Colors.BORDER,
    borderTopWidth: 1,
  },
  titleContainer: {
    height: 30,
    width,
  },
  titleContainerBorder: {
    borderBottomColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  button: {
    width: width * 0.5,
  },
  buttonBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.BORDER,
  },
  buttonText1: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  buttonText2: {
    fontWeight: 'bold',
    color: Colors.RED,
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
