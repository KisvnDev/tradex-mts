import { StyleSheet } from 'react-native';
import { Colors, height } from 'styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  infoSection: {
    height: height > 640 ? 100 : 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GREY,
  },
  inputSection: {
    height: 50,
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
    flex: height > 640 ? 1 : 2,
  },
  label: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  accountPicker: {
    flex: height > 640 ? 3 : 4,
  },
  accountBankPicker: {
    flex: height > 640 ? 2 : 3,
    paddingRight: 5,
  },
  tabItem: {
    minWidth: undefined,
  },
});
