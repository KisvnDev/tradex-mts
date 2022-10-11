import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  inputSection: {
    height: 60,
    borderBottomWidth: 3,
    borderColor: Colors.LIGHTER_GREY,
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
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  accountPicker: {
    flex: 4,
  },
  accountBankPicker: {
    flex: height > 640 ? 2 : 3,
    paddingRight: 5,
  },
});
