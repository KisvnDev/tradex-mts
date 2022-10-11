import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  form: {
    flexGrow: 1,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  inputSection: {
    height: 60,
    borderBottomWidth: 3,
    borderColor: Colors.LIGHTER_GREY,
    marginBottom: 10,
  },

  itemSection: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
  },
  inputItem: {
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  labelContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  accountPicker: {
    flex: 4,
  },
  button: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
