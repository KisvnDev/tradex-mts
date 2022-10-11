import { StyleSheet } from 'react-native';
import { height, Colors, width } from 'styles';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
  },
  form: {
    paddingTop: 10,
    marginBottom: -60,
  },
  item: {
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
    flex: 1,
    padding: 10,
  },
  labelTextBox: {
    color: Colors.LIGHT_GREY,
    fontFamily: 'Noto Sans',
    flex: 1,
  },
  picker: {
    height: height > 640 ? 42 : 32,
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
  textInputStyle: {
    height: height > 640 ? 84 : 64,
  },
  labelSection: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 10,
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopColor: Colors.BORDER,
    borderTopWidth: 1,
    minHeight: 60,
  },
  buttonLeft: {
    borderRightColor: Colors.BORDER,
    borderRightWidth: 1,
  },
  buttonCancel: {
    color: Colors.RED,
    fontWeight: 'bold',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTransfer: {
    color: Colors.PRIMARY_1,
    fontWeight: 'bold',
  },
  fontTitle: { fontWeight: '700' },
  contentModal: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: width * 0.1,
  },
});
